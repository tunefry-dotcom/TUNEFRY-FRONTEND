const PLATFORMS = [
  { name: 'Spotify', color: '#1DB954', bg: 'rgba(29,185,84,0.1)', border: 'rgba(29,185,84,0.25)', icon: '🎵', connected: true, followers: '12,400' },
  { name: 'Apple Music', color: '#FC3C44', bg: 'rgba(252,60,68,0.1)', border: 'rgba(252,60,68,0.25)', icon: '🍎', connected: true, followers: '8,200' },
  { name: 'YouTube Music', color: '#FF0000', bg: 'rgba(255,0,0,0.1)', border: 'rgba(255,0,0,0.25)', icon: '▶', connected: false, followers: null },
  { name: 'Amazon Music', color: '#FF9900', bg: 'rgba(255,153,0,0.1)', border: 'rgba(255,153,0,0.25)', icon: '🎵', connected: false, followers: null },
  { name: 'Tidal', color: '#00FFFF', bg: 'rgba(0,255,255,0.08)', border: 'rgba(0,255,255,0.2)', icon: '🌊', connected: false, followers: null },
  { name: 'Deezer', color: '#A238FF', bg: 'rgba(162,56,255,0.1)', border: 'rgba(162,56,255,0.25)', icon: '🎧', connected: false, followers: null },
]

export default function Connect() {
  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        Connect
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Connect Platforms</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 8 }}>
        {PLATFORMS.map((p, i) => (
          <div key={p.name} className="glass-card animate-in" style={{ padding: 24, animationDelay: `${0.1 + i * 0.05}s`, border: p.connected ? `0.5px solid ${p.border}` : undefined }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: p.bg, border: `0.5px solid ${p.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{p.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                  {p.connected && <div style={{ fontSize: 11.5, color: '#22C55E', fontWeight: 600 }}>{p.followers} followers</div>}
                </div>
              </div>
              {p.connected && (
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', color: '#22C55E' }}>Connected</span>
              )}
            </div>
            <button
              style={{ width: '100%', padding: '9px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-display)', cursor: 'pointer', border: `0.5px solid ${p.connected ? 'rgba(255,255,255,0.1)' : p.border}`, background: p.connected ? 'rgba(255,255,255,0.04)' : p.bg, color: p.connected ? 'var(--text-secondary)' : p.color, transition: 'all .2s' }}
            >
              {p.connected ? 'Disconnect' : `Connect ${p.name}`}
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
