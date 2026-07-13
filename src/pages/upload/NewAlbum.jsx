import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/new-album.css'
import { useAuth } from '../../context/AuthContext'
import { getProfile, updateProfile } from '../../lib/profile'

const BASE = 'https://backend1-xzx5.onrender.com'

const PLAN_MAX_ARTISTS = { free: 1, starter: 1, single_artist: 1, double_artist: 2, label: 5 }
const planMaxArtists = (plan) => PLAN_MAX_ARTISTS[plan] ?? 1

const GENRES = [
  'Hip-Hop / Rap', 'Devotional', 'Pop', 'Indie',
  'Film', 'Jazz', 'Ambient / Instrumental',
  'R&B / Soul', 'Electronic / Dance', 'Classical',
  'Folk', 'Rock',
]

const LANGUAGES = [
  'Hindi', 'English', 'Punjabi', 'Tamil',
  'Telugu', 'Bengali', 'Marathi',
  'Kannada', 'Malayalam', 'Other',
]

const MOODS = ['Happy', 'Sad', 'Relaxed', 'Romantic', 'Dance', 'Nostalgic', 'Inspirational', 'Calm']

let songSeq = 0

function makeSong() {
  songSeq += 1
  return {
    key: songSeq,
    open: true,
    name: '',
    duration: '',
    originalReleaseDate: '',
    goLiveDate: '',
    audioName: '',
    ytCid: false,
    genre: '',
    subGenre: '',
    language: '',
    moods: [],
    producer: '',
    composer: '',
    lyricist: '',
    callertuneTiming: '',
    callertuneCutName: '',
    ytBeat: false,
    explicit: false,
    mainArtists: [],
    featuredArtists: [],
  }
}

let artistSeq = 0
function makeArtist() {
  artistSeq += 1
  return { key: artistSeq, name: '', spotify: '', apple: '', instagram: '' }
}

