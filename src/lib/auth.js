const BASE = 'https://backend1-xzx5.onrender.com'

export async function getCurrentUser() {
  try {
    const [authResult, billingResult] = await Promise.allSettled([
      fetch(`${BASE}/auth/me`, { credentials: 'include' }),
      fetch(`${BASE}/billing/me`, { credentials: 'include' }),
    ])

    if (authResult.status === 'rejected') return null
    const authRes = authResult.value
    if (authRes.status === 401 || !authRes.ok) return null
    const user = await authRes.json()

    if (billingResult.status === 'fulfilled' && billingResult.value.ok) {
      try {
        const billing = await billingResult.value.json()
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
      } catch {
        // billing JSON parse failed — fall through to safe default
      }
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

export async function signup(fullName, artistName, phone, email, password) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: fullName, artist_name: artistName, phone, email, password }),
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

export async function forgotPassword(email) {
  const res = await fetch(`${BASE}/auth/forgot-password`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'Request failed')
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
