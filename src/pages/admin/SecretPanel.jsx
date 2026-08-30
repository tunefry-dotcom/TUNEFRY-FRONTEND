import { useState, useEffect, useCallback } from 'react'

import { API_BASE as BASE } from '../../lib/config.js'
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

const SUBMISSION_PLAN_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'free', label: 'Free' },
  { key: 'single-song', label: 'Single Song' },
  { key: 'starter', label: 'Starter' },
  { key: 'single-artist', label: 'Single Artist' },
  { key: 'double-artist', label: 'Double Artist' },
  { key: 'label', label: 'Label' },
]

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
    { id: 'new-songs', label: 'New Songs', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg> },
    { id: 'transfer-songs', label: 'Transfer Songs', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
    { id: 'new-albums', label: 'New Albums', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> },
    { id: 'transfer-albums', label: 'Transfer Albums', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
    { id: 'profile-mismatch', label: 'Profile Mismatch', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
    { id: 'claim-removal', label: 'Claim Removal', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { id: 'insta-link', label: 'Insta Link', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
    { id: 'new-artist', label: 'New Artist Profile Updates', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
    { id: 'purchases', label: 'Plan Purchases', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'withdrawals', label: 'Withdrawals', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: 'earnings', label: 'Earnings', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: 'master-home', label: 'Master Home', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'announcements', label: 'Announcements', icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
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
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [addUserForm, setAddUserForm] = useState({ email: '', password: '', full_name: '', artist_name: '', phone: '', plan: 'free' })
  const [addUserSaving, setAddUserSaving] = useState(false)
  const [addUserMsg, setAddUserMsg] = useState('')
  const [setPwValue, setSetPwValue] = useState('')
  const [setPwSaving, setSetPwSaving] = useState(false)
  const [setPwMsg, setSetPwMsg] = useState('')

  const fetchUsers = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE}/admin/users`, { headers: { 'X-Admin-Secret': secret } })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { let msg = `${res.status}`; try { const b = await res.json(); msg = b.detail || JSON.stringify(b) } catch {} throw new Error(msg) }
      const data = await res.json()
      setUsers(data.users); setTotal(data.total)
    } catch (e) { setError(e.message) }
    finally { if (!silent) setLoading(false) }
  }, [secret, onSessionExpired])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  // Silent background poll every 30 s — picks up plan changes from payments
  // without showing the loading spinner or blanking the list.
  useEffect(() => {
    const id = setInterval(() => fetchUsers(true), 30_000)
    return () => clearInterval(id)
  }, [fetchUsers])

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

  const handleAddUser = async () => {
    if (!addUserForm.email || !addUserForm.password) { setAddUserMsg('Email and password are required'); return }
    setAddUserSaving(true); setAddUserMsg('')
    try {
      const res = await fetch(`${BASE}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify(addUserForm),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) throw new Error((await res.json()).detail || 'Create failed')
      setAddUserMsg('User created!')
      setAddUserForm({ email: '', password: '', full_name: '', artist_name: '', phone: '', plan: 'free' })
      setTimeout(() => { setAddUserOpen(false); setAddUserMsg(''); fetchUsers(true) }, 1200)
    } catch (e) { setAddUserMsg(e.message) }
    finally { setAddUserSaving(false) }
  }

  const handleSetPassword = async () => {
    if (!setPwValue || setPwValue.length < 6) { setSetPwMsg('Min 6 characters'); return }
    setSetPwSaving(true); setSetPwMsg('')
    try {
      const res = await fetch(`${BASE}/admin/users/${editingUser.id}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify({ password: setPwValue }),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed')
      setSetPwMsg('Password updated!')
      setSetPwValue('')
    } catch (e) { setSetPwMsg(e.message) }
    finally { setSetPwSaving(false) }
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
          <button onClick={() => { setAddUserOpen(true); setAddUserMsg('') }}
            style={{ background: '#ff6b2b', border: 'none', borderRadius: 7, padding: '.55rem .9rem', color: '#fff', cursor: 'pointer', fontSize: '.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
            + Add User
          </button>
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
                            custom_label_name: u.custom_label_name || '',
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
              {(editForm.plan === 'double-artist' || editForm.plan === 'label') && (
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Label Name</span>
                  <input value={editForm.custom_label_name || ''} onChange={e => setEditForm(p => ({ ...p, custom_label_name: e.target.value }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none' }} />
                </label>
              )}
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: '1.25rem' }}>
              <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Bio</span>
              <textarea value={editForm.bio || ''} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', resize: 'vertical' }} />
            </label>
            {/* Set Password */}
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase', marginBottom: 8 }}>Set New Password</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="password" placeholder="New password (min 6 chars)" value={setPwValue}
                  onChange={e => { setSetPwValue(e.target.value); setSetPwMsg('') }}
                  style={{ flex: 1, minWidth: 180, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.45rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none' }} />
                <button onClick={handleSetPassword} disabled={setPwSaving}
                  style={{ padding: '.45rem 1rem', borderRadius: 7, border: 'none', background: '#1e3a5f', color: '#60a5fa', fontWeight: 600, fontSize: '.82rem', cursor: setPwSaving ? 'default' : 'pointer', opacity: setPwSaving ? .6 : 1, whiteSpace: 'nowrap' }}>
                  {setPwSaving ? '…' : 'Set Password'}
                </button>
                {setPwMsg && <span style={{ color: setPwMsg === 'Password updated!' ? '#4ade80' : '#f87171', fontSize: '.82rem' }}>{setPwMsg}</span>}
              </div>
            </div>

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
      {addUserOpen && (
        <div onClick={(e) => { if (e.target === e.currentTarget) setAddUserOpen(false) }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 14, padding: '1.5rem', width: '100%', maxWidth: 480 }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>Add New User</h3>
              <button onClick={() => setAddUserOpen(false)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1, padding: '0 0 0 1rem' }}>✕</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Email *', 'email', 'email', 'artist@example.com'], ['Password *', 'password', 'password', 'Min 6 characters']].map(([label, key, type, ph]) => (
                <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{label}</span>
                  <input type={type} placeholder={ph} value={addUserForm[key]}
                    onChange={e => setAddUserForm(p => ({ ...p, [key]: e.target.value }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none' }} />
                </label>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
                {[['Full Name', 'full_name'], ['Artist Name', 'artist_name'], ['Phone', 'phone']].map(([label, key]) => (
                  <label key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{label}</span>
                    <input type="text" value={addUserForm[key]}
                      onChange={e => setAddUserForm(p => ({ ...p, [key]: e.target.value }))}
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none' }} />
                  </label>
                ))}
                <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>Plan</span>
                  <select value={addUserForm.plan} onChange={e => setAddUserForm(p => ({ ...p, plan: e.target.value }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.48rem .7rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', cursor: 'pointer' }}>
                    {Object.entries(PLAN_NAMES).map(([slug, name]) => (
                      <option key={slug} value={slug}>{name}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: '1.25rem' }}>
              <button onClick={handleAddUser} disabled={addUserSaving}
                style={{ padding: '.5rem 1.2rem', borderRadius: 8, border: 'none', background: '#ff6b2b', color: '#fff', fontWeight: 600, fontSize: '.85rem', cursor: addUserSaving ? 'default' : 'pointer', opacity: addUserSaving ? .6 : 1 }}>
                {addUserSaving ? 'Creating…' : 'Create User'}
              </button>
              {addUserMsg && <span style={{ color: addUserMsg === 'User created!' ? '#4ade80' : '#f87171', fontSize: '.84rem' }}>{addUserMsg}</span>}
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

function DetailModal({ sub, secret, onClose, onReviewed, onDeleted }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm('Delete this submission permanently? This also removes its uploaded files.')) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/admin/submissions`, {
        method: 'DELETE',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [sub.id] }),
      })
      if (!res.ok) { alert(`Delete failed: ${res.status}`); return }
      onDeleted(sub.id)
      onClose()
    } catch (e) { alert('Network error.') }
    finally { setLoading(false) }
  }

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
  // audio_N_key top-level entries are duplicates of songs[N].audio_key; Files section handles downloads
  const dataEntries = Object.entries(data).filter(([k]) => !SKIP.has(k) && !/^audio_\d+_key$/.test(k))

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={handleDelete} disabled={loading} title="Delete submission"
              style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 7, padding: '.4rem .7rem', color: loading ? '#555' : '#f87171', cursor: loading ? 'default' : 'pointer', fontSize: '.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              Delete
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>✕</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.25rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px' }}>
            {dataEntries.map(([k, v]) => {
              if (v === null || v === undefined || v === '') return null

              // Custom rich renderer for album tracks
              if (k === 'songs' && Array.isArray(v)) {
                return (
                  <div key="songs" style={{ gridColumn: '1 / -1' }}>
                    <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>
                      Songs ({v.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {v.map((track, i) => {
                        const mainList = (track.main_artists || []).filter((a) => a && (a.name || a.spotify || a.apple_music || a.instagram))
                        const featuredList = (track.featured_artists || []).filter((a) => a && (a.name || a.spotify || a.apple_music))
                        const rows = [
                          { label: 'Track', value: track.index ?? i + 1 },
                          { label: 'Title', value: track.title || track.songName },
                          { label: 'Genre', value: [track.genre, track.sub_genre || track.subGenre].filter(Boolean).join(' / ') },
                          { label: 'Language', value: track.language },
                          { label: 'Mood', value: track.mood ?? (Array.isArray(track.moods) ? track.moods.join(', ') : track.moods) },
                          { label: 'Lyricist', value: track.lyricist },
                          { label: 'Composer', value: track.composer },
                          { label: 'Producer', value: track.producer || track.musicProducer },
                          { label: 'Explicit', value: track.explicit },
                          { label: 'YT Content ID', value: track.yt_content_id ?? track.ytCid },
                          { label: 'YT Beat', value: track.yt_beat ?? track.ytBeat },
                          { label: 'YT Beat Link', value: track.yt_beat_link },
                          { label: 'ISRC', value: track.isrc || track.isrcNo },
                          { label: 'Orig. Release', value: track.original_release_date || track.originalReleaseDate },
                          { label: 'Go Live', value: track.go_live_date || track.goLiveDate },
                          { label: 'Callertune', value: track.callertune_timing || track.callertuneTiming },
                        ].filter((r) => r.value)
                        const artistCard = (a, keys) => (
                          <div style={{ background: '#111', borderRadius: 6, padding: '6px 10px', marginTop: 4, fontSize: '.78rem', color: '#d1d5db', wordBreak: 'break-word' }}>
                            {keys.filter((k) => a[k]).map((k) => `${fmtKey(k)}: ${a[k]}`).join(' · ')}
                          </div>
                        )
                        return (
                          <div key={i} style={{ background: '#1a1a1a', borderRadius: 8, padding: '10px 14px', border: '1px solid #2a2a2a' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                              {rows.map((r) => (
                                <span key={r.label} style={{ fontSize: '.78rem', color: '#d1d5db' }}>
                                  <span style={{ color: '#555', fontWeight: 600 }}>{r.label}: </span>
                                  {String(r.value)}
                                </span>
                              ))}
                            </div>
                            {mainList.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div style={{ color: '#555', fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Main Artists ({mainList.length})</div>
                                {mainList.map((a, ai) => (
                                  <div key={ai}>{artistCard(a, ['name', 'spotify', 'apple_music', 'instagram'])}</div>
                                ))}
                              </div>
                            )}
                            {featuredList.length > 0 && (
                              <div style={{ marginTop: 8 }}>
                                <div style={{ color: '#555', fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em' }}>Featured Artists ({featuredList.length})</div>
                                {featuredList.map((a, ai) => (
                                  <div key={ai}>{artistCard(a, ['name', 'spotify', 'apple_music'])}</div>
                                ))}
                              </div>
                            )}
                            {track.audio_key && (
                              <div style={{ marginTop: 6, fontSize: '.72rem', color: '#444' }}>{track.audio_key}</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              }

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
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [deleting, setDeleting] = useState(false)

  const fetchPage = useCallback(async (p) => {
    setLoading(true); setError('')
    try {
      const params = new URLSearchParams({ page: p, per_page: 10 })
      if (search.trim()) params.set('q', search.trim())
      if (planFilter !== 'all') params.set('plan', planFilter)
      const res = await fetch(`${BASE}/admin/submissions/${category}?${params}`, {
        headers: { 'X-Admin-Secret': secret },
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { let msg = `${res.status}`; try { const b = await res.json(); msg = b.detail || JSON.stringify(b) } catch {} throw new Error(msg) }
      const data = await res.json()
      setSubmissions(data.submissions)
      setTotal(data.total)
      setTotalPages(data.total_pages)
      setPage(data.page)
      setSelectedIds(new Set())
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }, [secret, category, onSessionExpired, search, planFilter])

  // Debounced (re)load: fires on mount and whenever search / planFilter / category change.
  useEffect(() => {
    const t = setTimeout(() => fetchPage(1), 300)
    return () => clearTimeout(t)
  }, [fetchPage])

  const handleReviewed = (id, newStatus) => {
    setSubmissions((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, status: newStatus, reviewed_at: new Date().toISOString() } : s)
      // Sort: pending first, reviewed last
      return [...updated.filter((s) => s.status === 'pending'), ...updated.filter((s) => s.status !== 'pending')]
    })
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const allOnPageSelected = submissions.length > 0 && submissions.every((s) => selectedIds.has(s.id))

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (submissions.every((s) => next.has(s.id))) submissions.forEach((s) => next.delete(s.id))
      else submissions.forEach((s) => next.add(s.id))
      return next
    })
  }

  const deleteIds = async (ids) => {
    if (ids.length === 0) return
    if (!window.confirm(`Delete ${ids.length} submission${ids.length > 1 ? 's' : ''} permanently? This also removes uploaded files.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`${BASE}/admin/submissions`, {
        method: 'DELETE',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) { alert(`Delete failed: ${res.status}`); return }
      await fetchPage(page)
    } catch (e) { alert('Network error.') }
    finally { setDeleting(false) }
  }

  const handleDeleted = (id) => {
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n })
    fetchPage(page)
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

      {/* Search + plan filter toolbar */}
      <div style={{ padding: '.9rem 1.75rem', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Search song / album title or email…" value={search} onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.55rem .8rem .55rem 2rem', color: '#f0f0f0', fontSize: '.84rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {SUBMISSION_PLAN_FILTERS.map((fo) => (
            <button key={fo.key} onClick={() => setPlanFilter(fo.key)}
              style={{ padding: '.38rem .7rem', borderRadius: 6, border: `1px solid ${planFilter === fo.key ? '#ff6b2b' : '#2a2a2a'}`, background: planFilter === fo.key ? 'rgba(255,107,43,.12)' : '#1a1a1a', color: planFilter === fo.key ? '#ff6b2b' : '#9ca3af', fontSize: '.75rem', fontWeight: planFilter === fo.key ? 600 : 400, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .1s' }}>
              {fo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk actions bar */}
      {submissions.length > 0 && (
        <div style={{ padding: '.6rem 1.75rem', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#9ca3af', fontSize: '.8rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={allOnPageSelected} onChange={toggleSelectAll} style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#ff6b2b' }} />
            Select all on page
          </label>
          {selectedIds.size > 0 && (
            <>
              <span style={{ color: '#ff6b2b', fontSize: '.8rem', fontWeight: 600 }}>{selectedIds.size} selected</span>
              <button onClick={() => deleteIds([...selectedIds])} disabled={deleting}
                style={{ marginLeft: 'auto', padding: '.4rem .8rem', borderRadius: 7, border: '1px solid #7f1d1d', background: deleting ? '#1a1a1a' : '#2d0a0a', color: deleting ? '#555' : '#f87171', fontSize: '.8rem', fontWeight: 600, cursor: deleting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                {deleting ? 'Deleting…' : `Delete ${selectedIds.size}`}
              </button>
            </>
          )}
        </div>
      )}

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
                    {/* Select checkbox */}
                    <input type="checkbox" checked={selectedIds.has(sub.id)} onClick={(e) => e.stopPropagation()} onChange={() => toggleSelect(sub.id)}
                      style={{ width: 16, height: 16, flexShrink: 0, cursor: 'pointer', accentColor: '#ff6b2b' }} />
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
        <DetailModal sub={selected} secret={secret} onClose={() => setSelected(null)} onReviewed={handleReviewed} onDeleted={handleDeleted} />
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
        {homeData.yt_testimonials.map((t, i) => {
          const vid = extractYtId(t.video_id)
          return (
            <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
              {vid && (
                <img
                  src={`https://img.youtube.com/vi/${vid}/mqdefault.jpg`}
                  alt=""
                  style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              )}
              <input placeholder="YouTube URL or Video ID" value={t.video_id} onChange={(e) => updateYT(i, 'video_id', e.target.value)} style={{ ...inp, flex: 2 }} />
              <input placeholder="Title" value={t.title} onChange={(e) => updateYT(i, 'title', e.target.value)} style={{ ...inp, flex: 2 }} />
              <input placeholder="Channel" value={t.channel} onChange={(e) => updateYT(i, 'channel', e.target.value)} style={{ ...inp, flex: 1 }} />
              <button onClick={() => removeYT(i)} style={delBtn}>&#x2715;</button>
            </div>
          )
        })}
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

// ── Announcements view ──────────────────────────────────────────────────────
function AnnouncementsView({ secret, onSessionExpired }) {
  const [announceTitle, setAnnounceTitle] = useState('')
  const [announceBody, setAnnounceBody] = useState('')
  const [announceStatus, setAnnounceStatus] = useState(null)
  const [announcements, setAnnouncements] = useState([])

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/notifications/announcements`, { credentials: 'include', headers: { 'X-Admin-Secret': secret } })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) return
      setAnnouncements(await res.json())
    } catch {}
  }, [secret, onSessionExpired])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  const handleSendAnnouncement = async () => {
    if (!announceTitle.trim()) return
    setAnnounceStatus('sending')
    try {
      const res = await fetch(`${BASE}/admin/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Secret': secret },
        body: JSON.stringify({ title: announceTitle.trim(), body: announceBody.trim() }),
      })
      if (res.status === 403) { onSessionExpired(); return }
      if (!res.ok) throw new Error()
      setAnnounceTitle('')
      setAnnounceBody('')
      setAnnounceStatus('ok')
      fetchAnnouncements()
      setTimeout(() => setAnnounceStatus(null), 3000)
    } catch {
      setAnnounceStatus('error')
    }
  }

  const inp = {
    background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7,
    padding: '.5rem .75rem', color: '#f0f0f0', fontSize: '.85rem',
    outline: 'none', width: '100%', boxSizing: 'border-box',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '1.5rem 1.75rem 1rem', borderBottom: '1px solid #1a1a1a' }}>
        <h2 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Announcements</h2>
        <p style={{ color: '#555', margin: '.2rem 0 0', fontSize: '.82rem' }}>Broadcast a message to all users</p>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem 1.75rem' }}>
        {/* Compose */}
        <div style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 11, padding: '1.25rem', marginBottom: '1.75rem', maxWidth: 640 }}>
          <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem' }}>Send Announcement</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Title"
              value={announceTitle}
              onChange={(e) => setAnnounceTitle(e.target.value)}
              style={inp}
            />
            <textarea
              placeholder="Message (optional)"
              value={announceBody}
              onChange={(e) => setAnnounceBody(e.target.value)}
              rows={3}
              style={{ ...inp, resize: 'vertical' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                onClick={handleSendAnnouncement}
                disabled={announceStatus === 'sending' || !announceTitle.trim()}
                style={{ padding: '.6rem 1.4rem', borderRadius: 8, border: 'none', background: announceStatus === 'sending' || !announceTitle.trim() ? '#1a1a1a' : 'linear-gradient(135deg,#ff6b2b,#ff4500)', color: announceStatus === 'sending' || !announceTitle.trim() ? '#444' : '#fff', fontWeight: 600, fontSize: '.88rem', cursor: announceStatus === 'sending' || !announceTitle.trim() ? 'default' : 'pointer' }}
              >
                {announceStatus === 'sending' ? 'Sending…' : 'Send to All Users'}
              </button>
              {announceStatus === 'ok' && <span style={{ color: '#4ade80', fontSize: '.84rem' }}>Announcement sent!</span>}
              {announceStatus === 'error' && <span style={{ color: '#f87171', fontSize: '.84rem' }}>Failed to send.</span>}
            </div>
          </div>
        </div>

        {/* Recent */}
        <div style={{ color: '#555', fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '1rem' }}>Recent Announcements</div>
        {announcements.length === 0
          ? <div style={{ textAlign: 'center', color: '#555', paddingTop: '2rem', fontSize: '.88rem' }}>No announcements yet.</div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 640 }}>
              {announcements.map((a) => (
                <div key={a.id} style={{ background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <strong style={{ color: '#f0f0f0', fontSize: '.9rem', fontWeight: 600 }}>{a.title}</strong>
                    <span style={{ color: '#555', fontSize: '.75rem', flexShrink: 0 }}>{new Date(a.created_at).toLocaleString()}</span>
                  </div>
                  {a.body && <p style={{ color: '#9ca3af', fontSize: '.84rem', margin: '.5rem 0 0', lineHeight: 1.5 }}>{a.body}</p>}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  )
}

// ── Root ────────────────────────────────────────────────────────────────────
// ── Earnings view ────────────────────────────────────────────────────────────
const _MO = { January:1,February:2,March:3,April:4,May:5,June:6,July:7,August:8,September:9,October:10,November:11,December:12 }
const MONTHS_LIST = ['January','February','March','April','May','June','July','August','September','October','November','December']
const PLATFORMS_LIST = ['Spotify','Apple Music','YouTube','YouTube Music','Facebook','Amazon','JioSaavn','Gaana','TikTok','Other']

function EarningsView({ secret, onSessionExpired }) {
  const fmtRs = (n) => `₹${(Number(n)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}`
  const H = { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' }

  const [searchInput, setSearchInput] = useState('')
  const [candidates, setCandidates] = useState([])
  const [artistData, setArtistData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyRowId, setBusyRowId] = useState(null)
  const [editCell, setEditCell] = useState(null)  // { rowId, field, draft }
  const [expanded, setExpanded] = useState({})    // { songTitle: bool }
  const [modal, setModal] = useState(null)
  const [subs, setSubs] = useState([])
  const [modalError, setModalError] = useState('')
  const [modalBusy, setModalBusy] = useState(false)

  const doSearch = async (e) => {
    e.preventDefault()
    const q = searchInput.trim()
    if (!q) return
    setLoading(true); setError(''); setCandidates([]); setArtistData(null)
    try {
      const param = q.includes('@') ? `email=${encodeURIComponent(q)}` : `q=${encodeURIComponent(q)}`
      const r = await fetch(`${BASE}/admin/artist-earnings?${param}`, { headers: H })
      if (r.status === 403) { onSessionExpired(); return }
      const d = await r.json()
      if (!r.ok) { setError(d.detail || 'Error'); return }
      if (d.candidates) {
        setCandidates(d.candidates)
      } else {
        setArtistData(d)
        const exp = {}
        ;(d.rows || []).forEach(row => { exp[row.song_title] = true })
        setExpanded(exp)
      }
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const pickCandidate = async (email) => {
    setCandidates([]); setSearchInput(email); setLoading(true); setError('')
    try {
      const r = await fetch(`${BASE}/admin/artist-earnings?email=${encodeURIComponent(email)}`, { headers: H })
      if (r.status === 403) { onSessionExpired(); return }
      const d = await r.json()
      if (!r.ok) { setError(d.detail || 'Error'); return }
      setArtistData(d)
      const exp = {}
      ;(d.rows || []).forEach(row => { exp[row.song_title] = true })
      setExpanded(exp)
    } catch { setError('Network error') }
    finally { setLoading(false) }
  }

  const commitEdit = async (rowId, field, value) => {
    setBusyRowId(rowId)
    try {
      const body = field === 'streams' ? { streams: Number(value) } : { revenue: String(value) }
      const r = await fetch(`${BASE}/admin/song-stats/${rowId}`, { method: 'PATCH', headers: H, body: JSON.stringify(body) })
      if (r.status === 403) { onSessionExpired(); return }
      const d = await r.json()
      if (!r.ok) { setError(d.detail || 'Update failed'); return }
      setArtistData(prev => ({
        artist: { ...prev.artist, ...d.balance },
        rows: prev.rows.map(row => row.id === rowId ? { ...row, ...d.row } : row),
      }))
    } catch { setError('Update failed') }
    finally { setBusyRowId(null); setEditCell(null) }
  }

  const deleteRow = async (rowId) => {
    if (!window.confirm("Delete this stat row? The artist's balance will be recalculated.")) return
    setBusyRowId(rowId)
    try {
      const r = await fetch(`${BASE}/admin/song-stats/${rowId}`, { method: 'DELETE', headers: H })
      if (r.status === 403) { onSessionExpired(); return }
      const d = await r.json()
      if (!r.ok) { setError(d.detail || 'Delete failed'); return }
      setArtistData(prev => ({
        artist: { ...prev.artist, ...d.balance },
        rows: prev.rows.filter(row => row.id !== rowId),
      }))
    } catch { setError('Delete failed') }
    finally { setBusyRowId(null) }
  }

  const openModal = async (prefill = {}) => {
    const email = artistData?.artist?.email || ''
    setModalError('')
    setModal({
      user_email: email,
      song_title: '',
      artist_name: artistData?.artist?.artist_name || '',
      period_month: '',
      period_year: String(new Date().getFullYear()),
      submission_id: '',
      entries: [{ platform: 'Spotify', streams: '', revenue: '' }],
      ...prefill,
    })
    if (email) {
      try {
        const r = await fetch(`${BASE}/admin/song-stats/submissions/${encodeURIComponent(email)}`, { headers: H })
        if (r.ok) { const d = await r.json(); setSubs(d.submissions || []) }
      } catch { /* ignore */ }
    }
  }

  const submitModal = async () => {
    if (!modal.song_title.trim()) { setModalError('Song title is required'); return }
    if (!modal.period_month) { setModalError('Month is required'); return }
    const year = Number(modal.period_year)
    if (!year || year < 1990 || year > new Date().getFullYear() + 1) { setModalError('Enter a valid year'); return }
    if (!modal.entries.length) { setModalError('Add at least one platform entry'); return }
    setModalBusy(true); setModalError('')
    try {
      const r = await fetch(`${BASE}/admin/song-stats`, {
        method: 'POST', headers: H,
        body: JSON.stringify({
          user_email: modal.user_email,
          song_title: modal.song_title.trim(),
          artist_name: modal.artist_name.trim() || modal.song_title.trim(),
          period_month: modal.period_month,
          period_year: year,
          submission_id: modal.submission_id || null,
          entries: modal.entries.map(e => ({
            platform: e.platform,
            streams: Number(e.streams) || 0,
            revenue: String(Number(e.revenue) || 0),
          })),
        }),
      })
      if (r.status === 403) { onSessionExpired(); return }
      const d = await r.json()
      if (!r.ok) { setModalError(d.detail || 'Failed'); return }
      setArtistData(prev => ({
        artist: { ...prev.artist, ...d.balance },
        rows: [
          ...(prev?.rows || []).filter(row => !d.rows.find(nr => nr.id === row.id)),
          ...d.rows,
        ],
      }))
      setExpanded(prev => ({ ...prev, [modal.song_title.trim()]: true }))
      setModal(null)
    } catch { setModalError('Network error') }
    finally { setModalBusy(false) }
  }

  // Compute grouped view from flat rows on each render (fast enough for admin)
  const grouped = (() => {
    if (!artistData?.rows?.length) return []
    const songs = {}
    for (const row of artistData.rows) {
      if (!songs[row.song_title]) songs[row.song_title] = { totalStreams: 0, totalRevenue: 0, months: {} }
      const s = songs[row.song_title]
      s.totalStreams += row.streams || 0
      s.totalRevenue += row.revenue || 0
      const mk = `${row.period_year}-${String(_MO[row.period_month] || 0).padStart(2, '0')}`
      if (!s.months[mk]) s.months[mk] = { month: row.period_month, year: row.period_year, streams: 0, revenue: 0, rows: [] }
      s.months[mk].streams += row.streams || 0
      s.months[mk].revenue += row.revenue || 0
      s.months[mk].rows.push(row)
    }
    return Object.entries(songs)
      .sort(([, a], [, b]) => b.totalStreams - a.totalStreams)
      .map(([title, data]) => ({
        title,
        totalStreams: data.totalStreams,
        totalRevenue: data.totalRevenue,
        months: Object.values(data.months).sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year
          return (_MO[b.month] || 0) - (_MO[a.month] || 0)
        }),
      }))
  })()

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #1a1a1a', flexShrink: 0 }}>
        <h2 style={{ color: '#f0f0f0', margin: '0 0 .25rem', fontSize: '1.2rem', fontWeight: 700 }}>Earnings Editor</h2>
        <p style={{ color: '#555', fontSize: '.85rem', margin: 0 }}>Browse, edit, and add stream stats for any artist</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>
        {/* Search */}
        <form onSubmit={doSearch} style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search by email or artist name…"
            style={{ flex: 1, background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: '.65rem 1rem', color: '#f0f0f0', fontSize: '.9rem', outline: 'none' }}
          />
          <button type="submit" disabled={loading}
            style={{ padding: '.65rem 1.25rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#ff6b2b,#ff4500)', color: '#fff', fontWeight: 600, fontSize: '.9rem', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? '…' : 'Search'}
          </button>
        </form>

        {/* Name search candidates */}
        {candidates.length > 0 && (
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 10, marginBottom: '1.25rem', overflow: 'hidden' }}>
            <div style={{ padding: '.65rem 1rem', borderBottom: '1px solid #1a1a1a', color: '#9ca3af', fontSize: '.8rem' }}>{candidates.length} match(es) — select an artist</div>
            {candidates.map(c => (
              <button key={c.email} onClick={() => pickCandidate(c.email)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '.7rem 1rem', background: 'transparent', border: 'none', borderBottom: '1px solid #1a1a1a', cursor: 'pointer', textAlign: 'left' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,43,.06)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarColor(c.email), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.8rem', fontWeight: 700, flexShrink: 0 }}>{initials(c.email)}</div>
                <div>
                  <div style={{ color: '#f0f0f0', fontSize: '.88rem', fontWeight: 600 }}>{c.artist_name || '—'}</div>
                  <div style={{ color: '#6b7280', fontSize: '.77rem' }}>{c.email}</div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '.85rem' }}>{error}</div>}

        {/* Artist panel */}
        {artistData && (
          <>
            {/* Balance cards */}
            <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Total Earned',   val: fmtRs(artistData.artist?.total_earned),       color: '#4ade80' },
                { label: 'Withdrawn',      val: fmtRs(artistData.artist?.total_withdrawn),     color: '#f87171' },
                { label: 'Available',      val: fmtRs(artistData.artist?.available_balance),   color: '#ff8a4c' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ flex: 1, minWidth: 150, background: '#111', border: '1px solid #1a1a1a', borderRadius: 10, padding: '.9rem 1.1rem' }}>
                  <div style={{ color: '#4b5563', fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
                  <div style={{ color, fontSize: '1.2rem', fontWeight: 700, fontFamily: 'monospace' }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Warning */}
            <div style={{ background: 'rgba(234,179,8,.07)', border: '1px solid rgba(234,179,8,.22)', borderRadius: 8, padding: '.6rem 1rem', marginBottom: '1rem', color: '#fbbf24', fontSize: '.8rem' }}>
              ⚠ Rows for months covered by the next royalty ingestion will be overwritten when that script runs.
            </div>

            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.875rem' }}>
              <div style={{ color: '#6b7280', fontSize: '.83rem' }}>
                {artistData.rows.length === 0
                  ? 'No stats yet — add the first entry below.'
                  : `${artistData.rows.length} row(s) across ${grouped.length} song(s)`}
              </div>
              <button onClick={() => openModal()}
                style={{ padding: '.45rem .95rem', borderRadius: 8, border: '1px solid rgba(255,107,43,.4)', background: 'rgba(255,107,43,.1)', color: '#ff8a4c', fontSize: '.83rem', fontWeight: 600, cursor: 'pointer' }}>
                + Add Entry
              </button>
            </div>

            {/* Grouped tree */}
            {grouped.map(song => (
              <div key={song.title} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: 10, marginBottom: 8, overflow: 'hidden' }}>
                {/* Song row */}
                <button onClick={() => setExpanded(prev => ({ ...prev, [song.title]: !prev[song.title] }))}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '.85rem 1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                  <span style={{ color: '#ff6b2b', fontSize: '.72rem', display: 'inline-block', transform: expanded[song.title] ? 'rotate(90deg)' : 'none', transition: 'transform .12s' }}>▶</span>
                  <div style={{ flex: 1, minWidth: 0, color: '#f0f0f0', fontWeight: 600, fontSize: '.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                  <div style={{ display: 'flex', gap: 18, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#4b5563', fontSize: '.67rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Streams</div>
                      <div style={{ color: '#d1d5db', fontSize: '.85rem', fontWeight: 600 }}>{song.totalStreams.toLocaleString('en-IN')}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#4b5563', fontSize: '.67rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>Revenue</div>
                      <div style={{ color: '#4ade80', fontSize: '.85rem', fontWeight: 600 }}>{fmtRs(song.totalRevenue)}</div>
                    </div>
                  </div>
                </button>

                {/* Months */}
                {expanded[song.title] && (
                  <div style={{ borderTop: '1px solid #1a1a1a' }}>
                    {song.months.map(mon => (
                      <div key={`${mon.year}-${mon.month}`} style={{ borderBottom: '1px solid #161616' }}>
                        {/* Month header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '.5rem 1.5rem', background: 'rgba(255,255,255,.02)' }}>
                          <div style={{ flex: 1, color: '#9ca3af', fontSize: '.8rem', fontWeight: 600 }}>{mon.month} {mon.year}</div>
                          <div style={{ color: '#4b5563', fontSize: '.75rem' }}>{mon.streams.toLocaleString('en-IN')} streams · {fmtRs(mon.revenue)}</div>
                          <button
                            onClick={() => openModal({ song_title: song.title, period_month: mon.month, period_year: String(mon.year), artist_name: mon.rows[0]?.artist_name || '' })}
                            style={{ padding: '.22rem .55rem', borderRadius: 5, border: '1px solid #2a2a2a', background: 'transparent', color: '#6b7280', fontSize: '.72rem', cursor: 'pointer' }}>
                            + platform
                          </button>
                        </div>

                        {/* Platform table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              {['Platform', 'Streams', 'Revenue', ''].map((h, hi) => (
                                <th key={hi} style={{ padding: '.38rem 1.5rem', textAlign: hi > 0 ? 'right' : 'left', color: '#374151', fontSize: '.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.05em', borderBottom: '1px solid #161616' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {[...mon.rows].sort((a, b) => (b.streams || 0) - (a.streams || 0)).map(row => {
                              const busy = busyRowId === row.id
                              const editingStreams = editCell?.rowId === row.id && editCell?.field === 'streams'
                              const editingRevenue = editCell?.rowId === row.id && editCell?.field === 'revenue'
                              return (
                                <tr key={row.id} style={{ borderBottom: '1px solid #0d0d0d', opacity: busy ? 0.45 : 1 }}>
                                  <td style={{ padding: '.5rem 1.5rem', color: '#d1d5db', fontSize: '.83rem' }}>{row.platform}</td>

                                  {/* Streams */}
                                  <td style={{ padding: '.5rem 1.5rem', textAlign: 'right' }}>
                                    {editingStreams ? (
                                      <input autoFocus type="number" min="0" value={editCell.draft}
                                        onChange={e => setEditCell(c => ({ ...c, draft: e.target.value }))}
                                        onBlur={() => commitEdit(row.id, 'streams', editCell.draft)}
                                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(row.id, 'streams', editCell.draft); if (e.key === 'Escape') setEditCell(null) }}
                                        style={{ width: 90, background: '#1a1a1a', border: '1px solid #ff6b2b', borderRadius: 5, padding: '.28rem .5rem', color: '#f0f0f0', fontSize: '.83rem', outline: 'none', textAlign: 'right' }} />
                                    ) : (
                                      <span title="Click to edit" style={{ color: '#d1d5db', fontSize: '.83rem', fontFamily: 'monospace', cursor: 'pointer' }}
                                        onClick={() => !busy && setEditCell({ rowId: row.id, field: 'streams', draft: String(row.streams || 0) })}>
                                        {(row.streams || 0).toLocaleString('en-IN')}
                                      </span>
                                    )}
                                  </td>

                                  {/* Revenue */}
                                  <td style={{ padding: '.5rem 1.5rem', textAlign: 'right' }}>
                                    {editingRevenue ? (
                                      <input autoFocus type="number" min="0" step="0.01" value={editCell.draft}
                                        onChange={e => setEditCell(c => ({ ...c, draft: e.target.value }))}
                                        onBlur={() => commitEdit(row.id, 'revenue', editCell.draft)}
                                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(row.id, 'revenue', editCell.draft); if (e.key === 'Escape') setEditCell(null) }}
                                        style={{ width: 100, background: '#1a1a1a', border: '1px solid #ff6b2b', borderRadius: 5, padding: '.28rem .5rem', color: '#f0f0f0', fontSize: '.83rem', outline: 'none', textAlign: 'right' }} />
                                    ) : (
                                      <span title="Click to edit" style={{ color: '#4ade80', fontSize: '.83rem', fontFamily: 'monospace', cursor: 'pointer' }}
                                        onClick={() => !busy && setEditCell({ rowId: row.id, field: 'revenue', draft: String(row.revenue || 0) })}>
                                        {fmtRs(row.revenue)}
                                      </span>
                                    )}
                                  </td>

                                  {/* Delete */}
                                  <td style={{ padding: '.5rem 1.5rem', textAlign: 'right' }}>
                                    <button disabled={busy} onClick={() => deleteRow(row.id)}
                                      style={{ padding: '.28rem .55rem', borderRadius: 5, border: '1px solid #3a1a1a', background: 'transparent', color: '#f87171', fontSize: '.76rem', cursor: busy ? 'wait' : 'pointer' }}>
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    ))}

                    {/* Add month */}
                    <div style={{ padding: '.55rem 1.5rem' }}>
                      <button onClick={() => openModal({ song_title: song.title, artist_name: song.months[0]?.rows[0]?.artist_name || '' })}
                        style={{ padding: '.3rem .7rem', borderRadius: 6, border: '1px solid #2a2a2a', background: 'transparent', color: '#6b7280', fontSize: '.78rem', cursor: 'pointer' }}>
                        + Add month for this song
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.82)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#111', border: '1px solid #222', borderRadius: 14, width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ color: '#f0f0f0', margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Add Stats Entry</h3>
              <button onClick={() => setModal(null)} style={{ background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.3rem', lineHeight: 1 }}>×</button>
            </div>

            {modalError && <div style={{ background: '#2d0a0a', border: '1px solid #7f1d1d', borderRadius: 8, padding: '.6rem .9rem', marginBottom: '.875rem', color: '#f87171', fontSize: '.82rem' }}>{modalError}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Song Title *</label>
                <input value={modal.song_title} onChange={e => setModal(m => ({ ...m, song_title: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Artist Name</label>
                <input value={modal.artist_name} onChange={e => setModal(m => ({ ...m, artist_name: e.target.value }))} style={inp} />
              </div>
              <div>
                <label style={lbl}>Submission (optional)</label>
                <select value={modal.submission_id} onChange={e => setModal(m => ({ ...m, submission_id: e.target.value }))} style={inp}>
                  <option value="">— none —</option>
                  {subs.map(s => <option key={s.id} value={s.id}>{s.title || s.type} ({s.status})</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Month *</label>
                <select value={modal.period_month} onChange={e => setModal(m => ({ ...m, period_month: e.target.value }))} style={inp}>
                  <option value="">Select month</option>
                  {MONTHS_LIST.map(mo => <option key={mo} value={mo}>{mo}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Year *</label>
                <input type="number" value={modal.period_year} onChange={e => setModal(m => ({ ...m, period_year: e.target.value }))} style={inp} />
              </div>
            </div>

            {/* Platform entries */}
            <div style={{ marginBottom: '1.1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6, marginBottom: 5 }}>
                {['Platform', 'Streams', 'Revenue ₹', ''].map((h, i) => (
                  <div key={i} style={{ color: '#374151', fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</div>
                ))}
              </div>
              {modal.entries.map((entry, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6, marginBottom: 6 }}>
                  <select value={entry.platform}
                    onChange={e => setModal(m => ({ ...m, entries: m.entries.map((en, idx) => idx === i ? { ...en, platform: e.target.value } : en) }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '.52rem .7rem', color: '#f0f0f0', fontSize: '.85rem', outline: 'none' }}>
                    {PLATFORMS_LIST.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <input type="number" min="0" placeholder="0" value={entry.streams}
                    onChange={e => setModal(m => ({ ...m, entries: m.entries.map((en, idx) => idx === i ? { ...en, streams: e.target.value } : en) }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '.52rem .7rem', color: '#f0f0f0', fontSize: '.85rem', outline: 'none' }} />
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={entry.revenue}
                    onChange={e => setModal(m => ({ ...m, entries: m.entries.map((en, idx) => idx === i ? { ...en, revenue: e.target.value } : en) }))}
                    style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6, padding: '.52rem .7rem', color: '#f0f0f0', fontSize: '.85rem', outline: 'none' }} />
                  <button onClick={() => setModal(m => ({ ...m, entries: m.entries.filter((_, idx) => idx !== i) }))}
                    disabled={modal.entries.length === 1}
                    style={{ padding: '.52rem .65rem', borderRadius: 6, border: '1px solid #2a2a2a', background: 'transparent', color: '#6b7280', cursor: modal.entries.length === 1 ? 'default' : 'pointer', opacity: modal.entries.length === 1 ? 0.3 : 1 }}>×</button>
                </div>
              ))}
              <button onClick={() => setModal(m => ({ ...m, entries: [...m.entries, { platform: 'Spotify', streams: '', revenue: '' }] }))}
                style={{ padding: '.38rem .75rem', borderRadius: 6, border: '1px solid #2a2a2a', background: 'transparent', color: '#6b7280', fontSize: '.78rem', cursor: 'pointer', marginTop: 2 }}>
                + Add platform row
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{ padding: '.58rem 1.1rem', borderRadius: 8, border: '1px solid #2a2a2a', background: 'transparent', color: '#9ca3af', fontSize: '.88rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={submitModal} disabled={modalBusy}
                style={{ padding: '.58rem 1.3rem', borderRadius: 8, border: 'none', background: modalBusy ? '#2a2a2a' : 'linear-gradient(135deg,#ff6b2b,#ff4500)', color: modalBusy ? '#555' : '#fff', fontWeight: 600, fontSize: '.88rem', cursor: modalBusy ? 'wait' : 'pointer' }}>
                {modalBusy ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Shared modal input styles (defined outside to avoid re-creation on render)
const lbl = { display: 'block', color: '#6b7280', fontSize: '.72rem', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '.05em' }
const inp = { width: '100%', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 7, padding: '.58rem .85rem', color: '#f0f0f0', fontSize: '.88rem', outline: 'none', boxSizing: 'border-box' }

const SUBMISSION_VIEWS = [
  { id: 'new-songs',       title: 'New Songs' },
  { id: 'transfer-songs',  title: 'Transfer Songs' },
  { id: 'new-albums',      title: 'New Albums' },
  { id: 'transfer-albums', title: 'Transfer Albums' },
  { id: 'profile-mismatch',title: 'Profile Mismatch' },
  { id: 'claim-removal',   title: 'Claim Removal' },
  { id: 'insta-link',      title: 'Insta Link' },
]

// ── Withdrawal requests view ─────────────────────────────────────────────────
function WithdrawalRequestsView({ secret, onSessionExpired }) {
  const [requests, setRequests] = useState([])
  const [totalPending, setTotalPending] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const fmtRs = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const load = useCallback(() => {
    setLoading(true); setError('')
    fetch(`${BASE}/admin/withdrawals`, { headers: { 'X-Admin-Secret': secret } })
      .then((res) => {
        if (res.status === 403) { onSessionExpired(); return null }
        if (!res.ok) throw new Error('Failed to load withdrawals')
        return res.json()
      })
      .then((data) => {
        if (!data) return
        setRequests(data.requests || [])
        setTotalPending(data.total_pending || 0)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [secret, onSessionExpired])

  useEffect(() => { load() }, [load])

  const markPaid = async (id) => {
    setBusyId(id)
    try {
      const res = await fetch(`${BASE}/admin/withdrawals/${id}`, {
        method: 'PATCH',
        headers: { 'X-Admin-Secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      })
      if (res.status === 403) return onSessionExpired()
      if (!res.ok) throw new Error('Update failed')
      const data = await res.json()
      setRequests((rs) => rs.map((r) => (r.id === id ? data.request : r)))
      setTotalPending((p) => Math.max(0, p - Number(requests.find((r) => r.id === id)?.amount || 0)))
    } catch (e) { alert(e.message) } finally { setBusyId(null) }
  }

  const del = async (id) => {
    if (!window.confirm('Delete this withdrawal request? If it is not paid, the amount is credited back to the artist.')) return
    setBusyId(id)
    try {
      const res = await fetch(`${BASE}/admin/withdrawals/${id}`, {
        method: 'DELETE', headers: { 'X-Admin-Secret': secret },
      })
      if (res.status === 403) return onSessionExpired()
      if (!res.ok) throw new Error('Delete failed')
      setRequests((rs) => rs.filter((r) => r.id !== id))
    } catch (e) { alert(e.message) } finally { setBusyId(null) }
  }

  return (
    <div style={{ padding: '1.75rem 2rem', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ color: '#f0f0f0', fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>Withdrawal Requests</h1>
        <button onClick={load} style={{ padding: '.5rem 1rem', borderRadius: 8, border: '1px solid #2a2a2a', background: '#141414', color: '#9ca3af', fontSize: '.82rem', cursor: 'pointer' }}>Refresh</button>
      </div>
      <div style={{ color: '#6b7280', fontSize: '.85rem', marginBottom: 20 }}>
        {requests.length} request(s) · <span style={{ color: '#EAB308' }}>{fmtRs(totalPending)} pending payout</span>
      </div>

      {loading && <div style={{ color: '#6b7280' }}>Loading…</div>}
      {error && <div style={{ color: '#f87171' }}>{error}</div>}
      {!loading && !error && requests.length === 0 && <div style={{ color: '#6b7280' }}>No withdrawal requests yet.</div>}

      <div style={{ display: 'grid', gap: 14 }}>
        {requests.map((r) => {
          const paid = r.status === 'paid'
          const s = r.snapshot || {}
          const pd = r.payout_details || {}
          return (
            <div key={r.id} style={{ background: paid ? '#0c0c0c' : '#111', border: `1px solid ${paid ? '#1a1a1a' : '#242424'}`, borderRadius: 12, padding: '1.1rem 1.25rem', opacity: paid ? 0.55 : 1, transition: 'opacity .2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 700, color: paid ? '#22C55E' : '#ff8a4c' }}>{fmtRs(r.amount)}</span>
                    <span style={{ padding: '2px 9px', borderRadius: 100, fontSize: '.66rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', background: paid ? 'rgba(34,197,94,.12)' : 'rgba(234,179,8,.12)', color: paid ? '#22C55E' : '#EAB308', border: `1px solid ${paid ? 'rgba(34,197,94,.3)' : 'rgba(234,179,8,.3)'}` }}>{paid ? 'Paid' : 'Pending'}</span>
                  </div>
                  <div style={{ color: '#e5e7eb', fontSize: '.9rem', fontWeight: 600 }}>{s.full_name || s.artist_name || r.user_email}</div>
                  <div style={{ color: '#6b7280', fontSize: '.78rem', marginTop: 2 }}>{r.user_email}</div>
                  <div style={{ color: '#6b7280', fontSize: '.75rem', marginTop: 6 }}>
                    Requested {r.requested_at ? new Date(r.requested_at).toLocaleString('en-IN') : '—'}
                    {paid && r.processed_at ? ` · Paid ${new Date(r.processed_at).toLocaleString('en-IN')}` : ''}
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: 240, fontSize: '.8rem', color: '#9ca3af', lineHeight: 1.7 }}>
                  <div style={{ color: '#e5e7eb', fontWeight: 600, marginBottom: 4 }}>Artist details</div>
                  <div>Plan: <span style={{ color: '#e5e7eb' }}>{s.plan_name || s.plan || '—'}</span></div>
                  {s.artist_name && <div>Artist name: <span style={{ color: '#e5e7eb' }}>{s.artist_name}</span></div>}
                  <div>Phone: <span style={{ color: '#e5e7eb' }}>{s.phone || '—'}</span></div>
                  <div>Address: <span style={{ color: '#e5e7eb' }}>{[s.city, s.state].filter(Boolean).join(', ') || '—'}</span></div>
                  <div>Age: <span style={{ color: '#e5e7eb' }}>{s.age ?? '—'}</span></div>
                  <div style={{ color: '#e5e7eb', fontWeight: 600, margin: '8px 0 4px' }}>Payout ({r.method === 'bank' ? 'Bank' : 'UPI'})</div>
                  {r.method === 'upi'
                    ? <div>UPI: <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{pd.upi_id || '—'}</span></div>
                    : <>
                        <div>A/C holder: <span style={{ color: '#e5e7eb' }}>{pd.account_holder || '—'}</span></div>
                        <div>Bank: <span style={{ color: '#e5e7eb' }}>{pd.bank_name || '—'}</span></div>
                        <div>A/C no: <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{pd.account_number || '—'}</span></div>
                        <div>IFSC: <span style={{ color: '#e5e7eb', fontFamily: 'monospace' }}>{pd.ifsc || '—'}</span></div>
                      </>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 120 }}>
                  {!paid && (
                    <button disabled={busyId === r.id} onClick={() => markPaid(r.id)}
                      style={{ padding: '.5rem .9rem', borderRadius: 8, border: '1px solid rgba(34,197,94,.35)', background: 'rgba(34,197,94,.12)', color: '#22C55E', fontSize: '.82rem', fontWeight: 600, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
                      Mark Paid
                    </button>
                  )}
                  <button disabled={busyId === r.id} onClick={() => del(r.id)}
                    style={{ padding: '.5rem .9rem', borderRadius: 8, border: '1px solid #3a1a1a', background: 'transparent', color: '#f87171', fontSize: '.82rem', fontWeight: 600, cursor: busyId === r.id ? 'wait' : 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

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
        {activeNav === 'withdrawals' && <WithdrawalRequestsView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'earnings' && <EarningsView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'master-home' && <MasterHomeView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'announcements' && <AnnouncementsView secret={secret} onSessionExpired={handleLock} />}
        {subView && (
          <SubmissionsView key={subView.id} secret={secret} category={subView.id} title={subView.title} onSessionExpired={handleLock} />
        )}
      </div>
    </div>
    </>
  )
}
