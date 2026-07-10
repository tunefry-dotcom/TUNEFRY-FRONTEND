import { Link } from 'react-router-dom'

const OPTIONS = [
  {
    to: '/upload/song',
    title: 'Song Upload',
    sub: 'Single track release',
    iconBg: 'rgba(242,101,34,0.15)',
    iconBorder: '0.5px solid rgba(242,101,34,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="#F26522" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
  },
  {
    to: '/upload/album',
    title: 'Album Upload',
    sub: 'Multi-track project',
    iconBg: 'rgba(59,130,246,0.15)',
    iconBorder: '0.5px solid rgba(59,130,246,0.3)',
    icon: (
      <svg viewBox="0 0 24 24" stroke="#3B82F6" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M9 21V9"/>
      </svg>
    ),
  },
]

export default function CreateReleaseDropdown({ open, onClose }) {
  return (
    <div className={`create-dropdown${open ? ' open' : ''}`}>
      {OPTIONS.map((opt, i) => (
        <div key={opt.to} style={{ display: 'contents' }}>
          {i > 0 && <div className="create-dropdown-divider" />}
          <Link
            to={opt.to}
            className="create-dropdown-item"
            onClick={onClose}
          >
            <span className="create-dropdown-icon" style={{ background: opt.iconBg, border: opt.iconBorder }}>
              {opt.icon}
            </span>
            <span className="create-dropdown-text">
              <span className="create-dropdown-title">{opt.title}</span>
              <span className="create-dropdown-sub">{opt.sub}</span>
            </span>
          </Link>
        </div>
      ))}
    </div>
  )
}
