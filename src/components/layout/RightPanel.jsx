import { Link } from 'react-router-dom'

const MANAGEMENT_ACTIONS = [
  {
    label: 'Song Upload',
    path: '/upload/song',
    icon: <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><path d="M8 17V5l12-2"/></svg>,
  },
  {
    label: 'Album Upload',
    path: '/upload/album',
    icon: <svg viewBox="0 0 24 24"><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>,
  },
  {
    label: 'Your Release',
    path: '/releases',
    icon: <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  },
  {
    label: 'Blog',
    path: '/daily/ai-blog',
    icon: <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  },
]

const UTILITY_CARDS = [
  {
    label: 'Profile\nMismatch',
    path: '/profile-mismatch',
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  },
  {
    label: 'Current\nPlan',
    path: '/plan',
    icon: <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  },
  {
    label: 'Claim\nRemoval',
    path: '/claim-removal',
    icon: <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    label: 'Link\nInstagram',
    path: '/instalink',
    icon: <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  },
]

export default function RightPanel() {
  return (
    <aside className="right-panel">
      <div className="panel-section animate-slide-right" style={{ animationDelay: '0.2s' }}>
        <p className="panel-section-title">Management Actions</p>
        {MANAGEMENT_ACTIONS.map((a) => (
          <Link key={a.path} to={a.path} className="action-card">
            <span className="action-icon">{a.icon}</span>
            <span className="action-label">{a.label}</span>
            <span className="action-arrow">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </Link>
        ))}
      </div>

      <div className="panel-section animate-slide-right" style={{ animationDelay: '0.35s' }}>
        <p className="panel-section-title">Utility &amp; Support</p>
        <div className="utility-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          {UTILITY_CARDS.map((c) => (
            <Link key={c.path} to={c.path} className="utility-card">
              <span className="util-icon">{c.icon}</span>
              <span className="util-label" dangerouslySetInnerHTML={{ __html: c.label.replace('\n', '<br>') }} />
            </Link>
          ))}
        </div>
      </div>

      <div className="panel-section animate-slide-right" style={{ animationDelay: '0.6s' }}>
        <Link to="/help" className="help-card" style={{ width: '100%' }}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".5" fill="currentColor"/></svg>
          Help Center
        </Link>
        <a
          href="mailto:support@tunefry.com"
          style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(242,101,34,0.06)', border: '0.5px solid rgba(242,101,34,0.18)', textDecoration: 'none', transition: 'background .2s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(242,101,34,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(242,101,34,0.06)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>support@tunefry.com</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '9px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.07)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>Office hours: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Mon–Fri, 11 AM – 5 PM</strong></span>
        </div>
      </div>
    </aside>
  )
}
