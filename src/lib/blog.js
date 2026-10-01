// Tunefry Daily blog API helpers (artist-facing). Admin calls stay inline in
// SecretPanel.jsx with the X-Admin-Secret header, matching every other admin view.
import { API_BASE as BASE } from './config.js'
const RZP_SRC = 'https://checkout.razorpay.com/v1/checkout.js'

async function getJSON(path, opts) {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include', ...opts })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : `Request failed (${res.status})`)
  return data
}

async function postJSON(path, body) {
  return getJSON(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

// [{ id, label }]
export function getCategories() {
  return getJSON('/blog/categories')
}

// { free_article_used, credits_remaining, can_publish }
export function getCreditStatus() {
  return getJSON('/blog/credits/me')
}

// { posts: [...], total, page, per_page, total_pages }
export function getPosts({ category, page = 1, perPage = 12 } = {}) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) })
  if (category) params.set('category', category)
  return getJSON(`/blog/posts?${params.toString()}`)
}

export function getPostBySlug(slug) {
  return getJSON(`/blog/posts/${encodeURIComponent(slug)}`)
}

export function getRelatedPosts(slug, limit = 6) {
  return getJSON(`/blog/posts/${encodeURIComponent(slug)}/related?limit=${limit}`)
}

// status is optional: 'pending' | 'approved' | 'declined'
export function getMyPosts(status) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : ''
  return getJSON(`/blog/mine${qs}`)
}

// Returns { key } — pass key straight into submitArticle's cover_image_key.
export async function uploadBlogImage(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/blog/images`, { method: 'POST', credentials: 'include', body: form })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Image upload failed')
  return data
}

// body = { title, body, category, cover_image_key }
export function submitArticle(body) {
  return postJSON('/blog/submit', body)
}

// --- Publish-credit purchase (Razorpay) -------------------------------------

function loadRazorpay() {
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

// pack is 'single' (₹49 → 1 credit) or 'bundle_20' (₹799 → 20 credits)
export function createCreditOrder(pack) {
  return postJSON('/blog/credits/order', { pack })
}

export function verifyCreditPayment(body) {
  return postJSON('/blog/credits/verify', body)
}

// Full flow: create order → open checkout → verify. `prefill` = {name, email, contact}.
// Resolves with the verify response ({credited, credits_remaining, ...}); rejects on failure/cancel.
export async function buyCreditPack(pack, prefill) {
  const ok = await loadRazorpay()
  if (!ok) throw new Error('Could not load payment gateway. Check your connection.')

  const order = await createCreditOrder(pack)

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.key_id,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      name: 'Tunefry Daily',
      description: pack === 'single' ? '1 article credit' : '20 article credits',
      prefill: prefill || {},
      notes: { pack: order.pack },
      theme: { color: '#F26522' },
      handler: async (resp) => {
        try {
          const result = await verifyCreditPayment({
            pack: order.pack,
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
