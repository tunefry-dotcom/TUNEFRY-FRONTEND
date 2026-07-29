import { forwardRef, useState, useEffect } from 'react'
import { API_BASE } from '../../lib/config'

function relativeTime(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const NotificationsDropdown = forwardRef(function NotificationsDropdown({ open, style, onClose, user }, ref) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !user?.id) return

    setLoading(true)
    const storageKey = `tf_bell_ts_${user.id}`
    const lastBellTs = localStorage.getItem(storageKey) || '0'

    Promise.all([
      fetch(`${API_BASE}/submissions/my`, { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
      fetch(`${API_BASE}/notifications/announcements`, { credentials: 'include' }).then((r) => r.ok ? r.json() : []),
    ]).then(([subs, announcements]) => {
      const subItems = (Array.isArray(subs) ? subs : [])
        .filter((s) => (s.status === 'approved' || s.status === 'declined') && s.reviewed_at)
        .map((s) => ({
          id: `sub-${s.id}`,
          type: s.status,
          title: s.data?.song_title || s.data?.album_name || s.submission_type,
          ts: s.reviewed_at,
          unread: s.reviewed_at > lastBellTs,
        }))

      const announceItems = (Array.isArray(announcements) ? announcements : []).map((n) => ({
        id: `ann-${n.id}`,
        type: 'announcement',
        title: n.title,
        body: n.body,
        ts: n.created_at,
        unread: n.created_at > lastBellTs,
      }))

      const merged = [...subItems, ...announceItems]
        .sort((a, b) => (b.ts > a.ts ? 1 : -1))
        .slice(0, 20)

      setItems(merged)
      localStorage.setItem(storageKey, new Date().toISOString())
    }).finally(() => setLoading(false))
  }, [open, user?.id])

  const markAllRead = () => {
    if (!user?.id) return
    const now = new Date().toISOString()
    localStorage.setItem(`tf_bell_ts_${user.id}`, now)
    setItems((prev) => prev.map((i) => ({ ...i, unread: false })))
  }

  const hasUnread = items.some((i) => i.unread)

  return (
    <div
      ref={ref}
      className={`notif-menu${open ? ' open' : ''}`}
      style={style}
    >
      <div className="notif-head">
        <span className="notif-title">Notifications</span>
        {hasUnread && (
          <button className="notif-clear" onClick={markAllRead}>Mark all read</button>
        )}
      </div>
      <div className="notif-list">
        {loading ? (
          <div style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            Loading…
          </div>
        ) : items.length === 0 ? (
          <p className="notif-empty">No notifications yet</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className={`notif-item${item.unread ? '' : ' read'}`}>
              <span className="notif-dot-sm" />
              <div>
                <div className="notif-text">
                  {item.type === 'approved' && <span style={{ color: '#4ade80', marginRight: 4 }}>✓ Approved</span>}
                  {item.type === 'declined' && <span style={{ color: '#f87171', marginRight: 4 }}>✗ Declined</span>}
                  {item.type === 'announcement' ? `📢 ${item.title}` : item.title}
                </div>
                <div className="notif-time">{relativeTime(item.ts)}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
})

export default NotificationsDropdown
