import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/insta-link.css'

const BASE = 'https://backend1-xzx5.onrender.com'

export default function InstaLink() {
  const navigate = useNavigate()
  const [instagramUrl, setInstagramUrl] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [songName, setSongName] = useState('')
  const [chkInstagram, setChkInstagram] = useState(false)
  const [chkFacebook, setChkFacebook] = useState(false)

  const [instaBorder, setInstaBorder] = useState('')
  const [songBorder, setSongBorder] = useState('')

  const [badgeConnected, setBadgeConnected] = useState(false)
  const [badgeText, setBadgeText] = useState('Not Connected')

  const [toastType, setToastType] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [toastShow, setToastShow] = useState(false)
  const toastTimer = useRef(null)

  function showToast(type, msg) {
    setToastMsg(msg)
    setToastType(type)
    setToastShow(true)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(function () { setToastShow(false) }, 3500)
  }

  function submitLinkRequest() {
    var instaUrl = instagramUrl.trim()
    var song = songName.trim()
    var chkInsta = chkInstagram
    var chkFb = chkFacebook

    if (!instaUrl) {
      setInstaBorder('#3B82F6')
      showToast('error', 'Please enter your Instagram profile URL.')
      return
    }
    if (!song) {
      setSongBorder('#3B82F6')
      showToast('error', 'Please enter the song name.')
      return
    }
    if (!chkInsta && !chkFb) {
      showToast('error', 'Please select at least one platform to link.')
      return
    }

    setInstaBorder('')
    setSongBorder('')

    const fd = new FormData()
    fd.append('instagram_url', instaUrl)
    fd.append('facebook_url', facebookUrl.trim())
    fd.append('song_name', song)
    fd.append('link_instagram', chkInsta ? 'yes' : 'no')
    fd.append('link_facebook', chkFb ? 'yes' : 'no')

    fetch(`${BASE}/submissions/insta-link`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e })))
      .then(() => {
        navigate('/', { state: { successMsg: 'Instagram Link Request' } })
        setInstagramUrl('')
        setFacebookUrl('')
        setSongName('')
        setChkInstagram(false)
        setChkFacebook(false)
        setBadgeConnected(true)
        setBadgeText('Pending Verification')
      })
      .catch((err) => {
        showToast('error', err && err.detail ? err.detail : 'Submission failed. Please try again.')
      })
  }

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
        Account
      </div>
      <div className="page-header">
        <h1 className="page-title">Link Instagram</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Status Card */}
      <div className="glass-card status-card">
        <div className="status-left">
          <div className="insta-icon-wrap">
            {/* Instagram gradient icon */}
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FCAF45"/>
                  <stop offset="30%" stopColor="#F77737"/>
                  <stop offset="60%" stopColor="#F56040"/>
                  <stop offset="80%" stopColor="#C13584"/>
                  <stop offset="100%" stopColor="#833AB4"/>
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#instaGrad)" strokeWidth="1.8" fill="none"/>
              <circle cx="12" cy="12" r="4" stroke="url(#instaGrad)" strokeWidth="1.8" fill="none"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="url(#instaGrad)"/>
            </svg>
          </div>
          <div className="status-info">
            <div className="status-title">Instagram Connection</div>
            <div className="status-desc">Link your Instagram account to show your music on your Instagram profile and get verified artist features.</div>
          </div>
        </div>
        <div className={badgeConnected ? 'connection-badge connected' : 'connection-badge disconnected'} id="connectionBadge">
          <span className="status-dot"></span>
          {badgeText}
        </div>
      </div>

      {/* Instructions Card */}
      <div className="glass-card instructions-card">
        <div className="instructions-title">
          <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          How to Link Your Accounts
        </div>
        <div className="steps-list">
          <div className="step-item">
            <div className="step-number">1</div>
            <div className="step-content">
              <div className="step-heading">Enter your Instagram and/or Facebook profile URL</div>
              <div className="step-detail">Paste the full URL of your artist profile on each platform.</div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">2</div>
            <div className="step-content">
              <div className="step-heading">Enter the song name you want to link</div>
              <div className="step-detail">Type the exact release name as submitted to Tunefry.</div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">3</div>
            <div className="step-content">
              <div className="step-heading">Select which platforms to link</div>
              <div className="step-detail">Choose Instagram, Facebook, or both — at least one is required.</div>
            </div>
          </div>
          <div className="step-item">
            <div className="step-number">4</div>
            <div className="step-content">
              <div className="step-heading">Submit — our team will process the request</div>
              <div className="step-detail">Linking may take up to 24 hours after submission.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Link Form Card */}
      <div className="glass-card link-form-card">
        <div className="link-form-title">Link Your Account</div>

        <div className="form-group">
          <label className="form-label">Instagram URL <span className="req">*</span></label>
          <input type="url" className="form-input" id="instagramUrl" placeholder="https://www.instagram.com/yourprofile/" value={instagramUrl} onChange={(e) => setInstagramUrl(e.target.value)} style={{ borderColor: instaBorder }} />
        </div>

        <div className="form-group">
          <label className="form-label">Facebook URL <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'none', fontWeight: 500 }}>(optional)</span></label>
          <input type="url" className="form-input" id="facebookUrl" placeholder="https://www.facebook.com/yourpage/" value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Song Name <span className="req">*</span></label>
          <input type="text" className="form-input" id="songName" placeholder="Enter song name as submitted" value={songName} onChange={(e) => setSongName(e.target.value)} style={{ borderColor: songBorder }} />
        </div>

        <div className="form-group">
          <label className="form-label">Artist Name</label>
          <input type="text" className="form-input" id="artistName" value="Your Artist Name" readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
        </div>

        <div className="form-group">
          <label className="form-label">Link on Platforms <span className="req">*</span></label>
          <div style={{ display: 'flex', gap: '20px', padding: '4px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" id="chkInstagram" value="instagram" checked={chkInstagram} onChange={(e) => setChkInstagram(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }} /> Instagram
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-primary)', cursor: 'pointer' }}>
              <input type="checkbox" id="chkFacebook" value="facebook" checked={chkFacebook} onChange={(e) => setChkFacebook(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }} /> Facebook
            </label>
          </div>
        </div>

        <div className="verify-note">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>Linking may take up to 24 hours after submission. Make sure your profiles are set to <strong style={{ color: 'var(--text-primary)' }}>Public</strong>.</span>
        </div>

        <button className="btn-verify" onClick={submitLinkRequest}>
          <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Submit Link Request
        </button>
      </div>

      {/* Benefits Section */}
      <div style={{ marginBottom: '8px' }}>
        <div className="benefits-section-title">What you unlock after linking</div>
        <div className="benefits-grid">
          <div className="glass-card benefit-card">
            <div className="benefit-icon" style={{ background: 'rgba(242,101,34,0.12)', border: '0.5px solid rgba(242,101,34,0.22)', color: '#F26522' }}>
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
            </div>
            <div className="benefit-title">Music on Instagram Reels</div>
            <div className="benefit-desc">Your tracks appear in the Instagram music library for Reels and Stories</div>
          </div>
          <div className="glass-card benefit-card">
            <div className="benefit-icon" style={{ background: 'rgba(193,53,132,0.12)', border: '0.5px solid rgba(193,53,132,0.22)', color: '#C13584' }}>
              <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="benefit-title">Verified Badge Connection</div>
            <div className="benefit-desc">Connect your Tunefry artist page to your Instagram verified profile</div>
          </div>
          <div className="glass-card benefit-card">
            <div className="benefit-icon" style={{ background: 'rgba(59,130,246,0.12)', border: '0.5px solid rgba(59,130,246,0.22)', color: '#3B82F6' }}>
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="benefit-title">Reach More Fans</div>
            <div className="benefit-desc">Drive Instagram followers directly to your music on all streaming platforms</div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className={'toast' + (toastType ? ' toast-' + toastType : '') + (toastShow ? ' show' : '')} id="toast">
        <svg id="toastIcon" viewBox="0 0 24 24">
          {toastType === 'success'
            ? <polyline points="20 6 9 17 4 12"/>
            : toastType === 'error'
              ? <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>
              : null}
        </svg>
        <span id="toastMsg">{toastMsg}</span>
      </div>
    </>
  )
}
