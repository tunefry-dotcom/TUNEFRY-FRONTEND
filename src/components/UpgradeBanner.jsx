import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/upgrade-banner.css'

const UPGRADE_TTL  = 3 * 24 * 60 * 60 * 1000  // 3 days — upgrade nudge
const CHOOSE_TTL   = 1 * 24 * 60 * 60 * 1000  // 1 day  — first-time dismiss

function getLS(key) { try { return localStorage.getItem(key) } catch { return null } }
function setLS(key, val) { try { localStorage.setItem(key, val) } catch { /* private */ } }

export default function UpgradeBanner() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const uid = user?.id || ''

  // -- state flags --
  const planChosen     = getLS(`tf_plan_chosen_${uid}`)          // 'free' | planId | null
  const singleUsed     = getLS(`tf_single_used_${uid}`)          // '1' | null
  const chooseDismissTs = Number(getLS(`tf_choose_dismiss_${uid}`) || 0)
  const upgradeDismissTs = Number(getLS(`tf_upgrade_banner_ts`) || 0)

  const [, forceRender] = useState(0)
  const rerender = () => forceRender(n => n + 1)

  if (!user) return null

  const isExpired       = ['expired', 'cancelled'].includes(user.status)
  const isSingleExhausted = user.plan === 'single-song' && !!singleUsed
  const neverChosen     = user.isFree && !planChosen
  const chooseDismissed = Date.now() - chooseDismissTs < CHOOSE_TTL
  const upgradeDismissed = Date.now() - upgradeDismissTs < UPGRADE_TTL

  // Priority 1: Choose Plan (hard requirement or first-time)
  const mustChoose = isExpired || isSingleExhausted           // no dismiss
  const firstTime  = neverChosen && !chooseDismissed          // dismissible

  if (mustChoose || firstTime) {
    return (
      <div className="upgrade-banner" role="status">
        <div className="upgrade-banner-left">
          <span className="upgrade-banner-icon">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </span>
          <div className="upgrade-banner-text">
            <strong>
              {isExpired ? 'Your plan has expired.' : isSingleExhausted ? 'Your single-song credit is used.' : 'No plan active.'}
            </strong>
            <span> Choose a plan to start distributing your music.</span>
          </div>
        </div>
        <div className="upgrade-banner-actions">
          <button className="upgrade-banner-cta" onClick={() => navigate('/plan')}>
            Choose Plan
          </button>
          {firstTime && (
            <button className="upgrade-banner-close" onClick={() => {
              setLS(`tf_choose_dismiss_${uid}`, String(Date.now()))
              rerender()
            }} aria-label="Dismiss">
              <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}
        </div>
      </div>
    )
  }

  // Priority 2: Upgrade nudge (explicitly on free)
  if (user.isFree && planChosen === 'free' && !upgradeDismissed) {
    return (
      <div className="upgrade-banner" role="status">
        <div className="upgrade-banner-left">
          <span className="upgrade-banner-icon">
            <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </span>
          <div className="upgrade-banner-text">
            <strong>You're on the Free plan.</strong>
            <span> Upgrade to unlock albums, catalogue transfer, playlist pitching &amp; 100% royalties.</span>
          </div>
        </div>
        <div className="upgrade-banner-actions">
          <button className="upgrade-banner-cta" onClick={() => navigate('/plan')}>
            Upgrade
          </button>
          <button className="upgrade-banner-close" onClick={() => {
            setLS('tf_upgrade_banner_ts', String(Date.now()))
            rerender()
          }} aria-label="Dismiss">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    )
  }

  return null
}
