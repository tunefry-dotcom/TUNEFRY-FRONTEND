import { useState, useEffect, useCallback } from 'react'

const BASE = 'https://backend1-xzx5.onrender.com'
const STORAGE_KEY = 'tunefry_admin_secret'

// ── Helpers ────────────────────────────────────────────────────────────────
const PLAN_COLORS = {
  'free':          { bg: '#1a1a1a', text: '#9ca3af', border: '#374151' },
  'single-song':   { bg: '#052e16', text: '#4ade80', border: '#166534' },
  'starter':       { bg: '#052e16', text: '#4ade80', border: '#166534' },
  'single-artist': { bg: '#052e16', text: '#4ade80', border: '#166534' },
  'double-artist': { bg: '#052e16', text: '#4ade80', border: '#166534' },
  'label':         { bg: '#052e16', text: '#4ade80', border: '#166534' },
}
const PLAN_NAMES = {
  'free': 'Free', 'single-song': 'Single Song', 'starter': 'Starter',
  'single-artist': 'Single Artist', 'double-artist': 'Double Artist', 'label': 'Label Plan',
}

const TYPE_LABELS = {
  new_song:        { label: 'New Song',      color: '#6366f1' },
  transfer_song:   { label: 'Transfer',      color: '#8b5cf6' },
  new_album:       { label: 'New Album',     color: '#06b6d4' },
  transfer_album:  { label: 'Transfer Album',color: '#0891b2' },
  profile_mismatch:{ label: 'Mismatch',      color: '#eab308' },
  claim_removal:   { label: 'Claim',         color: '#f97316' },
  insta_link:      { label: 'Insta Link',    color: '#ec4899' },
}

function subTitle(sub) {
  const d = sub.data || {}
  return d.song_title || d.album_name || d.section_name || d.song_name || d.instagram_url || '(no title)'
}

function initials(email = '') {
  return email[0]?.toUpperCase() || '?'
}

