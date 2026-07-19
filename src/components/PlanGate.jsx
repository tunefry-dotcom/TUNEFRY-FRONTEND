import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess, PLAN_LABELS } from '../lib/billing'
import '../styles/plan-gate.css'

// Wraps a route/section. If the user's plan grants `feature`, renders children.
// Otherwise shows a "locked" upgrade screen naming the cheapest plan that unlocks
// it. Enforcement is defense-in-depth: the backend also 403s gated APIs, so this
// is a UX layer, not the security boundary.
//
// `title` is the friendly name of the service being gated (for the message).
export default function PlanGate({ feature, title = 'This feature', children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user?.planConfirmed) {
    return (
      <div className="plan-gate">
        <div className="plan-gate-card glass-card">
          <div className="plan-gate-icon">
            <svg viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div className="plan-gate-badge">Choose a plan first</div>
          <h1 className="plan-gate-title">Select a plan to get started</h1>
          <p className="plan-gate-sub">Pick a plan — even the free one — before you can upload music.</p>
          <div className="plan-gate-actions">
            <button className="plan-gate-btn primary" onClick={() => navigate('/your-plan')}>
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
              Choose Plan
            </button>
            <button className="plan-gate-btn ghost" onClick={() => navigate('/')}>
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (canAccess(user, feature)) return children

  const requiredPlanId = user?.upgradeHints?.[feature]
  const requiredPlanName = requiredPlanId ? PLAN_LABELS[requiredPlanId] || requiredPlanId : null
  const currentPlanName = user?.planName || PLAN_LABELS[user?.plan] || 'your current plan'

  return (
    <div className="plan-gate">
      <div className="plan-gate-card glass-card">
        <div className="plan-gate-icon">
          <svg viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <div className="plan-gate-badge">Upgrade required</div>
        <h1 className="plan-gate-title">{title} is locked on {currentPlanName}</h1>
        <p className="plan-gate-sub">
          {requiredPlanName
            ? <>Unlock it by upgrading to the <strong>{requiredPlanName}</strong> plan or higher.</>
            : <>This feature isn’t available on your current plan.</>}
        </p>

        <div className="plan-gate-actions">
          <button className="plan-gate-btn primary" onClick={() => navigate('/pricing')}>
            <svg viewBox="0 0 24 24"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
            View Plans &amp; Upgrade
          </button>
          <button className="plan-gate-btn ghost" onClick={() => navigate('/')}>
            Back to Overview
          </button>
        </div>
      </div>
    </div>
  )
}
