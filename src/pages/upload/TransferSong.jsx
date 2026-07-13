import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/transfer-song.css'
import { useAuth } from '../../context/AuthContext'

const BASE = 'https://backend1-xzx5.onrender.com'

const PLAN_MAX_ARTISTS = { free: 1, starter: 1, single_artist: 1, double_artist: 2, label: 5 }
const planMaxArtists = (plan) => PLAN_MAX_ARTISTS[plan] ?? 1

const SUB_CATEGORIES = {
  'Hip-Hop/Rap': ['Alternative Hip-Hop', 'Conscious Hip-Hop', 'Country Rap', 'Emo Rap', 'Jazz Rap', 'Hip-Hop', 'Pop Rap', 'Trap'],
  'Devotional': ['Aarti', 'Bhajan', 'Carol', 'Chalisa', 'Chant', 'Geet', 'Gospel', 'Gurbani', 'Kirtan', 'Mantra', 'Paath', 'Islamic'],
  'Ambient / Instrumental': ['Instrumental', 'Soft', 'Easy Listening'],
  'Pop': ['Acoustic Pop', 'Band Songs', 'Chill Pop', 'Contemporary Pop', 'Country Pop / Regional Pop', 'Dance Pop', 'Electro Pop', 'Lo-Fi Pop', 'Love Songs', 'Pop Rap', 'Sad Songs', 'Soft Pop'],
  'Hindustani Classical': [], 'Carnatic Classical': [], 'Film': [], 'Indie': [], 'Folk': [], 'Childrens Music': [], 'Jazz': []
}

