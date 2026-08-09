import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import RevenueChart from '../components/charts/RevenueChart'
import StreamsChart from '../components/charts/StreamsChart'
import PlatformChart, { PLATFORM_COLORS } from '../components/charts/PlatformChart'
import { getSongEarnings } from '../lib/earnings'

const fmtNum = (n) => (Number(n) || 0).toLocaleString('en-IN')
const fmtRs = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

export default function ReleaseDetail() {
  const { submissionId } = useParams()
  const navigate = useNavigate()
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(false)
    getSongEarnings(submissionId)
      .then((d) => { if (alive) setDetail(d) })
      .catch(() => { if (alive) setError(true) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [submissionId])

  const monthly = detail?.monthly || []
  const platforms = detail?.platforms || []
  const hasData = monthly.length > 0 || platforms.length > 0

  const totalStreams = monthly.reduce((s, m) => s + (Number(m.streams) || 0), 0)
  const totalRevenue = monthly.reduce((s, m) => s + (Number(m.revenue) || 0), 0)
  const maxPlatformStreams = platforms.reduce((m, p) => Math.max(m, Number(p.streams) || 0), 0) || 1

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-8"/></svg>
        Analytics
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <div>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => navigate('/releases')}
            style={{ marginBottom: 10, fontSize: 13, padding: '4px 10px' }}
          >
            ← Your Releases
          </button>
          <h1 className="page-title">
            {loading ? '…' : (detail?.song_title || 'Release Detail')}
          </h1>
        </div>
      </div>

      {loading && (
        <div className="glass-card chart-card animate-in" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          Loading stats…
        </div>
      )}

      {!loading && (error || !hasData) && (
        <div className="glass-card chart-card animate-in animate-in-delay-2" style={{ textAlign: 'center', padding: '3rem' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 40, height: 40, color: 'var(--text-muted)', marginBottom: 16 }}><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-8"/></svg>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            No stream data yet
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Stats will appear here once this release goes live and starts streaming on platforms.
          </p>
        </div>
      )}

      {!loading && !error && hasData && (
        <>
          {/* Mini Stats */}
          <div className="stats-grid-2 animate-in animate-in-delay-2" style={{ isolation: 'isolate' }}>
            <div className="glass-card mini-stat-card">
              <div className="mini-stat-label">Total Streams</div>
              <div className="mini-stat-value">{fmtNum(totalStreams)}</div>
              <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>All time</div>
            </div>
            <div className="glass-card mini-stat-card">
              <div className="mini-stat-label">Total Revenue</div>
              <div className="mini-stat-value" style={{ color: 'var(--accent)' }}>{fmtRs(totalRevenue)}</div>
              <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>All time</div>
            </div>
          </div>

          {/* Revenue Chart */}
          <RevenueChart monthly={monthly} />

          {/* Two-col: Streams + Platform */}
          <div className="two-col">
            <StreamsChart monthly={monthly} />

            <div className="chart-card glass-card animate-in animate-in-delay-5">
              <div className="chart-header">
                <div>
                  <p className="chart-title">Platform Split</p>
                  <p className="chart-subtitle">Streams by platform</p>
                </div>
              </div>
              {platforms.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: 13, padding: '1rem 0' }}>No platform data yet.</div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                  <div className="chart-canvas-wrap" style={{ width: 180, height: 180, flexShrink: 0 }}>
                    <PlatformChart platforms={platforms} hideList />
                  </div>
                  <ul style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', margin: 0, padding: 0 }}>
                    {platforms.map((p) => (
                      <li key={p.platform_group}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, marginBottom: 5 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: PLATFORM_COLORS[p.platform_group] ?? '#555', flexShrink: 0 }} />
                            <span style={{ fontWeight: 600 }}>{p.platform_group}</span>
                          </div>
                          <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                            {fmtNum(p.streams)} streams · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{fmtRs(p.revenue)}</span>
                          </span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 100 }}>
                          <div style={{ width: `${Math.max(3, (Number(p.streams) / maxPlatformStreams) * 100)}%`, height: '100%', background: `linear-gradient(90deg,#FF9A60,var(--accent))`, borderRadius: 100 }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Monthly breakdown table */}
          {monthly.length > 0 && (
            <div className="glass-card chart-card animate-in animate-in-delay-6">
              <div className="chart-header">
                <div>
                  <p className="chart-title">Monthly Breakdown</p>
                  <p className="chart-subtitle">Streams &amp; revenue per month</p>
                </div>
              </div>
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr><th>Month</th><th>Streams</th><th>Revenue</th></tr>
                  </thead>
                  <tbody>
                    {[...monthly]
                      .sort((a, b) => a.year !== b.year ? b.year - a.year : b.month - a.month)
                      .map((m, i) => (
                        <tr key={i}>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {new Date(m.year, m.month - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ fontWeight: 600 }}>{fmtNum(m.streams)}</td>
                          <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{fmtRs(m.revenue)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
