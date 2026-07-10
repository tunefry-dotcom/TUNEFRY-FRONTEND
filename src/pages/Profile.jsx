import { useState } from 'react'

export default function Profile() {
  const [form, setForm] = useState({ name: 'Vasu Sharma', email: 'vasu@example.com', phone: '+91 98765 43210', bio: 'Independent artist from Mumbai. Producer. Songwriter.' })
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        Account
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Profile Settings</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={save}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 28, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(242,101,34,0.3) 0%, rgba(242,101,34,0.1) 100%)', border: '2px solid rgba(242,101,34,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)', flexShrink: 0 }}>V</div>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}>{form.name}</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>{form.email}</div>
          <button className="btn btn-sm btn-outline" style={{ marginTop: 10 }}>Upload Photo</button>
        </div>
      </div>

      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 28 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 20, paddingBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>Personal Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {[
            { label: 'Full Name', key: 'name', type: 'text' },
            { label: 'Email Address', key: 'email', type: 'email' },
            { label: 'Phone Number', key: 'phone', type: 'tel' },
          ].map((f) => (
            <div key={f.key} className="form-group" style={{ gridColumn: f.key === 'bio' ? '1 / -1' : undefined }}>
              <label className="form-label">{f.label}</label>
              <input type={f.type} className="form-input" value={form[f.key]} onChange={(e) => setForm((v) => ({ ...v, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Bio</label>
            <textarea className="form-input" rows={3} style={{ resize: 'vertical', minHeight: 80 }} value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} />
          </div>
        </div>
      </div>

      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: 28, marginTop: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 20, paddingBottom: 14, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>Security</div>
        <button className="btn btn-outline">Change Password</button>
      </div>
    </>
  )
}
