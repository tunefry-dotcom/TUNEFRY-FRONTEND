// Razorpay plan-upgrade helpers. The backend creates/verifies orders; this module
// only opens the checkout widget and relays the result back for server verification.

const BASE = 'https://backend1-xzx5.onrender.com'
const RZP_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

// Thrown when /billing/orders reports the profile isn't complete yet.
export class ProfileIncompleteError extends Error {
  constructor(missing) {
    super('profile_incomplete')
    this.code = 'profile_incomplete'
    this.missing = missing || []
  }
}

// Inject the Razorpay checkout script once; resolves true when ready.
export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${RZP_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }
    const script = document.createElement('script')
    script.src = RZP_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

// Ask the backend to create an order. Throws ProfileIncompleteError on 403.
export async function createOrder(plan) {
  const res = await fetch(`${BASE}/billing/orders`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data.detail
    if (detail && typeof detail === 'object' && detail.error === 'profile_incomplete') {
      throw new ProfileIncompleteError(detail.missing_fields)
    }
    throw new Error(typeof detail === 'string' ? detail : 'Could not start payment')
  }
  return data // { order_id, amount, currency, key_id, plan, plan_name }
}

// Verify a completed payment server-side; returns the upgraded plan payload.
export async function verifyPayment(payload) {
  const res = await fetch(`${BASE}/billing/verify-payment`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Payment verification failed')
  return data
}

// Full flow: create order → open checkout → verify. `prefill` = {name, email, contact}.
// Resolves with the verified plan payload; rejects on failure/cancel.
export async function startUpgrade(plan, prefill) {
  const ok = await loadRazorpay()
  if (!ok) throw new Error('Could not load payment gateway. Check your connection.')

  const order = await createOrder(plan)

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.key_id,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      name: 'Tunefry',
      description: `Upgrade to ${order.plan_name}`,
      prefill: prefill || {},
      notes: { plan: order.plan },
      theme: { color: '#F26522' },
      handler: async (resp) => {
        try {
          const result = await verifyPayment({
            plan: order.plan,
            razorpay_order_id: resp.razorpay_order_id,
            razorpay_payment_id: resp.razorpay_payment_id,
            razorpay_signature: resp.razorpay_signature,
          })
          resolve(result)
        } catch (err) {
          reject(err)
        }
      },
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    })
    rzp.on('payment.failed', (resp) => reject(new Error(resp?.error?.description || 'Payment failed')))
    rzp.open()
  })
}
