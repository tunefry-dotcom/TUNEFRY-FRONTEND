import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../data/plans'
import { getProfile } from '../lib/profile'
import { startUpgrade, ProfileIncompleteError } from '../lib/payment'
import '../styles/your-plan.css'

function Check({ ck }) {
  if (ck === 'cross') {
    return <span className="yp-ck cross"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg></span>
  }
  return <span className={`yp-ck ${ck}`}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></span>
}

export default function YourPlan() {
  const { user, refreshUser, loading } = useAuth()
  const navigate = useNavigate()
  const [busyPlan, setBusyPlan] = useState(null)
  const [toast, setToast] = useState({ show: false, type: 'success', msg: '' })
  const toastTimer = useRef(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  function showToast(type, msg) {
    setToast({ show: true, type, msg })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 4000)
  }

  if (loading) return <div className="yp-loading">Loading your plan…</div>

  const currentRank = Math.max(0, PLANS.findIndex((p) => p.id === user?.plan))
  const currentName = user?.planName || PLANS[currentRank]?.name || 'Free'

  function setPlanChosen(planId) {
    try { localStorage.setItem(`tf_plan_chosen_${user?.id}`, planId) } catch { /* private */ }
  }

  async function handleSelectFree() {
    setPlanChosen('free')
    showToast('success', 'Free plan activated! You can upgrade anytime.')
  }

  async function handleUpgrade(planId) {
    setBusyPlan(planId)
    try {
      // Google OAuth users must complete their profile before payment.
      if (user?.provider === 'google') {
        const profile = await getProfile()
        if (!profile.is_complete) {
          showToast('error', 'Complete your basic details to continue to payment.')
          navigate('/profile', { state: { from: 'upgrade', plan: planId } })
          return
        }
      }

      const prefill = {
        name: user?.full_name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      }
      await startUpgrade(planId, prefill)
      setPlanChosen(planId)
      await refreshUser()
      showToast('success', 'Payment successful — your plan has been upgraded! 🎉')
    } catch (err) {
      if (err instanceof ProfileIncompleteError) {
        showToast('error', 'Complete your basic details to continue to payment.')
        navigate('/profile', { state: { from: 'upgrade', plan: planId } })
      } else if (err.message === 'Payment cancelled') {
        showToast('error', 'Payment cancelled.')
      } else {
        showToast('error', err.message || 'Something went wrong.')
      }
    } finally {
      setBusyPlan(null)
    }
  }

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        Account
      </div>
      <div className="page-header">
        <h1 className="page-title">Your Plan</h1>
      </div>

      {/* Current plan summary */}
      <div className="glass-card yp-current">
        <div className="yp-current-left">
          <div className="yp-current-label">Current Plan</div>
          <div className="yp-current-name">{currentName}</div>
          <div className="yp-current-meta">
            <span className={`yp-status ${(user?.status === 'active' || user?.isFree) ? 'active' : ''}`}>
              <span className="yp-status-dot" />
              {user?.status ? user.status[0].toUpperCase() + user.status.slice(1) : 'Active'}
            </span>
            {user?.isFree
              ? <span className="yp-current-sub">Free forever</span>
              : user?.daysRemaining != null
                ? <span className="yp-current-sub">{user.daysRemaining} days remaining</span>
                : null}
          </div>
        </div>
      </div>

      <div className="yp-section-title">All Plans</div>

      <div className="yp-grid">
        {PLANS.map((p, idx) => {
          const isCurrent = idx === currentRank
          const isLower = idx < currentRank
          const isUpgrade = idx > currentRank
          return (
            <div key={p.id} className={`yp-card${p.pop ? ' pop' : ''}${isCurrent ? ' current' : ''}`}>
              {p.pop && <div className="yp-badge-pop">Most Popular</div>}
              <div className="yp-card-icon">{p.icon}</div>
              <div className="yp-card-name">{p.name}</div>
              <div className="yp-card-tag">{p.tag}</div>
              {p.priceStrike && <div className="yp-price-strike">{p.priceStrike}</div>}
              <div className="yp-price">₹{p.price}</div>
              <div className="yp-per">{p.per}</div>
              <div className={`yp-royalty ${p.royalty.cls}`}>{p.royalty.text}</div>
              <div className="yp-divider" />
              <ul className="yp-feats">
                {p.feats.map(({ ck, text }) => (
                  <li key={text} className={ck === 'cross' ? 'excluded' : ''}>
                    <Check ck={ck} />{text}
                  </li>
                ))}
              </ul>
              {isCurrent && p.id === 'free' && (
                <button className="yp-cta upgrade" onClick={handleSelectFree}>
                  Choose Plan
                </button>
              )}
              {isCurrent && p.id !== 'free' && <button className="yp-cta current" disabled>Current Plan</button>}
              {isLower && (
                <button className="yp-cta upgrade" onClick={() => handleUpgrade(p.id)} disabled={busyPlan !== null}>
                  {busyPlan === p.id ? 'Processing…' : 'Choose Plan'}
                </button>
              )}
              {isUpgrade && (
                <button
                  className="yp-cta upgrade"
                  disabled={busyPlan !== null}
                  onClick={() => handleUpgrade(p.id)}
                >
                  {busyPlan === p.id ? 'Processing…' : 'Choose Plan'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className={`toast toast-${toast.type}${toast.show ? ' show' : ''}`}>
        <span>{toast.msg}</span>
      </div>
    </>
  )
}
