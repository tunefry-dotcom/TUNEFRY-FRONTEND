import { forwardRef } from 'react'

const NotificationsDropdown = forwardRef(function NotificationsDropdown({ open, style, onClose }, ref) {
  return (
    <div
      ref={ref}
      className={`notif-menu${open ? ' open' : ''}`}
      style={style}
    >
      <div className="notif-head">
        <span className="notif-title">Notifications</span>
        <button className="notif-clear">Mark all read</button>
      </div>
      <div className="notif-list">
        <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: 10, display: 'block', margin: '0 auto 10px' }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          No notifications yet
        </div>
      </div>
    </div>
  )
})

export default NotificationsDropdown
