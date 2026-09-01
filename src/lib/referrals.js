// Refer & Earn API helpers. All calls send the session cookie.
import { API_BASE as BASE } from './config.js'

// { referral_code, referred_count, referrals: [{email, plan, joined_at}], total_referral_earned }
export async function getMyReferrals() {
  const res = await fetch(`${BASE}/referrals/me`, { credentials: 'include' })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}
