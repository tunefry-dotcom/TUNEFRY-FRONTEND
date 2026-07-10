import { useState } from 'react'
import { Link } from 'react-router-dom'

const RELEASES = [
  { id: 1, title: 'Midnight Echoes', type: 'Single', date: 'May 12, 2026', status: 'Live', statusClass: 'success', streams: '68,432', platforms: ['Spotify', 'Apple Music', 'YouTube Music'] },
  { id: 2, title: 'Neon Dreams EP', type: 'EP', date: 'Apr 3, 2026', status: 'Live', statusClass: 'success', streams: '52,108', platforms: ['Spotify', 'Apple Music'] },
  { id: 3, title: 'Urban Pulse', type: 'Single', date: 'Mar 28, 2026', status: 'Live', statusClass: 'success', streams: '41,290', platforms: ['Spotify', 'Amazon Music'] },
  { id: 4, title: 'Golden Hour', type: 'Album', date: 'Jun 20, 2026', status: 'Pending', statusClass: 'processing', streams: '—', platforms: ['Spotify', 'Apple Music', 'YouTube Music', 'Amazon Music'] },
  { id: 5, title: 'Velvet Skyline', type: 'Single', date: 'Jul 1, 2026', status: 'Scheduled', statusClass: 'scheduled', streams: '—', platforms: ['All Platforms'] },
]

const STATUS_COLORS = {
  success: { bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)', color: '#22C55E' },
  processing: { bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)', color: '#3B82F6' },
  scheduled: { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)', color: '#EAB308' },
}

export default function Releases() {
  const [filter, setFilter] = useState('All')

  const filtered = filter === 'All' ? RELEASES : RELEASES.filter((r) => r.status === filter)

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
        {['All', 'Live', 'Pending', 'Scheduled'].map((f) => (
          <button key={f} className={`category-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Release</th><th>Type</th><th>Release Date</th><th>Streams</th><th>Platforms</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const sc = STATUS_COLORS[r.statusClass]
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="song-cell">
                        <div className="song-thumb">
                          <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>
                        </div>
                        <span className="song-name">{r.title}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 12.5 }}>{r.type}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{r.date}</td>
                    <td style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{r.streams}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.platforms.slice(0, 2).join(', ')}{r.platforms.length > 2 ? ` +${r.platforms.length - 2}` : ''}</td>
                    <td>
                      <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: sc.bg, border: `0.5px solid ${sc.border}`, color: sc.color }}>{r.status}</span>
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
      </div>
    </>
  )
}