function avatarColor(email = '') {
  let h = 0
  for (let i = 0; i < email.length; i++) h = email.charCodeAt(i) + ((h << 5) - h)
  return `hsl(${Math.abs(h) % 360},55%,38%)`
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function fmtKey(k) {
  return k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function openMail(email, action, sub) {
  const title = subTitle(sub)
  const typeLabel = TYPE_LABELS[sub.submission_type]?.label || sub.submission_type
  if (action === 'approved') {
    const subject = encodeURIComponent(`Your ${typeLabel} submission has been approved — Tunefry`)
    const body = encodeURIComponent(
      `Hi there,\n\nGreat news! Your ${typeLabel} submission "${title}" has been reviewed and approved by the Tunefry team.\n\nYour content will be live on all major platforms within 3–5 business days.\n\nThank you for being part of Tunefry!\n\nWarm regards,\nTunefry Team`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  } else {
    const subject = encodeURIComponent(`Update on your ${typeLabel} submission — Tunefry`)
    const body = encodeURIComponent(
      `Hi there,\n\nThank you for submitting your ${typeLabel} "${title}" to Tunefry.\n\nAfter careful review, we were unable to approve this submission. Please review our submission guidelines and feel free to resubmit after making the necessary changes.\n\nFor specific feedback, please reply to this email and our team will assist you.\n\nWarm regards,\nTunefry Team`
    )
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
  }
}

// ── Secret gate ────────────────────────────────────────────────────────────
function SecretGate({ onUnlock }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const attempt = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/admin/users`, { headers: { 'X-Admin-Secret': value } })
      if (res.status === 403) { setError('Wrong secret.'); return }
      if (!res.ok) { const b = await res.text(); setError(`Server error ${res.status}: ${b}`); return }
      sessionStorage.setItem(STORAGE_KEY, value)
      onUnlock(value)
    } catch {
      setError('Cannot reach backend.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,sans-serif' }}>
      <div style={{ width: 360, background: '#111', border: '1px solid #222', borderRadius: 16, padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'linear-gradient(135deg,#ff6b2b,#ff4500)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h1 style={{ color: '#f0f0f0', fontSize: '1.4rem', margin: '0 0 .4rem' }}>Admin Access</h1>
          <p style={{ color: '#666', fontSize: '.9rem', margin: 0 }}>Tunefry internal panel</p>
        </div>
        <form onSubmit={attempt}>
          {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '.85rem' }}>{error}</div>}
          <input type="password" placeholder="Enter admin secret" value={value} onChange={(e) => setValue(e.target.value)} autoFocus
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '.75rem 1rem', color: '#f0f0f0', fontSize: '.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }} />
          <button type="submit" disabled={!value || loading}
            style={{ width: '100%', padding: '.8rem', borderRadius: 8, border: 'none', background: value && !loading ? 'linear-gradient(135deg,#ff6b2b,#ff4500)' : '#1a1a1a', color: value && !loading ? '#fff' : '#444', fontWeight: 600, fontSize: '.95rem', cursor: value && !loading ? 'pointer' : 'default', transition: 'all .2s' }}>
            {loading ? 'Verifying…' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Admin sidebar ───────────────────────────────────────────────────────────
function AdminSidebar({ active, onNav, onLock }) {
  const navItems = [
    { id: 'users', label: 'All Users', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
    { id: 'songs', label: 'Songs', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
    { id: 'albums', label: 'Albums', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> },
    { id: 'profile-mismatch', label: 'Profile Mismatch', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
    { id: 'claim-removal', label: 'Claim Removal', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id: 'insta-link', label: 'Insta Link', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
    { id: 'new-artist', label: 'New Artist Profile Updates', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
    { id: 'purchases', label: 'Plan Purchases', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'master-home', label: 'Master Home', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  ]

  return (
    <aside style={{ width: 220, flexShrink: 0, background: '#0d0d0d', borderRight: '1px solid #1a1a1a', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0 }}>
      <div style={{ padding: '1.25rem 1rem .875rem', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#ff6b2b,#ff4500)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
          </div>
          <div>
            <div style={{ color: '#f0f0f0', fontWeight: 700, fontSize: '.9rem', lineHeight: 1.2 }}>Tunefry</div>
            <div style={{ color: '#555', fontSize: '.68rem', letterSpacing: '.05em' }}>ADMIN</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '.75rem .6rem', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '.6rem .8rem', borderRadius: 7, border: 'none', background: active === item.id ? 'rgba(255,107,43,.12)' : 'transparent', color: active === item.id ? '#ff6b2b' : '#9ca3af', fontWeight: active === item.id ? 600 : 400, fontSize: '.85rem', cursor: 'pointer', textAlign: 'left', marginBottom: 2, transition: 'all .12s' }}>
            <span style={{ color: 'inherit', flexShrink: 0 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ padding: '.6rem', borderTop: '1px solid #1a1a1a' }}>
        <button onClick={onLock}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 7, padding: '.55rem .8rem', borderRadius: 7, border: 'none', background: 'transparent', color: '#4b5563', fontSize: '.82rem', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#4b5563')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Lock panel
        </button>
      </div>
    </aside>
  )
}

// ── Users view ──────────────────────────────────────────────────────────────
function UsersView({ secret, onSessionExpired }) {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editSaving, setEditSaving] = useState(false)
  const [editMsg, setEditMsg] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/admin/users`, { headers: { 'X-Admin-Secret': secret } })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { let msg = `${res.status}`; try { const b = await res.json(); msg = b.detail || JSON.stringify(b) } catch {} throw new Error(msg) }
      const data = await res.json()
      setUsers(data.users); setTotal(data.total)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [secret, onSessionExpired])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const handleDelete = async (uid) => {
    setDeleteLoading(true)
    try {
      const res = await fetch(`${BASE}/admin/users/${uid}`, {
        method: 'DELETE', headers: { 'X-Admin-Secret': secret },
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) throw new Error((await res.json()).detail || 'Delete failed')
      setUsers(prev => prev.filter(u => u.id !== uid))
      setTotal(prev => prev - 1)
      setDeletingId(null)
    } catch (e) { setError(e.message) }
    finally { setDeleteLoading(false) }
  }

  const handleEditSave = async () => {
    setEditSaving(true); setEditMsg('')
    try {
      const res = await fetch(`${BASE}/admin/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify(editForm),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) throw new Error((await res.json()).detail || 'Save failed')
      const data = await res.json()
      setUsers(prev => prev.map(u => u.id === editingUser.id ? {
        ...u, ...editForm,
        plan: editForm.plan || u.plan,
        plan_name: data.plan_name || PLAN_NAMES[editForm.plan] || u.plan_name,
      } : u))
      setEditMsg('Saved!')
      setTimeout(() => setEditingUser(null), 800)
    } catch (e) { setEditMsg(e.message) }
    finally { setEditSaving(false) }
  }

  const filtered = search.trim()
    ? users.filter((u) => { const q = search.toLowerCase(); return u.email.toLowerCase().includes(q) || u.full_name.toLowerCase().includes(q) })
    : users

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h2 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>All Users</h2>
          <p style={{ color: '#555', margin: '.2rem 0 0', fontSize: '.82rem' }}>{loading ? 'Loading…' : `${total} total · ${filtered.length} shown`}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ position: 'relative' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search email or name…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem .55rem 2rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', width: 220 }} />
          </div>
          <button onClick={fetchUsers} disabled={loading} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem', color: '#9ca3af', cursor: 'pointer', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Refresh
          </button>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.75rem' }}>
        {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 9, padding: '.875rem 1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1rem' }}>Error: {error}</div>}
        {loading ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>Loading users…</div>
          : filtered.length === 0 ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>{search ? 'No users match.' : 'No users found.'}</div>
          : (
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 11, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 1.2fr 1fr 1fr 90px', padding: '.65rem 1.1rem', borderBottom: '1px solid #1a1a1a', color: '#555', fontSize: '.74rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                <span>User</span><span>Artist Name</span><span>Phone</span><span>Plan</span><span>Joined</span><span>Last Sign In</span><span>Actions</span>
              </div>
              {filtered.map((u, i) => {
                const ps = PLAN_COLORS[u.plan] || PLAN_COLORS['free']
                return (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 1.2fr 1fr 1fr 90px', padding: '.85rem 1.1rem', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid #161616' : 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#161616')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                      <div style={{ width: 33, height: 33, borderRadius: 9, flexShrink: 0, background: avatarColor(u.email), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.78rem' }}>{initials(u.email)}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ color: '#f0f0f0', fontWeight: 500, fontSize: '.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.full_name || <span style={{ color: '#555', fontStyle: 'italic' }}>No name</span>}</div>
                        <div style={{ color: '#6b7280', fontSize: '.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</div>
                      </div>
                    </div>
                    <div style={{ color: '#d1d5db', fontSize: '.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.artist_name || <span style={{ color: '#555', fontStyle: 'italic' }}>—</span>}</div>
                    <div style={{ color: '#d1d5db', fontSize: '.83rem' }}>{u.phone || <span style={{ color: '#555', fontStyle: 'italic' }}>—</span>}</div>
                    <span style={{ display: 'inline-block', padding: '.22rem .6rem', borderRadius: 5, fontSize: '.75rem', fontWeight: 600, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}` }}>{u.plan_name}</span>
                    <div style={{ color: '#6b7280', fontSize: '.8rem' }}>{fmtDate(u.created_at)}</div>
                    <div style={{ color: '#6b7280', fontSize: '.8rem' }}>{fmtDate(u.last_sign_in_at)}</div>
                    <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                      <button
                        onClick={() => {
                          setEditingUser(u)
                          setEditForm({
                            full_name: u.full_name || '', artist_name: u.artist_name || '',
                            phone: u.phone || '', city: u.city || '', state: u.state || '',
                            date_of_birth: u.date_of_birth || '', gender: u.gender || '',
                            bio: u.bio || '', spotify_url: u.spotify_url || '',
                            apple_music_url: u.apple_music_url || '',
                            instagram: u.instagram || '', youtube_url: u.youtube_url || '',
                            plan: u.plan || 'free',
                          })
                          setEditMsg('')
                        }}
                        title="Edit"
                        style={{ padding: '4px 7px', borderRadius: 6, border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#9ca3af', cursor: 'pointer', fontSize: '.75rem', lineHeight: 1 }}>
                        ✏️
                      </button>
                      {deletingId === u.id
                        ? <>
                            <button onClick={() => handleDelete(u.id)} disabled={deleteLoading}
                              style={{ padding: '4px 7px', borderRadius: 6, border: '1px solid #7f1d1d', background: '#2d0a0a', color: '#f87171', cursor: 'pointer', fontSize: '.75rem' }}>✓</button>
                            <button onClick={() => setDeletingId(null)}
                              style={{ padding: '4px 7px', borderRadius: 6, border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#9ca3af', cursor: 'pointer', fontSize: '.75rem' }}>✕</button>
                          </>
                        : <button onClick={() => setDeletingId(u.id)} title="Delete"
                            style={{ padding: '4px 7px', borderRadius: 6, border: '1px solid #2a2a2a', background: '#1a1a1a', color: '#f87171', cursor: 'pointer', fontSize: '.75rem', lineHeight: 1 }}>🗑</button>
                      }
                    </div>
                  </div>
                )
              })}
            </div>
          )}
      </div>
      {editingUser && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setEditingUser(null) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 14, padding: '1.5rem', width: '100%', maxWidth: 620, maxHeight: '90vh', overflow: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ color: '#f0f0f0', margin: '0 0 .2rem', fontSize: '1.05rem', fontWeight: 600 }}>Edit User</h3>
                <div style={{ color: '#6b7280', fontSize: '.8rem' }}>{editingUser.email}</div>
              </div>
              <button onClick={() => setEditingUser(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: '0 0 0 1rem' }}>✕</button>
            </div>

            {/* Plan selector */}
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.1rem' }}>
              <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Plan</span>
              <select value={editForm.plan || 'free'} onChange={e => setEditForm(p => ({ ...p, plan: e.target.value }))}
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', cursor: 'pointer' }}>
                {Object.entries(PLAN_NAMES).map(([slug, name]) => (
                  <option key={slug} value={slug}>{name}</option>
                ))}
              </select>
            </label>

            {/* Profile fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', marginBottom: '1rem' }}>
              {[
                ['Full Name', 'full_name'], ['Artist Name', 'artist_name'], ['Phone', 'phone'],
                ['City', 'city'], ['State', 'state'], ['Date of Birth', 'date_of_birth'],
                ['Gender', 'gender'], ['Instagram', 'instagram'], ['YouTube URL', 'youtube_url'],
                ['Spotify URL', 'spotify_url'], ['Apple Music URL', 'apple_music_url'],
              ].map(([label, key]) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{label}</span>
                  <input value={editForm[key] || ''} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none' }} />
                </label>
              ))}
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.25rem' }}>
              <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Bio</span>
              <textarea value={editForm.bio || ''} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', resize: 'vertical' }} />
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={handleEditSave} disabled={editSaving}
                style={{ padding: '.5rem 1.2rem', borderRadius: 8, border: 'none', background: '#ff6b2b', color: '#fff', fontWeight: 600, fontSize: '.85rem', cursor: editSaving ? 'default' : 'pointer', opacity: editSaving ? .6 : 1 }}>
                {editSaving ? 'Saving…' : 'Save Changes'}
              </button>
              {editMsg && <span style={{ color: editMsg === 'Saved!' ? '#4ade80' : '#f87171', fontSize: '.84rem' }}>{editMsg}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Submission detail modal ─────────────────────────────────────────────────
function DownloadButton({ label, r2key, secret }) {
  const [fetching, setFetching] = useState(false)
  const download = async () => {
    if (!r2key) return
    setFetching(true)
    try {
      const res = await fetch(`${BASE}/admin/media/download-url?key=${encodeURIComponent(r2key)}`, { headers: { 'X-Admin-Secret': secret } })
      if (!res.ok) { const b = await res.json().catch(() => ({})); alert(b.detail || 'Could not get download URL'); return }
      const { url } = await res.json()
      window.open(url, '_blank', 'noopener')
    } catch { alert('Network error') }
    finally { setFetching(false) }
  }
  return (
    <button onClick={download} disabled={fetching}
      style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '.45rem .85rem', borderRadius: 7, border: '1px solid #2a2a2a', background: '#1a1a1a', color: fetching ? '#555' : '#9ca3af', fontSize: '.78rem', cursor: fetching ? 'default' : 'pointer', transition: 'all .15s' }}
      onMouseEnter={(e) => { if (!fetching) { e.currentTarget.style.borderColor = '#ff6b2b'; e.currentTarget.style.color = '#ff6b2b' } }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.color = fetching ? '#555' : '#9ca3af' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      {fetching ? 'Generating…' : label}
    </button>
  )
}

function DetailModal({ sub, secret, onClose, onReviewed }) {
  const [loading, setLoading] = useState(false)

  const handleAction = async (newStatus) => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/admin/submissions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, admin_note: '' }),
      })
      if (!res.ok) { alert(`Failed: ${res.status}`); return }
      openMail(sub.user_email, newStatus, sub)
      onReviewed(sub.id, newStatus)
      onClose()
    } catch (e) { alert('Network error.') }
    finally { setLoading(false) }
  }

  const data = sub.data || {}
  const typeInfo = TYPE_LABELS[sub.submission_type] || { label: sub.submission_type, color: '#9ca3af' }
  const ps = PLAN_COLORS[sub.user_plan] || PLAN_COLORS['free']

  // Fields to skip in the generic display
  const SKIP = new Set(['submission_type'])
  const dataEntries = Object.entries(data).filter(([k]) => !SKIP.has(k))

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 700, background: `${typeInfo.color}22`, color: typeInfo.color, border: `1px solid ${typeInfo.color}44` }}>{typeInfo.label}</span>
              <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}` }}>{PLAN_NAMES[sub.user_plan] || sub.user_plan}</span>
              {sub.status !== 'pending' && (
                <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: sub.status === 'approved' ? '#052e16' : '#2d0a0a', color: sub.status === 'approved' ? '#4ade80' : '#f87171', border: `1px solid ${sub.status === 'approved' ? '#166534' : '#7f1d1d'}` }}>{sub.status}</span>
              )}
            </div>
            <div style={{ color: '#f0f0f0', fontWeight: 600, fontSize: '1rem' }}>{subTitle(sub)}</div>
            <div style={{ color: '#6b7280', fontSize: '.8rem', marginTop: 2 }}>{sub.user_email} · {fmtDate(sub.created_at)}</div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
            {dataEntries.map(([k, v]) => {
              if (v === null || v === undefined || v === '') return null
              const display = Array.isArray(v)
                ? v.map((item, i) => (
                    <div key={i} style={{ background: '#1a1a1a', borderRadius: 6, padding: '6px 10px', marginTop: 4, fontSize: '.78rem', color: '#d1d5db' }}>
                      {typeof item === 'object' ? Object.entries(item).filter(([,val]) => val).map(([ik, iv]) => `${fmtKey(ik)}: ${iv}`).join(' · ') : String(item)}
                    </div>
                  ))
                : typeof v === 'object'
                  ? JSON.stringify(v, null, 2)
                  : String(v)

              const isWide = Array.isArray(v) || k === 'comments' || k.includes('description')
              return (
                <div key={k} style={{ gridColumn: isWide ? '1 / -1' : 'auto' }}>
                  <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{fmtKey(k)}</div>
                  {Array.isArray(v) ? display : <div style={{ color: '#d1d5db', fontSize: '.85rem', wordBreak: 'break-word' }}>{display}</div>}
                </div>
              )
            })}
          </div>
        </div>

        {/* File Downloads */}
        {(() => {
          const d = sub.data || {}
          const coverKey = d.cover_art_key
          const audioKey = d.audio_key
          // For albums: collect per-track audio keys from songs array
          const songs = Array.isArray(d.songs) ? d.songs : []
          const trackKeys = songs.map((s, i) => s.audio_key ? { label: `Track ${i + 1}`, key: s.audio_key } : null).filter(Boolean)
          if (!coverKey && !audioKey && trackKeys.length === 0) return null
          return (
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a' }}>
              <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Files</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {coverKey && <DownloadButton label="Cover Art" r2key={coverKey} secret={secret} />}
                {audioKey && <DownloadButton label="Audio" r2key={audioKey} secret={secret} />}
                {trackKeys.map((t) => <DownloadButton key={t.key} label={t.label} r2key={t.key} secret={secret} />)}
              </div>
            </div>
          )
        })()}

        {/* Actions */}
        {sub.status === 'pending' && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: 10 }}>
            <button onClick={() => handleAction('approved')} disabled={loading}
              style={{ flex: 1, padding: '.7rem', borderRadius: 8, border: '1px solid #166534', background: loading ? '#1a1a1a' : '#052e16', color: loading ? '#555' : '#4ade80', fontWeight: 700, fontSize: '.9rem', cursor: loading ? 'default' : 'pointer', transition: 'all .15s' }}>
              {loading ? 'Processing…' : '✓ Approve'}
            </button>
            <button onClick={() => handleAction('declined')} disabled={loading}
              style={{ flex: 1, padding: '.7rem', borderRadius: 8, border: '1px solid #7f1d1d', background: loading ? '#1a1a1a' : '#2d0a0a', color: loading ? '#555' : '#f87171', fontWeight: 700, fontSize: '.9rem', cursor: loading ? 'default' : 'pointer', transition: 'all .15s' }}>
              {loading ? 'Processing…' : '✗ Decline'}
            </button>
          </div>
        )}
        {sub.status !== 'pending' && (
          <div style={{ padding: '.875rem 1.5rem', borderTop: '1px solid #1a1a1a', textAlign: 'center' }}>
            <button onClick={() => openMail(sub.user_email, sub.status, sub)}
              style={{ background: 'none', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.5rem 1rem', color: '#9ca3af', fontSize: '.82rem', cursor: 'pointer' }}>
              Resend {sub.status === 'approved' ? 'approval' : 'decline'} email
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Submissions view ────────────────────────────────────────────────────────
function SubmissionsView({ secret, category, title, onSessionExpired }) {
  const [submissions, setSubmissions] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchPage = useCallback(async (p) => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/admin/submissions/${category}?page=${p}&per_page=10`, {
        headers: { 'X-Admin-Secret': secret },
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { let msg = `${res.status}`; try { const b = await res.json(); msg = b.detail || JSON.stringify(b) } catch {} throw new Error(msg) }
      const data = await res.json()
      setSubmissions(data.submissions)
      setTotal(data.total)
      setTotalPages(data.total_pages)
      setPage(data.page)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [secret, category, onSessionExpired])

  useEffect(() => { fetchPage(1) }, [fetchPage])

  const handleReviewed = (id, newStatus) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, status: newStatus, reviewed_at: new Date().toISOString() } : s)
      // Sort: pending first, reviewed last
      return [...updated.filter((s) => s.status === 'pending'), ...updated.filter((s) => s.status !== 'pending')]
    })
  }

  const pending = submissions.filter((s) => s.status === 'pending').length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>{title}</h2>
          <p style={{ color: '#555', margin: '.2rem 0 0', fontSize: '.82rem' }}>
            {loading ? 'Loading…' : <>{total} total{pending > 0 && <span style={{ color: '#fbbf24', marginLeft: 6 }}>· {pending} pending</span>}</>}
          </p>
        </div>
        <button onClick={() => fetchPage(page)} disabled={loading}
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem', color: '#9ca3af', cursor: 'pointer', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.75rem' }}>
        {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 9, padding: '.875rem 1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1rem' }}>Error: {error}</div>}

        {loading ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>Loading…</div>
          : submissions.length === 0 ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>No submissions yet.</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {submissions.map((sub) => {
                const isReviewed = sub.status !== 'pending'
                const typeInfo = TYPE_LABELS[sub.submission_type] || { label: sub.submission_type, color: '#9ca3af' }
                const ps = PLAN_COLORS[sub.user_plan] || PLAN_COLORS['free']
                return (
                  <div key={sub.id} onClick={() => setSelected(sub)}
                    style={{ background: isReviewed ? '#0d0d0d' : '#111', border: `1px solid ${isReviewed ? '#161616' : '#1f1f1f'}`, borderRadius: 10, padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', opacity: isReviewed ? 0.55 : 1, transition: 'all .15s', filter: isReviewed ? 'grayscale(0.4)' : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = isReviewed ? '#222' : '#2a2a2a'; e.currentTarget.style.background = isReviewed ? '#111' : '#161616' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = isReviewed ? '#161616' : '#1f1f1f'; e.currentTarget.style.background = isReviewed ? '#0d0d0d' : '#111' }}>
                    {/* Avatar */}
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: avatarColor(sub.user_email), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.82rem' }}>
                      {initials(sub.user_email)}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: isReviewed ? '#6b7280' : '#f0f0f0', fontWeight: 500, fontSize: '.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{subTitle(sub)}</div>
                      <div style={{ color: '#555', fontSize: '.78rem', marginTop: 2 }}>{sub.user_email}</div>
                    </div>
                    {/* Badges */}
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 700, background: `${typeInfo.color}22`, color: typeInfo.color, border: `1px solid ${typeInfo.color}44` }}>{typeInfo.label}</span>
                      <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}` }}>{PLAN_NAMES[sub.user_plan] || sub.user_plan}</span>
                      {sub.status === 'approved' && <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: '#052e16', color: '#4ade80', border: '1px solid #166534' }}>Approved</span>}
                      {sub.status === 'declined' && <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: '#2d0a0a', color: '#f87171', border: '1px solid #7f1d1d' }}>Declined</span>}
                    </div>
                    <div style={{ color: '#555', fontSize: '.78rem', flexShrink: 0, marginLeft: 4 }}>{fmtDate(sub.created_at)}</div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a3a3a" strokeWidth="2" style={{ flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )
              })}
            </div>
          )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ padding: '.875rem 1.75rem', borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <button onClick={() => fetchPage(page - 1)} disabled={page === 1 || loading}
            style={{ padding: '.45rem .85rem', borderRadius: 7, border: '1px solid #2a2a2a', background: page === 1 ? '#0d0d0d' : '#1a1a1a', color: page === 1 ? '#333' : '#9ca3af', cursor: page === 1 ? 'default' : 'pointer', fontSize: '.82rem' }}>
            ← Prev
          </button>
          <span style={{ color: '#555', fontSize: '.82rem' }}>Page {page} of {totalPages}</span>
          <button onClick={() => fetchPage(page + 1)} disabled={page === totalPages || loading}
            style={{ padding: '.45rem .85rem', borderRadius: 7, border: '1px solid #2a2a2a', background: page === totalPages ? '#0d0d0d' : '#1a1a1a', color: page === totalPages ? '#333' : '#9ca3af', cursor: page === totalPages ? 'default' : 'pointer', fontSize: '.82rem' }}>
            Next →
          </button>
        </div>
      )}

      {selected && (
        <DetailModal sub={selected} secret={secret} onClose={() => setSelected(null)} onReviewed={handleReviewed} />
      )}
    </div>
  )
}

