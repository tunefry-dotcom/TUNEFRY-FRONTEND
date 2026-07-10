import { useState } from 'react'

const REFERRALS = [
  { name: 'Arjun Mehra', date: 'Jun 10, 2026', status: 'Active', earned: '₹200' },
  { name: 'Priya Shah', date: 'May 28, 2026', status: 'Pending', earned: '₹0' },
  { name: 'Rohan Das', date: 'Apr 15, 2026', status: 'Active', earned: '₹200' },
]

export default function ReferEarn() {
  const [copied, setCopied] = useState(false)
  const refCode = 'TUNEFRY-VASU2026'

  const copyCode = () => {
    navigator.clipboard?.writeText(refCode)
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

      {/* Hero */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 32, marginBottom: 20, textAlign: 'center', borderColor: 'rgba(242,101,34,0.2)', background: 'linear-gradient(165deg, rgba(242,101,34,0.08) 0%, rgba(255,255,255,0.02) 100%)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Earn ₹200 per referral</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
          Share your unique referral code. Earn ₹200 for every artist who signs up and uploads their first release.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 0, background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 12, overflow: 'hidden' }}>
          <span style={{ padding: '12px 20px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent)' }}>{refCode}</span>
          <button onClick={copyCode} style={{ padding: '12px 18px', background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(242,101,34,0.12)', border: 'none', borderLeft: '0.5px solid rgba(255,255,255,0.09)', color: copied ? '#22C55E' : 'var(--accent)', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied
              ? <><svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2.5 }}><polyline points="20 6 9 17 4 12"/></svg>Copied!</>
              : <><svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: 'currentColor', fill: 'none', strokeWidth: 2 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copy</>
            }
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'Total Referrals', value: '3' },
          { label: 'Active Referrals', value: '2' },
          { label: 'Total Earned', value: '₹400' },
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
              <tr><th>Artist</th><th>Joined</th><th>Status</th><th>Earned</th></tr>
            </thead>
            <tbody>
              {REFERRALS.map((r) => (
                <tr key={r.name}>
                  <td style={{ fontWeight: 600 }}>{r.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{r.date}</td>
                  <td>
                    <span style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11.5, fontWeight: 700, background: r.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(59,130,246,0.1)', border: `0.5px solid ${r.status === 'Active' ? 'rgba(34,197,94,0.25)' : 'rgba(59,130,246,0.25)'}`, color: r.status === 'Active' ? '#22C55E' : '#3B82F6' }}>{r.status}</span>
                  </td>
                  <td style={{ fontWeight: 700, color: r.status === 'Active' ? '#22C55E' : 'var(--text-muted)' }}>{r.earned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
