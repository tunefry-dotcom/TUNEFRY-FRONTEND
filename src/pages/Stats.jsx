import { useState } from 'react'
import { Link } from 'react-router-dom'
import RevenueChart from '../components/charts/RevenueChart'
import StreamsChart from '../components/charts/StreamsChart'
import PlatformChart from '../components/charts/PlatformChart'

const TOP_TRACKS = []
const PLATFORM_SPLIT = []
const GEO = []

const RANGES = ['Last 3 Months', 'Last 6 Months', 'Last 12 Months', 'All Time']

export default function Stats() {
  const [range, setRange] = useState('Last 12 Months')
  const [rangeOpen, setRangeOpen] = useState(false)
  const [period, setPeriod] = useState('monthly')

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-8"/></svg>
        Analytics
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Stats &amp; Revenue</h1>
        <div className="page-header-actions">
          <div style={{ position: 'relative' }}>
            <button className="btn btn-outline" onClick={(e) => { e.stopPropagation(); setRangeOpen((v) => !v) }} style={{ gap: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {range}
              <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5 }}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {rangeOpen && (
              <div
                style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, background: 'rgba(18,14,10,0.97)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: 5, minWidth: 160, zIndex: 200, boxShadow: '0 8px 28px rgba(0,0,0,0.55)' }}
                onClick={(e) => e.stopPropagation()}
              >
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setRange(r); setRangeOpen(false) }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', background: r === range ? 'rgba(242,101,34,0.08)' : 'transparent', border: 'none', color: r === range ? 'var(--accent)' : 'var(--text-secondary)', fontSize: 13, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer', borderRadius: 7, transition: 'background .15s' }}
                    onMouseEnter={(e) => { if (r !== range) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff' } }}
                    onMouseLeave={(e) => { if (r !== range) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
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
          <div className="mini-stat-value">—</div>
          <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>No data yet</div>
        </div>
        <div className="glass-card mini-stat-card">
          <div className="mini-stat-label">Total Revenue</div>
          <div className="mini-stat-value">—</div>
          <div className="mini-stat-change" style={{ color: 'var(--text-muted)', fontSize: 12 }}>No data yet</div>
        </div>
      </div>

      {/* Revenue Chart */}
      <RevenueChart />

      {/* Two-col: Streams + Platform */}
      <div className="two-col">
        <StreamsChart />

        <div className="chart-card glass-card animate-in animate-in-delay-5">
          <div className="chart-header">
            <div>
              <p className="chart-title">Platform Split</p>
              <p className="chart-subtitle">Distribution by platform</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="chart-canvas-wrap" style={{ width: 180, height: 180, flexShrink: 0 }}>
              <PlatformChart hideList />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, paddingTop: 8 }}>No platform data yet.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Tracks Table */}
      <div className="glass-card chart-card animate-in animate-in-delay-6">
        <div className="chart-header">
          <div>
            <p className="chart-title">Top Performing Tracks</p>
            <p className="chart-subtitle">{period === 'monthly' ? 'Your most streamed releases this month' : 'Your most streamed releases this year'}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 8, padding: 3, gap: 2 }}>
              {['monthly', 'yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  style={{ padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer', border: 'none', transition: 'all .2s', background: period === p ? 'var(--accent)' : 'transparent', color: period === p ? '#fff' : 'var(--text-secondary)', boxShadow: period === p ? '0 2px 8px rgba(242,101,34,0.3)' : 'none' }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn btn-sm btn-outline">View All</button>
          </div>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th><th>Track</th><th>Streams</th><th>Revenue</th><th>Trend</th><th>Top Platform</th>
              </tr>
            </thead>
            <tbody>
              {TOP_TRACKS.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No stream data yet. Distribute your first release to see stats here.</td></tr>
              )}
              {TOP_TRACKS.map((t) => (
                <tr key={t.rank}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{t.rank}</td>
                  <td>
                    <div className="song-cell">
                      <div className="song-thumb"><svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg></div>
                      <div>
                        <div className="song-name">{t.name}</div>
                        <div className="song-artist">{t.artist}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{t.streams}</td>
                  <td style={{ fontWeight: 600, color: 'var(--accent)' }}>{t.revenue}</td>
                  <td className={t.trendUp ? 'trend-up' : 'trend-down'}>{t.trend}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.platBg, borderRadius: 20, fontSize: 12, fontWeight: 600, color: t.platColor }}>
                      {t.platform}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Reach */}
      <div className="glass-card chart-card animate-in" style={{ animationDelay: '0.7s' }}>
        <div className="chart-header">
          <div>
            <p className="chart-title">Geographic Reach</p>
            <p className="chart-subtitle">Where your listeners are located</p>
          </div>
        </div>
        <div className="geo-map-placeholder">
          <div className="geo-dot" style={{ top: '35%', left: '25%' }} />
          <div className="geo-dot" style={{ top: '30%', left: '48%', animationDelay: '0.5s' }} />
          <div className="geo-dot" style={{ top: '45%', left: '52%', animationDelay: '1s' }} />
          <div className="geo-dot" style={{ top: '32%', left: '72%', animationDelay: '0.3s' }} />
          <div className="geo-dot" style={{ top: '55%', left: '78%', animationDelay: '0.8s' }} />
          <div className="geo-dot" style={{ top: '65%', left: '30%', animationDelay: '1.2s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 24 }}>
          {GEO.map((g) => (
            <div key={g.country} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{g.country}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700 }}>{g.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
