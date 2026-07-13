import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BASE = 'https://backend1-xzx5.onrender.com'

const STATUS_META = {
  approved: { label: 'Live',     bg: 'rgba(34,197,94,0.1)',  border: 'rgba(34,197,94,0.25)',  color: '#22C55E' },
  pending:  { label: 'Pending',  bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', color: '#3B82F6' },
  declined: { label: 'Declined', bg: 'rgba(239,68,68,0.1)',  border: 'rgba(239,68,68,0.25)',  color: '#EF4444' },
}

const TYPE_LABELS = {
  new_song: 'Single', transfer_song: 'Transfer',
  new_album: 'Album', transfer_album: 'Transfer Album',
  profile_mismatch: 'Support', claim_removal: 'Support', insta_link: 'Support',
}

function fmtDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Releases() {
  const { user } = useAuth()
  const [filter, setFilter] = useState('All')
  const [releases, setReleases] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}/submissions/my`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { submissions: [] })
      .then((d) => {
        const songAlbum = (d.submissions || []).filter((s) =>
          ['new_song','transfer_song','new_album','transfer_album'].includes(s.submission_type)
        )
        setReleases(songAlbum)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.id])

  const filtered = filter === 'All'
    ? releases
    : releases.filter((r) => STATUS_META[r.status]?.label === filter)

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        Catalog
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Your Releases</h1>
        <div className="page-header-actions">
          <Link to="/upload/song" className="btn btn-outline" style={{ textDecoration: 'none' }}>+ Song</Link>
          <Link to="/upload/album" className="btn btn-primary" style={{ textDecoration: 'none' }}>+ Album</Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="category-tabs animate-in animate-in-delay-2">
        {['All', 'Live', 'Pending', 'Declined'].map((f) => (
          <button key={f} className={`category-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading releases…</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            {releases.length === 0 ? 'No releases yet. Submit your first song or album!' : 'No releases match this filter.'}
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Release</th><th>Type</th><th>Submitted</th><th>Streams</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const sm = STATUS_META[r.status] || STATUS_META.pending
                  const title = r.data?.song_title || r.data?.album_name || '(untitled)'
                  const type = TYPE_LABELS[r.submission_type] || r.submission_type
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="song-cell">
                          <div className="song-thumb">
                            <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>
                          </div>
                          <span className="song-name">{title}</span>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{type}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fmtDate(r.created_at)}</td>
                      <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>—</td>
                      <td>
                        <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: sm.bg, border: `0.5px solid ${sm.border}`, color: sm.color }}>{sm.label}</span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-ghost">Details</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