export default function TransferSong() {
  const { user } = useAuth()
  const maxArtists = planMaxArtists(user?.plan)

  // Simple text/select field values (mirrors the original DOM element ids)
  const [upcCode, setUpcCode] = useState('')
  const [isrcCode, setIsrcCode] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [ytBeat, setYtBeat] = useState('')
  const [explicit, setExplicit] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [language, setLanguage] = useState('')
  const [mood, setMood] = useState('')
  const [originalDate, setOriginalDate] = useState('')
  const [goLiveDate, setGoLiveDate] = useState('')
  const [ytContentId, setYtContentId] = useState('')

  // Credits / callertune / comments (unbound in the original, kept as local state)
  const [producer, setProducer] = useState('')
  const [composer, setComposer] = useState('')
  const [lyricist, setLyricist] = useState('')
  const [callertuneName, setCallertuneName] = useState('')
  const [callertuneTiming, setCallertuneTiming] = useState('')
  const [comments, setComments] = useState('')

  // Artists — each row keeps the exact field set produced by the original addArtist()
  const [mainArtists, setMainArtists] = useState([{ name: '', spotify: '', apple_music: '', instagram: '' }])
  const [featuredArtists, setFeaturedArtists] = useState([])

  // File selections
  const [coverArtName, setCoverArtName] = useState('')
  const [audioFileName, setAudioFileName] = useState('')
  const coverInputRef = useRef(null)
  const audioInputRef = useRef(null)

  // Validation error markers, per field id
  const [errors, setErrors] = useState({})
  const [checkError, setCheckError] = useState(false)
  const [guidelinesCheck, setGuidelinesCheck] = useState(false)
  const [termsCheck, setTermsCheck] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const errorStyle = { borderColor: 'rgba(239,68,68,.6)', boxShadow: '0 0 0 3px rgba(239,68,68,.12)' }
  const markStyle = (id) => (errors[id] ? errorStyle : undefined)

  // addArtist('mainArtists', false) / addArtist('featuredArtists', true)
  const addArtist = (isFeatured) => {
    if (isFeatured) {
      setFeaturedArtists((prev) => [...prev, { name: '', spotify: '', apple_music: '' }])
    } else {
      setMainArtists((prev) => [...prev, { name: '', spotify: '', apple_music: '', instagram: '' }])
    }
  }
  const removeMainArtist = (i) => setMainArtists((prev) => prev.filter((_, idx) => idx !== i))
  const removeFeaturedArtist = (i) => setFeaturedArtists((prev) => prev.filter((_, idx) => idx !== i))

  const updateMainArtist = (i, key, value) =>
    setMainArtists((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)))
  const updateFeaturedArtist = (i, key, value) =>
    setFeaturedArtists((prev) => prev.map((a, idx) => (idx === i ? { ...a, [key]: value } : a)))

  // updateSubCategory() — resets sub-category when the category changes
  const onCategoryChange = (value) => {
    setCategory(value)
    setSubCategory('')
  }
  const subs = SUB_CATEGORIES[category] || []

  const handleFileSelect = (input, setter) => {
    if (input.files && input.files[0]) {
      setter(input.files[0].name)
    }
  }

  // submitTransferSong()
  const submitTransferSong = () => {
    const values = {
      upcCode, isrcCode, songTitle, ytBeat, explicit,
      category, originalDate, goLiveDate, ytContentId,
    }
    const required = [
      { id: 'upcCode', label: 'UPC Code' },
      { id: 'isrcCode', label: 'ISRC No.' },
      { id: 'songTitle', label: 'Title' },
      { id: 'ytBeat', label: 'YouTube Beat/Music' },
      { id: 'explicit', label: 'Explicit' },
      { id: 'category', label: 'Category' },
      { id: 'originalDate', label: 'Original Release Date' },
      { id: 'goLiveDate', label: 'Go Live Date' },
      { id: 'ytContentId', label: 'YouTube Content ID' },
    ]
    const newErrors = {}
    let bad = false
    required.forEach((r) => {
      const v = values[r.id]
      if (!v || !v.trim()) {
        newErrors[r.id] = true
        bad = true
      }
    })
    // Validate first main artist name
    if (mainArtists[0] && !mainArtists[0].name.trim()) {
      newErrors.mainArtist0 = true
      bad = true
    }
    setErrors(newErrors)
    if (bad) return

    if (!guidelinesCheck || !termsCheck) {
      setCheckError(true)
      setTimeout(() => setCheckError(false), 2300)
      return
    }

    setSubmitting(true)

    // Collect artists
    const mainArtistsPayload = mainArtists.map((a) => ({
      name: a.name.trim(),
      spotify: a.spotify.trim(),
      apple_music: a.apple_music.trim(),
      instagram: a.instagram.trim(),
    }))
    const featuredArtistsPayload = featuredArtists.map((a) => ({
      name: a.name.trim(),
      spotify: a.spotify.trim(),
      apple_music: a.apple_music.trim(),
    }))

    const fd = new FormData()
    fd.append('upc_code', upcCode.trim())
    fd.append('isrc_code', isrcCode.trim())
    fd.append('song_title', songTitle.trim())
    fd.append('yt_beat', ytBeat)
    fd.append('explicit', explicit)
    fd.append('category', category)
    fd.append('sub_category', subCategory)
    fd.append('language', language)
    fd.append('mood', mood)
    fd.append('original_release_date', originalDate)
    fd.append('go_live_date', goLiveDate)
    fd.append('yt_content_id', ytContentId)
    fd.append('main_artists', JSON.stringify(mainArtistsPayload))
    fd.append('featured_artists', JSON.stringify(featuredArtistsPayload))
    const coverFileEl = coverInputRef.current
    if (coverFileEl && coverFileEl.files[0]) fd.append('cover_art', coverFileEl.files[0])
    const audioFileEl = audioInputRef.current
    if (audioFileEl && audioFileEl.files[0]) fd.append('audio_file', audioFileEl.files[0])

    /* ===== BACKEND CONTRACT =========================================
     * POST /api/release/song/transfer
     * Content-Type: multipart/form-data  (set automatically by browser)
     * Auth: session cookie (credentials: 'include')
     *
     * Text fields: upc_code, isrc_code, song_title, yt_beat (yes|no),
     *   explicit (yes|no), category, sub_category, language, mood,
     *   original_release_date, go_live_date, yt_content_id (yes|no)
     * JSON-encoded text fields:
     *   main_artists      = [{name, spotify, apple_music, instagram}]
     *   featured_artists  = [{name, spotify, apple_music}]
     * File fields:
     *   cover_art   (image/jpeg|image/png, required)
     *   audio_file  (.wav/.mp3/.flac, required)
     *
     * Expected response:
     *   2xx -> { ok: true, transfer_id: string }
     *   4xx/5xx -> { message: string }
     * ================================================================ */
    fd.append('submission_type', 'transfer_song')
    fetch(`${BASE}/submissions/song`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e })))
      .then(() => {
        if (user?.plan === 'single-song') {
          try { localStorage.setItem(`tf_single_used_${user.id}`, '1') } catch { /* private */ }
        }
        setToastVisible(true)
        setSubmitting(false)
        setTimeout(() => {
          setToastVisible(false)
        }, 4200)
      })
      .catch((err) => {
        alert(err && err.message ? err.message : 'Submission failed. Please try again.')
        setSubmitting(false)
      })
  }

  const checkCardStyle = checkError
    ? { borderColor: 'rgba(239,68,68,.45)', background: 'rgba(239,68,68,.06)' }
    : undefined

  return (
    <>
      <div className="page-label animate-in"><svg viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>Releases</div>
      <div className="page-header animate-in animate-in-delay-1">
        <div><h1 className="page-title">Transfer Existing Song</h1><p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Move a released song from another distributor without losing momentum.</p></div>
        <div className="page-header-actions"><Link to="/" className="btn btn-outline">&#8592; Overview</Link></div>
      </div>

      <Link to="/submission-rules" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', background: 'rgba(242,101,34,0.07)', border: '0.5px solid rgba(242,101,34,0.22)', borderLeft: '3px solid #F26522', borderRadius: '12px', marginBottom: '20px', textDecoration: 'none', transition: 'background .2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.11)' }} onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.07)' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', flex: 1 }}>Before submitting, please review our <strong style={{ color: 'var(--accent)' }}>Submission Rules &amp; Terms of Service</strong> — including processing timelines, content policies, and artist responsibilities.</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,101,34,0.6)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </Link>

      {/* Step 01: Identifiers */}
      <div className="glass-card transfer-section animate-in animate-in-delay-2">
        <div className="section-eyebrow">Step 01</div>
        <div className="section-heading">Transfer Identifiers</div>
        <div className="transfer-note">Provide your UPC and ISRC codes from your previous distributor. These preserve your existing streams, chart positions and playlist placements.</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">UPC Code <span className="req">*</span></label>
            <input className="form-input" id="upcCode" name="upc_code" type="text" placeholder="Enter UPC code" required value={upcCode} onChange={(e) => setUpcCode(e.target.value)} style={markStyle('upcCode')} />
          </div>
          <div className="form-group">
            <label className="form-label">ISRC No. <span className="req">*</span></label>
            <input className="form-input" id="isrcCode" name="isrc_code" type="text" placeholder="Enter ISRC no" required value={isrcCode} onChange={(e) => setIsrcCode(e.target.value)} style={markStyle('isrcCode')} />
          </div>
        </div>
      </div>

      {/* Step 02: Basic Information */}
      <div className="glass-card transfer-section animate-in animate-in-delay-2">
        <div className="section-eyebrow">Step 02</div>
        <div className="section-heading">Basic Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Title <span className="req">*</span></label>
            <input className="form-input" id="songTitle" name="song_title" type="text" placeholder="Enter track title" required value={songTitle} onChange={(e) => setSongTitle(e.target.value)} style={markStyle('songTitle')} />
          </div>
          <div className="form-group">
            <label className="form-label">YouTube Beat / Music? <span className="req">*</span></label>
            <select className="form-input" id="ytBeat" name="yt_beat" value={ytBeat} onChange={(e) => setYtBeat(e.target.value)} style={markStyle('ytBeat')}>
              <option value="" disabled>Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Artists */}
      <div className="glass-card transfer-section animate-in animate-in-delay-2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="section-eyebrow">Artists</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Main Artists <span className="req">*</span></div>
          </div>
          <button type="button" className="add-artist-btn" onClick={() => addArtist(false)}
            disabled={mainArtists.length >= maxArtists}
            title={mainArtists.length >= maxArtists ? `Your plan allows ${maxArtists} main artist(s). Upgrade to add more.` : undefined}>
            <svg viewBox="0 0 24 24" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Artist
          </button>
          {mainArtists.length >= maxArtists && (
            <p style={{ fontSize: '12px', color: '#f59e0b', margin: '4px 0 0' }}>
              Plan limit: {maxArtists} main artist{maxArtists > 1 ? 's' : ''}. <Link to="/plan" style={{ color: '#f59e0b' }}>Upgrade</Link> to add more.
            </p>
          )}
        </div>
        <div id="mainArtists">
          {mainArtists.map((artist, i) => (
            <div className="artist-group" key={i}>
              <div className="artist-group-header">
                <span className="artist-group-label">Main Artist #{i + 1}</span>
                {i > 0 && (
                  <button type="button" className="remove-artist-btn" onClick={() => removeMainArtist(i)} title="Remove">&#215;</button>
                )}
              </div>
              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label">Artist Name <span className="req">*</span></label>
                  <input className="form-input" type="text" placeholder="Main artist name" value={artist.name} onChange={(e) => updateMainArtist(i, 'name', e.target.value)} style={i === 0 ? markStyle('mainArtist0') : undefined} />
                </div>
                <div className="form-group">
                  <label className="form-label">Spotify Link <span className="opt-tag">(optional)</span></label>
                  <input className="form-input" type="url" placeholder="https://open.spotify.com/artist/..." value={artist.spotify} onChange={(e) => updateMainArtist(i, 'spotify', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Apple Music Link <span className="opt-tag">(optional)</span></label>
                  <input className="form-input" type="url" placeholder="https://music.apple.com/artist/..." value={artist.apple_music} onChange={(e) => updateMainArtist(i, 'apple_music', e.target.value)} />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Instagram <span className="opt-tag">(optional)</span></label>
                  <input className="form-input" type="url" placeholder="https://www.instagram.com/artist/..." value={artist.instagram} onChange={(e) => updateMainArtist(i, 'instagram', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Artists */}
      <div className="glass-card transfer-section animate-in animate-in-delay-2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="section-eyebrow">Artists</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Featured Artists <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif", color: 'var(--text-muted)', letterSpacing: 0 }}>(optional)</span></div>
          </div>
          <button type="button" className="add-artist-btn" onClick={() => addArtist(true)}>
            <svg viewBox="0 0 24 24" width="12" height="12"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Featured
          </button>
        </div>
        <div id="featuredArtists">
          {featuredArtists.map((artist, i) => (
            <div className="artist-group" key={i}>
              <div className="artist-group-header">
                <span className="artist-group-label">Featured Artist #{i + 1}</span>
                <button type="button" className="remove-artist-btn" onClick={() => removeFeaturedArtist(i)} title="Remove">&#215;</button>
              </div>
              <div className="form-grid">
                <div className="form-group col-span-2">
                  <label className="form-label">Artist Name</label>
                  <input className="form-input" type="text" placeholder="Featured artist name" value={artist.name} onChange={(e) => updateFeaturedArtist(i, 'name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Spotify Link <span className="opt-tag">(optional)</span></label>
                  <input className="form-input" type="url" placeholder="https://open.spotify.com/artist/..." value={artist.spotify} onChange={(e) => updateFeaturedArtist(i, 'spotify', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Apple Music Link <span className="opt-tag">(optional)</span></label>
                  <input className="form-input" type="url" placeholder="https://music.apple.com/artist/..." value={artist.apple_music} onChange={(e) => updateFeaturedArtist(i, 'apple_music', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 03: Credits */}
      <div className="glass-card transfer-section animate-in animate-in-delay-3">
        <div className="section-eyebrow">Step 03</div>
        <div className="section-heading">Credits</div>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">Music Producer Name <span className="opt-tag">(optional)</span></label>
            <input className="form-input" type="text" placeholder="Producer name" value={producer} onChange={(e) => setProducer(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Composer Name <span className="opt-tag">(Artist's real name)</span></label>
            <input className="form-input" type="text" placeholder="Composer name" value={composer} onChange={(e) => setComposer(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Lyricist / Author Name <span className="opt-tag">(Artist's real name)</span></label>
            <input className="form-input" type="text" placeholder="Lyricist name" value={lyricist} onChange={(e) => setLyricist(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Step 04: Track Details */}
      <div className="glass-card transfer-section animate-in animate-in-delay-3">
        <div className="section-eyebrow">Step 04</div>
        <div className="section-heading">Track Details</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Explicit <span className="req">*</span></label>
            <select className="form-input" id="explicit" name="explicit" value={explicit} onChange={(e) => setExplicit(e.target.value)} style={markStyle('explicit')}>
              <option value="" disabled>Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Category <span className="req">*</span></label>
            <select className="form-input" id="category" name="category" value={category} onChange={(e) => onCategoryChange(e.target.value)} style={markStyle('category')}>
              <option value="" disabled>Select an option</option>
              <option>Hip-Hop/Rap</option>
              <option>Hindustani Classical</option>
              <option>Devotional</option>
              <option>Carnatic Classical</option>
              <option>Ambient / Instrumental</option>
              <option>Film</option>
              <option>Pop</option>
              <option>Indie</option>
              <option>Folk</option>
              <option>Childrens Music</option>
              <option>Jazz</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Sub Category <span className="opt-tag">(optional)</span></label>
            <select className="form-input" id="subCategory" name="sub_category" value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
              {category === '' ? (
                <option value="" disabled>Select category first</option>
              ) : subs.length ? (
                <>
                  <option value="" disabled>Select an option</option>
                  {subs.map((s) => <option key={s}>{s}</option>)}
                </>
              ) : (
                <option value="" disabled>No sub-categories for this genre</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-input" id="language" name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="" disabled>Select an option</option>
              <option>Hindi</option>
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Chinese</option>
              <option>Gujrati</option>
              <option>Urdu</option>
              <option>Bhojpuri</option>
              <option>Marathi</option>
              <option>Haryanvi</option>
              <option>Telugu</option>
              <option>Chhattisgarhi</option>
              <option>Konkani</option>
              <option>Punjabi</option>
              <option>Sanskrit</option>
              <option>Bengali</option>
              <option>Nagpuri</option>
              <option>Odia</option>
              <option>Kharia</option>
              <option>Kannada</option>
              <option>Malayalam</option>
              <option>Tamil</option>
              <option>Kashmiri</option>
              <option>Nepali</option>
            </select>
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">Mood</label>
            <select className="form-input" id="mood" name="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="" disabled>Select an option</option>
              <option>Happy</option>
              <option>Sad</option>
              <option>Relaxed</option>
              <option>Romantic</option>
              <option>Dance</option>
              <option>Bhangra</option>
              <option>Patriotic</option>
              <option>Nostalgic</option>
              <option>Inspirational</option>
              <option>Enthusiastic</option>
              <option>Optimistic</option>
              <option>Passion</option>
              <option>Pessimistic</option>
              <option>Spiritual</option>
              <option>Peppy</option>
              <option>Philosophical</option>
              <option>Mellow</option>
              <option>Calm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 05: Release Dates */}
      <div className="glass-card transfer-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 05</div>
        <div className="section-heading">Release Dates</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Original Release Date <span className="req">*</span></label>
            <input className="form-input" id="originalDate" name="original_release_date" type="date" style={{ colorScheme: 'dark', ...(markStyle('originalDate') || {}) }} required value={originalDate} onChange={(e) => setOriginalDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Go Live Date <span className="req">*</span></label>
            <input className="form-input" id="goLiveDate" name="go_live_date" type="date" style={{ colorScheme: 'dark', ...(markStyle('goLiveDate') || {}) }} required value={goLiveDate} onChange={(e) => setGoLiveDate(e.target.value)} />
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">YouTube Content ID <span className="req">*</span></label>
            <select className="form-input" id="ytContentId" name="yt_content_id" value={ytContentId} onChange={(e) => setYtContentId(e.target.value)} style={markStyle('ytContentId')}>
              <option value="" disabled>Select an option</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 06: Upload Files */}
      <div className="glass-card transfer-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 06</div>
        <div className="section-heading">Upload Files</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Cover Art (3000×3000px) <span className="opt-tag">(optional)</span></label>
            <div className="upload-zone" id="coverArtZone">
              <input ref={coverInputRef} type="file" name="cover_art" accept="image/jpeg,image/png" onChange={(e) => handleFileSelect(e.target, setCoverArtName)} />
              <div className="upload-zone-icon">📁</div>
              <div className="upload-zone-text">Drag &amp; drop your cover art or click to browse</div>
              <div className="upload-zone-sub">JPEG, PNG (min 3000×3000px)</div>
              <div className="upload-zone-name" id="coverArtName" style={coverArtName ? { display: 'block' } : undefined}>{coverArtName}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Audio File (WAV/MP3/FLAC) <span className="opt-tag">(optional)</span></label>
            <div className="upload-zone" id="audioFileZone">
              <input ref={audioInputRef} type="file" name="audio_file" accept=".wav,.mp3,.flac" onChange={(e) => handleFileSelect(e.target, setAudioFileName)} />
              <div className="upload-zone-icon">🎵</div>
              <div className="upload-zone-text">Drag &amp; drop your audio file or click to browse</div>
              <div className="upload-zone-sub">WAV, MP3, FLAC (min 16-bit 44.1kHz)</div>
              <div className="upload-zone-name" id="audioFileName" style={audioFileName ? { display: 'block' } : undefined}>{audioFileName}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 07: Callertune Options */}
      <div className="glass-card transfer-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 07</div>
        <div className="section-heading">Callertune Options</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Callertune Cut Name <span className="opt-tag">(optional)</span></label>
            <input className="form-input" type="text" placeholder="Optional callertune name" value={callertuneName} onChange={(e) => setCallertuneName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Callertune Timing <span className="opt-tag">(optional)</span></label>
            <input className="form-input" type="text" placeholder="00:00" value={callertuneTiming} onChange={(e) => setCallertuneTiming(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Step 08: Review & Submit */}
      <div className="glass-card transfer-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 08</div>
        <div className="section-heading">Review &amp; Submit</div>
        <div className="form-group col-span-2" style={{ marginBottom: '20px' }}>
          <label className="form-label">Additional Comments <span className="opt-tag">(optional)</span></label>
          <textarea className="form-input" rows="3" placeholder="Any special instructions or notes about your release" value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
        </div>
        <label className="check-card" style={checkCardStyle}><input type="checkbox" id="guidelinesCheck" checked={guidelinesCheck} onChange={(e) => setGuidelinesCheck(e.target.checked)} /><span>I agree to the content delivery guidelines.</span></label>
        <label className="check-card" style={checkCardStyle}><input type="checkbox" id="termsCheck" checked={termsCheck} onChange={(e) => setTermsCheck(e.target.checked)} /><span>I agree to the Terms &amp; Conditions. I hereby declare that Tunefry has full rights to modify artwork or album/song metadata details based on the content delivery guidelines. I will not request the takedown of this song for the next 2 years.</span></label>
        <button className="submit-btn" onClick={submitTransferSong} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit Transfer Request'}</button>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: '1.6' }}>Your submission will be reviewed within 3–5 business days.</p>
      </div>

      <div className="toast" id="successToast" style={toastVisible ? { opacity: 1, transform: 'translateY(0)' } : undefined}><span style={{ fontSize: '20px' }}>🎉</span><div><strong style={{ fontFamily: "'Syne',sans-serif" }}>Transfer Request Submitted!</strong><br /><span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>Our team will review your submission within 3–5 business days.</span></div></div>
    </>
  )
}
