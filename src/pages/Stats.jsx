import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import RevenueChart from '../components/charts/RevenueChart'
import StreamsChart from '../components/charts/StreamsChart'
import PlatformChart from '../components/charts/PlatformChart'
import { getEarnings, getSongEarnings } from '../lib/earnings'

const fmtNum = (n) => (Number(n) || 0).toLocaleString('en-IN')
const fmtRs = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

// Per-song platform + monthly breakdown modal.
function SongDetailModal({ song, onClose }) {
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true
    setLoading(true); setError('')
    getSongEarnings(song.submission_id)
      .then((d) => { if (alive) setDetail(d) })
      .catch(() => { if (alive) setError('Could not load song details.') })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [song.submission_id])

  const maxStreams = detail?.platforms?.reduce((m, p) => Math.max(m, p.streams), 0) || 1

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.78)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={onClose}>
      <div className="glass-card" style={{ width: '100%', maxWidth: 620, maxHeight: '88vh', overflow: 'auto', padding: 28 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800 }}>{song.song_title}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{song.artist_name}</div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="stats-grid-2" style={{ marginBottom: 22 }}>
          <div className="glass-card mini-stat-card">
            <div className="mini-stat-label">Total Streams</div>
            <div className="mini-stat-value">{fmtNum(song.streams)}</div>
          </div>
          <div className="glass-card mini-stat-card">
            <div className="mini-stat-label">Total Revenue</div>
            <div className="mini-stat-value" style={{ color: 'var(--accent)' }}>{fmtRs(song.revenue)}</div>
          </div>
        </div>

        {loading && <div style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>Loading…</div>}
        {error && <div style={{ color: 'var(--red)', padding: '1rem 0' }}>{error}</div>}

        {!loading && !error && detail && (
          <>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 12 }}>By Platform</div>
            {(detail.platforms || []).length === 0 && (
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No platform data yet.</div>
            )}
            {(detail.platforms || []).map((p) => (
              <div key={p.platform_group} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                  <span style={{ fontWeight: 600 }}>{p.platform_group}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{fmtNum(p.streams)} streams · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmtRs(p.revenue)}</span></span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
                  <div style={{ width: `${Math.max(3, (p.streams / maxStreams) * 100)}%`, height: '100%', background: 'linear-gradient(90deg,#FF9A60,var(--accent))', borderRadius: 100 }} />
                </div>
              </div>
            ))}

            {(detail.monthly || []).length > 0 && (
              <>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, margin: '22px 0 12px' }}>Monthly</div>
                <div className="data-table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Month</th><th>Streams</th><th>Revenue</th></tr></thead>
                    <tbody>
                      {detail.monthly.map((m, i) => (
                        <tr key={i}>
                          <td>{m.month} {m.year}</td>
                          <td style={{ fontWeight: 600 }}>{fmtNum(m.streams)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmtRs(m.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function Stats() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openSong, setOpenSong] = useState(null)

  useEffect(() => {
    let alive = true
    getEarnings()
      .then((d) => { if (alive) setData(d) })
      .catch(() => { if (alive) setData({ total_streams: 0, total_revenue: 0, available_balance: 0, songs: [] }) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const songs = data?.songs || []

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-8"/></svg>
        Analytics
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Stats &amp; Revenue</h1>
        <div className="page-header-actions">
          <Link to="/withdraw" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            Withdraw Earnings
          </Link>
        </div>
      </div>

      {/* Mini Stats */}
      <div className="stats-grid-2 animate-in animate-in-delay-2" style={{ isolation: 'isolate' }}>
        <div className="glass-card mini-stat-card">
          <div className="mini-stat-label">Total Streams</div>
          <div className="mini-stat-value">{loading ? '…' : fmtNum(data?.total_streams)}</div>
          <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>All time</div>
        </div>
        <div className="glass-card mini-stat-card">
          <div className="mini-stat-label">Total Revenue</div>
          <div className="mini-stat-value">{loading ? '…' : fmtRs(data?.total_revenue)}</div>
          <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>All time</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart monthly={data?.monthly} />

      {/* Two-col: Streams + Platform */}
      <div className="two-col">
        <StreamsChart monthly={data?.monthly} />
        <div className="chart-card glass-card animate-in animate-in-delay-5">
          <div className="chart-header">
            <div>
              <p className="chart-title">Platform Split</p>
              <p className="chart-subtitle">Open a track for its full platform breakdown</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="chart-canvas-wrap" style={{ width: 180, height: 180, flexShrink: 0 }}>
              <PlatformChart platforms={data?.platforms} hideList />
            </div>
            <div style={{ flex: 1, color: 'var(--text-muted)', fontSize: 13 }}>
              Click <strong style={{ color: 'var(--text-primary)' }}>Details</strong> on any track below to see how many streams came from each major distributor (Spotify, Apple Music, YouTube, …) and the revenue each generated.
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks Table */}
      <div className="glass-card chart-card animate-in animate-in-delay-6">
        <div className="chart-header">
          <div>
            <p className="chart-title">Your Tracks</p>
            <p className="chart-subtitle">Streams &amp; revenue per release — click Details for the platform split</p>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Track</th><th>Streams</th><th>Revenue</th><th>Top Platform</th><th></th></tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading…</td></tr>
              )}
              {!loading && songs.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No stream data yet. Distribute your first release to see stats here.</td></tr>
              )}
              {!loading && songs.map((t, i) => (
                <tr key={t.submission_id || t.song_title || i}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{i + 1}</td>
                  <td>
                    <div className="song-cell">
                      <div className="song-thumb"><svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg></div>
                      <div>
                        <div className="song-name">{t.song_title}</div>
                        <div className="song-artist">{t.artist_name}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{fmtNum(t.streams)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmtRs(t.revenue)}</td>
                  <td>
                    {t.top_platform && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>{t.top_platform}</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-sm btn-outline" disabled={!t.submission_id} onClick={() => setOpenSong(t)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {openSong && <SongDetailModal song={openSong} onClose={() => setOpenSong(null)} />}
    </>
  )
}
