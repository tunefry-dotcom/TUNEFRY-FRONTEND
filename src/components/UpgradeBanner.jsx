import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/upgrade-banner.css'

// Persistent-per-session notification nudging free-plan artists to upgrade.
// Shows only while the user is on the Free plan; dismissible for the session.
export default function UpgradeBanner() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('tf_upgrade_banner_dismissed') === '1'
  )

  // Only nudge free-plan users. Paid users never see it.
  if (!user || !user.isFree || dismissed) return null

  const dismiss = () => {
    sessionStorage.setItem('tf_upgrade_banner_dismissed', '1')
    setDismissed(true)
  }

  return (
    <div className="upgrade-banner" role="status">
      <div className="upgrade-banner-left">
        <span className="upgrade-banner-icon">
          <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        </span>
        <div className="upgrade-banner-text">
          <strong>You’re on the Free plan.</strong>
          <span> Upgrade to unlock albums, catalogue transfer, playlist pitching, Instagram linking &amp; 100% royalties.</span>
        </div>
      </div>
      <div className="upgrade-banner-actions">
        <button className="upgrade-banner-cta" onClick={() => navigate('/pricing')}>
          Upgrade
        </button>
        <button className="upgrade-banner-close" onClick={dismiss} aria-label="Dismiss">
          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      </div>
    </div>
  )
}
