const BASE = 'https://backend1-xzx5.onrender.com'

export async function getHomeContent() {
  try {
    const res = await fetch(`${BASE}/home/content`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export async function updateHomeContent(secret, data) {
  const res = await fetch(`${BASE}/admin/home`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.detail || 'Save failed')
  return json
}

export async function uploadArtistImage(secret, file) {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/admin/home/artist-image`, {
    method: 'POST',
    headers: { 'X-Admin-Secret': secret },
    body: form,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.detail || 'Upload failed')
  return json.url
}
