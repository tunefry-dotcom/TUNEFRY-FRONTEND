import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const BASE = 'https://backend1-xzx5.onrender.com'

export default function PitchSong() {
  const { user } = useAuth()
  const location = useLocation()
  const [songs, setSongs] = useState([])
  const [song, setSong] = useState('')

  useEffect(() => {
    if (!user?.id) return
    const uid = user.id
    const pitched = JSON.parse(localStorage.getItem(`tf_pitched_${uid}`) || '[]')
    fetch(`${BASE}/submissions/my`, { credentials: 'include' })
      .then((r) => r.ok ? r.json() : { submissions: [] })
      .then(({ submissions = [] }) => {
        const eligible = submissions.filter((s) =>
          s.status === 'approved' &&
          ['new_song', 'transfer_song'].includes(s.submission_type) &&
          !pitched.includes(s.id)
        )
        setSongs(eligible)
        // Pre-select if navigated from Overview "Apply Now"
        if (location.state?.submissionId) {
          setSong(location.state.submissionId)
        }
      })
      .catch(() => {})
  }, [user?.id, location.state?.submissionId])
  const [releaseDate, setReleaseDate] = useState('')
  const [pitchText, setPitchText] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [checks, setChecks] = useState({ photos: false, videos: false, canvas: false, access: false })
  const [errMsg, setErrMsg] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const toggleCheck = (k) => setChecks((c) => ({ ...c, [k]: !c[k] }))

  const submit = () => {
    if (!song) { setErrMsg('Please select the song you want to pitch.'); return }
    if (!releaseDate) { setErrMsg('Please add the release date for this song.'); return }
    if (pitchText.trim().length < 120) { setErrMsg('Please write a stronger pitch with at least 120 characters.'); return }
    if (!driveLink.startsWith('http')) { setErrMsg('Please paste a valid Google Drive link for the media folder.'); return }
    if (!checks.photos || !checks.videos || !checks.canvas || !checks.access) { setErrMsg('Please confirm all required media checklist items before submitting.'); return }
    setErrMsg('')
    setSubmitting(true)
    // Mark as pitched locally so this song disappears from the pitch list everywhere
    const uid = user?.id || ''
    const pitched = JSON.parse(localStorage.getItem(`tf_pitched_${uid}`) || '[]')
    localStorage.setItem(`tf_pitched_${uid}`, JSON.stringify([...pitched, song]))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, stroke: '#22C55E', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Pitch Request Submitted!</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420, lineHeight: 1.6 }}>Your song, pitch, and Drive link are ready for internal review. We'll be in touch soon.</p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>Back to Overview</Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-label animate-in" style={{ color: '#22C55E' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        Playlist Pitching
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Pitch Your Song</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Info banner */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: '18px 22px', marginBottom: 20, borderColor: 'rgba(34,197,94,0.25)', background: 'linear-gradient(165deg,rgba(34,197,94,0.07),rgba(255,255,255,0.02))' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '0.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Updated Pitch Flow</div>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>This form collects only what your team actually needs: <strong style={{ color: '#fff' }}>the song</strong>, <strong style={{ color: '#fff' }}>a strong written pitch</strong>, and <strong style={{ color: '#fff' }}>one Google Drive link</strong> containing all required photos, videos, and Spotify Canvas assets.</p>
          </div>
        </div>
      </div>

      {/* Step 01 — Song Selection */}
      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 28, marginBottom: 20 }}>
        <div className="pitch-step-badge"><span className="pitch-step-dot" />Step 01</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Song Selection</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div>
            <label className="form-label" style={{ marginBottom: 7 }}>Choose Song <span style={{ color: 'var(--accent)' }}>*</span></label>
            <select className="form-input" value={song} onChange={(e) => setSong(e.target.value)} style={{ colorScheme: 'dark' }}>
              <option value="">Select song for pitching</option>
              {songs.length === 0
                ? <option disabled>No approved songs yet — submit a song first</option>
                : songs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.data?.song_title || '(untitled)'}
                    </option>
                  ))
              }
            </select>
            <p className="pitch-helper-note">Pick the exact unreleased track you want us to pitch.</p>
          </div>
          <div>
            <label className="form-label" style={{ marginBottom: 7 }}>Release Date <span style={{ color: 'var(--accent)' }}>*</span></label>
            <input type="date" className="form-input" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} style={{ colorScheme: 'dark' }} />
            <p className="pitch-helper-note">Recommended pitching window: 7 to 28 days before release.</p>
          </div>
        </div>
      </div>

      {/* Step 02 — Your Pitch */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 28, marginBottom: 20 }}>
        <div className="pitch-step-badge"><span className="pitch-step-dot" />Step 02</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Your Pitch</div>
        <div className="pitch-guide-card">
          <div className="pitch-guide-title">
            <span className="pitch-guide-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" /></svg>
            </span>
            Write a curator-friendly story
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>Tell the story behind the song in a clear, human way. Mention the emotion, artist story, theme, sound, and where the track fits. Avoid one-line promo copy. Write it like a strong editorial pitch.</p>
        </div>
        <div className="pitch-highlight">
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#F26522', marginBottom: 8 }}>Example Pitch</div>
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>"Midnight Echoes" is a late-night Hindi pop record built around heartbreak, reflection, and quiet confidence. The production stays cinematic and modern, with airy synths, intimate vocals, and a hook designed to stay with the listener after the first play. The song works especially well for emotional pop, late-night drive, heartbreak, and mood playlists.</p>
        </div>
        <div className="form-group">
          <label className="form-label">Write Your Pitch <span style={{ color: 'var(--accent)' }}>*</span></label>
          <textarea className="form-input" rows={6} placeholder="Write the final pitch text here. Mention the artist, song story, emotion, sound, and which kind of playlists or listeners it fits." value={pitchText} onChange={(e) => setPitchText(e.target.value)} style={{ resize: 'vertical' }} />
          <div className="pitch-char-count">
            <span style={{ color: pitchText.trim().length > 0 && pitchText.trim().length < 120 ? '#EAB308' : 'inherit' }}>{pitchText.trim().length}</span> characters
            {pitchText.trim().length > 0 && pitchText.trim().length < 120 && <span style={{ color: '#EAB308' }}> (min 120)</span>}
          </div>
        </div>
        <div className="pitch-tip-grid">
          <div className="pitch-tip-card"><strong>Include the story</strong><span>Why was the song made, and what should a curator feel while listening?</span></div>
          <div className="pitch-tip-card"><strong>Describe the sound</strong><span>Call out genre, vibe, instrumentation, or energy in plain language.</span></div>
          <div className="pitch-tip-card"><strong>Name the fit</strong><span>Say what listeners or playlist moments this record is best for.</span></div>
        </div>
      </div>

      {/* Step 03 — Artist Media Requirements */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: 28, marginBottom: 20 }}>
        <div className="pitch-step-badge"><span className="pitch-step-dot" />Step 03</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Artist Media Requirements</div>
        <div className="pitch-drive-box">
          <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>Instead of uploading heavy files on the website, ask the artist to place everything in <strong style={{ color: '#fff' }}>one shareable Google Drive folder</strong>. Your team can directly download from there, keeping this page lightweight and avoiding server load.</p>
        </div>
        <div className="pitch-req-grid">
          <div className="pitch-req-card">
            <div className="pitch-req-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
            </div>
            <h3>4 HD / 4K Photos</h3>
            <p>Clear artist photos for pitching and platform support.</p>
            <ul className="pitch-req-list">
              <li>Total 4 photos required.</li>
              <li>Front-facing shots only.</li>
              <li>At least 90% face visibility.</li>
              <li>No side-view or heavily covered face shots.</li>
            </ul>
          </div>
          <div className="pitch-req-card">
            <div className="pitch-req-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
            </div>
            <h3>4 to 5 Video Samples</h3>
            <p>Artist introduces themselves, their song, and platform mentions on camera.</p>
            <ul className="pitch-req-list">
              <li>Total 4 to 5 short videos.</li>
              <li>Mention artist name and song name.</li>
              <li>Mention target platforms where needed.</li>
            </ul>
          </div>
          <div className="pitch-req-card">
            <div className="pitch-req-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round"><path d="M21 15V6a2 2 0 00-2-2H8" /><rect x="3" y="8" width="13" height="13" rx="2" /><path d="M10 12l3 2-3 2v-4z" /></svg>
            </div>
            <h3>Spotify Canvas</h3>
            <p>One vertical looping visual for Spotify.</p>
            <ul className="pitch-req-list">
              <li>Duration: 7 to 9 seconds max.</li>
              <li>Format: 9:16 vertical.</li>
              <li>Clean, branded, and ready to publish.</li>
            </ul>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Google Drive Link <span style={{ color: 'var(--accent)' }}>*</span></label>
          <input type="url" className="form-input" placeholder="Paste the shareable Drive folder link here" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />
          <p className="pitch-helper-note">Make sure the folder permission is set so the Tunefry team can open and download files.</p>
        </div>
        <div className="pitch-check-grid">
          {[
            { k: 'photos', label: 'I confirm the Drive folder includes 4 front-facing HD / 4K artist photos with strong face visibility.' },
            { k: 'videos', label: 'I confirm the Drive folder includes 4 to 5 artist video samples mentioning the artist, song, or relevant platforms.' },
            { k: 'canvas', label: 'I confirm the folder includes one Spotify Canvas in 9:16 format and 7 to 9 seconds duration.' },
            { k: 'access', label: 'I confirm the Google Drive link is accessible for direct review and download by the Tunefry team.' },
          ].map(({ k, label }) => (
            <label key={k} className="pitch-check-item">
              <input type="checkbox" checked={checks[k]} onChange={() => toggleCheck(k)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="animate-in animate-in-delay-5" style={{ marginBottom: 40 }}>
        {errMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '0.5px solid rgba(59,130,246,0.3)', fontSize: 12.5, color: '#60a5fa', marginBottom: 14 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {errMsg}
          </div>
        )}
        <button className="pitch-submit-btn" onClick={submit} disabled={submitting}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle' }}><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          {submitting ? 'Submitting…' : 'Submit Pitch Request'}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.6 }}>Once submitted, your team gets the written pitch plus the Drive handoff link in one place.</p>
      </div>
    </>
  )
}