export default function NewAlbum() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const maxArtists = planMaxArtists(user?.plan)
  const newArtistUsed = (() => { try { return !!localStorage.getItem(`tf_new_artist_${user?.id}`) } catch { return false } })()
  const [isNewArtist, setIsNewArtist] = useState(false)
  const [artistLinkError, setArtistLinkError] = useState('')
  const [profileData, setProfileData] = useState(null)

  const [albumName, setAlbumName] = useState('')
  const [albumDescription, setAlbumDescription] = useState('')
  const [additionalComments, setAdditionalComments] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [coverDragOver, setCoverDragOver] = useState(false)
  const [songs, setSongs] = useState([makeSong()])
  const [guidelinesCheck, setGuidelinesCheck] = useState(false)
  const [rightsCheck, setRightsCheck] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const albumNameRef = useRef(null)
  const coverInputRef = useRef(null)
  const [albumNameStyle, setAlbumNameStyle] = useState({})
  const [termsError, setTermsError] = useState(false)

  const updateSong = (key, patch) =>
    setSongs((prev) => prev.map((s) => (s.key === key ? { ...s, ...patch } : s)))

  const toggleSong = (key) =>
    setSongs((prev) => prev.map((s) => (s.key === key ? { ...s, open: !s.open } : s)))

  const addSong = () => setSongs((prev) => [...prev, makeSong()])

  const removeSong = (key) => setSongs((prev) => prev.filter((s) => s.key !== key))

  const toggleMood = (key, mood) =>
    setSongs((prev) =>
      prev.map((s) =>
        s.key === key
          ? { ...s, moods: s.moods.includes(mood) ? s.moods.filter((m) => m !== mood) : [...s.moods, mood] }
          : s
      )
    )

  const addArtist = (key, type) =>
    setSongs((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s
        const listKey = type === 'main' ? 'mainArtists' : 'featuredArtists'
        const newArtist = type === 'main' && profileData
          ? { ...makeArtist(), name: profileData.artist_name || '', spotify: profileData.spotify_url || '', apple: profileData.apple_music_url || '' }
          : makeArtist()
        return { ...s, [listKey]: [...s[listKey], newArtist] }
      })
    )

  const removeArtist = (key, type, aKey) =>
    setSongs((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s
        const listKey = type === 'main' ? 'mainArtists' : 'featuredArtists'
        return { ...s, [listKey]: s[listKey].filter((a) => a.key !== aKey) }
      })
    )

  const updateArtist = (key, type, aKey, field, val) =>
    setSongs((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s
        const listKey = type === 'main' ? 'mainArtists' : 'featuredArtists'
        return {
          ...s,
          [listKey]: s[listKey].map((a) => (a.key === aKey ? { ...a, [field]: val } : a)),
        }
      })
    )

  const showCover = (file) => {
    const reader = new FileReader()
    reader.onload = (ev) => setCoverPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  // Prefill first song's first main artist from profile on mount; store for use when adding more artists
  useEffect(() => {
    getProfile().then((p) => {
      const merged = { ...p, artist_name: p.artist_name || user?.artist_name || '' }
      setProfileData(merged)
      if (merged.artist_name || merged.spotify_url || merged.apple_music_url) {
        setSongs((prev) => prev.map((s, idx) => idx === 0 ? {
          ...s,
          mainArtists: [{ key: Date.now(), name: merged.artist_name || '', spotify: merged.spotify_url || '', apple: merged.apple_music_url || '', instagram: '' }],
        } : s))
      }
    }).catch(() => {})
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCover = (e) => {
    const files = e.target.files
    if (files && files[0]) showCover(files[0])
  }

  const coverDrop = (e) => {
    e.preventDefault()
    setCoverDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) showCover(e.dataTransfer.files[0])
  }

  const handleSongAudio = (key, e) => {
    const file = e.target.files[0]
    if (!file) return
    const label = '✓ ' + (file.name.length > 30 ? file.name.substring(0, 28) + '…' : file.name)
    updateSong(key, { audioName: label })
  }

  const submitAlbum = () => {
    if (!albumName.trim()) {
      if (albumNameRef.current) albumNameRef.current.focus()
      setAlbumNameStyle({ borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(242,101,34,0.18)' })
      setTimeout(() => setAlbumNameStyle({}), 2200)
      return
    }
    // Validate first song first main artist spotify/apple (required unless new artist)
    const firstArtist = songs[0]?.mainArtists?.[0]
    if (!isNewArtist && firstArtist) {
      if (!firstArtist.spotify?.trim()) { setArtistLinkError('Spotify Profile Link is required for the main artist.'); return }
      if (!firstArtist.apple?.trim()) { setArtistLinkError('Apple Music Profile Link is required for the main artist.'); return }
    }
    setArtistLinkError('')

    if (!guidelinesCheck || !rightsCheck) {
      setTermsError(true)
      setTimeout(() => setTermsError(false), 2500)
      return
    }

    setSubmitting(true)

    const collectedSongs = songs.map((s, idx) => ({
      index: idx + 1,
      main_artists: s.mainArtists.map((a) => ({ name: a.name, spotify: a.spotify, apple_music: a.apple })),
    }))

    const fd = new FormData()
    fd.append('album_name', albumName.trim())
    fd.append('songs', JSON.stringify(collectedSongs))
    fd.append('album_description', albumDescription.trim())
    fd.append('additional_comments', additionalComments.trim())
    const coverInput = coverInputRef.current
    if (coverInput && coverInput.files[0]) fd.append('cover_art', coverInput.files[0])

    /* ===== BACKEND CONTRACT =========================================
     * POST /api/release/album/new
     * Content-Type: multipart/form-data  (set automatically by browser)
     * Auth: session cookie (credentials: 'include')
     *
     * Text fields: album_name, album_description, additional_comments
     * JSON-encoded text field:
     *   songs = [{ title, duration, genre, producer, composer,
     *              lyricist, callertune_time, callertune_name,
     *              main_artists:[{name, spotify}], audio_filename }]
     *   NOTE: each song's audio file is appended separately as
     *         `audio_<sid>` in the same FormData (see code above).
     * File fields:
     *   cover_art       (image/*, required)
     *   audio_<sid>     (.wav/.flac/.mp3, one per song)
     * ================================================================ */
    fd.append('submission_type', 'new_album')
    if (isNewArtist) fd.append('new_artist', 'true')
    fetch(`${BASE}/submissions/album`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e })))
      .then(() => {
        const fa = songs[0]?.mainArtists?.[0]
        if (!isNewArtist && fa?.spotify) {
          updateProfile({ spotify_url: fa.spotify, apple_music_url: fa.apple || '' }).catch(() => {})
        }
        if (isNewArtist) {
          try { localStorage.setItem(`tf_new_artist_${user?.id}`, 'used') } catch { /* private */ }
        }
        setSubmitting(false)
        navigate('/', { state: { successMsg: 'New Album Submission' } })
      })
      .catch((err) => {
        alert(err && err.message ? err.message : 'Submission failed. Please try again.')
        setSubmitting(false)
      })
  }

  const termsCardStyle = termsError
    ? { borderColor: 'rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.06)' }
    : {}

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
        Releases
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <div>
          <h1 className="page-title">New Album Submission</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Create your full album release with complete metadata and tracks.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline">&#8592; Back to Overview</Link>
        </div>
      </div>

      <Link
        to="/submission-rules"
        target="_blank"
        style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', background: 'rgba(242,101,34,0.07)', border: '0.5px solid rgba(242,101,34,0.22)', borderLeft: '3px solid #F26522', borderRadius: '12px', marginBottom: '20px', textDecoration: 'none', transition: 'background .2s' }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.11)' }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.07)' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', flex: 1 }}>Before submitting, please review our <strong style={{ color: 'var(--accent)' }}>Submission Rules &amp; Terms of Service</strong> — including processing timelines, content policies, and artist responsibilities.</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,101,34,0.6)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </Link>

      {/* Step 01: Album Info */}
      <div className="glass-card upload-section animate-in animate-in-delay-2">
        <div className="section-eyebrow">Step 01</div>
        <div className="section-heading">Album Information</div>
        <div className="form-group" style={{ marginBottom: '20px' }}>
          <label className="form-label">Album Name <span className="req">*</span></label>
          <input
            ref={albumNameRef}
            id="albumName"
            type="text"
            name="album_name"
            className="form-input"
            placeholder="Enter your album name"
            required
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
            style={albumNameStyle}
          />
        </div>
        <div className="cover-wrap">
          <div className="cover-preview">
            <img id="coverPreviewImg" alt="Cover preview" src={coverPreview || undefined} className={coverPreview ? 'visible' : ''} />
            {!coverPreview && <div className="cover-placeholder" id="coverPlaceholder">Cover Preview</div>}
          </div>
          <div
            className={`drop-zone${coverDragOver ? ' drag-over' : ''}`}
            id="coverDropZone"
            style={{ height: '220px' }}
            onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true) }}
            onDragLeave={() => setCoverDragOver(false)}
            onDrop={coverDrop}
          >
            <input ref={coverInputRef} type="file" id="coverInput" name="cover_art" accept="image/*" onChange={handleCover} />
            <div className="drop-zone-icon"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>
            <div className="drop-zone-text">Drop album cover here</div>
            <div className="drop-zone-sub">JPEG or PNG<br/>Minimum 3000 × 3000 px</div>
          </div>
        </div>
      </div>

      {/* Step 02: Songs */}
      <div className="glass-card upload-section animate-in animate-in-delay-3">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div className="section-eyebrow">Step 02</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Songs</div>
          </div>
          <div className="track-count-badge">Total <span id="songCount">{songs.length}</span></div>
        </div>
        <div id="songsContainer">
          {songs.map((song, idx) => (
            <SongCard
              key={song.key}
              song={song}
              num={idx + 1}
              removeDisabled={songs.length === 1}
              onToggle={() => toggleSong(song.key)}
              onRemove={() => removeSong(song.key)}
              updateSong={updateSong}
              toggleMood={toggleMood}
              addArtist={addArtist}
              removeArtist={removeArtist}
              updateArtist={updateArtist}
              handleSongAudio={handleSongAudio}
              maxArtists={maxArtists}
              profileData={profileData}
              songIndex={idx}
            />
          ))}
        </div>
        <button type="button" className="add-song-btn" onClick={addSong}>+ Add Another Song</button>

        {/* Permanent save notice */}
        {!profileData?.spotify_url && (songs[0]?.mainArtists?.[0]?.spotify || songs[0]?.mainArtists?.[0]?.apple) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 14, padding: '11px 14px', background: 'rgba(234,179,8,0.07)', border: '0.5px solid rgba(234,179,8,0.25)', borderRadius: 10 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style={{ margin: 0, fontSize: 12, color: 'rgba(234,179,8,0.9)', lineHeight: 1.6 }}>These Spotify and Apple Music profile links will be <strong>permanently saved</strong> to your Tunefry profile.</p>
          </div>
        )}
        {!newArtistUsed && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={isNewArtist} onChange={(e) => setIsNewArtist(e.target.checked)} style={{ width: 15, height: 15, accentColor: 'var(--accent)', cursor: 'pointer' }} />
            I don't have a Spotify or Apple Music profile yet <span style={{ color: 'var(--text-muted)' }}>(new artist)</span>
          </label>
        )}
        {artistLinkError && <p style={{ marginTop: 10, fontSize: 12.5, color: '#f87171', fontWeight: 500 }}>{artistLinkError}</p>}
      </div>

      {/* Step 03: Additional Info */}
      <div className="glass-card upload-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 03</div>
        <div className="section-heading">Additional Information</div>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">Album Description <span className="opt-tag">(optional)</span></label>
            <textarea className="form-input" rows="4" name="album_description" placeholder="Describe your album..." value={albumDescription} onChange={(e) => setAlbumDescription(e.target.value)}></textarea>
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">Additional Comments <span className="opt-tag">(optional)</span></label>
            <textarea className="form-input" rows="3" name="additional_comments" placeholder="Any special instructions or notes for review..." value={additionalComments} onChange={(e) => setAdditionalComments(e.target.value)}></textarea>
          </div>
        </div>
      </div>

      {/* Step 04: Agreement & Submit */}
      <div className="glass-card upload-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 04</div>
        <div className="section-heading">Agreement &amp; Submit</div>
        <label className="terms-check" htmlFor="guidelinesCheck" style={termsCardStyle}><input type="checkbox" id="guidelinesCheck" checked={guidelinesCheck} onChange={(e) => setGuidelinesCheck(e.target.checked)} /><span className="terms-check-text"><strong>Content Delivery Guidelines</strong><br/>I agree to the Tunefry content delivery guidelines and confirm this album meets all quality and format requirements.</span></label>
        <label className="terms-check" htmlFor="rightsCheck" style={termsCardStyle}><input type="checkbox" id="rightsCheck" checked={rightsCheck} onChange={(e) => setRightsCheck(e.target.checked)} /><span className="terms-check-text"><strong>Terms &amp; Conditions</strong><br/>I declare that Tunefry may modify artwork or metadata according to content delivery guidelines. I will not request takedown for the next 2 years.</span></label>
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={submitAlbum}
            disabled={submitting}
            style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '15px', fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '.03em', color: '#fff', background: 'linear-gradient(135deg,#FF8A50,#F26522,#D4520F)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(242,101,34,0.4),inset 0 1px 0 rgba(255,255,255,0.15)', transition: 'opacity .2s,transform .2s' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
          >{submitting ? 'Submitting…' : 'Submit Album'}</button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>Your submission will be reviewed within 3–5 business days. You'll receive an email confirmation.</p>
        </div>
      </div>

      <div id="successToast" style={{ position: 'fixed', bottom: '28px', right: '28px', background: 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.08))', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 9999, opacity: toastVisible ? 1 : 0, transform: toastVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity .3s,transform .3s', pointerEvents: toastVisible ? 'auto' : 'none', maxWidth: '340px' }}>
        <span style={{ fontSize: '22px' }}>&#127881;</span>
        <div><strong style={{ fontFamily: "'Syne',sans-serif" }}>Album Submitted!</strong><br/><span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>We'll review it within 3–5 business days.</span></div>
      </div>
    </>
  )
}

