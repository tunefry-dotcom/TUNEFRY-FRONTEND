import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/new-song.css';
import { useAuth } from '../../context/AuthContext';

const BASE = 'https://backend1-xzx5.onrender.com'

const PLAN_MAX_ARTISTS = { free: 1, starter: 1, single_artist: 1, double_artist: 2, label: 5 }
const planMaxArtists = (plan) => PLAN_MAX_ARTISTS[plan] ?? 1

const LANGUAGES = [
  { value: '24', text: 'Hindi' },
  { value: '1', text: 'English' },
  { value: '2', text: 'Spanish' },
  { value: '3', text: 'French' },
  { value: '4', text: 'German' },
  { value: '5', text: 'Chinese' },
  { value: '6', text: 'Gujarati' },
  { value: '7', text: 'Urdu' },
  { value: '8', text: 'Bhojpuri' },
  { value: '9', text: 'Marathi' },
  { value: '10', text: 'Haryanvi' },
  { value: '11', text: 'Telugu' },
  { value: '12', text: 'Chhattisgarhi' },
  { value: '13', text: 'Konkani' },
  { value: '14', text: 'Punjabi' },
  { value: '15', text: 'Sanskrit' },
  { value: '16', text: 'Bengali' },
  { value: '17', text: 'Nagpuri' },
  { value: '18', text: 'Odia' },
  { value: '20', text: 'Kannada' },
  { value: '21', text: 'Malayalam' },
  { value: '22', text: 'Tamil' },
  { value: '23', text: 'Kashmiri' },
  { value: '25', text: 'Nepali' },
];

const GENRES = [
  { value: '7', text: 'Hip-Hop / Rap' },
  { value: '8', text: 'Hindustani Classical' },
  { value: '9', text: 'Devotional' },
  { value: '10', text: 'Carnatic Classical' },
  { value: '11', text: 'Ambient / Instrumental' },
  { value: '12', text: 'Film' },
  { value: '13', text: 'Pop' },
  { value: '14', text: 'Indie' },
  { value: '15', text: 'Folk' },
  { value: '16', text: "Children's Music" },
  { value: '17', text: 'Jazz' },
];

const MOODS = [
  { value: '1', text: 'Happy' },
  { value: '2', text: 'Sad' },
  { value: '3', text: 'Relaxed' },
  { value: '6', text: 'Romantic' },
  { value: '7', text: 'Dance' },
  { value: '8', text: 'Bhangra' },
  { value: '9', text: 'Patriotic' },
  { value: '10', text: 'Nostalgic' },
  { value: '11', text: 'Inspirational' },
  { value: '12', text: 'Enthusiastic' },
  { value: '13', text: 'Optimistic' },
  { value: '14', text: 'Passion' },
  { value: '15', text: 'Pessimistic' },
  { value: '16', text: 'Spiritual' },
  { value: '17', text: 'Peppy' },
  { value: '18', text: 'Philosophical' },
  { value: '19', text: 'Mellow' },
  { value: '20', text: 'Calm' },
];

const SUBCATS = {
  'Hip-Hop / Rap': [
    { value: '8', text: 'Alternative Hip-Hop' }, { value: '9', text: 'Conscious Hip-Hop' },
    { value: '10', text: 'Country Rap' }, { value: '11', text: 'Emo Rap' },
    { value: '12', text: 'Jazz Rap' }, { value: '13', text: 'Hip-Hop' },
    { value: '14', text: 'Pop Rap' }, { value: '15', text: 'Trap' },
  ],
  'Devotional': [
    { value: '17', text: 'Aarti' }, { value: '18', text: 'Bhajan' },
    { value: '19', text: 'Carol' }, { value: '20', text: 'Chalisa' },
    { value: '21', text: 'Chant' }, { value: '22', text: 'Geet' },
    { value: '23', text: 'Gospel' }, { value: '24', text: 'Gurbani' },
    { value: '25', text: 'Kirtan' }, { value: '26', text: 'Mantra' },
    { value: '27', text: 'Paath' }, { value: '28', text: 'Islamic' },
  ],
  'Ambient / Instrumental': [
    { value: '16', text: 'Instrumental' }, { value: '29', text: 'Soft' },
    { value: '30', text: 'Easy Listening' }, { value: '31', text: 'Electronic' },
  ],
  'Pop': [
    { value: '32', text: 'Acoustic Pop' }, { value: '33', text: 'Band Songs' },
    { value: '34', text: 'Chill Pop' }, { value: '35', text: 'Contemporary Pop' },
    { value: '36', text: 'Country Pop / Regional Pop' }, { value: '37', text: 'Dance Pop' },
    { value: '38', text: 'Electro Pop' }, { value: '39', text: 'Lo-Fi Pop' },
    { value: '40', text: 'Love Songs' }, { value: '41', text: 'Pop Rap' },
    { value: '42', text: 'Sad Songs' }, { value: '43', text: 'Soft Pop' },
  ],
};

