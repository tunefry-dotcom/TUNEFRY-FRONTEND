// Earnings + withdrawal API helpers. All calls send the session cookie.
import { API_BASE as BASE } from './config.js'

async function getJSON(path) {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return res.json()
}

// { total_streams, total_revenue, available_balance, songs: [...] }
export function getEarnings() {
  return getJSON('/earnings/me')
}

// { song_title, platforms: [{platform_group, streams, revenue}], monthly: [...] }
export function getSongEarnings(submissionId) {
  return getJSON(`/earnings/songs/${encodeURIComponent(submissionId)}`)
}

// { available_balance, total_earned, total_withdrawn, min_withdrawal, eligible }
export function getBalance() {
  return getJSON('/earnings/balance')
}

// [{ id, amount, status, method, requested_at, processed_at }]
export function getWithdrawalHistory() {
  return getJSON('/withdrawals/me')
}

// body = { method: 'upi'|'bank', ...payout fields }. Amount is server-derived.
export async function requestWithdrawal(body) {
  const res = await fetch(`${BASE}/withdrawals`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(typeof data.detail === 'string' ? data.detail : 'Withdrawal request failed')
  }
  return data
}
