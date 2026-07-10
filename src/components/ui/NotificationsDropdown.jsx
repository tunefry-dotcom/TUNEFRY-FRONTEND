import { forwardRef } from 'react'

const NOTIFICATIONS = [
  { id: 1, text: 'Your track "Midnight Drive" has been approved and is now live on Spotify.', time: '2m ago', read: false },
  { id: 2, text: 'Apple Music royalties of $124.50 are ready for withdrawal.', time: '1h ago', read: false },
  { id: 3, text: 'New playlist placement opportunity available for your song.', time: '3h ago', read: true },
  { id: 4, text: 'Your profile verification has been completed successfully.', time: '1d ago', read: true },
]

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
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`notif-item${n.read ? ' read' : ''}`}>
            <span className="notif-dot-sm" />
            <div>
              <p className="notif-text">{n.text}</p>
              <p className="notif-time">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

export default NotificationsDropdown