function ynClass(base, isYes) {
  // base is 'yn-btn' or 'explicit-btn'
  return {
    no: isYes ? base : `${base} active-no`,
    yes: isYes ? `${base} active-yes` : base,
  }
}

function ArtistGroup({ song, type, artist, num, updateArtist, removeArtist, locked }) {
  const isMain = type === 'main'
  const title = isMain ? `Main Artist #${num}` : `Featured Artist #${num}`
  const lockName    = isMain && !!locked?.artist_name
  const lockSpotify = isMain && !!locked?.spotify_url
  const lockApple   = isMain && !!locked?.apple_music_url
  return (
    <div className="artist-group">
      <div className="artist-group-header">
        <span className="artist-group-label">{title}</span>
        <button type="button" className="remove-artist-btn" onClick={() => removeArtist(song.key, type, artist.key)}>&#215;</button>
      </div>
      <div className="form-grid">
        <div className="form-group col-span-2"><label className="form-label">Artist Name {isMain && <span className="req">*</span>}</label><input type="text" className="form-input" placeholder="Artist name" disabled={lockName} value={artist.name} onChange={(e) => updateArtist(song.key, type, artist.key, 'name', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Spotify Profile Link {isMain && !lockSpotify ? <span className="opt-tag">(optional)</span> : null}</label><input type="url" className="form-input" placeholder="https://open.spotify.com/artist/..." disabled={lockSpotify} value={artist.spotify} onChange={(e) => updateArtist(song.key, type, artist.key, 'spotify', e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Apple Music Profile Link {isMain && !lockApple ? <span className="opt-tag">(optional)</span> : null}</label><input type="url" className="form-input" placeholder="https://music.apple.com/artist/..." disabled={lockApple} value={artist.apple} onChange={(e) => updateArtist(song.key, type, artist.key, 'apple', e.target.value)} /></div>
        <div className="form-group col-span-2"><label className="form-label">Instagram <span className="opt-tag">(optional)</span></label><input type="url" className="form-input" placeholder="https://www.instagram.com/artist/..." value={artist.instagram} onChange={(e) => updateArtist(song.key, type, artist.key, 'instagram', e.target.value)} /></div>
      </div>
    </div>
  )
}

function SongCard({ song, num, removeDisabled, onToggle, onRemove, updateSong, toggleMood, addArtist, removeArtist, updateArtist, handleSongAudio, maxArtists, profileData, songIndex }) {
  const audioRef = useRef(null)
  const ytCid = ynClass('yn-btn', song.ytCid)
  const ytBeat = ynClass('yn-btn', song.ytBeat)
  const explicit = ynClass('explicit-btn', song.explicit)

  return (
    <div className={`song-card${song.open ? ' open' : ''}`}>
      <div className="song-card-hd" onClick={onToggle}>
        <div><div className="song-card-num">Track {num}</div>
          <div className="song-card-name">{song.name.trim() || 'Untitled Song'}</div></div>
        <div className="song-card-actions">
          <button type="button" className="song-remove-btn" onClick={(e) => { e.stopPropagation(); onRemove() }} disabled={removeDisabled}>&#215;</button>
          <button type="button" className="song-toggle-btn"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg></button>
        </div>
      </div>
      <div className="song-card-body">
        <div className="form-grid" style={{ marginTop: '16px' }}>
          <div className="form-group col-span-2"><label className="form-label">Song Name <span className="req">*</span></label>
            <input type="text" className="form-input" placeholder="Song title" value={song.name} onChange={(e) => updateSong(song.key, { name: e.target.value })} /></div>
        </div>
        <div className="form-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group"><label className="form-label">Duration <span className="req">*</span></label>
            <input type="text" className="form-input" placeholder="mm:ss" maxLength="5" value={song.duration} onChange={(e) => updateSong(song.key, { duration: e.target.value.replace(/[^0-9:]/g, '') })} /></div>
          <div className="form-group"><label className="form-label">Original Release Date <span className="req">*</span></label>
            <input type="date" className="form-input" style={{ colorScheme: 'dark' }} value={song.originalReleaseDate} onChange={(e) => updateSong(song.key, { originalReleaseDate: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Go Live Date <span className="req">*</span></label>
            <input type="date" className="form-input" style={{ colorScheme: 'dark' }} value={song.goLiveDate} onChange={(e) => updateSong(song.key, { goLiveDate: e.target.value })} /></div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}><label className="form-label">Audio File <span className="req">*</span></label>
          <div className="drop-zone" style={{ height: '76px', flexDirection: 'row', gap: '14px', padding: '0 20px' }} onClick={() => audioRef.current && audioRef.current.click()}>
            <input ref={audioRef} type="file" accept=".wav,.flac,.mp3" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} onChange={(e) => handleSongAudio(song.key, e)} />
            <div className="drop-zone-icon" style={{ width: '30px', height: '30px', flexShrink: 0 }}><svg viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg></div>
            <div><div className="drop-zone-text" style={{ fontSize: '12px', textAlign: 'left' }}>{song.audioName || 'Drop audio or click to upload'}</div>
              <div className="drop-zone-sub" style={{ textAlign: 'left' }}>WAV, FLAC or MP3</div></div>
          </div>
        </div>
        <div className="form-grid" style={{ marginTop: '16px' }}>
          <div className="form-group"><label className="form-label">YouTube Content ID <span className="req">*</span></label>
            <div className="yn-toggle">
              <button type="button" className={ytCid.no} onClick={() => updateSong(song.key, { ytCid: false })}>No</button>
              <button type="button" className={ytCid.yes} onClick={() => updateSong(song.key, { ytCid: true })}>Yes</button>
            </div></div>
        </div>
        <div className="form-grid-3" style={{ marginTop: '16px' }}>
          <div className="form-group"><label className="form-label">Genre <span className="req">*</span></label>
            <select className="form-input" value={song.genre} onChange={(e) => updateSong(song.key, { genre: e.target.value })}><option value="" disabled>Select genre</option>
              {GENRES.map((g) => <option key={g}>{g}</option>)}</select></div>
          <div className="form-group"><label className="form-label">Sub-Genre <span className="opt-tag">(optional)</span></label>
            <input type="text" className="form-input" placeholder="e.g. Alternative Pop" value={song.subGenre} onChange={(e) => updateSong(song.key, { subGenre: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Language <span className="req">*</span></label>
            <select className="form-input" value={song.language} onChange={(e) => updateSong(song.key, { language: e.target.value })}><option value="" disabled>Select language</option>
              {LANGUAGES.map((l) => <option key={l}>{l}</option>)}</select></div>
        </div>
        <div className="form-group" style={{ marginTop: '16px' }}><label className="form-label">Mood <span className="opt-tag">(optional)</span></label>
          <div className="mood-pills">
            {MOODS.map((m) => (
              <button key={m} type="button" className={`mood-pill${song.moods.includes(m) ? ' active' : ''}`} onClick={() => toggleMood(song.key, m)}>{m}</button>
            ))}
          </div></div>
        <div className="song-sub-label">Credits</div>
        <div className="form-grid">
          <div className="form-group"><label className="form-label">Music Producer <span className="opt-tag">(optional)</span></label>
            <input type="text" className="form-input" placeholder="Producer name" value={song.producer} onChange={(e) => updateSong(song.key, { producer: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Composer <span className="opt-tag">(artist's real name)</span></label>
            <input type="text" className="form-input" placeholder="Composer name" value={song.composer} onChange={(e) => updateSong(song.key, { composer: e.target.value })} /></div>
          <div className="form-group col-span-2"><label className="form-label">Lyricist / Author <span className="opt-tag">(artist's real name)</span></label>
            <input type="text" className="form-input" placeholder="Lyricist name" value={song.lyricist} onChange={(e) => updateSong(song.key, { lyricist: e.target.value })} /></div>
        </div>
        <div className="form-grid" style={{ marginTop: '16px' }}>
          <div className="form-group"><label className="form-label">Callertune Timing <span className="opt-tag">(optional)</span></label>
            <input type="text" className="form-input" placeholder="00:00" maxLength="5" value={song.callertuneTiming} onChange={(e) => updateSong(song.key, { callertuneTiming: e.target.value.replace(/[^0-9:]/g, '') })} /></div>
          <div className="form-group"><label className="form-label">Callertune Cut Name <span className="opt-tag">(optional)</span></label>
            <input type="text" className="form-input" placeholder="Optional callertune name" value={song.callertuneCutName} onChange={(e) => updateSong(song.key, { callertuneCutName: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">YouTube Music / Beat <span className="req">*</span></label>
            <div className="yn-toggle">
              <button type="button" className={ytBeat.no} onClick={() => updateSong(song.key, { ytBeat: false })}>No</button>
              <button type="button" className={ytBeat.yes} onClick={() => updateSong(song.key, { ytBeat: true })}>Yes</button>
            </div></div>
          <div className="form-group"><label className="form-label">Explicit Content <span className="req">*</span></label>
            <div className="explicit-toggle">
              <button type="button" className={explicit.no} onClick={() => updateSong(song.key, { explicit: false })}>No</button>
              <button type="button" className={explicit.yes} onClick={() => updateSong(song.key, { explicit: true })}>Yes</button>
            </div></div>
        </div>
        <div className="song-artists-row">
          <div className="song-sub-label">Main Artists</div>
          <button type="button" className="add-artist-btn" onClick={() => addArtist(song.key, 'main')}
            disabled={song.mainArtists.length >= maxArtists}
            title={song.mainArtists.length >= maxArtists ? `Your plan allows ${maxArtists} main artist(s). Upgrade to add more.` : undefined}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Main Artist
          </button>
          {song.mainArtists.length >= maxArtists && (
            <span style={{ fontSize: '11px', color: '#f59e0b', marginLeft: 8 }}>Plan limit ({maxArtists})</span>
          )}
        </div>
        <div>
          {song.mainArtists.map((a, i) => (
            <ArtistGroup key={a.key} song={song} type="main" artist={a} num={i + 1} updateArtist={updateArtist} removeArtist={removeArtist}
              locked={songIndex === 0 && i === 0 ? profileData : null} />
          ))}
        </div>
        {song.mainArtists.length === 0 && (
          <div style={{ padding: '14px', textAlign: 'center', border: '1.5px dashed rgba(255,255,255,0.07)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>Click <strong style={{ color: 'var(--accent)' }}>Add Main Artist</strong> to add the main artist</div>
        )}
        <div className="song-artists-row" style={{ marginTop: '20px' }}>
          <div className="song-sub-label">Featured Artists <span style={{ fontWeight: 500, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></div>
          <button type="button" className="add-artist-btn" onClick={() => addArtist(song.key, 'featured')}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Add Featured</button>
        </div>
        <div>
          {song.featuredArtists.map((a, i) => (
            <ArtistGroup key={a.key} song={song} type="featured" artist={a} num={i + 1} updateArtist={updateArtist} removeArtist={removeArtist} />
          ))}
        </div>
        {song.featuredArtists.length === 0 && (
          <div style={{ padding: '14px', textAlign: 'center', border: '1.5px dashed rgba(255,255,255,0.06)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '12px' }}>No featured artists — click <strong style={{ color: 'var(--accent)' }}>Add Featured</strong> to add one</div>
        )}
      </div>
    </div>
  )
}
