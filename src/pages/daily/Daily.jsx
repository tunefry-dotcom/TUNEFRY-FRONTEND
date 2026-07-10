import { Link } from 'react-router-dom'

const STATS = [
  { label: 'Articles Published', value: '24' },
  { label: 'AI Pitches Sent', value: '18' },
  { label: 'Avg. Engagement', value: '4.2%' },
]

export default function Daily() {
  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        Tunefry Daily
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Tunefry Daily</h1>
        <div className="page-header-actions">
          <Link to="/daily/ai-blog" className="btn btn-primary" style={{ textDecoration: 'none' }}>Open AI Blog Writer</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {STATS.map((s, i) => (
          <div key={s.label} className={`glass-card animate-in animate-in-delay-${i + 2}`} style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Link to="/daily/ai-blog" style={{ textDecoration: 'none' }}>
          <div className="glass-card animate-in animate-in-delay-4" style={{ padding: 28, height: '100%', cursor: 'pointer', borderColor: 'rgba(242,101,34,0.15)', transition: 'border-color .2s' }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(242,101,34,0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(242,101,34,0.15)'}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.8 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>AI Blog Writer</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Generate SEO-optimized articles about your music, releases, and journey using AI.</p>
          </div>
        </Link>

        <div className="glass-card animate-in animate-in-delay-5" style={{ padding: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: '#3B82F6', fill: 'none', strokeWidth: 1.8 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>AI Pitch Writer</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Auto-generate compelling pitch notes for editorial playlists powered by AI.</p>
          <span style={{ display: 'inline-block', marginTop: 14, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.25)', color: '#3B82F6' }}>Coming Soon</span>
        </div>
      </div>
    </>
  )
}
