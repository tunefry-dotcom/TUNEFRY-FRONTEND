import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/upgrade-banner.css'

const TTL_MS = 3 * 24 * 60 * 60 * 1000 // 3 days

function isDismissed() {
  try {
    const ts = localStorage.getItem('tf_upgrade_banner_ts')
    return Boolean(ts && Date.now() - Number(ts) < TTL_MS)
  } catch {
    return false
  }
}

export default function UpgradeBanner() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(() => isDismissed())

  if (!user || !user.isFree || dismissed) return null

  const dismiss = () => {
    try { localStorage.setItem('tf_upgrade_banner_ts', String(Date.now())) } catch { /* private browsing */ }
    setDismissed(true)
  }

  return (
    <div className="upgrade-banner" role="status">
      <div className="upgrade-banner-left">
        <span className="upgrade-banner-icon">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </span>
        <div className="upgrade-banner-text">
          <strong>No plan active.</strong>
          <span> Choose a plan to start distributing your music and unlock albums, 100% royalties &amp; more.</span>
        </div>
      </div>
      <div className="upgrade-banner-actions">
        <button className="upgrade-banner-cta" onClick={() => navigate('/plan')}>
          Choose Plan
        </button>
        <button className="upgrade-banner-close" onClick={dismiss} aria-label="Dismiss">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  )
}
