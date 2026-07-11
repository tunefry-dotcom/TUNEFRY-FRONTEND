const BASE = 'https://backend1-xzx5.onrender.com'

export async function getCurrentUser() {
  try {
    const res = await fetch(`${BASE}/auth/me`, { credentials: 'include' })
    if (res.status === 401) return null
    if (!res.ok) return null
    const user = await res.json()

    // Enrich with plan entitlements from the billing service (server is the
    // source of truth for what the user can access). If this call fails we fall
    // back to no entitlements — a safe, least-privilege default that shows the
    // upgrade prompts rather than silently unlocking gated features.
    try {
      const billingRes = await fetch(`${BASE}/billing/me`, { credentials: 'include' })
      if (billingRes.ok) {
        const billing = await billingRes.json()
        return {
          ...user,
          plan: billing.plan,
          planName: billing.name,
          entitlements: billing.entitlements || {},
          upgradeHints: billing.upgrade_hints || {},
          isFree: billing.is_free,
          status: billing.status,
          expiresAt: billing.expires_at,
          daysRemaining: billing.days_remaining,
        }
      }
    } catch {
      // ignore — fall through with empty entitlements
    }
    return { ...user, plan: 'free', planName: 'Free', entitlements: {}, upgradeHints: {}, isFree: true }
  } catch {
    return null
  }
}

export async function login(email, password) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Login failed')
  return data
}

export async function signup(fullName, email, password) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, email, password }),
  })
  const data = await res.json()
  if (!res.ok) {
    // FastAPI validation errors come back as an array under `detail`
    const msg = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg).join(', ')
      : data.detail
    throw new Error(msg || 'Signup failed')
  }
  return data
}

export async function logout() {
  try {
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // ignore network errors — we still clear local state
  }
}
