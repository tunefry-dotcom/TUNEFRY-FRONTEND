// Profile (basic details) API helpers.

const BASE = 'https://backend1-xzx5.onrender.com'

// Human labels for the required fields, so we can tell the user what's missing.
export const FIELD_LABELS = {
  full_name: 'Full Name',
  artist_name: 'Artist / Stage Name',
  phone: 'Phone Number',
  city: 'City',
  state: 'State',
  date_of_birth: 'Date of Birth',
}

export async function getProfile() {
  const res = await fetch(`${BASE}/profile/me`, { credentials: 'include' })
  if (!res.ok) throw new Error('Could not load profile')
  return res.json() // includes is_complete + missing_fields
}

export async function updateProfile(fields) {
  const res = await fetch(`${BASE}/profile/me`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(typeof data.detail === 'string' ? data.detail : 'Could not save profile')
  return data
}
