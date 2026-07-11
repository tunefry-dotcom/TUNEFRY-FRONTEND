import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/profile-mismatch.css';

const BASE = 'https://backend1-xzx5.onrender.com'

export default function ProfileMismatch() {
  const [profileAction, setProfileAction] = useState('');
  const [errText, setErrText] = useState('Please fill in all required fields.');
  const [errVisible, setErrVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const [sectionName, setSectionName] = useState('');
  const [sectionLink, setSectionLink] = useState('');
  const [platform, setPlatform] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [existingProfileLink, setExistingProfileLink] = useState('');

  const showProfileAction = (type) => {
    setProfileAction(type);
  };

  const clearErr = () => setErrVisible(false);

  const submitForm = (e) => {
    e.preventDefault();
    const missing = [];

    if (!sectionName.trim()) missing.push('Name of Section');
    if (!sectionLink.trim()) missing.push('Link of Section');
    if (!platform) missing.push('Platform');
    if (!profileAction) {
      missing.push('Profile Action');
    } else if (profileAction === 'new') {
      if (!newProfileName.trim()) missing.push('Artist / Profile Name');
    } else if (profileAction === 'existing') {
      if (!existingProfileLink.trim()) missing.push('Existing Profile Link');
    }

    if (missing.length) {
      setErrText('Please fill in: ' + missing.join(', '));
      setErrVisible(true);
      return;
    }
    setErrVisible(false);
    setSubmitting(true);

    const fd = new FormData();
    fd.append('section_name', sectionName.trim());
    fd.append('section_link', sectionLink.trim());
    fd.append('platform', platform);
    fd.append('profile_action', profileAction);
    fd.append('new_profile_name', newProfileName.trim());
    fd.append('existing_profile_link', existingProfileLink.trim());

    fetch(`${BASE}/submissions/profile-mismatch`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e; })))
      .then(() => {
        setSubmitting(false);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 4000);
        setSectionName('');
        setSectionLink('');
        setPlatform('');
        setProfileAction('');
        setNewProfileName('');
        setExistingProfileLink('');
      })
      .catch((err) => {
        setSubmitting(false);
        setErrText(err && err.detail ? err.detail : 'Submission failed. Please try again.');
        setErrVisible(true);
      });
  };

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
        Support
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Profile Mismatch</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Info banner */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: '20px 22px', marginBottom: '20px', borderColor: 'rgba(234,179,8,0.25)', background: 'linear-gradient(165deg,rgba(234,179,8,0.07),rgba(255,255,255,0.02))' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(234,179,8,0.15)', border: '0.5px solid rgba(234,179,8,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, marginBottom: '5px' }}>What is a Profile Mismatch?</div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>A profile mismatch occurs when the artist name on a streaming platform doesn't match your Tunefry account. This can prevent proper royalty attribution and profile verification. Fill in the form below and our team will investigate and resolve it within <strong style={{ color: '#fff' }}>5–7 working days.</strong></p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: '28px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700, marginBottom: '22px' }}>Submit Mismatch Report</div>

        <form onSubmit={submitForm} noValidate>

          <div className="fg">
            <label className="lbl" htmlFor="sectionName">Name of Section <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input id="sectionName" type="text" name="section_name" className="inp" placeholder="e.g. Midnight Echoes" required value={sectionName} onChange={(e) => { setSectionName(e.target.value); clearErr(); }} onFocus={(e) => { e.target.style.borderColor = 'rgba(242,101,34,0.6)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }} />
          </div>

          <div className="fg">
            <label className="lbl" htmlFor="sectionLink">Link of Section <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input id="sectionLink" type="url" name="section_link" className="inp" placeholder="https://..." required value={sectionLink} onChange={(e) => { setSectionLink(e.target.value); clearErr(); }} onFocus={(e) => { e.target.style.borderColor = 'rgba(242,101,34,0.6)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }} />
          </div>

          <div className="fg">
            <label className="lbl" htmlFor="platform">Select Platform <span style={{ color: 'var(--accent)' }}>*</span></label>
            <select id="platform" name="platform" className="inp" required value={platform} onChange={(e) => { setPlatform(e.target.value); clearErr(); }} style={{ appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
              <option value="" disabled style={{ background: '#1a1a1a' }}>Select a platform…</option>
              <option value="spotify" style={{ background: '#1a1a1a' }}>Spotify</option>
              <option value="apple" style={{ background: '#1a1a1a' }}>Apple Music</option>
            </select>
          </div>

          <div className="fg">
            <label className="lbl">Profile Action <span style={{ color: 'var(--accent)' }}>*</span></label>
            <div className="radio-group">
              <label className="radio-opt" onClick={() => showProfileAction('new')}>
                <input type="radio" name="profileAction" value="new" id="radioNew" checked={profileAction === 'new'} onChange={() => showProfileAction('new')} />
                <span>Create new profile</span>
              </label>
              <label className="radio-opt" onClick={() => showProfileAction('existing')}>
                <input type="radio" name="profileAction" value="existing" id="radioExisting" checked={profileAction === 'existing'} onChange={() => showProfileAction('existing')} />
                <span>Link to existing one</span>
              </label>
            </div>
          </div>

          {/* Create new profile fields */}
          <div id="newProfileFields" style={{ display: profileAction === 'new' ? 'block' : 'none' }}>
            <div className="fg">
              <label className="lbl" htmlFor="newProfileName">Artist / Profile Name <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input id="newProfileName" type="text" name="new_profile_name" className="inp" placeholder="e.g. Vasu Sharma" required={profileAction === 'new'} value={newProfileName} onChange={(e) => { setNewProfileName(e.target.value); clearErr(); }} onFocus={(e) => { e.target.style.borderColor = 'rgba(242,101,34,0.6)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }} />
              <div style={{ marginTop: '8px', padding: '10px 13px', borderRadius: '9px', background: 'rgba(234,179,8,0.07)', border: '0.5px solid rgba(234,179,8,0.2)', fontSize: '11.5px', color: 'rgba(234,179,8,0.85)', lineHeight: 1.6 }}>
                <strong style={{ color: '#EAB308' }}>T&amp;C:</strong> The name entered here must match exactly with what is written on your cover artwork — same spelling, same capitalisation, same formatting. Inconsistencies may result in rejection or delayed processing.
              </div>
            </div>
          </div>

          {/* Link to existing profile fields */}
          <div id="existingProfileFields" style={{ display: profileAction === 'existing' ? 'block' : 'none' }}>
            <div className="fg">
              <label className="lbl" htmlFor="existingProfileLink">Existing Profile Link <span style={{ color: 'var(--accent)' }}>*</span></label>
              <input id="existingProfileLink" type="url" name="existing_profile_link" className="inp" placeholder="https://open.spotify.com/artist/..." required={profileAction === 'existing'} value={existingProfileLink} onChange={(e) => { setExistingProfileLink(e.target.value); clearErr(); }} onFocus={(e) => { e.target.style.borderColor = 'rgba(242,101,34,0.6)'; }} onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }} />
            </div>
          </div>

          <div id="errBox" style={{ display: errVisible ? 'flex' : 'none', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.3)', fontSize: '12.5px', color: '#60a5fa', marginBottom: '14px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span id="errText">{errText}</span>
          </div>

          <button type="submit" className="submit-btn" disabled={submitting} style={submitting ? { opacity: 0.7 } : { opacity: 1 }}>{submitting ? 'Submitting…' : 'Submit'}</button>
          <p style={{ textAlign: 'center', fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '10px' }}>We'll review your request and respond within 3–5 business days.</p>

        </form>
      </div>

      <div id="toast" style={{ position: 'fixed', bottom: '28px', right: '28px', background: 'rgba(18,14,10,0.97)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 9999, opacity: toastVisible ? 1 : 0, transform: toastVisible ? 'translateY(0)' : 'translateY(10px)', transition: 'opacity .3s,transform .3s', pointerEvents: 'none', maxWidth: '320px' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
        <div><div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: 700 }}>Report Submitted!</div><div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Our team will resolve this within 5–7 working days.</div></div>
      </div>
    </>
  );
}
