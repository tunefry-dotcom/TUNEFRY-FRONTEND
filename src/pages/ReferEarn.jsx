import { useEffect, useState } from 'react'
import { getMyReferrals } from '../lib/referrals'

function money(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

export default function ReferEarn() {
  const [copied, setCopied] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getMyReferrals()
      .then((d) => { if (!cancelled) setData(d) })
      .catch(() => { if (!cancelled) setError('Could not load your referral data. Please refresh.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const refCode = data?.referral_code || ''
  const referralUrl = refCode ? `https://tunefry.com/signup?ref=${refCode}` : ''

  const copyCode = () => {
    if (!referralUrl) return
    navigator.clipboard?.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        Referrals
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Refer &amp; Earn</h1>
      </div>

      {error && (
        <div className="glass-card animate-in" style={{ padding: 20, marginBottom: 20, color: '#f87171' }}>{error}</div>
      )}

      {/* Hero */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 32, marginBottom: 20, textAlign: 'center', borderColor: 'rgba(242,101,34,0.2)', background: 'linear-gradient(165deg, rgba(242,101,34,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Earn 10% on every plan purchase</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Share your unique referral code. Whenever a friend signs up with it and activates a paid plan — now or any time in the future — you get 10% of that plan's price, credited straight to your wallet.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          <span style={{ padding: '12px 20px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)' }}>
            {loading ? 'Loading…' : refCode}
          </span>
          <button onClick={copyCode} disabled={!refCode} style={{ padding: '12px 18px', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(242,101,34,0.12)', border: 'none', borderLeft: '0.5px solid rgba(255,255,255,0.09)', color: copied ? '#22C55E' : 'var(--accent)', fontSize: 12.5, fontWeight: 700, cursor: refCode ? 'pointer' : 'default', fontFamily: 'var(--font-body)', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied
              ? <><svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5 }}><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              : <><svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy Link</>
            }
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Referrals', value: loading ? '—' : String(data?.referred_count ?? 0) },
          { label: 'Total Earned', value: loading ? '—' : money(data?.total_referral_earned) },
        ].map((s) => (
          <div key={s.label} className="glass-card animate-in animate-in-delay-3" style={{ padding: '20px 24px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Referral List */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '0.5px solid rgba(255,255,255,0.07)', fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700 }}>Your Referrals</div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Artist</th><th>Joined</th><th>Plan</th></tr>
            </thead>
            <tbody>
              {!loading && (data?.referrals || []).length === 0 && (
                <tr><td colSpan={3} style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px 0' }}>
                  No referrals yet — share your code to start earning.
                </td></tr>
              )}
              {(data?.referrals || []).map((r) => (
                <tr key={r.email + r.joined_at}>
                  <td style={{ fontWeight: 600 }}>{r.email}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.joined_at ? new Date(r.joined_at).toLocaleDateString() : '—'}</td>
                  <td>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: r.plan === 'free' ? 'rgba(59,130,246,0.1)' : 'rgba(34,197,94,0.1)', border: `0.5px solid ${r.plan === 'free' ? 'rgba(59,130,246,0.25)' : 'rgba(34,197,94,0.25)'}`, color: r.plan === 'free' ? '#3B82F6' : '#22C55E' }}>
                      {r.plan === 'free' ? 'Free' : r.plan}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
