import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const BALANCE = 2641
const MIN = 1500

const TRANSACTIONS = [
  { id: 1, type: 'bank', title: 'Bank Transfer — HDFC Bank', date: '12 Apr 2026', amount: '₹1,800.00', status: 'Paid', statusClass: 'success' },
  { id: 2, type: 'upi', title: 'UPI — vasusharma@okaxis', date: '28 Mar 2026', amount: '₹2,100.00', status: 'Paid', statusClass: 'success' },
  { id: 3, type: 'bank', title: 'Bank Transfer — SBI', date: '5 Mar 2026', amount: '₹1,500.00', status: 'Processing', statusClass: 'processing' },
]

function Toast({ toast }) {
  if (!toast) return null
  return (
    <div className={`toast show ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`} style={{ position: 'fixed', bottom: 32, right: 32, pointerEvents: 'none' }}>
      <svg viewBox="0 0 24 24">
        {toast.type === 'success'
          ? <polyline points="20 6 9 17 4 12" />
          : <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
        }
      </svg>
      {toast.msg}
    </div>
  )
}

export default function Withdrawal() {
  const [tab, setTab] = useState('bank')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const [bankForm, setBankForm] = useState({ amount: '', name: '', bankName: '', accNo: '', ifsc: '' })
  const [upiForm, setUpiForm] = useState({ amount: '', upiId: '', upiName: '', verified: false })

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(() => setToast(null), 4000)
  }

  const submitBank = () => {
    const amt = parseFloat(bankForm.amount)
    if (!amt || amt < MIN) return showToast('error', 'Minimum withdrawal amount is ₹1,500.')
    if (amt > BALANCE) return showToast('error', `Amount exceeds your available balance of ₹${BALANCE.toFixed(2)}.`)
    if (!bankForm.name || !bankForm.accNo || !bankForm.ifsc || !bankForm.bankName) return showToast('error', 'Please fill in all bank details.')
    showToast('success', 'Withdrawal request submitted! Payment will be credited within 14 working days.')
  }

  const verifyUpi = () => {
    if (!upiForm.upiId || !upiForm.upiId.includes('@')) return showToast('error', 'Please enter a valid UPI ID (e.g. name@upi).')
    setUpiForm((f) => ({ ...f, verified: true, upiName: 'Vasu Sharma' }))
    showToast('success', 'UPI ID verified successfully!')
  }

  const submitUpi = () => {
    const amt = parseFloat(upiForm.amount)
    if (!amt || amt < MIN) return showToast('error', 'Minimum withdrawal amount is ₹1,500.')
    if (amt > BALANCE) return showToast('error', `Amount exceeds your available balance of ₹${BALANCE.toFixed(2)}.`)
    if (!upiForm.upiId || !upiForm.upiId.includes('@')) return showToast('error', 'Please enter and verify your UPI ID first.')
    showToast('success', `UPI withdrawal initiated! ₹${amt.toFixed(2)} will be credited within 14 working days.`)
  }

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        Finance
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Withdraw Earnings</h1>
        <div className="page-header-actions">
          <Link to="/stats" className="btn btn-outline">← Stats &amp; Revenue</Link>
        </div>
      </div>

      {/* Balance Hero */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 32, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', borderColor: 'rgba(242,101,34,0.2)', background: 'linear-gradient(165deg, rgba(242,101,34,0.08) 0%, rgba(255,255,255,0.03) 60%)' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: 10 }}>Available Balance</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent)', marginRight: 4 }}>₹</span>2,641.00
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', color: '#22C55E' }}>
              <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5 }}><polyline points="20 6 9 17 4 12"/></svg>
              Eligible to Withdraw
            </span>
            <span>Last updated today</span>
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Min. withdrawal: <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>₹1,500</strong>
        </div>
      </div>

      {/* Method Selector */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, paddingBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.8 }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Select Payment Method
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: 4, marginBottom: 28, width: 'fit-content' }}>
          {[
            { key: 'bank', label: 'Bank Transfer', icon: <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="12" height="20" rx="2"/></svg> },
            { key: 'upi', label: 'UPI', badge: '14 Working Days', icon: <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 10l2 2 4-4"/></svg> },
          ].map((t) => (
            <div
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: '0.5px solid transparent', background: tab === t.key ? 'linear-gradient(145deg, rgba(242,101,34,0.18) 0%, rgba(242,101,34,0.08) 100%)' : 'transparent', borderColor: tab === t.key ? 'rgba(242,101,34,0.3)' : 'transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              {t.icon}
              {t.label}
              {t.badge && <span style={{ padding: '1px 7px', background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 100, fontSize: 10, fontWeight: 700, color: '#22C55E', letterSpacing: '0.04em' }}>{t.badge}</span>}
            </div>
          ))}
        </div>

        {/* Info Note */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 16px', background: 'rgba(234,179,8,0.06)', border: '0.5px solid rgba(234,179,8,0.2)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: '#EAB308', fill: 'none', strokeWidth: 2, flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {tab === 'bank'
            ? <>Bank transfers are credited within <strong style={{ color: 'var(--text-primary)' }}>14 working days</strong>. Ensure your account details match your KYC-registered bank account exactly.</>
            : <>UPI payments are processed within <strong style={{ color: 'var(--text-primary)' }}>14 working days</strong>. Make sure your UPI ID is active and linked to an Indian bank account.</>
          }
        </div>

        {tab === 'bank' ? (
          <>
            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Withdrawal Amount <span style={{ color: 'var(--accent)' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 10, overflow: 'hidden' }}>
                <span style={{ padding: '11px 14px', fontSize: 14, fontWeight: 700, color: 'var(--accent)', background: 'rgba(242,101,34,0.08)', borderRight: '0.5px solid rgba(255,255,255,0.09)', flexShrink: 0 }}>₹</span>
                <input type="number" placeholder="Enter amount (min ₹1,500)" min={MIN} max={BALANCE} value={bankForm.amount} onChange={(e) => setBankForm((f) => ({ ...f, amount: e.target.value }))} style={{ flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#fff', fontFamily: 'var(--font-body)' }} />
                <button onClick={() => setBankForm((f) => ({ ...f, amount: String(BALANCE) }))} style={{ padding: '0 14px', fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'transparent', border: 'none', borderLeft: '0.5px solid rgba(255,255,255,0.09)', minHeight: 44, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>MAX</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Account Holder Name', key: 'name', placeholder: 'As per bank records' },
                { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. HDFC Bank, SBI' },
              ].map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label} <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input type="text" className="form-input" placeholder={f.placeholder} value={bankForm[f.key]} onChange={(e) => setBankForm((v) => ({ ...v, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Account Number', key: 'accNo', placeholder: 'Enter account number' },
                { label: 'IFSC Code', key: 'ifsc', placeholder: 'e.g. HDFC0001234' },
              ].map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label} <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input type="text" className="form-input" placeholder={f.placeholder} value={bankForm[f.key]} onChange={(e) => setBankForm((v) => ({ ...v, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
            <button className="btn-submit-withdraw" onClick={submitBank} style={{ width: '100%', padding: 14, background: 'linear-gradient(145deg, #FF9A60 0%, var(--accent) 50%, #D4520F 100%)', border: 'none', borderRadius: 12, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,101,34,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Withdrawal Request
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Withdrawal Amount <span style={{ color: 'var(--accent)' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 10, overflow: 'hidden' }}>
                <span style={{ padding: '11px 14px', fontSize: 14, fontWeight: 700, color: 'var(--accent)', background: 'rgba(242,101,34,0.08)', borderRight: '0.5px solid rgba(255,255,255,0.09)', flexShrink: 0 }}>₹</span>
                <input type="number" placeholder="Enter amount (min ₹1,500)" min={MIN} max={BALANCE} value={upiForm.amount} onChange={(e) => setUpiForm((f) => ({ ...f, amount: e.target.value }))} style={{ flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#fff', fontFamily: 'var(--font-body)' }} />
                <button onClick={() => setUpiForm((f) => ({ ...f, amount: String(BALANCE) }))} style={{ padding: '0 14px', fontSize: 11, fontWeight: 700, color: 'var(--accent)', background: 'transparent', border: 'none', borderLeft: '0.5px solid rgba(255,255,255,0.09)', minHeight: 44, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>MAX</button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">UPI ID <span style={{ color: 'var(--accent)' }}>*</span></label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: `0.5px solid ${upiForm.verified ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.09)'}`, borderRadius: 10, overflow: 'hidden' }}>
                <input type="text" placeholder="yourname@upi or @okaxis or @ybl" value={upiForm.upiId} onChange={(e) => setUpiForm((f) => ({ ...f, upiId: e.target.value, verified: false }))} style={{ flex: 1, padding: '11px 14px', background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: '#fff', fontFamily: 'var(--font-body)' }} />
                <button onClick={verifyUpi} style={{ padding: '0 16px', background: 'rgba(242,101,34,0.1)', borderLeft: '0.5px solid rgba(255,255,255,0.09)', fontSize: 12, fontWeight: 700, color: 'var(--accent)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'var(--font-body)', minHeight: 44, border: 'none' }}>Verify</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}>
                {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((p) => (
                  <span key={p} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em' }}>{p}</span>
                ))}
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>&amp; more</span>
              </div>
            </div>
            {upiForm.verified && (
              <div className="form-group">
                <label className="form-label">Account Holder Name</label>
                <input type="text" className="form-input" value={upiForm.upiName} disabled />
              </div>
            )}
            <button onClick={submitUpi} style={{ width: '100%', padding: 14, background: 'linear-gradient(145deg, #FF9A60 0%, var(--accent) 50%, #D4520F 100%)', border: 'none', borderRadius: 12, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 4px 20px rgba(242,101,34,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
              <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Withdraw via UPI
            </button>
          </>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: '28px 32px', marginTop: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Recent Transactions
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </div>
        {TRANSACTIONS.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.type === 'bank' ? 'rgba(59,130,246,0.12)' : 'rgba(242,101,34,0.12)', border: `0.5px solid ${t.type === 'bank' ? 'rgba(59,130,246,0.2)' : 'rgba(242,101,34,0.2)'}`, color: t.type === 'bank' ? '#3B82F6' : 'var(--accent)' }}>
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}>
                {t.type === 'bank' ? <><line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="12" height="20" rx="2"/></> : <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 10l2 2 4-4"/></>}
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.title}</div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{t.date}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#22C55E' }}>{t.amount}</div>
              <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', background: t.statusClass === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', border: `0.5px solid ${t.statusClass === 'success' ? 'rgba(34,197,94,0.25)' : 'rgba(59,130,246,0.25)'}`, color: t.statusClass === 'success' ? '#22C55E' : '#3B82F6' }}>{t.status}</span>
            </div>
          </div>
        ))}
      </div>

      <Toast toast={toast} />
    </>
  )
}
