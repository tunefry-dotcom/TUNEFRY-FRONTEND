import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const VELOCITY_BARS = [
  { label: 'Spotify', height: 100, hot: false, delay: '0s' },
  { label: 'Apple', height: 180, hot: true, delay: '0.08s' },
  { label: 'YouTube', height: 80, hot: false, delay: '0.16s' },
  { label: 'Amazon', height: 120, hot: false, delay: '0.24s' },
  { label: 'Tidal', height: 70, hot: false, delay: '0.32s' },
  { label: 'Deezer', height: 110, hot: false, delay: '0.4s' },
  { label: 'Pandora', height: 90, hot: false, delay: '0.48s' },
  { label: 'Other', height: 60, hot: false, delay: '0.56s' },
]

const PITCH_SONGS = [
  { name: 'Midnight Echoes', release: '15 days away' },
  { name: 'Neon Dreams', release: '18 days away' },
]

const MOBILE_ACTIONS = [
  { label: 'Song Upload', path: '/upload/song', icon: <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><path d="M8 17V5l12-2"/></svg> },
  { label: 'Album Upload', path: '/upload/album', icon: <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg> },
  { label: 'Your Release', path: '/releases', icon: <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
  { label: 'Blog', path: '/daily/ai-blog', icon: <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
]

const MOBILE_UTILS = [
  { label: 'Profile\nMismatch', path: '/profile-mismatch', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> },
  { label: 'Current\nPlan', path: '/plan', icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { label: 'Claim\nRemoval', path: '/claim-removal', icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  { label: 'Link\nInstagram', path: '/instalink', icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
]

export default function Overview() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [ugcOn, setUgcOn] = useState(false)

  const streamValue = ugcOn ? '230,797' : '214,532'

  return (
    <div className="overview-content">
      {/* Artistic BG */}
      <div className="overview-art-bg" aria-hidden="true">
        <svg className="art-wave" viewBox="0 0 1200 50" preserveAspectRatio="none" fill="none">
          <path d="M0 25 Q150 0 300 25 Q450 50 600 25 Q750 0 900 25 Q1050 50 1200 25 L1200 50 L0 50 Z" fill="rgba(242,101,34,0.12)" />
        </svg>
      </div>

      {/* Page Label */}
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6"/><path d="M9 13h4"/></svg>
        Performance Hub
      </div>

      {/* Page Header */}
      <div className="page-header animate-in animate-in-delay-1">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1
            className="page-title"
            style={{ background: 'linear-gradient(135deg, #fff 40%, rgba(242,101,34,0.9) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', margin: 0 }}
          >
            Overview
          </h1>
          {/* Equalizer bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, opacity: 0.55, flexShrink: 0, alignSelf: 'center' }} aria-hidden="true">
            {[{ h: 8, d: '0s' }, { h: 16, d: '0.15s' }, { h: 22, d: '0.3s' }, { h: 14, d: '0.45s' }, { h: 10, d: '0.6s' }].map((b, i) => (
              <div key={i} style={{ width: 3, borderRadius: 2, background: 'var(--accent)', animation: 'eqBounce 0.9s ease-in-out infinite alternate', animationDelay: b.d, height: b.h, transformOrigin: 'bottom' }} />
            ))}
          </div>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row animate-in animate-in-delay-2">
        {/* Total Streams */}
        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Streams</span>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>
            </div>
          </div>
          <div className="stat-value">{streamValue}</div>
          <div className="stat-badge positive">
            <svg viewBox="0 0 24 24"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            +12.4% vs last month
          </div>
          {/* UGC Toggle */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--border-subtle)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div
                onClick={() => setUgcOn((v) => !v)}
                style={{
                  width: 36, height: 20, borderRadius: 100, position: 'relative', flexShrink: 0, cursor: 'pointer',
                  background: ugcOn ? 'rgba(242,101,34,0.3)' : 'rgba(255,255,255,0.07)',
                  border: `0.5px solid ${ugcOn ? 'rgba(242,101,34,0.4)' : 'rgba(255,255,255,0.12)'}`,
                  transition: 'background .25s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2, left: ugcOn ? 18 : 2, width: 16, height: 16,
                  borderRadius: '50%', transition: 'left .25s',
                  background: ugcOn ? 'var(--accent)' : 'rgba(255,255,255,0.3)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>UGC Included</span>
            </label>
            {ugcOn && (
              <p style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.5 }}>
                Includes Facebook, TikTok, Instagram &amp; WhatsApp streams. <em>Note: revenue distributed by Meta is very minimal, so details may not reflect accurately.</em>
              </p>
            )}
          </div>
        </div>

        {/* Estimated Revenue */}
        <div className="glass-card stat-card">
          <div className="stat-header">
            <span className="stat-label">Estimated Revenue</span>
            <div className="stat-icon">
              <svg viewBox="0 0 24 24"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
            </div>
          </div>
          <div className="stat-value">$219.72</div>
          <div className="stat-badge neutral">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Next payout: Oct 1st
          </div>
        </div>
      </div>

      {/* Plan nudge — state-aware */}
      {(() => {
        if (!user?.isFree) return null
        const uid = user.id || ''
        const planChosen = (() => { try { return localStorage.getItem(`tf_plan_chosen_${uid}`) } catch { return null } })()
        const neverChosen = !planChosen
        const title = neverChosen ? 'No Plan Active' : 'Unlock Your Full Potential'
        const desc = neverChosen
          ? 'Choose a plan to start distributing your music on 100+ platforms.'
          : "You're on the Free plan. Upgrade to distribute albums, transfer your catalogue, pitch to playlists & keep 100% of your royalties."
        const ctaLabel = neverChosen ? 'Choose Plan' : 'Upgrade Plan'
        return (
          <div className="glass-card" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 20, padding: '20px 24px', marginBottom: 8,
            borderLeft: '3px solid var(--accent)', flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 0 }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, flexShrink: 0, background: 'rgba(242,101,34,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}>
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{desc}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Albums', 'Catalogue Transfer', 'Playlist Pitching', '100% Royalties'].map((feat) => (
                    <span key={feat} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 100, background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.25)', color: 'var(--accent-light, #FF8A50)' }}>{feat}</span>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => navigate('/plan')} style={{ flexShrink: 0, padding: '10px 22px', borderRadius: 100, background: 'var(--accent)', border: 'none', color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 4px 16px var(--accent-glow, rgba(242,101,34,0.35))' }}>
              {ctaLabel}
            </button>
          </div>
        )
      })()}

      {/* Ad Banner placeholder */}
      <div style={{ width: '100%', margin: '4px 0 8px', textAlign: 'center' }}>
        <div style={{ maxWidth: 728, margin: '0 auto', height: 90, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.3px' }}>Advertisement</span>
        </div>
      </div>

      {/* Pitch Your Song */}
      <div className="glass-card pitch-song-section animate-in animate-in-delay-4">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Pitch Your Song</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 2 }}>Upcoming releases eligible for playlist pitching</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px rgba(34,197,94,0.7)', display: 'block', animation: 'blink 1.8s ease-in-out infinite' }} />
            <span className="badge-new">New</span>
          </div>
        </div>
        {PITCH_SONGS.map((s) => (
          <div key={s.name} className="pitch-song-row">
            <div className="pitch-song-info">
              <span className="pitch-song-name">{s.name}</span>
              <span className="pitch-song-date">Release: {s.release}</span>
            </div>
            <Link to="/pitch-song" className="pitch-cta">Apply Now</Link>
          </div>
        ))}
        <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.5 }}>
          Songs with release dates 15–20 days away are eligible for editorial playlist pitching. Tap "Apply Now" to submit your pitch.
        </p>
      </div>

      {/* Streaming Velocity */}
      <div className="glass-card velocity-section animate-in animate-in-delay-3">
        <div className="velocity-header">
          <div>
            <div className="velocity-title">Streaming Velocity</div>
            <div className="velocity-subtitle">Real-time listener distribution across platforms</div>
          </div>
        </div>
        <div className="velocity-chart">
          {VELOCITY_BARS.map((b) => (
            <div key={b.label} className="velocity-bar-wrapper">
              <div
                className={`velocity-bar${b.hot ? ' hot' : ''}`}
                style={{
                  '--bar-h': `${b.height}px`,
                  height: 0,
                  animation: `barGrow 1s cubic-bezier(.22,1,.36,1) forwards`,
                  animationDelay: b.delay,
                }}
              />
              <span className="velocity-bar-label">{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile panels (visible only on small screens) */}
      <section className="mobile-overview-panels">
        <div className="panel-section mobile-management-panel animate-in animate-in-delay-5">
          <div className="panel-section-title">Management Actions</div>
          {MOBILE_ACTIONS.map((a) => (
            <Link key={a.path} to={a.path} className="action-card">
              <span className="action-icon">{a.icon}</span>
              <span className="action-label">{a.label}</span>
              <span className="action-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg></span>
            </Link>
          ))}
        </div>

        <div className="panel-section mobile-utility-panel animate-in animate-in-delay-6">
          <div className="panel-section-title">Utility &amp; Support</div>
          <div className="utility-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {MOBILE_UTILS.map((c) => (
              <Link key={c.path} to={c.path} className="utility-card">
                <span className="util-icon">{c.icon}</span>
                <span className="util-label" dangerouslySetInnerHTML={{ __html: c.label.replace('\n', '<br>') }} />
              </Link>
            ))}
          </div>
          <Link to="/help" className="help-card" style={{ width: '100%', marginTop: 10 }}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
            Help Center
          </Link>
        </div>
      </section>
    </div>
  )
}