// ── New Artist Profile Updates view ─────────────────────────────────────────────────
function NewArtistView({ secret, onSessionExpired }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [spotify, setSpotify] = useState('')
  const [apple, setApple] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchEntries = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/admin/new-artist-queue`, { headers: { 'X-Admin-Secret': secret } })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.detail || `Error ${res.status}`) }
      const data = await res.json()
      setEntries(data.entries || [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [secret, onSessionExpired])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  const openEntry = (entry) => { setSelected(entry); setSpotify(entry.spotify_url || ''); setApple(entry.apple_music_url || '') }

  const submitUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${BASE}/admin/new-artist-queue/${selected.id}`, {
        method: 'PATCH',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ spotify_url: spotify, apple_music_url: apple }),
      })
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.detail || 'Update failed') }
      setEntries((prev) => {
        const updated = prev.map((e) => e.id === selected.id ? { ...e, status: 'updated', spotify_url: spotify, apple_music_url: apple } : e)
        return [...updated.filter((e) => e.status === 'pending'), ...updated.filter((e) => e.status !== 'pending')]
      })
      setSelected(null)
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const pending = entries.filter((e) => e.status === 'pending').length

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>New Artist Profile Updates</h2>
          <p style={{ color: '#555', margin: '.2rem 0 0', fontSize: '.82rem' }}>
            {loading ? 'Loading…' : <>{entries.length} total{pending > 0 && <span style={{ color: '#fbbf24', marginLeft: 6 }}>· {pending} pending</span>}</>}
          </p>
        </div>
        <button onClick={fetchEntries} disabled={loading} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem', color: '#9ca3af', cursor: 'pointer', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.75rem' }}>
        {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 9, padding: '.875rem 1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1rem' }}>Error: {error}</div>}
        {loading ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>Loading…</div>
          : entries.length === 0 ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>No new artists in queue.</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {entries.map((entry) => {
                const done = entry.status === 'updated'
                return (
                  <div key={entry.id} onClick={() => openEntry(entry)}
                    style={{ background: done ? '#0d0d0d' : '#111', border: `1px solid ${done ? '#161616' : '#1f1f1f'}`, borderRadius: 10, padding: '1rem 1.1rem', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', opacity: done ? 0.5 : 1, filter: done ? 'grayscale(0.4)' : 'none', transition: 'all .15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = done ? '#111' : '#161616' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = done ? '#0d0d0d' : '#111' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: avatarColor(entry.user_email), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.82rem' }}>
                      {initials(entry.user_email)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: done ? '#6b7280' : '#f0f0f0', fontWeight: 500, fontSize: '.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{entry.artist_name || '(no name)'}</div>
                      <div style={{ color: '#555', fontSize: '.78rem', marginTop: 2 }}>{entry.user_email}</div>
                    </div>
                    {done
                      ? <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: '#052e16', color: '#4ade80', border: '1px solid #166534' }}>Updated</span>
                      : <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: '#1c1002', color: '#fbbf24', border: '1px solid #92400e' }}>Pending</span>}
                    <div style={{ color: '#555', fontSize: '.78rem' }}>{fmtDate(entry.created_at)}</div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3a3a3a" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )
              })}
            </div>
          )}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setSelected(null)}>
          <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: 14, width: '100%', maxWidth: 480, overflow: 'hidden' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f0f0f0', fontWeight: 700, fontSize: '1rem' }}>{selected.artist_name}</div>
                <div style={{ color: '#6b7280', fontSize: '.82rem', marginTop: 2 }}>{selected.user_email}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.3rem' }}>✕</button>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Spotify Profile URL</label>
                <input type="url" value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="https://open.spotify.com/artist/..."
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '.65rem .9rem', color: '#f0f0f0', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>Apple Music Profile URL</label>
                <input type="url" value={apple} onChange={(e) => setApple(e.target.value)} placeholder="https://music.apple.com/artist/..."
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '.65rem .9rem', color: '#f0f0f0', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1a1a1a', display: 'flex', gap: 10 }}>
              <button onClick={submitUpdate} disabled={saving || (!spotify && !apple)}
                style={{ flex: 1, padding: '.7rem', borderRadius: 8, border: '1px solid #166534', background: saving ? '#1a1a1a' : '#052e16', color: saving ? '#555' : '#4ade80', fontWeight: 700, fontSize: '.9rem', cursor: saving ? 'default' : 'pointer' }}>
                {saving ? 'Saving…' : 'Update Artist Profile'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Plan Purchases view ──────────────────────────────────────────────────────
const PURCHASE_PLAN_DISPLAY = {
  'single-song':   { label: 'Single Song',   col: { bg: '#052e16', text: '#4ade80', border: '#166534' } },
  'starter':       { label: 'Starter',        col: { bg: '#052e16', text: '#4ade80', border: '#166534' } },
  'single-artist': { label: 'Single Artist',  col: { bg: '#1e1b4b', text: '#818cf8', border: '#3730a3' } },
  'double-artist': { label: 'Double Artist',  col: { bg: '#1c1002', text: '#fbbf24', border: '#92400e' } },
  'label':         { label: 'Label',          col: { bg: '#2d0a0a', text: '#f87171', border: '#7f1d1d' } },
  // legacy underscore keys
  'single_song':   { label: 'Single Song',   col: { bg: '#052e16', text: '#4ade80', border: '#166534' } },
  'single_artist': { label: 'Single Artist',  col: { bg: '#1e1b4b', text: '#818cf8', border: '#3730a3' } },
  'double_artist': { label: 'Double Artist',  col: { bg: '#1c1002', text: '#fbbf24', border: '#92400e' } },
}

function PurchasesView({ secret, onSessionExpired }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')

  const fetchData = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BASE}/admin/purchases`, { headers: { 'X-Admin-Secret': secret } })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.detail || `Error ${res.status}`) }
      setData(await res.json())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [secret, onSessionExpired])

  useEffect(() => { fetchData() }, [fetchData])

  const allPurchases = data?.purchases || []

  const filtered = allPurchases.filter((p) => {
    if (planFilter !== 'all' && p.plan !== planFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return p.email.toLowerCase().includes(q) || (p.full_name || '').toLowerCase().includes(q) || (p.artist_name || '').toLowerCase().includes(q)
    }
    return true
  })

  const activePurchases = allPurchases.filter((p) => p.status === 'active')
  const totalRevenue = data?.total_revenue_inr || 0

  const FILTER_OPTIONS = [
    { key: 'all', label: 'All Plans' },
    { key: 'single-song', label: 'Single Song' },
    { key: 'starter', label: 'Starter' },
    { key: 'single-artist', label: 'Single Artist' },
    { key: 'double-artist', label: 'Double Artist' },
    { key: 'label', label: 'Label' },
  ]

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Plan Purchases</h2>
          <p style={{ color: '#555', margin: '.2rem 0 0', fontSize: '.82rem' }}>
            {loading ? 'Loading…' : `${data?.total || 0} total · ${activePurchases.length} active`}
          </p>
        </div>
        <button onClick={fetchData} disabled={loading}
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem', color: '#9ca3af', cursor: 'pointer', fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh
        </button>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.75rem' }}>
        {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 9, padding: '.875rem 1rem', color: '#f87171', fontSize: '.85rem', marginBottom: '1rem' }}>Error: {error}</div>}

        {/* Stats cards */}
        {!loading && data && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: '1.25rem' }}>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Total Purchases</div>
              <div style={{ color: '#f0f0f0', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>{data.total}</div>
              <div style={{ color: '#555', fontSize: '.75rem', marginTop: 5 }}>{activePurchases.length} active</div>
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>Active Revenue</div>
              <div style={{ color: '#4ade80', fontSize: '1.75rem', fontWeight: 700, lineHeight: 1 }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
              <div style={{ color: '#555', fontSize: '.75rem', marginTop: 5 }}>from active plans</div>
            </div>
            <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem 1.25rem' }}>
              <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>By Plan</div>
              {Object.entries(data.plan_counts || {}).length === 0
                ? <span style={{ color: '#555', fontSize: '.82rem', fontStyle: 'italic' }}>No active purchases</span>
                : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {Object.entries(data.plan_counts).map(([plan, count]) => {
                      const pd = PURCHASE_PLAN_DISPLAY[plan]
                      const col = pd?.col || { bg: '#1a1a1a', text: '#9ca3af', border: '#2a2a2a' }
                      return (
                        <span key={plan} style={{ padding: '.2rem .6rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: col.bg, color: col.text, border: `1px solid ${col.border}` }}>
                          {pd?.label || plan} × {count}
                        </span>
                      )
                    })}
                  </div>}
            </div>
          </div>
        )}

        {/* Search + plan filter */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search email, name or artist…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem .55rem 2rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {FILTER_OPTIONS.map((fo) => (
              <button key={fo.key} onClick={() => setPlanFilter(fo.key)}
                style={{ padding: '.38rem .7rem', borderRadius: 6, border: `1px solid ${planFilter === fo.key ? '#ff6b2b' : '#2a2a2a'}`, background: planFilter === fo.key ? 'rgba(255,107,43,.12)' : '#1a1a1a', color: planFilter === fo.key ? '#ff6b2b' : '#9ca3af', fontSize: '.75rem', fontWeight: planFilter === fo.key ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .1s' }}>
                {fo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading
          ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>Loading…</div>
          : filtered.length === 0
            ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '3rem' }}>{(data?.total || 0) === 0 ? 'No plan purchases yet.' : 'No purchases match your filters.'}</div>
            : (
              <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 11, overflow: 'hidden' }}>
                {/* Column headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1.3fr 0.85fr 1.1fr 1fr 1fr', padding: '.65rem 1.1rem', borderBottom: '1px solid #1a1a1a', color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  <span>User</span><span>Artist</span><span>Plan</span><span>Status</span><span>Payment</span><span>Started</span><span>Expires</span>
                </div>
                {filtered.map((p, i) => {
                  const pd = PURCHASE_PLAN_DISPLAY[p.plan]
                  const pc = pd?.col || { bg: '#1a1a1a', text: '#9ca3af', border: '#2a2a2a' }
                  const isActive = p.status === 'active'
                  const isExpired = !isActive && p.expires_at && new Date(p.expires_at) < new Date()
                  const statusStyle = isActive
                    ? { bg: '#052e16', text: '#4ade80', border: '#166534', label: 'Active' }
                    : isExpired
                      ? { bg: '#2d0a0a', text: '#f87171', border: '#7f1d1d', label: 'Expired' }
                      : { bg: '#1a1a1a', text: '#9ca3af', border: '#2a2a2a', label: (p.status || 'Unknown').charAt(0).toUpperCase() + (p.status || '').slice(1) }
                  return (
                    <div key={p.id || i}
                      style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 1.3fr 0.85fr 1.1fr 1fr 1fr', padding: '.85rem 1.1rem', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid #161616' : 'none', transition: 'background .1s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#161616')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                      {/* User */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                        <div style={{ width: 31, height: 31, borderRadius: 8, flexShrink: 0, background: avatarColor(p.email), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '.75rem' }}>{initials(p.email)}</div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ color: '#f0f0f0', fontWeight: 500, fontSize: '.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.full_name || <span style={{ color: '#555', fontStyle: 'italic' }}>No name</span>}</div>
                          <div style={{ color: '#6b7280', fontSize: '.76rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.email}</div>
                        </div>
                      </div>
                      {/* Artist */}
                      <div style={{ color: '#d1d5db', fontSize: '.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.artist_name || <span style={{ color: '#444', fontStyle: 'italic' }}>—</span>}</div>
                      {/* Plan */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ padding: '.2rem .55rem', borderRadius: 5, fontSize: '.73rem', fontWeight: 600, background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>{pd?.label || p.plan_name}</span>
                        {p.plan_price_inr > 0 && <span style={{ color: '#4b5563', fontSize: '.7rem' }}>₹{p.plan_price_inr.toLocaleString('en-IN')}</span>}
                      </div>
                      {/* Status */}
                      <span style={{ padding: '.2rem .55rem', borderRadius: 5, fontSize: '.73rem', fontWeight: 600, background: statusStyle.bg, color: statusStyle.text, border: `1px solid ${statusStyle.border}`, whiteSpace: 'nowrap', display: 'inline-block' }}>{statusStyle.label}</span>
                      {/* Payment */}
                      <div style={{ minWidth: 0 }}>
                        {p.payment_ref ? (
                          <>
                            <span style={{ padding: '.1rem .4rem', borderRadius: 4, fontSize: '.66rem', fontWeight: 600, background: 'rgba(99,102,241,.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,.3)', display: 'inline-block', marginBottom: 3 }}>Razorpay</span>
                            <div style={{ color: '#6b7280', fontSize: '.69rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'monospace' }} title={p.payment_ref}>{p.payment_ref.length > 16 ? p.payment_ref.slice(0, 14) + '…' : p.payment_ref}</div>
                          </>
                        ) : (
                          <span style={{ padding: '.1rem .4rem', borderRadius: 4, fontSize: '.66rem', fontWeight: 600, background: 'rgba(234,179,8,.1)', color: '#fbbf24', border: '1px solid rgba(234,179,8,.25)' }}>Manual</span>
                        )}
                      </div>
                      {/* Dates */}
                      <div style={{ color: '#6b7280', fontSize: '.78rem' }}>{fmtDate(p.started_at)}</div>
                      <div style={{ color: isExpired ? '#f87171' : '#6b7280', fontSize: '.78rem' }}>{p.expires_at ? fmtDate(p.expires_at) : <span style={{ color: '#333', fontStyle: 'italic' }}>Perpetual</span>}</div>
                    </div>
                  )
                })}
              </div>
            )}
      </div>
    </div>
  )
}

// ── Master Home view ────────────────────────────────────────────────────────
function MasterHomeView({ secret, onSessionExpired }) {
  const [homeData, setHomeData] = useState({
    artists: [],
    yt_testimonials: [],
    trending_links: [],
    latest_release_link: '',
    popular_artist_links: ['', ''],
    top_hits_links: ['', '', '', '', ''],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [imgUploading, setImgUploading] = useState(-1)

  function extractYtId(url) {
    if (!url) return ''
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]+)/)
    return m ? m[1] : url.trim()
  }

  useEffect(() => {
    fetch(`${BASE}/admin/home`, { headers: { 'X-Admin-Secret': secret } })
      .then(async (r) => {
        if (r.status === 403) { onSessionExpired(); return }
        const d = await r.json()
        setHomeData({
          artists: d.artists || [],
          yt_testimonials: d.yt_testimonials || [],
          trending_links: d.trending_links || [],
          latest_release_link: d.latest_release_link || '',
          popular_artist_links: [
            d.popular_artist_links?.[0] || '',
            d.popular_artist_links?.[1] || '',
          ],
          top_hits_links: Array.from({ length: 5 }, (_, i) => d.top_hits_links?.[i] || ''),
        })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [secret])

  const handleSave = async () => {
    setSaving(true)
    setSaveMsg('')
    try {
      const payload = {
        artists: homeData.artists.map((a) => ({ ...a, yt_video_id: extractYtId(a.yt_video_id) })),
        yt_testimonials: homeData.yt_testimonials.map((t) => ({ ...t, video_id: extractYtId(t.video_id) })),
        trending_links: homeData.trending_links.filter(Boolean),
        latest_release_link: homeData.latest_release_link || null,
        popular_artist_links: homeData.popular_artist_links.filter(Boolean),
        top_hits_links: homeData.top_hits_links.filter(Boolean),
      }
      const res = await fetch(`${BASE}/admin/home`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify(payload),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        throw new Error(b.detail || `Save failed (${res.status})`)
      }
      setSaveMsg('Saved successfully!')
    } catch (e) {
      setSaveMsg(e.message)
    } finally {
      setSaving(false)
      setTimeout(() => setSaveMsg(''), 4000)
    }
  }

  const handleImageUpload = async (e, idx) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgUploading(idx)
    setSaveMsg('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`${BASE}/admin/home/artist-image`, {
        method: 'POST',
        headers: { 'X-Admin-Secret': secret },
        body: form,
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        throw new Error(b.detail || 'Upload failed')
      }
      const { url } = await res.json()
      setHomeData((prev) => ({
        ...prev,
        artists: prev.artists.map((a, i) => (i === idx ? { ...a, image_url: url } : a)),
      }))
    } catch (e) {
      setSaveMsg(`Image upload failed: ${e.message}`)
    } finally {
      setImgUploading(-1)
    }
  }

  const addArtist = () =>
    setHomeData((prev) => ({
      ...prev,
      artists: [...prev.artists, { name: '', image_url: '', genre: '', city: '', yt_video_id: '' }],
    }))
  const removeArtist = (i) =>
    setHomeData((prev) => ({ ...prev, artists: prev.artists.filter((_, j) => j !== i) }))
  const updateArtist = (i, field, val) =>
    setHomeData((prev) => ({
      ...prev,
      artists: prev.artists.map((a, j) => (j === i ? { ...a, [field]: val } : a)),
    }))

  const addYT = () =>
    setHomeData((prev) => ({
      ...prev,
      yt_testimonials: [...prev.yt_testimonials, { video_id: '', title: '', channel: '' }],
    }))
  const removeYT = (i) =>
    setHomeData((prev) => ({ ...prev, yt_testimonials: prev.yt_testimonials.filter((_, j) => j !== i) }))
  const updateYT = (i, field, val) =>
    setHomeData((prev) => ({
      ...prev,
      yt_testimonials: prev.yt_testimonials.map((t, j) => (j === i ? { ...t, [field]: val } : t)),
    }))

  const addTrending = () =>
    setHomeData((prev) => ({ ...prev, trending_links: [...prev.trending_links, ''] }))
  const removeTrending = (i) =>
    setHomeData((prev) => ({ ...prev, trending_links: prev.trending_links.filter((_, j) => j !== i) }))
  const updateTrending = (i, val) =>
    setHomeData((prev) => ({
      ...prev,
      trending_links: prev.trending_links.map((u, j) => (j === i ? val : u)),
    }))

  const inp = {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7,
    padding: '.5rem .75rem', color: '#f0f0f0', fontSize: '.85rem',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }
  const card = {
    background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 12,
    padding: '20px', marginBottom: '20px',
  }
  const secLabel = {
    fontSize: '.75rem', fontWeight: 700, color: '#555', letterSpacing: '1px',
    textTransform: 'uppercase', marginBottom: '12px',
  }
  const addBtn = {
    padding: '.45rem .9rem', borderRadius: 7, border: '1px solid #2a2a2a',
    background: 'transparent', color: '#9ca3af', fontSize: '.82rem', cursor: 'pointer',
  }
  const delBtn = {
    padding: '.38rem .6rem', borderRadius: 7, border: '1px solid #7f1d1d',
    background: '#2d0a0a', color: '#f87171', fontSize: '.8rem', cursor: 'pointer', flexShrink: 0,
  }

  if (loading) return <div style={{ padding: '3rem', color: '#555', fontSize: '.9rem' }}>Loading…</div>

  return (
    <div style={{ padding: '2rem', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ color: '#f0f0f0', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Master Home</h1>
          <p style={{ color: '#555', fontSize: '.83rem', margin: '.3rem 0 0' }}>Manage all dynamic content on the public home page.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {saveMsg && (
            <span style={{ fontSize: '.82rem', color: saveMsg.startsWith('Saved') ? '#4ade80' : '#f87171' }}>
              {saveMsg}
            </span>
          )}
          <button onClick={handleSave} disabled={saving}
            style={{ padding: '.6rem 1.4rem', borderRadius: 8, border: 'none', background: saving ? '#1a1a1a' : 'linear-gradient(135deg,#ff6b2b,#ff4500)', color: saving ? '#444' : '#fff', fontWeight: 600, fontSize: '.88rem', cursor: saving ? 'default' : 'pointer' }}>
            {saving ? 'Saving…' : 'Save All'}
          </button>
        </div>
      </div>

      {/* Artists & Projects */}
      <div style={card}>
        <div style={secLabel}>{'Artists & Projects'}</div>
        {homeData.artists.map((a, i) => (
          <div key={i} style={{ background: '#161616', border: '1px solid #222', borderRadius: 10, padding: '14px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <label style={{ cursor: 'pointer', flexShrink: 0 }}>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, i)} />
                {a.image_url
                  ? <img src={a.image_url} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
                  : (
                    <div style={{ width: 52, height: 52, borderRadius: 8, background: '#222', border: '1px dashed #333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                      {imgUploading === i ? '⏳' : '📷'}
                    </div>
                  )
                }
              </label>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input placeholder="Name" value={a.name} onChange={(e) => updateArtist(i, 'name', e.target.value)} style={inp} />
                <input placeholder="Genre" value={a.genre} onChange={(e) => updateArtist(i, 'genre', e.target.value)} style={inp} />
                <input placeholder="City" value={a.city} onChange={(e) => updateArtist(i, 'city', e.target.value)} style={inp} />
                <input placeholder="YouTube URL (testimonial)" value={a.yt_video_id} onChange={(e) => updateArtist(i, 'yt_video_id', e.target.value)} style={inp} />
              </div>
              <button onClick={() => removeArtist(i)} style={delBtn}>&#x2715;</button>
            </div>
          </div>
        ))}
        <button onClick={addArtist} style={addBtn}>+ Add Artist</button>
      </div>

      {/* YouTube Testimonials */}
      <div style={card}>
        <div style={secLabel}>YouTube Testimonials</div>
        {homeData.yt_testimonials.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input placeholder="YouTube URL or Video ID" value={t.video_id} onChange={(e) => updateYT(i, 'video_id', e.target.value)} style={{ ...inp, flex: 2 }} />
            <input placeholder="Title" value={t.title} onChange={(e) => updateYT(i, 'title', e.target.value)} style={{ ...inp, flex: 2 }} />
            <input placeholder="Channel" value={t.channel} onChange={(e) => updateYT(i, 'channel', e.target.value)} style={{ ...inp, flex: 1 }} />
            <button onClick={() => removeYT(i)} style={delBtn}>&#x2715;</button>
          </div>
        ))}
        <button onClick={addYT} style={addBtn}>+ Add Video</button>
      </div>

      {/* Trending On Tunefry */}
      <div style={card}>
        <div style={secLabel}>Trending On Tunefry</div>
        <p style={{ color: '#555', fontSize: '.8rem', margin: '0 0 12px' }}>Spotify track/album links — appear as embed cards in the scrollable row.</p>
        {homeData.trending_links.map((url, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
            <input placeholder={`Spotify URL ${i + 1}`} value={url} onChange={(e) => updateTrending(i, e.target.value)} style={inp} />
            <button onClick={() => removeTrending(i)} style={delBtn}>&#x2715;</button>
          </div>
        ))}
        <button onClick={addTrending} style={addBtn}>+ Add Link</button>
      </div>

      {/* Latest Release */}
      <div style={card}>
        <div style={secLabel}>Latest Release</div>
        <p style={{ color: '#555', fontSize: '.8rem', margin: '0 0 10px' }}>One Spotify link shown as a large embed card.</p>
        <input placeholder="https://open.spotify.com/track/..."
          value={homeData.latest_release_link || ''}
          onChange={(e) => setHomeData((prev) => ({ ...prev, latest_release_link: e.target.value }))}
          style={inp} />
      </div>

      {/* Popular Artists */}
      <div style={card}>
        <div style={secLabel}>Popular Artists</div>
        <p style={{ color: '#555', fontSize: '.8rem', margin: '0 0 12px' }}>Two Spotify links shown as side-by-side embed cards.</p>
        {[0, 1].map((i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ color: '#555', fontSize: '.77rem', marginBottom: '4px' }}>Artist {i + 1}</div>
            <input placeholder="https://open.spotify.com/artist/..."
              value={homeData.popular_artist_links[i] || ''}
              onChange={(e) => {
                const val = e.target.value
                setHomeData((prev) => {
                  const links = [...prev.popular_artist_links]
                  links[i] = val
                  return { ...prev, popular_artist_links: links }
                })
              }}
              style={inp} />
          </div>
        ))}
      </div>

      {/* This Week's Top Hits */}
      <div style={card}>
        <div style={secLabel}>{"This Week's Top Hits"}</div>
        <p style={{ color: '#555', fontSize: '.8rem', margin: '0 0 12px' }}>Five Spotify track links shown as stacked embed cards.</p>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} style={{ marginBottom: '10px' }}>
            <div style={{ color: '#555', fontSize: '.77rem', marginBottom: '4px' }}>Hit {i + 1}</div>
            <input placeholder="https://open.spotify.com/track/..."
              value={homeData.top_hits_links[i] || ''}
              onChange={(e) => {
                const val = e.target.value
                setHomeData((prev) => {
                  const links = [...prev.top_hits_links]
                  links[i] = val
                  return { ...prev, top_hits_links: links }
                })
              }}
              style={inp} />
          </div>
        ))}
      </div>

    </div>
  )
}

// ── Root ────────────────────────────────────────────────────────────────────
const SUBMISSION_VIEWS = [
  { id: 'songs',           title: 'Songs' },
  { id: 'albums',          title: 'Albums' },
  { id: 'profile-mismatch',title: 'Profile Mismatch' },
  { id: 'claim-removal',   title: 'Claim Removal' },
  { id: 'insta-link',      title: 'Insta Link' },
]

export default function SecretPanel() {
  const storedSecret = sessionStorage.getItem(STORAGE_KEY) || ''
  const [secret, setSecret] = useState(storedSecret)
  const [isAuthenticated, setIsAuthenticated] = useState(!!storedSecret)
  const [activeNav, setActiveNav] = useState('users')

  const handleUnlock = useCallback((s) => { setSecret(s); setIsAuthenticated(true) }, [])
  const handleLock = useCallback(() => { sessionStorage.removeItem(STORAGE_KEY); setSecret(''); setIsAuthenticated(false) }, [])

  if (!isAuthenticated) return <SecretGate onUnlock={handleUnlock} />

  const subView = SUBMISSION_VIEWS.find((v) => v.id === activeNav)

  return (
    <>
      <style>{`.sp-root,.sp-root *{user-select:text!important;-webkit-user-select:text!important;-moz-user-select:text!important}`}</style>
      <div className="sp-root" style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui,sans-serif' }}>
      <AdminSidebar active={activeNav} onNav={setActiveNav} onLock={handleLock} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activeNav === 'users' && <UsersView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'new-artist' && <NewArtistView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'purchases' && <PurchasesView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'master-home' && <MasterHomeView secret={secret} onSessionExpired={handleLock} />}
        {subView && (
          <SubmissionsView key={subView.id} secret={secret} category={subView.id} title={subView.title} onSessionExpired={handleLock} />
        )}
      </div>
    </div>
    </>
  )
}
