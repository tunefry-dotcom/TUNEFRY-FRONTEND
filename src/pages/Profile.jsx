import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getProfile, updateProfile } from '../lib/profile'
import '../styles/profile.css'

function Toast({ toast }) {
  return (
    <div className={`pf-toast${toast.show ? ' show' : ''}${toast.type ? ' ' + toast.type : ''}`}>
      {toast.type === 'success'
        ? <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      }
      <span>{toast.msg}</span>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const fileRef = useRef(null)
  const [photoSrc, setPhotoSrc] = useState(null)
  const [toast, setToast] = useState({ show: false, type: '', msg: '' })
  const [saving, setSaving] = useState(false)

  // Set when the user was sent here from an upgrade attempt with an incomplete profile.
  const fromUpgrade = location.state?.from === 'upgrade'
  const upgradePlan = location.state?.plan

  const [form, setForm] = useState({
    fullName: '', artistName: '', email: '', phone: '', dob: '',
    gender: '', city: '', state: '', bio: '', spotify: '', instagram: '', youtube: '',
  })

  const [errors, setErrors] = useState({})

  // Load the real profile on mount; seed email from the auth user.
  useEffect(() => {
    let active = true
    getProfile()
      .then((p) => {
        if (!active) return
        setForm((f) => ({
          ...f,
          fullName: p.full_name || '',
          artistName: p.artist_name || '',
          email: user?.email || '',
          phone: p.phone || '',
          dob: p.date_of_birth || '',
          gender: p.gender || '',
          city: p.city || '',
          state: p.state || '',
          bio: p.bio || '',
          spotify: p.spotify_url || '',
          instagram: p.instagram || '',
          youtube: p.youtube_url || '',
        }))
      })
      .catch(() => setForm((f) => ({ ...f, email: user?.email || '' })))
    return () => { active = false }
  }, [user?.id, user?.email])

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { showToast('error', 'File too large. Max 5MB.'); return }
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoSrc(ev.target.result)
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    const requiredMap = { fullName: 'full_name', artistName: 'artist_name', phone: 'phone', city: 'city', state: 'state', dob: 'date_of_birth' }
    const newErrors = {}
    Object.keys(requiredMap).forEach(k => { if (!form[k]?.trim()) newErrors[k] = true })
    setErrors(newErrors)
    if (Object.keys(newErrors).length) {
      showToast('error', 'Please fill in all required fields.')
      return
    }
    setSaving(true)
    try {
      const saved = await updateProfile({
        full_name: form.fullName,
        artist_name: form.artistName,
        phone: form.phone,
        date_of_birth: form.dob,
        gender: form.gender,
        city: form.city,
        state: form.state,
        bio: form.bio,
        spotify_url: form.spotify,
        instagram: form.instagram,
        youtube_url: form.youtube,
      })
      showToast('success', 'Profile saved successfully!')
      if (fromUpgrade && saved.is_complete) {
        setTimeout(() => navigate('/plan', { state: { plan: upgradePlan } }), 1200)
      }
    } catch (err) {
      showToast('error', err.message || 'Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }))
    setErrors(er => ({ ...er, [k]: false }))
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Account
      </div>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {fromUpgrade && (
        <div className="pf-upgrade-banner">
          <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Complete your basic details below to continue to payment.
        </div>
      )}

      <div className="profile-columns">
        {/* ── LEFT: FORM ── */}
        <div className="glass-card profile-form-card">
          {/* Photo */}
          <div className="profile-photo-wrap">
            <div className="profile-photo-circle" onClick={() => fileRef.current?.click()}>
              {photoSrc
                ? <img src={photoSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                : <span>V</span>
              }
              <div className="profile-photo-overlay">
                <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span>Upload Photo</span>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
            <span className="photo-hint">Click to upload · JPG, PNG, WebP · Max 5MB</span>
          </div>

          {/* Full Name / Artist Name */}
          <div className="pf-form-row">
            <div className="pf-form-group">
              <label className="pf-form-label">Full Name</label>
              <input type="text" className={`pf-form-input${errors.fullName ? ' input-error' : ''}`} value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
            </div>
            <div className="pf-form-group">
              <label className="pf-form-label">Artist / Stage Name</label>
              <input type="text" className={`pf-form-input${errors.artistName ? ' input-error' : ''}`} value={form.artistName} onChange={set('artistName')} placeholder="Stage name" />
            </div>
          </div>

          {/* Email / Phone */}
          <div className="pf-form-row">
            <div className="pf-form-group">
              <label className="pf-form-label">Email Address</label>
              <input type="email" className="pf-form-input" value={form.email} disabled />
            </div>
            <div className="pf-form-group">
              <label className="pf-form-label">Phone Number</label>
              <input type="tel" className={`pf-form-input${errors.phone ? ' input-error' : ''}`} value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>

          {/* DOB / Gender */}
          <div className="pf-form-row">
            <div className="pf-form-group">
              <label className="pf-form-label">Date of Birth</label>
              <input type="date" className={`pf-form-input${errors.dob ? ' input-error' : ''}`} value={form.dob} onChange={set('dob')} />
            </div>
            <div className="pf-form-group">
              <label className="pf-form-label">Gender</label>
              <select className="pf-form-input" value={form.gender} onChange={set('gender')}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="nonbinary">Non-binary</option>
                <option value="prefer-not">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* City / State */}
          <div className="pf-form-row">
            <div className="pf-form-group">
              <label className="pf-form-label">City</label>
              <input type="text" className={`pf-form-input${errors.city ? ' input-error' : ''}`} value={form.city} onChange={set('city')} placeholder="Your city" />
            </div>
            <div className="pf-form-group">
              <label className="pf-form-label">State</label>
              <input type="text" className={`pf-form-input${errors.state ? ' input-error' : ''}`} value={form.state} onChange={set('state')} placeholder="Your state" />
            </div>
          </div>

          {/* Bio */}
          <div className="pf-form-group">
            <label className="pf-form-label">Bio / About</label>
            <textarea className="pf-form-input" rows={4} value={form.bio} onChange={set('bio')} placeholder="Tell your fans about yourself..." />
          </div>

          <div className="pf-divider" />
          <div className="pf-section-heading">Social Links</div>

          {/* Spotify */}
          <div className="pf-form-group">
            <label className="pf-form-label">Spotify Profile URL</label>
            <input type="url" className="pf-form-input" value={form.spotify} onChange={set('spotify')} placeholder="https://open.spotify.com/artist/..." />
          </div>

          {/* Instagram */}
          <div className="pf-form-group">
            <label className="pf-form-label">Instagram Handle</label>
            <div className="pf-social-prefix">
              <span className="pf-social-prefix-label">@</span>
              <input type="text" className="pf-form-input" value={form.instagram} onChange={set('instagram')} placeholder="yourhandle" />
            </div>
          </div>

          {/* YouTube */}
          <div className="pf-form-group" style={{ marginBottom: 24 }}>
            <label className="pf-form-label">YouTube Channel URL</label>
            <input type="url" className="pf-form-input" value={form.youtube} onChange={set('youtube')} placeholder="https://youtube.com/@..." />
          </div>

          <button className="btn-save" onClick={saveProfile} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="pf-right-col">
          {/* Account Info */}
          <div className="glass-card pf-info-card">
            <div className="pf-info-card-title">Account Info</div>
            <div className="pf-info-row">
              <span className="pf-info-row-label">Member Since</span>
              <span className="pf-info-row-value">January 2024</span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-row-label">Current Plan</span>
              <span className="pf-plan-badge">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                {user?.planName || 'Free'}
              </span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-row-label">Account Status</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#22C55E' }}>
                <span className="pf-active-dot" />
                Active
              </span>
            </div>
            <div className="pf-info-row">
              <span className="pf-info-row-label">Account ID</span>
              <span className="pf-account-id">TFY-2024-00847</span>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-card pf-danger-card">
            <div className="pf-danger-title">Danger Zone</div>
            <div className="pf-danger-desc">Permanently delete your account and all associated data. This action cannot be undone.</div>
            <button className="pf-btn-danger-disabled" disabled>Delete Account</button>
            <div className="pf-danger-note">To delete your account, contact support@tunefry.com</div>
          </div>

          {/* Quick Links */}
          <div className="glass-card pf-quicklinks-card">
            <div className="pf-quicklinks-title">Quick Links</div>
            <Link to="/plan" className="pf-quicklink-item">
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Current Plan
            </Link>
            <Link to="/help" className="pf-quicklink-item">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Help Center
            </Link>
            <Link to="/instalink" className="pf-quicklink-item">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
              Link Instagram
            </Link>
            <Link to="/claim-removal" className="pf-quicklink-item">
              <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Claim Removal
            </Link>
          </div>
        </div>
      </div>

      {/* ── LOGOUT ── */}
      <div className="pf-logout-wrap">
        <button className="pf-btn-logout" onClick={handleLogout}>
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Log Out
        </button>
      </div>

      <Toast toast={toast} />
    </>
  )
}
