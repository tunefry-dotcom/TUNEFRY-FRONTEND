export default function ComingSoon({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      {/* Content is blurred behind the overlay */}
      <div style={{ filter: 'blur(6px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.55 }}>
        {children}
      </div>
      {/* Overlay — sibling to blurred div, so NOT affected by blur filter */}
      <div style={{
        position: 'fixed', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 100, background: 'rgba(0,0,0,0.35)',
      }}>
        <div style={{
          background: 'rgba(10,10,10,0.92)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 18, padding: '2.5rem 3rem',
          textAlign: 'center', backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🚀</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8, color: '#fff' }}>
            Coming Soon
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
            This feature is under development.<br />Stay tuned!
          </p>
        </div>
      </div>
    </div>
  )
}