function getLabelPlanTier() {
  const urlPlan = new URLSearchParams(window.location.search).get('plan');
  const saved = localStorage.getItem('tunefryPlanTier');
  const raw = (urlPlan || saved || '1599').toLowerCase().trim();
  if (raw.indexOf('label') > -1) return 'label';
  if (raw.indexOf('2999') > -1 || raw.indexOf('double') > -1) return '2999';
  return '1599';
}

function isCustomLabelAllowed() {
  const tier = getLabelPlanTier();
  return tier === '2999' || tier === 'label';
}

export default function NewSong() {
  const { user } = useAuth()
  const maxArtists = planMaxArtists(user?.plan)

  // Toggles
  const [ytBeat, setYtBeat] = useState(null); // null | true | false
  const [ytCid, setYtCid] = useState(null);
  const [explicit, setExplicit] = useState(false); // default: No active

  // Basic text fields
  const [songTitle, setSongTitle] = useState('');
  const [producerName, setProducerName] = useState('');
  const [composerName, setComposerName] = useState('');
  const [lyricistName, setLyricistName] = useState('');
  const [language, setLanguage] = useState('');
  const [genre, setGenre] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mood, setMood] = useState('');
  const [originalReleaseDate, setOriginalReleaseDate] = useState('');
  const [goLiveDate, setGoLiveDate] = useState('');
  const [callerTuneName, setCallerTuneName] = useState('');
  const [callerTuneTime, setCallerTuneTime] = useState('');
  const [comments, setComments] = useState('');
  const [guidelinesCheck, setGuidelinesCheck] = useState(false);
  const [rightsCheck, setRightsCheck] = useState(false);

  // Artists
  const [mainArtists, setMainArtists] = useState([]);
  const [featuredArtists, setFeaturedArtists] = useState([]);
  const mainCounter = useRef(0);
  const featCounter = useRef(0);

  // Files
  const [coverPreview, setCoverPreview] = useState(null);
  const [audioSelected, setAudioSelected] = useState(false);
  const [audioName, setAudioName] = useState('');
  const [audioSize, setAudioSize] = useState('');
  const coverInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const [coverDragOver, setCoverDragOver] = useState(false);
  const [audioDragOver, setAudioDragOver] = useState(false);

  // Label name
  const [customAllowed] = useState(isCustomLabelAllowed());
  const [savedLabel, setSavedLabel] = useState(
    (localStorage.getItem('tunefryCustomLabelName') || '').trim()
  );
  const [labelSetupValue, setLabelSetupValue] = useState('');
  const [labelSelectValue, setLabelSelectValue] = useState('');
  const labelSetupRef = useRef(null);

  // Submit / toast
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => {
    if (savedLabel) setLabelSelectValue(savedLabel);
  }, [savedLabel]);

  const saveCustomLabelName = () => {
    const value = labelSetupValue.trim();
    if (value.length < 2) {
      if (labelSetupRef.current) {
        labelSetupRef.current.focus();
        labelSetupRef.current.style.borderColor = 'rgba(59,130,246,.7)';
      }
      return;
    }
    localStorage.setItem('tunefryCustomLabelName', value);
    setSavedLabel(value);
  };

  const addMainArtist = () => {
    mainCounter.current += 1;
    const n = mainCounter.current;
    setMainArtists((prev) => [
      ...prev,
      { key: `main-artist-${n}`, num: n, name: '', spotify: '', apple_music: '', instagram: '' },
    ]);
  };

  const addFeaturedArtist = () => {
    featCounter.current += 1;
    const n = featCounter.current;
    setFeaturedArtists((prev) => [
      ...prev,
      { key: `featured-artist-${n}`, num: n, name: '', spotify: '', apple_music: '' },
    ]);
  };

  const removeMainArtist = (key) =>
    setMainArtists((prev) => prev.filter((a) => a.key !== key));
  const removeFeaturedArtist = (key) =>
    setFeaturedArtists((prev) => prev.filter((a) => a.key !== key));

  const updateMainArtist = (key, field, value) =>
    setMainArtists((prev) => prev.map((a) => (a.key === key ? { ...a, [field]: value } : a)));
  const updateFeaturedArtist = (key, field, value) =>
    setFeaturedArtists((prev) => prev.map((a) => (a.key === key ? { ...a, [field]: value } : a)));

  const showCoverArtPreview = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
  }, []);

  const showAudioFileName = useCallback((name, sizeBytes) => {
    setAudioSelected(true);
    setAudioName(name);
    if (sizeBytes) setAudioSize((sizeBytes / (1024 * 1024)).toFixed(1) + ' MB');
    else setAudioSize('');
  }, []);

  const handleCoverArt = (input) => {
    if (input.files && input.files[0]) showCoverArtPreview(input.files[0]);
  };
  const handleAudioFile = (input) => {
    if (input.files && input.files[0]) showAudioFileName(input.files[0].name, input.files[0].size);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setCoverDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) showCoverArtPreview(e.dataTransfer.files[0]);
  };
  const handleAudioDrop = (e) => {
    e.preventDefault();
    setAudioDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      showAudioFileName(e.dataTransfer.files[0].name, e.dataTransfer.files[0].size);
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setSubCategory('');
  };

  const currentGenreText = GENRES.find((g) => g.value === genre)?.text;
  const subcatOptions = currentGenreText ? SUBCATS[currentGenreText] : null;
  const subDisabled = !subcatOptions;

  const submitRelease = () => {
    if (!songTitle.trim()) {
      setTitleError(true);
      if (titleRef.current) titleRef.current.focus();
      setTimeout(() => setTitleError(false), 2500);
      return;
    }
    if (!guidelinesCheck || !rightsCheck) {
      setTermsError(true);
      setTimeout(() => setTermsError(false), 2500);
      return;
    }

    setSubmitting(true);

    const mainArtistsPayload = mainArtists.map((a) => ({
      name: a.name || '',
      spotify: a.spotify || '',
      apple_music: a.apple_music || '',
      instagram: a.instagram || '',
    }));
    const featuredArtistsPayload = featuredArtists.map((a) => ({
      name: a.name || '',
      spotify: a.spotify || '',
      apple_music: a.apple_music || '',
    }));

    const fd = new FormData();
    fd.append('song_title', songTitle.trim());
    fd.append('yt_beat', ytBeat ? 'yes' : 'no');
    fd.append('producer_name', producerName.trim());
    fd.append('composer_name', composerName.trim());
    fd.append('lyricist_name', lyricistName.trim());
    fd.append('explicit', explicit ? 'yes' : 'no');
    fd.append('language', language);
    fd.append('genre', genre);
    fd.append('sub_category', subCategory);
    fd.append('mood', mood);
    fd.append('original_release_date', originalReleaseDate);
    fd.append('go_live_date', goLiveDate);
    fd.append('yt_content_id', ytCid ? 'yes' : 'no');
    fd.append('callertune_name', callerTuneName.trim());
    fd.append('callertune_time', callerTuneTime.trim());
    fd.append('comments', comments.trim());
    fd.append('main_artists', JSON.stringify(mainArtistsPayload));
    fd.append('featured_artists', JSON.stringify(featuredArtistsPayload));
    let labelValue = '';
    if (!customAllowed) labelValue = 'Tunefry';
    else if (savedLabel) labelValue = labelSelectValue.trim();
    else labelValue = labelSetupValue.trim();
    if (labelValue) fd.append('label_name', labelValue);
    if (coverInputRef.current && coverInputRef.current.files[0])
      fd.append('cover_art', coverInputRef.current.files[0]);
    if (audioInputRef.current && audioInputRef.current.files[0])
      fd.append('audio_file', audioInputRef.current.files[0]);
    fd.append('submission_type', 'new_song');

    fetch(`${BASE}/submissions/song`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e; })))
      .then(() => {
        if (user?.plan === 'single-song') {
          try { localStorage.setItem(`tf_single_used_${user.id}`, '1') } catch { /* private */ }
        }
        setToastVisible(true);
        setSubmitting(false);
        setTimeout(() => setToastVisible(false), 4000);
      })
      .catch((err) => {
        alert(err && err.message ? err.message : 'Submission failed. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <>
      {/* Page label */}
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        Releases
      </div>

      {/* Page header */}
      <div className="page-header animate-in animate-in-delay-1">
        <div>
          <h1 className="page-title">New Song Submission</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Fill out the form below to submit your music for distribution. All fields are required unless marked optional.</p>
        </div>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline">&#8592; Back to Overview</Link>
        </div>
      </div>

      <Link to="/submission-rules" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 18px', background: 'rgba(242,101,34,0.07)', border: '0.5px solid rgba(242,101,34,0.22)', borderLeft: '3px solid #F26522', borderRadius: '12px', marginBottom: '20px', textDecoration: 'none', transition: 'background .2s' }}
        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.11)'; }}
        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(242,101,34,0.07)'; }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', flex: 1 }}>Before submitting, please review our <strong style={{ color: 'var(--accent)' }}>Submission Rules &amp; Terms of Service</strong> — including processing timelines, content policies, and artist responsibilities.</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,101,34,0.6)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
      </Link>

      {/* SECTION 1 — Basic Information */}
      <div className="glass-card upload-section animate-in animate-in-delay-2">
        <div className="section-eyebrow">Step 01</div>
        <div className="section-heading">Basic Information</div>

        <div className="form-grid">

          <div className="form-group col-span-2">
            <label className="form-label">Song Title <span className="req">*</span></label>
            <input
              ref={titleRef}
              id="songTitle"
              type="text"
              name="song_title"
              className="form-input"
              placeholder={titleError ? 'Song title is required!' : 'Enter track title'}
              required
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              style={titleError ? { borderColor: '#3B82F6', boxShadow: '0 0 0 3px rgba(59,130,246,0.18)' } : undefined}
            />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">YouTube Beat / Sample? <span className="req">*</span></label>
            <div className="yn-toggle">
              <button className={ytBeat === true ? 'yn-btn' : ytBeat === false ? 'yn-btn active-no' : 'yn-btn'} id="ytBeatNo" onClick={() => setYtBeat(false)}>No</button>
              <button className={ytBeat === true ? 'yn-btn active-yes' : 'yn-btn'} id="ytBeatYes" onClick={() => setYtBeat(true)}>Yes</button>
            </div>
            <span className="form-hint">Does your track contain a beat or sample sourced from YouTube?</span>
          </div>

        </div>
      </div>

      {/* SECTION 2 — Main Artists */}
      <div className="glass-card upload-section animate-in animate-in-delay-2">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="section-eyebrow">Step 02</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Main Artists</div>
          </div>
          <button className="add-artist-btn" onClick={addMainArtist}
            disabled={mainArtists.length >= maxArtists}
            title={mainArtists.length >= maxArtists ? `Your plan allows ${maxArtists} main artist(s). Upgrade to add more.` : undefined}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Artist
          </button>
        </div>

        <div id="mainArtistsContainer">
          {mainArtists.map((a, i) => (
            <div className="artist-group" id={a.key} key={a.key}>
              <div className="artist-group-header">
                <span className="artist-group-label">Main Artist #{a.num}</span>
                <button className="remove-artist-btn" onClick={() => removeMainArtist(a.key)} title="Remove">&#215;</button>
              </div>
              <div className="form-grid">
                <div className="form-group col-span-2"><label className="form-label">Artist Name <span className="req">*</span></label>
                  <input type="text" className="form-input" name={`main_artists[${i}][name]`} placeholder="Main artist name" value={a.name} onChange={(e) => updateMainArtist(a.key, 'name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Spotify Link <span className="opt-tag">(optional)</span></label>
                  <input type="url" className="form-input" name={`main_artists[${i}][spotify]`} placeholder="https://open.spotify.com/artist/..." value={a.spotify} onChange={(e) => updateMainArtist(a.key, 'spotify', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Apple Music Link <span className="opt-tag">(optional)</span></label>
                  <input type="url" className="form-input" name={`main_artists[${i}][apple_music]`} placeholder="https://music.apple.com/artist/..." value={a.apple_music} onChange={(e) => updateMainArtist(a.key, 'apple_music', e.target.value)} /></div>
                <div className="form-group col-span-2"><label className="form-label">Instagram <span className="opt-tag">(optional)</span></label>
                  <input type="url" className="form-input" name={`main_artists[${i}][instagram]`} placeholder="https://www.instagram.com/artist/..." value={a.instagram} onChange={(e) => updateMainArtist(a.key, 'instagram', e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>

        {mainArtists.length === 0 && (
          <div id="mainArtistEmpty" style={{ padding: '20px', textAlign: 'center', border: '1.5px dashed rgba(255,255,255,0.08)', borderRadius: '14px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Click <strong style={{ color: 'var(--accent)' }}>Add Artist</strong> to add the main artist for this release
          </div>
        )}
        {mainArtists.length >= maxArtists && (
          <p style={{ fontSize: '12px', color: '#f59e0b', margin: '8px 0 0', textAlign: 'right' }}>
            Plan limit reached ({maxArtists} main artist{maxArtists > 1 ? 's' : ''}). <Link to="/plan" style={{ color: '#f59e0b' }}>Upgrade</Link> to add more.
          </p>
        )}
      </div>

      {/* SECTION 3 — Featured Artists */}
      <div className="glass-card upload-section animate-in animate-in-delay-3">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="section-eyebrow">Step 03</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Featured Artists <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif", color: 'var(--text-muted)', letterSpacing: 0 }}>(optional)</span></div>
          </div>
          <button className="add-artist-btn" onClick={addFeaturedArtist}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            Add Featured
          </button>
        </div>

        <div id="featuredArtistsContainer">
          {featuredArtists.map((a, i) => (
            <div className="artist-group" id={a.key} key={a.key}>
              <div className="artist-group-header">
                <span className="artist-group-label">Featured Artist #{a.num}</span>
                <button className="remove-artist-btn" onClick={() => removeFeaturedArtist(a.key)} title="Remove">&#215;</button>
              </div>
              <div className="form-grid">
                <div className="form-group col-span-2"><label className="form-label">Artist Name</label>
                  <input type="text" className="form-input" name={`featured_artists[${i}][name]`} placeholder="Featured artist name" value={a.name} onChange={(e) => updateFeaturedArtist(a.key, 'name', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Spotify Link <span className="opt-tag">(optional)</span></label>
                  <input type="url" className="form-input" name={`featured_artists[${i}][spotify]`} placeholder="https://open.spotify.com/artist/..." value={a.spotify} onChange={(e) => updateFeaturedArtist(a.key, 'spotify', e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Apple Music Link <span className="opt-tag">(optional)</span></label>
                  <input type="url" className="form-input" name={`featured_artists[${i}][apple_music]`} placeholder="https://music.apple.com/artist/..." value={a.apple_music} onChange={(e) => updateFeaturedArtist(a.key, 'apple_music', e.target.value)} /></div>
              </div>
            </div>
          ))}
        </div>

        {featuredArtists.length === 0 && (
          <div id="featuredArtistEmpty" style={{ padding: '20px', textAlign: 'center', border: '1.5px dashed rgba(255,255,255,0.06)', borderRadius: '14px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No featured artists — click <strong style={{ color: 'var(--accent)' }}>Add Featured</strong> to add one
          </div>
        )}
      </div>

      {/* SECTION 4 — Credits */}
      <div className="glass-card upload-section animate-in animate-in-delay-3">
        <div className="section-eyebrow">Step 04</div>
        <div className="section-heading">Credits</div>

        <div className="form-grid">

          <div className="form-group">
            <label className="form-label">Music Producer Name</label>
            <input type="text" className="form-input" placeholder="Producer name" id="producerName" name="producer_name" value={producerName} onChange={(e) => setProducerName(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Composer Name <span className="opt-tag">(artist's real name)</span></label>
            <input type="text" className="form-input" placeholder="Composer name" id="composerName" name="composer_name" value={composerName} onChange={(e) => setComposerName(e.target.value)} />
          </div>

          <div className="form-group col-span-2">
            <label className="form-label">Lyricist / Author Name <span className="opt-tag">(artist's real name)</span></label>
            <input type="text" className="form-input" placeholder="Lyricist name" id="lyricistName" name="lyricist_name" value={lyricistName} onChange={(e) => setLyricistName(e.target.value)} />
          </div>

        </div>
      </div>

      {/* SECTION 5 — Track Details */}
      <div className="glass-card upload-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 05</div>
        <div className="section-heading">Track Details</div>

        <div className="form-grid">

          {/* Explicit */}
          <div className="form-group">
            <label className="form-label">Explicit Content <span className="req">*</span></label>
            <div className="explicit-toggle">
              <button className={explicit ? 'explicit-btn' : 'explicit-btn active-no'} id="explicitNo" onClick={() => setExplicit(false)}>No</button>
              <button className={explicit ? 'explicit-btn active-yes' : 'explicit-btn'} id="explicitYes" onClick={() => setExplicit(true)}>Yes</button>
            </div>
          </div>

          {/* Language */}
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-input" id="trackLanguage" name="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="" disabled>Select language</option>
              {LANGUAGES.map((l) => (<option key={l.value} value={l.value}>{l.text}</option>))}
            </select>
          </div>

          {/* Category / Genre */}
          <div className="form-group">
            <label className="form-label">Category <span className="req">*</span></label>
            <select className="form-input" id="trackGenre" name="genre" value={genre} onChange={handleGenreChange}>
              <option value="" disabled>Select category</option>
              {GENRES.map((g) => (<option key={g.value} value={g.value}>{g.text}</option>))}
            </select>
          </div>

          {/* Sub-Category */}
          <div className="form-group">
            <label className="form-label">Sub-Category <span className="opt-tag">(optional)</span></label>
            <select className="form-input" id="trackSubCategory" name="sub_category" disabled={subDisabled} value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
              <option value="" disabled>Select sub-category</option>
              {subcatOptions && (
                <optgroup label={currentGenreText}>
                  {subcatOptions.map((o) => (<option key={o.value} value={o.value}>{o.text}</option>))}
                </optgroup>
              )}
            </select>
          </div>

          {/* Mood */}
          <div className="form-group">
            <label className="form-label">Mood</label>
            <select className="form-input" id="trackMood" name="mood" value={mood} onChange={(e) => setMood(e.target.value)}>
              <option value="">Select an option</option>
              {MOODS.map((m) => (<option key={m.value} value={m.value}>{m.text}</option>))}
            </select>
          </div>

        </div>
      </div>

      {/* SECTION 6 — Release Dates */}
      <div className="glass-card upload-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 06</div>
        <div className="section-heading">Release Dates</div>

        <div className="form-grid-3">

          <div className="form-group">
            <label className="form-label">Original Release Date <span className="req">*</span></label>
            <input type="date" className="form-input" id="originalReleaseDate" name="original_release_date" style={{ colorScheme: 'dark' }} required value={originalReleaseDate} onChange={(e) => setOriginalReleaseDate(e.target.value)} />
            <span className="form-hint">Date the song was first created or released</span>
          </div>

          <div className="form-group">
            <label className="form-label">Go Live Date <span className="req">*</span></label>
            <input type="date" className="form-input" id="goLiveDate" name="go_live_date" style={{ colorScheme: 'dark' }} required value={goLiveDate} onChange={(e) => setGoLiveDate(e.target.value)} />
            <span className="form-hint">Date the song should go live on platforms</span>
          </div>

          <div className="form-group">
            <label className="form-label">YouTube Content ID <span className="req">*</span></label>
            <div className="yn-toggle">
              <button className={ytCid === true ? 'yn-btn' : ytCid === false ? 'yn-btn active-no' : 'yn-btn'} id="ytCidNo" onClick={() => setYtCid(false)}>No</button>
              <button className={ytCid === true ? 'yn-btn active-yes' : 'yn-btn'} id="ytCidYes" onClick={() => setYtCid(true)}>Yes</button>
            </div>
            <span className="form-hint">Enable Content ID to claim YouTube revenue</span>
          </div>

        </div>

        <div className="form-grid" style={{ marginTop: '14px' }}>
          <div className="form-group col-span-2">
            <label className="form-label">Label Name <span className="req">*</span></label>
            <div id="labelNameWrapNewSong">
              {!customAllowed ? (
                <input type="text" className="form-input" id="labelNameSelectNewSong" value="Tunefry" readOnly />
              ) : !savedLabel ? (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input ref={labelSetupRef} type="text" className="form-input" id="labelNameSelectNewSongSetup" placeholder="Enter your label name (one-time setup)" value={labelSetupValue} onChange={(e) => setLabelSetupValue(e.target.value)} />
                  <button type="button" onClick={saveCustomLabelName} style={{ padding: '10px 14px', borderRadius: '10px', border: '0.5px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Save</button>
                </div>
              ) : (
                <select className="form-input" id="labelNameSelectNewSong" value={labelSelectValue} onChange={(e) => setLabelSelectValue(e.target.value)}>
                  <option value="Tunefry">Tunefry</option>
                  <option value={savedLabel}>{savedLabel}</option>
                </select>
              )}
            </div>
            <span className="form-hint">Free to 1599 plans are locked to Tunefry. 2999 and Label plans can use one custom label name, then choose from dropdown.</span>
          </div>
        </div>
      </div>

      {/* SECTION 7 — Upload Files */}
      <div className="glass-card upload-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 07</div>
        <div className="section-heading">Upload Files</div>

        <div className="files-layout">

          {/* Cover Art */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Cover Art <span className="opt-tag">(optional)</span></label>
            <div className={coverDragOver ? 'drop-zone cover-art-zone drag-over' : 'drop-zone cover-art-zone'} id="coverArtZone"
              style={coverPreview ? { borderStyle: 'solid', borderColor: 'rgba(242,101,34,0.4)' } : undefined}
              onDragOver={(e) => { e.preventDefault(); setCoverDragOver(true); }}
              onDragLeave={() => setCoverDragOver(false)}
              onDrop={handleCoverDrop}>
              <input ref={coverInputRef} type="file" id="coverArtInput" name="cover_art" accept="image/*" onChange={(e) => handleCoverArt(e.target)} />
              <img id="coverArtPreview" className={coverPreview ? 'visible' : ''} src={coverPreview || undefined} alt="Cover art preview" />
              {!coverPreview && (
                <div className="cover-art-inner" id="coverArtContent">
                  <div className="drop-zone-icon">
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </div>
                  <div className="drop-zone-text">Drop cover art here</div>
                  <div className="drop-zone-sub">JPEG, PNG<br />Min 3000 × 3000 px</div>
                </div>
              )}
            </div>
          </div>

          {/* Right column: Audio */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Audio File <span className="opt-tag">(optional)</span></label>
              <div className={audioDragOver ? 'drop-zone audio-zone drag-over' : 'drop-zone audio-zone'} id="audioZone"
                style={audioSelected ? { borderStyle: 'solid', borderColor: 'rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.05)' } : undefined}
                onDragOver={(e) => { e.preventDefault(); setAudioDragOver(true); }}
                onDragLeave={() => setAudioDragOver(false)}
                onDrop={handleAudioDrop}>
                <input ref={audioInputRef} type="file" id="audioInput" name="audio_file" accept=".wav,.flac,.mp3" onChange={(e) => handleAudioFile(e.target)} />
                {!audioSelected && (
                  <div className="audio-inner" id="audioZoneContent">
                    <div className="drop-zone-icon">
                      <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                    </div>
                    <div>
                      <div className="drop-zone-text" style={{ textAlign: 'left' }}>Drop audio file here</div>
                      <div className="drop-zone-sub" style={{ textAlign: 'left' }}>.WAV, .MP3, .FLAC — min 16-bit 44.1kHz</div>
                    </div>
                  </div>
                )}
                <div id="audioFileName" style={audioSelected ? { display: 'block' } : undefined}>{audioSelected ? '✓ File selected' : ''}</div>
              </div>
            </div>

            <div id="audioFilePill" style={{ display: audioSelected ? 'flex' : 'none', padding: '8px 14px', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: '10px', alignItems: 'center', gap: '10px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              <span id="audioFileNameText" style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{audioName}</span>
              <span id="audioFileSizeText" style={{ fontSize: '11px', color: 'rgba(34,197,94,0.7)', flexShrink: 0 }}>{audioSize}</span>
            </div>

            <div style={{ padding: '14px 16px', background: 'rgba(242,101,34,0.06)', border: '0.5px solid rgba(242,101,34,0.15)', borderRadius: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: 'var(--accent)' }}>Audio requirements:</strong> WAV or FLAC preferred. MP3 must be 320 kbps or higher. Minimum 16-bit, 44.1 kHz sample rate.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 8 — Callertune Options */}
      <div className="glass-card upload-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 08</div>
        <div className="section-heading">Callertune Options <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: "'Plus Jakarta Sans',sans-serif", color: 'var(--text-muted)', letterSpacing: 0 }}>(optional)</span></div>

        <div className="form-grid">

          <div className="form-group">
            <label className="form-label">Callertune Cut Name</label>
            <input type="text" className="form-input" placeholder="Optional callertune name" id="callerTuneName" name="callertune_name" value={callerTuneName} onChange={(e) => setCallerTuneName(e.target.value)} />
            <span className="form-hint">Name for the callertune version (e.g., chorus, hook)</span>
          </div>

          <div className="form-group">
            <label className="form-label">Callertune Timing</label>
            <input type="text" className="form-input" placeholder="00:00" id="callerTuneTime" name="callertune_time" maxLength="5" pattern="\d{2}:\d{2}"
              value={callerTuneTime}
              onChange={(e) => setCallerTuneTime(e.target.value.replace(/[^0-9:]/g, ''))} />
            <span className="form-hint">Start time of the callertune segment (mm:ss)</span>
          </div>

        </div>
      </div>

      {/* SECTION 9 — Additional Information */}
      <div className="glass-card upload-section animate-in animate-in-delay-6">
        <div className="section-eyebrow">Step 09</div>
        <div className="section-heading">Additional Information</div>

        <div className="form-group">
          <label className="form-label">Comments <span className="opt-tag">(optional)</span></label>
          <textarea className="form-input" rows="5" id="releaseComments" name="comments"
            placeholder="Any special instructions or notes about your release..." value={comments} onChange={(e) => setComments(e.target.value)}></textarea>
          <span className="form-hint">Any additional information that might help our review team</span>
        </div>
      </div>

      {/* SECTION 10 — Agreement & Submit */}
      <div className="glass-card upload-section animate-in animate-in-delay-7">
        <div className="section-eyebrow">Step 10</div>
        <div className="section-heading">Agreement &amp; Submit</div>

        <label className="terms-check" htmlFor="guidelinesCheck" style={termsError ? { borderColor: 'rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.06)' } : undefined}>
          <input type="checkbox" id="guidelinesCheck" checked={guidelinesCheck} onChange={(e) => setGuidelinesCheck(e.target.checked)} />
          <span className="terms-check-text">
            <strong>Content Delivery Guidelines</strong><br />
            I agree to the Tunefry content delivery guidelines and confirm that my submission meets all quality and format requirements.
          </span>
        </label>

        <label className="terms-check" htmlFor="rightsCheck" style={termsError ? { borderColor: 'rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.06)' } : undefined}>
          <input type="checkbox" id="rightsCheck" checked={rightsCheck} onChange={(e) => setRightsCheck(e.target.checked)} />
          <span className="terms-check-text">
            <strong>Terms &amp; Conditions</strong><br />
            I hereby declare that Tunefry has full rights to modify artwork or album/song metadata based on content delivery guidelines. I will not request a takedown of this song for the next 2 years.
          </span>
        </label>

        <div style={{ marginTop: '28px' }}>
          <button
            onClick={submitRelease}
            disabled={submitting}
            style={{ width: '100%', padding: '16px', borderRadius: '14px', fontSize: '15px', fontFamily: "'Syne',sans-serif", fontWeight: 800, letterSpacing: '.03em', color: '#fff', background: 'linear-gradient(135deg,#FF8A50,#F26522,#D4520F)', border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(242,101,34,0.4),inset 0 1px 0 rgba(255,255,255,0.15)', transition: 'opacity .2s,transform .2s' }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(242,101,34,0.55),inset 0 1px 0 rgba(255,255,255,0.18)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(242,101,34,0.4),inset 0 1px 0 rgba(255,255,255,0.15)'; }}
          >
            {submitting ? 'Submitting…' : 'Submit Release'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>Your submission will be reviewed within 3–5 business days. You'll receive an email confirmation.</p>
        </div>

      </div>

      {/* Toast */}
      <div id="successToast" style={{ position: 'fixed', bottom: '28px', right: '28px', background: 'linear-gradient(135deg,rgba(34,197,94,0.15),rgba(34,197,94,0.08))', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 9999, opacity: toastVisible ? 1 : 0, transform: toastVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity .3s,transform .3s', pointerEvents: toastVisible ? 'auto' : 'none', maxWidth: '340px' }}>
        <span style={{ fontSize: '22px' }}>🎉</span>
        <div><strong style={{ fontFamily: "'Syne',sans-serif" }}>Release Submitted!</strong><br /><span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>We'll review it within 3–5 business days.</span></div>
      </div>
    </>
  );
}
