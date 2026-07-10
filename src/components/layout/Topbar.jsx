import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NotificationsDropdown from '../ui/NotificationsDropdown'
import CreateReleaseDropdown from '../ui/CreateReleaseDropdown'

export default function Topbar({ onMenuToggle }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [notifPos, setNotifPos] = useState({ top: 0, right: 0 })
  const notifBtnRef = useRef(null)
  const notifRef = useRef(null)
  const createRef = useRef(null)
  const navigate = useNavigate()

  const openNotif = () => {
    if (notifBtnRef.current) {
      const rect = notifBtnRef.current.getBoundingClientRect()
      setNotifPos({
        top: rect.bottom + 10,
        right: Math.max(12, window.innerWidth - rect.right - 10),
      })
    }
    setNotifOpen((v) => !v)
    setCreateOpen(false)
  }

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target) && !notifBtnRef.current?.contains(e.target)) {
        setNotifOpen(false)
      }
      if (createRef.current && !createRef.current.contains(e.target)) {
        setCreateOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="sidebar-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div className="search-box">
          <span className="search-icon">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input type="text" placeholder="Search releases, stats..." />
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          ref={notifBtnRef}
          onClick={openNotif}
          aria-label="Notifications"
        >
          <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          <span className="notif-dot" />
        </button>

        <NotificationsDropdown
          ref={notifRef}
          open={notifOpen}
          style={{ top: notifPos.top, right: notifPos.right }}
          onClose={() => setNotifOpen(false)}
        />

        <div className="create-release-wrap" ref={createRef}>
          <button
            className="btn-create"
            onClick={() => { setCreateOpen((v) => !v); setNotifOpen(false) }}
          >
            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round' }}>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span>Create Release</span>
          </button>
          <CreateReleaseDropdown open={createOpen} onClose={() => setCreateOpen(false)} />
        </div>

        <Link to="/profile" className="user-avatar" title="Profile">
          V
        </Link>
      </div>
    </header>
  )
}
