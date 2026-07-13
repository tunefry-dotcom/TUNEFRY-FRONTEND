import { useState, useEffect, useCallback } from 'react'

const BASE = 'https://backend1-xzx5.onrender.com'
const STORAGE_KEY = 'tunefry_admin_secret'

// ── Helpers ────────────────────────────────────────────────────────────────
const PLAN_COLORS = {
  free:          { bg: '#1a1a1a', text: '#9ca3af', border: '#374151' },
  starter:       { bg: '#052e16', text: '#4ade80', border: '#166534' },
  single_artist: { bg: '#1e1b4b', text: '#818cf8', border: '#3730a3' },
  double_artist: { bg: '#1c1002', text: '#fbbf24', border: '#92400e' },
  label:         { bg: '#2d0a0a', text: '#f87171', border: '#7f1d1d' },
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
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 1.2fr 1fr 1fr', padding: '.65rem 1.1rem', borderBottom: '1px solid #1a1a1a', color: '#555', fontSize: '.74rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                <span>User</span><span>Artist Name</span><span>Phone</span><span>Plan</span><span>Joined</span><span>Last Sign In</span>
              </div>
              {filtered.map((u, i) => {
                const ps = PLAN_COLORS[u.plan] || PLAN_COLORS.free
                return (
                  <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.1fr 1.2fr 1fr 1fr', padding: '.85rem 1.1rem', alignItems: 'center', borderBottom: i < filtered.length - 1 ? '1px solid #161616' : 'none' }}
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
                  </div>
                )
              })}
            </div>
          )}
      </div>
    </div>
  )
}

// ── Submission detail modal ─────────────────────────────────────────────────
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
  const ps = PLAN_COLORS[sub.user_plan] || PLAN_COLORS.free

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
              <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}` }}>{sub.user_plan}</span>
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
                const ps = PLAN_COLORS[sub.user_plan] || PLAN_COLORS.free
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
                      <span style={{ padding: '.18rem .55rem', borderRadius: 5, fontSize: '.72rem', fontWeight: 600, background: ps.bg, color: ps.text, border: `1px solid ${ps.border}` }}>{sub.user_plan}</span>
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0a', fontFamily: 'system-ui,sans-serif' }}>
      <AdminSidebar active={activeNav} onNav={setActiveNav} onLock={handleLock} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {activeNav === 'users' && <UsersView secret={secret} onSessionExpired={handleLock} />}
        {activeNav === 'new-artist' && <NewArtistView secret={secret} onSessionExpired={handleLock} />}
        {subView && (
          <SubmissionsView key={subView.id} secret={secret} category={subView.id} title={subView.title} onSessionExpired={handleLock} />
        )}
      </div>
    </div>
  )
}
