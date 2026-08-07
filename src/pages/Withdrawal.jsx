import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getBalance, getWithdrawalHistory, requestWithdrawal } from '../lib/earnings'

const fmtRs = (n) => (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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

  const [balance, setBalance] = useState(0)
  const [minWithdrawal, setMinWithdrawal] = useState(1500)
  const [eligible, setEligible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [history, setHistory] = useState([])

  const [bankForm, setBankForm] = useState({ name: '', bankName: '', accNo: '', ifsc: '' })
  const [upiForm, setUpiForm] = useState({ upiId: '' })

  const showToast = (type, msg) => {
    clearTimeout(toastTimer.current)
    setToast({ type, msg })
    toastTimer.current = setTimeout(() => setToast(null), 4500)
  }

  const load = useCallback(() => {
    Promise.all([getBalance(), getWithdrawalHistory().catch(() => [])])
      .then(([b, h]) => {
        setBalance(b.available_balance || 0)
        setMinWithdrawal(b.min_withdrawal || 1500)
        setEligible(!!b.eligible)
        setHistory(h || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const submit = async () => {
    if (!eligible) return showToast('error', `Minimum withdrawal amount is ₹${fmtRs(minWithdrawal)}.`)
    let body
    if (tab === 'bank') {
      if (!bankForm.name || !bankForm.accNo || !bankForm.ifsc || !bankForm.bankName) {
        return showToast('error', 'Please fill in all bank details.')
      }
      body = { method: 'bank', account_holder: bankForm.name, bank_name: bankForm.bankName, account_number: bankForm.accNo, ifsc: bankForm.ifsc }
    } else {
      if (!upiForm.upiId || !upiForm.upiId.includes('@')) {
        return showToast('error', 'Please enter a valid UPI ID (e.g. name@upi).')
      }
      body = { method: 'upi', upi_id: upiForm.upiId }
    }
    setSubmitting(true)
    try {
      await requestWithdrawal(body)
      showToast('success', 'Withdrawal request submitted! Our team will process your payout within 14 working days.')
      setBankForm({ name: '', bankName: '', accNo: '', ifsc: '' })
      setUpiForm({ upiId: '' })
      load()
    } catch (e) {
      showToast('error', e.message || 'Withdrawal request failed.')
    } finally {
      setSubmitting(false)
    }
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
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 10vw, 52px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: 'var(--accent)', marginRight: 4 }}>₹</span>{loading ? '…' : fmtRs(balance)}
          </div>
          <div style={{ marginTop: 10, fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 14 }}>
            {eligible ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', color: '#22C55E' }}>
                <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5 }}><polyline points="20 6 9 17 4 12"/></svg>
                Eligible to Withdraw
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 100, fontSize: 11.5, fontWeight: 600, background: 'rgba(234,179,8,0.1)', border: '0.5px solid rgba(234,179,8,0.25)', color: '#EAB308' }}>
                Below minimum
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)' }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Min. withdrawal: <strong style={{ color: 'var(--accent)', fontWeight: 700 }}>₹{fmtRs(minWithdrawal)}</strong>
        </div>
      </div>

      {/* Method Selector */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, paddingBottom: 16, borderBottom: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.8 }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          Withdraw Your Full Balance
        </div>

        {/* Full-balance notice */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 18px', background: 'rgba(242,101,34,0.06)', border: '0.5px solid rgba(242,101,34,0.2)', borderRadius: 12, marginBottom: 18 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>You are withdrawing your entire available balance</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: 'var(--accent)' }}>₹{fmtRs(balance)}</span>
        </div>

        {/* Tax / deduction notice */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '13px 16px', background: 'rgba(234,179,8,0.06)', border: '0.5px solid rgba(234,179,8,0.2)', borderRadius: 10, fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 22 }}>
          <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: '#EAB308', fill: 'none', strokeWidth: 2, flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Applicable <strong style={{ color: 'var(--text-primary)' }}>taxes (TDS)</strong> and platform/processing fees will be deducted from this amount before payout. Payouts are credited within <strong style={{ color: 'var(--text-primary)' }}>14 working days</strong>. Requesting a withdrawal sets your available balance to ₹0 until the next earnings update.</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.09)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {[
            { key: 'bank', label: 'Bank Transfer', icon: <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="12" height="20" rx="2"/></svg> },
            { key: 'upi', label: 'UPI', icon: <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 10l2 2 4-4"/></svg> },
          ].map((t) => (
            <div key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px 16px', flex: 1, borderRadius: 9, fontSize: 13.5, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', border: '0.5px solid transparent', background: tab === t.key ? 'linear-gradient(145deg, rgba(242,101,34,0.18) 0%, rgba(242,101,34,0.08) 100%)' : 'transparent', borderColor: tab === t.key ? 'rgba(242,101,34,0.3)' : 'transparent', color: tab === t.key ? 'var(--accent)' : 'var(--text-secondary)' }}>
              {t.icon}{t.label}
            </div>
          ))}
        </div>

        {tab === 'bank' ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Account Holder Name', key: 'name', placeholder: 'As per bank records' },
                { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. HDFC Bank, SBI' },
                { label: 'Account Number', key: 'accNo', placeholder: 'Enter account number' },
                { label: 'IFSC Code', key: 'ifsc', placeholder: 'e.g. HDFC0001234' },
              ].map((f) => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label} <span style={{ color: 'var(--accent)' }}>*</span></label>
                  <input type="text" className="form-input" placeholder={f.placeholder} value={bankForm[f.key]} onChange={(e) => setBankForm((v) => ({ ...v, [f.key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="form-group">
            <label className="form-label">UPI ID <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input type="text" className="form-input" placeholder="yourname@upi or @okaxis or @ybl" value={upiForm.upiId} onChange={(e) => setUpiForm({ upiId: e.target.value })} />
          </div>
        )}

        <button className="btn-submit-withdraw" disabled={!eligible || submitting} onClick={submit}
          style={{ width: '100%', padding: 14, background: (!eligible || submitting) ? 'rgba(255,255,255,0.08)' : 'linear-gradient(145deg, #FF9A60 0%, var(--accent) 50%, #D4520F 100%)', border: 'none', borderRadius: 12, fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fff', cursor: (!eligible || submitting) ? 'not-allowed' : 'pointer', boxShadow: (!eligible || submitting) ? 'none' : '0 4px 20px rgba(242,101,34,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }}>
          <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {submitting ? 'Submitting…' : `Request Withdrawal of ₹${fmtRs(balance)}`}
        </button>
      </div>

      {/* Transaction History */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: '28px 32px', marginTop: 20 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Payout History</div>
        {history.length === 0 && (
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No withdrawal requests yet.</div>
        )}
        {history.map((t) => {
          const paid = t.status === 'paid'
          return (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.method === 'bank' ? 'rgba(59,130,246,0.12)' : 'rgba(242,101,34,0.12)', border: `0.5px solid ${t.method === 'bank' ? 'rgba(59,130,246,0.2)' : 'rgba(242,101,34,0.2)'}`, color: t.method === 'bank' ? '#3B82F6' : 'var(--accent)' }}>
                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 1.8 }}>
                  {t.method === 'bank' ? <><line x1="3" y1="22" x2="21" y2="22"/><rect x="6" y="2" width="12" height="20" rx="2"/></> : <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M8 10l2 2 4-4"/></>}
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t.method === 'bank' ? 'Bank Transfer' : 'UPI'} withdrawal</div>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>Requested {t.requested_at ? new Date(t.requested_at).toLocaleDateString('en-IN') : ''}{paid && t.processed_at ? ` · Paid ${new Date(t.processed_at).toLocaleDateString('en-IN')}` : ''}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: paid ? '#22C55E' : 'var(--text-primary)' }}>₹{fmtRs(t.amount)}</div>
                <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', background: paid ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)', border: `0.5px solid ${paid ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}`, color: paid ? '#22C55E' : '#EAB308' }}>{paid ? 'Paid' : 'Pending'}</span>
              </div>
            </div>
          )
        })}
      </div>

      <Toast toast={toast} />
    </>
  )
}
