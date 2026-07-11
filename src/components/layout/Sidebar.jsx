import { NavLink, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Overview',
    icon: (
      <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
    ),
  },
  {
    path: '/stats',
    label: 'Stats & Revenue',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="M7 16l4-8 4 4 6-8"/></svg>
    ),
  },
  {
    path: '/withdraw',
    label: 'Withdraw Earnings',
    icon: (
      <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
    ),
  },
  {
    path: '/marketplace',
    label: 'Marketplace',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
    ),
  },
  {
    label: 'Tunefry Daily',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>
    ),
    dropdown: true,
    children: [
      { path: '/daily/ai-blog', label: 'Write a Blog' },
      { path: '/daily', label: 'Tunefry Daily' },
    ],
  },
  {
    path: '/connect',
    label: 'Connect',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    ),
  },
  {
    path: '/refer',
    label: 'Refer & Earn',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/><polyline points="16 3 21 3 21 8"/><line x1="21" y1="3" x2="12" y2="12"/></svg>
    ),
  },
  {
    path: '/plan',
    label: 'Your Plan',
    icon: (
      <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const isDailyActive = location.pathname.startsWith('/daily')
  const [dailyOpen, setDailyOpen] = useState(isDailyActive)

  return (
    <>
      <aside className={`sidebar${isOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <img src="/tunefry-logo.png" alt="Tunefry" />
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            if (item.dropdown) {
              return (
                <div key={item.label}>
                  <div
                    className={`nav-item nav-dropdown-trigger${dailyOpen ? ' open' : ''}${isDailyActive ? ' active' : ''}`}
                    onClick={() => setDailyOpen((v) => !v)}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-chevron">
                      <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                    </span>
                  </div>
                  <div className={`nav-sub-menu${dailyOpen ? ' open' : ''}`}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end
                        className={({ isActive }) => `nav-sub-item${isActive ? ' active' : ''}`}
                        onClick={onClose}
                      >
                        <span className="nav-sub-dot" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )
            }
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {isOpen && <div className="sidebar-overlay visible" onClick={onClose} />}
    </>
  )
}
