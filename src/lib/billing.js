// Billing / plan helpers. Feature keys mirror the backend Feature enum
// (app/modules/billing/plans.py). The authoritative entitlement map is fetched
// from the server (/billing/me) — these constants only name the features so the
// route gates read clearly and avoid magic strings.

const BASE = 'https://backend1-xzx5.onrender.com'

export const FEATURES = {
  RELEASE_SINGLE: 'release_single',       // /upload/new-song
  RELEASE_ALBUM: 'release_album',         // /upload/new-album
  TRANSFER_SINGLE: 'transfer_single',     // /upload/transfer-song
  TRANSFER_ALBUM: 'transfer_album',       // /upload/transfer-album
  PLAYLIST_PITCHING: 'playlist_pitching', // /pitch-song
  INSTAGRAM_LINKING: 'instagram_linking', // /instalink
  CONTENT_ID: 'content_id',
  CUSTOM_LABEL: 'custom_label',
}

// Human-friendly labels for the upgrade screens, keyed by plan id.
export const PLAN_LABELS = {
  free: 'Free',
  'single-song': 'Single Song',
  starter: 'Starter',
  'single-artist': 'Single Artist',
  'double-artist': 'Double Artist',
  label: 'Label Plan',
}

// Whether the given user (from AuthContext) can access a feature.
export function canAccess(user, feature) {
  return Boolean(user && user.entitlements && user.entitlements[feature])
}

// Fetch the full plan catalogue (source of truth) — used where we want to show
// pricing/entitlement data without hardcoding it.
export async function fetchPlans() {
  const res = await fetch(`${BASE}/billing/plans`, { credentials: 'include' })
  if (!res.ok) throw new Error('Failed to load plans')
  return res.json()
}

// Change the current user's plan. Backed by the dev/test endpoint until real
// checkout exists; returns the refreshed plan + entitlements on success.
export async function changePlan(plan) {
  const res = await fetch(`${BASE}/billing/change-plan`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || 'Failed to change plan')
  }
  return res.json()
}
