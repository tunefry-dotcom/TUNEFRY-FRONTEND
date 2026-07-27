import { Link } from 'react-router-dom'

// Small centered popup shown when a user on a lower plan tries to use a gated
// feature (e.g. custom label name). Reuses the app's glass-card + accent look.
// Render it unconditionally and control visibility via the `open` prop.
export default function UpgradeModal({
  open,
  onClose,
  title = 'Upgrade required',
  message,
}) {
  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{ maxWidth: 420, width: '100%', padding: '28px 26px', borderRadius: 18, textAlign: 'center' }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(242,101,34,0.12)',
            border: '1px solid rgba(242,101,34,0.3)',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 700, color: '#fff' }}>{title}</h3>
        <p style={{ margin: '0 0 22px', fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.65)' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Not now
          </button>
          <Link
            to="/plan"
            style={{
              flex: 1,
              padding: '11px 16px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #F26522, #FF8A50)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            View plans
          </Link>
        </div>
      </div>
    </div>
  )
}
