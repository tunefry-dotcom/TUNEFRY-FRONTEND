import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/transfer-album.css';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../lib/profile';

const BASE = 'https://backend1-xzx5.onrender.com'

const PLAN_MAX_ARTISTS = { free: 1, starter: 1, single_artist: 1, double_artist: 2, label: 5 }
const planMaxArtists = (plan) => PLAN_MAX_ARTISTS[plan] ?? 1

const GENRE_OPTIONS = [
  'Hip-Hop / Rap', 'Devotional', 'Pop', 'Indie',
  'Film', 'Jazz', 'Ambient / Instrumental',
  'R&B / Soul', 'Electronic / Dance', 'Classical',
  'Folk', 'Rock',
];

const LANGUAGE_OPTIONS = [
  'Hindi', 'English', 'Punjabi', 'Tamil',
  'Telugu', 'Bengali', 'Marathi',
  'Kannada', 'Malayalam', 'Other',
];

const MOOD_OPTIONS = [
  'Happy', 'Sad', 'Relaxed', 'Romantic',
  'Dance', 'Nostalgic', 'Inspirational', 'Calm',
];

let songSeq = 0;
let artistSeq = 0;

function makeArtist() {
  artistSeq++;
  return { id: 'artist-' + artistSeq, name: '', spotify: '', apple: '', instagram: '' };
}

function makeSong() {
  songSeq++;
  return {
    id: 'song-' + songSeq,
    open: true,
    songName: '',
    duration: '',
    originalReleaseDate: '',
    goLiveDate: '',
    audioFileName: '',
    ytCid: 'no',
    genre: '',
    subGenre: '',
    language: '',
    moods: [],
    musicProducer: '',
    composer: '',
    lyricist: '',
    callertuneTiming: '',
    callertuneCutName: '',
    ytBeat: 'no',
    explicit: 'no',
    isrcNo: '',
    mainArtists: [],
    featuredArtists: [],
  };
}

export default function TransferAlbum() {
  const { user } = useAuth();
  const maxArtists = planMaxArtists(user?.plan);
  const newArtistUsed = (() => { try { return !!localStorage.getItem(`tf_new_artist_${user?.id}`) } catch { return false } })();
  const [isNewArtist, setIsNewArtist] = useState(false);
  const [artistLinkError, setArtistLinkError] = useState('');
  const [profileData, setProfileData] = useState(null);

  const [upcCode, setUpcCode] = useState('');
  const [albumIsrc, setAlbumIsrc] = useState('');
  const [albumName, setAlbumName] = useState('');
  const [albumDescription, setAlbumDescription] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [ownershipCheck, setOwnershipCheck] = useState(false);
  const [migrationCheck, setMigrationCheck] = useState(false);

  const [coverPreview, setCoverPreview] = useState('');
  const [coverDragOver, setCoverDragOver] = useState(false);
  const coverInputRef = useRef(null);
  const [coverFile, setCoverFile] = useState(null);

  const [songs, setSongs] = useState(() => [makeSong()]);

  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const upcRef = useRef(null);
  const isrcRef = useRef(null);
  const nameRef = useRef(null);

  const [upcHighlight, setUpcHighlight] = useState(false);
  const [isrcHighlight, setIsrcHighlight] = useState(false);
  const [nameHighlight, setNameHighlight] = useState(false);
  const [termsHighlight, setTermsHighlight] = useState(false);

  const highlightStyle = { borderColor: 'rgba(59,130,246,.7)', boxShadow: '0 0 0 3px rgba(59,130,246,.12)' };
  const termsErrStyle = { borderColor: 'rgba(239,68,68,0.45)', background: 'rgba(239,68,68,0.06)' };

  // ---- Song helpers ----
  function updateSong(id, patch) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function toggleSong(id) {
    setSongs((prev) => prev.map((s) => (s.id === id ? { ...s, open: !s.open } : s)));
  }

  function addSong() {
    setSongs((prev) => [...prev, makeSong()]);
  }

  function removeSong(id) {
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleMood(songId, mood) {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id !== songId) return s;
        const has = s.moods.includes(mood);
        return { ...s, moods: has ? s.moods.filter((m) => m !== mood) : [...s.moods, mood] };
      })
    );
  }

  function addArtistToSong(songId, type) {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id !== songId) return s;
        const newArtist = type === 'main' && profileData
          ? { ...makeArtist(), name: profileData.artist_name || '', spotify: profileData.spotify_url || '', apple: profileData.apple_music_url || '' }
          : makeArtist();
        if (type === 'main') return { ...s, mainArtists: [...s.mainArtists, newArtist] };
        return { ...s, featuredArtists: [...s.featuredArtists, makeArtist()] };
      })
    );
  }

  function removeArtistFromSong(songId, type, artistId) {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id !== songId) return s;
        if (type === 'main') return { ...s, mainArtists: s.mainArtists.filter((a) => a.id !== artistId) };
        return { ...s, featuredArtists: s.featuredArtists.filter((a) => a.id !== artistId) };
      })
    );
  }

  function updateArtist(songId, type, artistId, patch) {
    setSongs((prev) =>
      prev.map((s) => {
        if (s.id !== songId) return s;
        const key = type === 'main' ? 'mainArtists' : 'featuredArtists';
        return { ...s, [key]: s[key].map((a) => (a.id === artistId ? { ...a, ...patch } : a)) };
      })
    );
  }

  // ---- Cover ----
  function showCover(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCoverPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function dragOver(e) {
    e.preventDefault();
    setCoverDragOver(true);
  }
  function dragLeave() {
    setCoverDragOver(false);
  }
  function coverDrop(e) {
    e.preventDefault();
    setCoverDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setCoverFile(e.dataTransfer.files[0]);
      showCover(e.dataTransfer.files[0]);
    }
  }
  function handleCover(input) {
    if (input.files && input.files[0]) {
      setCoverFile(input.files[0]);
      showCover(input.files[0]);
    }
  }

  function handleSongAudio(input, songId) {
    const file = input.files[0];
    if (!file) return;
    const label = '✓ ' + (file.name.length > 30 ? file.name.substring(0, 28) + '…' : file.name);
    updateSong(songId, { audioFileName: label });
  }

  // Prefill first song's first main artist from profile on mount; store for use when adding more artists
  useEffect(() => {
    getProfile().then((p) => {
      setProfileData(p);
      if (p.artist_name || p.spotify_url || p.apple_music_url) {
        setSongs((prev) => prev.map((s, idx) => idx === 0 ? {
          ...s,
          mainArtists: [{ id: 'artist-prefill', name: p.artist_name || '', spotify: p.spotify_url || '', apple: p.apple_music_url || '', instagram: '' }],
        } : s));
      }
    }).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function sanitizeTime(v) {
    return v.replace(/[^0-9:]/g, '');
  }

  // ---- Submit ----
  function submitTransferAlbum() {
    let bad = false;
    if (!upcCode.trim()) {
      setUpcHighlight(true);
      setTimeout(() => setUpcHighlight(false), 2200);
      if (!bad) { upcRef.current && upcRef.current.focus(); bad = true; }
    }
    if (!albumIsrc.trim()) {
      setIsrcHighlight(true);
      setTimeout(() => setIsrcHighlight(false), 2200);
      if (!bad) { isrcRef.current && isrcRef.current.focus(); bad = true; }
    }
    if (!albumName.trim()) {
      setNameHighlight(true);
      setTimeout(() => setNameHighlight(false), 2200);
      if (!bad) { nameRef.current && nameRef.current.focus(); bad = true; }
    }
    if (bad) return;
    const firstArtist = songs[0]?.mainArtists?.[0];
    if (!isNewArtist && firstArtist) {
      if (!firstArtist.spotify?.trim()) { setArtistLinkError('Spotify Profile Link is required for the main artist.'); return; }
      if (!firstArtist.apple?.trim()) { setArtistLinkError('Apple Music Profile Link is required for the main artist.'); return; }
    }
    setArtistLinkError('');
    if (!ownershipCheck || !migrationCheck) {
      setTermsHighlight(true);
      setTimeout(() => setTermsHighlight(false), 2500);
      return;
    }

    setSubmitting(true);

    // Collect songs
    const collected = songs.map((s, idx) => {
      const song = { index: idx + 1 };
      song.songName = s.songName;
      song.duration = s.duration;
      song.originalReleaseDate = s.originalReleaseDate;
      song.goLiveDate = s.goLiveDate;
      song.ytCid = s.ytCid;
      song.genre = s.genre;
      song.subGenre = s.subGenre;
      song.language = s.language;
      song.moods = s.moods;
      song.musicProducer = s.musicProducer;
      song.composer = s.composer;
      song.lyricist = s.lyricist;
      song.callertuneTiming = s.callertuneTiming;
      song.callertuneCutName = s.callertuneCutName;
      song.ytBeat = s.ytBeat;
      song.explicit = s.explicit;
      song.isrcNo = s.isrcNo;
      song.main_artists = s.mainArtists.map((a) => ({ name: a.name }));
      return song;
    });

    const fd = new FormData();
    fd.append('upc_code', upcCode.trim());
    fd.append('isrc_code', albumIsrc.trim());
    fd.append('album_name', albumName.trim());
    fd.append('songs', JSON.stringify(collected));
    fd.append('album_description', albumDescription.trim());
    fd.append('additional_comments', additionalComments.trim());
    if (coverFile) fd.append('cover_art', coverFile);

    /* ===== BACKEND CONTRACT =========================================
     * POST /api/release/album/transfer
     * Content-Type: multipart/form-data  (set automatically by browser)
     * Auth: session cookie (credentials: 'include')
     *
     * Text fields: upc_code, album_name, album_description,
     *   additional_comments
     * JSON-encoded text field:
     *   songs = [{ title, isrc, duration, main_artists:[{name,...}] }]
     * File fields:
     *   cover_art      (image/*, required)
     *   audio_<sid>    (.wav/.flac/.mp3, one per song)
     *
     * Expected response:
     *   2xx -> { ok: true, transfer_id: string }
     *   4xx/5xx -> { message: string }
     * ================================================================ */
    fd.append('submission_type', 'transfer_album')
    if (isNewArtist) fd.append('new_artist', 'true');
    fetch(`${BASE}/submissions/album`, {
      method: 'POST',
      body: fd,
      credentials: 'include',
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e; })))
      .then(() => {
        const fa = songs[0]?.mainArtists?.[0];
        if (!isNewArtist && fa?.spotify) {
          updateProfile({ spotify_url: fa.spotify, apple_music_url: fa.apple || '' }).catch(() => {});
        }
        if (isNewArtist) {
          try { localStorage.setItem(`tf_new_artist_${user?.id}`, 'used'); } catch { /* private */ }
        }
        setToastVisible(true);
        setSubmitting(false);
        setTimeout(() => setToastVisible(false), 4000);
      })
      .catch((err) => {
        alert(err && err.message ? err.message : 'Submission failed. Please try again.');
        setSubmitting(false);
      });
  }

  function renderArtist(song, type, artist, num) {
    const isMain = type === 'main';
    const title = isMain ? 'Main Artist #' + num : 'Featured Artist #' + num;
    return (
      <div className="artist-group" id={artist.id} key={artist.id}>
        <div className="artist-group-header">
          <span className="artist-group-label">{title}</span>
          <button
            type="button"
            className="remove-artist-btn"
            onClick={() => removeArtistFromSong(song.id, type, artist.id)}
          >
            &#215;
          </button>
        </div>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">
              Artist Name {isMain && <span className="req">*</span>}
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Artist name"
              value={artist.name}
              onChange={(e) => updateArtist(song.id, type, artist.id, { name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Spotify Profile Link <span className="opt-tag">(optional)</span>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://open.spotify.com/artist/..."
              value={artist.spotify}
              onChange={(e) => updateArtist(song.id, type, artist.id, { spotify: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Apple Music Profile Link <span className="opt-tag">(optional)</span>
            </label>
            <input
              type="url"
              className="form-input"
              placeholder="https://music.apple.com/artist/..."
              value={artist.apple}
              onChange={(e) => updateArtist(song.id, type, artist.id, { apple: e.target.value })}
            />
          </div>
          {isMain && (
            <div className="form-group col-span-2">
              <label className="form-label">
                Instagram <span className="opt-tag">(optional)</span>
              </label>
              <input
                type="url"
                className="form-input"
                placeholder="https://www.instagram.com/artist/..."
                value={artist.instagram}
                onChange={(e) => updateArtist(song.id, type, artist.id, { instagram: e.target.value })}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  function renderSong(song, i) {
    const num = i + 1;
    const removeDisabled = songs.length === 1;
    return (
      <div className={'song-card' + (song.open ? ' open' : '')} id={song.id} key={song.id}>
        <div className="song-card-hd" onClick={() => toggleSong(song.id)}>
          <div>
            <div className="song-card-num">Track {num}</div>
            <div className="song-card-name" id={song.id + '-label'}>
              {song.songName.trim() || 'Untitled Song'}
            </div>
          </div>
          <div className="song-card-actions">
            <button
              type="button"
              className="song-remove-btn"
              id={song.id + '-removebtn'}
              onClick={(e) => {
                e.stopPropagation();
                removeSong(song.id);
              }}
              disabled={removeDisabled}
            >
              &#215;
            </button>
            <button type="button" className="song-toggle-btn">
              <svg viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>
        <div className="song-card-body">
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-group col-span-2">
              <label className="form-label">
                Song Name <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Song title"
                value={song.songName}
                onChange={(e) => updateSong(song.id, { songName: e.target.value })}
              />
            </div>
          </div>
          <div className="form-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Duration <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="mm:ss"
                maxLength="5"
                value={song.duration}
                onChange={(e) => updateSong(song.id, { duration: sanitizeTime(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Original Release Date <span className="req">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                style={{ colorScheme: 'dark' }}
                value={song.originalReleaseDate}
                onChange={(e) => updateSong(song.id, { originalReleaseDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Go Live Date <span className="req">*</span>
              </label>
              <input
                type="date"
                className="form-input"
                style={{ colorScheme: 'dark' }}
                value={song.goLiveDate}
                onChange={(e) => updateSong(song.id, { goLiveDate: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              Audio File <span className="req">*</span>
            </label>
            <div
              className="drop-zone"
              style={{ height: '76px', flexDirection: 'row', gap: '14px', padding: '0 20px' }}
              onClick={() => document.getElementById(song.id + '-audio').click()}
            >
              <input
                type="file"
                id={song.id + '-audio'}
                accept=".wav,.flac,.mp3"
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                onChange={(e) => handleSongAudio(e.target, song.id)}
              />
              <div className="drop-zone-icon" style={{ width: '30px', height: '30px', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24">
                  <polyline points="16 16 12 12 8 16" />
                  <line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
                </svg>
              </div>
              <div>
                <div className="drop-zone-text" id={song.id + '-audiolabel'} style={{ fontSize: '12px', textAlign: 'left' }}>
                  {song.audioFileName || 'Drop audio or click to upload'}
                </div>
                <div className="drop-zone-sub" style={{ textAlign: 'left' }}>WAV, FLAC or MP3</div>
              </div>
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                YouTube Content ID <span className="req">*</span>
              </label>
              <select
                className="form-input"
                id={song.id + '-ytCid'}
                value={song.ytCid}
                onChange={(e) => updateSong(song.id, { ytCid: e.target.value })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="form-grid-3" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Genre <span className="req">*</span>
              </label>
              <select
                className="form-input"
                value={song.genre}
                onChange={(e) => updateSong(song.id, { genre: e.target.value })}
              >
                <option value="" disabled>Select genre</option>
                {GENRE_OPTIONS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                Sub-Genre <span className="opt-tag">(optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alternative Pop"
                value={song.subGenre}
                onChange={(e) => updateSong(song.id, { subGenre: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Language <span className="req">*</span>
              </label>
              <select
                className="form-input"
                value={song.language}
                onChange={(e) => updateSong(song.id, { language: e.target.value })}
              >
                <option value="" disabled>Select language</option>
                {LANGUAGE_OPTIONS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              Mood <span className="opt-tag">(optional)</span>
            </label>
            <div className="mood-pills">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  className={'mood-pill' + (song.moods.includes(mood) ? ' active' : '')}
                  onClick={() => toggleMood(song.id, mood)}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>
          <div className="song-sub-label">Credits</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Music Producer <span className="opt-tag">(optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Producer name"
                value={song.musicProducer}
                onChange={(e) => updateSong(song.id, { musicProducer: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Composer <span className="opt-tag">(artist's real name)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Composer name"
                value={song.composer}
                onChange={(e) => updateSong(song.id, { composer: e.target.value })}
              />
            </div>
            <div className="form-group col-span-2">
              <label className="form-label">
                Lyricist / Author <span className="opt-tag">(artist's real name)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Lyricist name"
                value={song.lyricist}
                onChange={(e) => updateSong(song.id, { lyricist: e.target.value })}
              />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label className="form-label">
                Callertune Timing <span className="opt-tag">(optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="00:00"
                maxLength="5"
                value={song.callertuneTiming}
                onChange={(e) => updateSong(song.id, { callertuneTiming: sanitizeTime(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Callertune Cut Name <span className="opt-tag">(optional)</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Optional callertune name"
                value={song.callertuneCutName}
                onChange={(e) => updateSong(song.id, { callertuneCutName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                YouTube Music / Beat <span className="req">*</span>
              </label>
              <select
                className="form-input"
                id={song.id + '-ytBeat'}
                value={song.ytBeat}
                onChange={(e) => updateSong(song.id, { ytBeat: e.target.value })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">
                Explicit Content <span className="req">*</span>
              </label>
              <select
                className="form-input"
                id={song.id + '-explicit'}
                value={song.explicit}
                onChange={(e) => updateSong(song.id, { explicit: e.target.value })}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label className="form-label">
              ISRC No <span className="opt-tag">(optional — preserves existing ISRC)</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. USABC1234567"
              maxLength="12"
              value={song.isrcNo}
              onChange={(e) => updateSong(song.id, { isrcNo: e.target.value })}
            />
          </div>
          <div className="song-artists-row">
            <div className="song-sub-label">Main Artists</div>
            <button
              type="button"
              className="add-artist-btn"
              onClick={() => addArtistToSong(song.id, 'main')}
              disabled={song.mainArtists.length >= maxArtists}
              title={song.mainArtists.length >= maxArtists ? `Your plan allows ${maxArtists} main artist(s). Upgrade to add more.` : undefined}
            >
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Main Artist
            </button>
            {song.mainArtists.length >= maxArtists && (
              <span style={{ fontSize: '11px', color: '#f59e0b', marginLeft: 8 }}>
                Plan limit ({maxArtists}). <Link to="/plan" style={{ color: '#f59e0b' }}>Upgrade</Link>
              </span>
            )}
          </div>
          <div id={song.id + '-mainArtists'}>
            {song.mainArtists.map((a, idx) => renderArtist(song, 'main', a, idx + 1))}
          </div>
          {song.mainArtists.length === 0 && (
            <div
              id={song.id + '-mainEmpty'}
              style={{
                padding: '14px',
                textAlign: 'center',
                border: '1.5px dashed rgba(255,255,255,0.07)',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                fontSize: '12px',
              }}
            >
              Click <strong style={{ color: '#3B82F6' }}>Add Main Artist</strong> to add the main artist
            </div>
          )}
          <div className="song-artists-row" style={{ marginTop: '20px' }}>
            <div className="song-sub-label">
              Featured Artists{' '}
              <span style={{ fontWeight: 500, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </span>
            </div>
            <button
              type="button"
              className="add-artist-btn"
              onClick={() => addArtistToSong(song.id, 'featured')}
            >
              <svg viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Featured
            </button>
          </div>
          <div id={song.id + '-featuredArtists'}>
            {song.featuredArtists.map((a, idx) => renderArtist(song, 'featured', a, idx + 1))}
          </div>
          {song.featuredArtists.length === 0 && (
            <div
              id={song.id + '-featuredEmpty'}
              style={{
                padding: '14px',
                textAlign: 'center',
                border: '1.5px dashed rgba(255,255,255,0.06)',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                fontSize: '12px',
              }}
            >
              No featured artists — click <strong style={{ color: '#3B82F6' }}>Add Featured</strong> to add one
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24">
          <path d="M7 16V4m0 0L3 8m4-4l4 4" />
          <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        Releases
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <div>
          <h1 className="page-title">Transfer Existing Album</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Migrate a released album from another distributor while preserving UPC and ISRC codes.
          </p>
        </div>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline">&#8592; Overview</Link>
        </div>
      </div>

      <Link
        to="/submission-rules"
        target="_blank"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '13px 18px',
          background: 'rgba(242,101,34,0.07)',
          border: '0.5px solid rgba(242,101,34,0.22)',
          borderLeft: '3px solid #F26522',
          borderRadius: '12px',
          marginBottom: '20px',
          textDecoration: 'none',
          transition: 'background .2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(242,101,34,0.11)')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(242,101,34,0.07)')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F26522" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', flex: 1 }}>
          Before submitting, please review our <strong style={{ color: 'var(--accent)' }}>Submission Rules &amp; Terms of Service</strong> — including processing timelines, content policies, and artist responsibilities.
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(242,101,34,0.6)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </Link>

      {/* Step 01: Album Info */}
      <div className="glass-card transfer-section animate-in animate-in-delay-2">
        <div className="section-eyebrow">Step 01</div>
        <div className="section-heading">Album Information</div>
        <div className="transfer-note">
          Keep your UPC and per-track ISRC codes exactly the same as your current release metadata for a smooth migration.
        </div>
        <div className="form-grid" style={{ marginBottom: '20px' }}>
          <div className="form-group">
            <label className="form-label">
              UPC Code <span className="req">*</span>
            </label>
            <input
              id="upcCode"
              ref={upcRef}
              type="text"
              name="upc_code"
              className="form-input"
              placeholder="e.g. 012345678901"
              required
              value={upcCode}
              onChange={(e) => setUpcCode(e.target.value)}
              style={upcHighlight ? highlightStyle : undefined}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              ISRC Code <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              id="albumIsrc"
              ref={isrcRef}
              name="isrc"
              placeholder="e.g. USABC1234567"
              maxLength="12"
              required
              value={albumIsrc}
              onChange={(e) => setAlbumIsrc(e.target.value)}
              style={isrcHighlight ? highlightStyle : undefined}
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              Album Name <span className="req">*</span>
            </label>
            <input
              id="albumName"
              ref={nameRef}
              type="text"
              name="album_name"
              className="form-input"
              placeholder="Enter your album name"
              required
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              style={nameHighlight ? highlightStyle : undefined}
            />
          </div>
        </div>
        <div className="cover-wrap">
          <div className="cover-preview">
            <img
              id="coverPreviewImg"
              className={coverPreview ? 'visible' : undefined}
              src={coverPreview || undefined}
              alt="Cover preview"
            />
            {!coverPreview && (
              <div className="cover-placeholder" id="coverPlaceholder">Cover Preview</div>
            )}
          </div>
          <div
            className={'drop-zone' + (coverDragOver ? ' drag-over' : '')}
            id="coverDropZone"
            style={{ height: '220px' }}
            onDragOver={dragOver}
            onDragLeave={dragLeave}
            onDrop={coverDrop}
          >
            <input
              type="file"
              id="coverInput"
              ref={coverInputRef}
              name="cover_art"
              accept="image/*"
              onChange={(e) => handleCover(e.target)}
            />
            <div className="drop-zone-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="drop-zone-text">Drop album cover here</div>
            <div className="drop-zone-sub">JPEG or PNG<br />Minimum 3000 × 3000 px</div>
          </div>
        </div>
      </div>

      {/* Step 02: Songs */}
      <div className="glass-card transfer-section animate-in animate-in-delay-3">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div className="section-eyebrow">Step 02</div>
            <div className="section-heading" style={{ marginBottom: 0 }}>Songs</div>
          </div>
          <div className="track-count-badge">Total <span id="songCount">{songs.length}</span></div>
        </div>
        <div id="songsContainer">
          {songs.map((song, i) => renderSong(song, i))}
        </div>
        <button type="button" className="add-song-btn" onClick={addSong}>+ Add Another Song</button>

        {(songs[0]?.mainArtists?.[0]?.spotify || songs[0]?.mainArtists?.[0]?.apple) && (
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
      <div className="glass-card transfer-section animate-in animate-in-delay-4">
        <div className="section-eyebrow">Step 03</div>
        <div className="section-heading">Additional Information</div>
        <div className="form-grid">
          <div className="form-group col-span-2">
            <label className="form-label">
              Album Description <span className="opt-tag">(optional)</span>
            </label>
            <textarea
              className="form-input"
              rows="4"
              name="album_description"
              placeholder="Describe your album..."
              value={albumDescription}
              onChange={(e) => setAlbumDescription(e.target.value)}
            />
          </div>
          <div className="form-group col-span-2">
            <label className="form-label">
              Additional Comments <span className="opt-tag">(optional)</span>
            </label>
            <textarea
              className="form-input"
              rows="3"
              name="additional_comments"
              placeholder="Any special instructions or migration notes..."
              value={additionalComments}
              onChange={(e) => setAdditionalComments(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Step 04: Agreement & Submit */}
      <div className="glass-card transfer-section animate-in animate-in-delay-5">
        <div className="section-eyebrow">Step 04</div>
        <div className="section-heading">Agreement &amp; Submit</div>
        <label className="terms-check" htmlFor="ownershipCheck" style={termsHighlight ? termsErrStyle : undefined}>
          <input
            type="checkbox"
            id="ownershipCheck"
            checked={ownershipCheck}
            onChange={(e) => setOwnershipCheck(e.target.checked)}
          />
          <span className="terms-check-text">
            <strong>Rights Ownership</strong>
            <br />
            I confirm I own or control the rights for this album and all tracks included in this transfer request.
          </span>
        </label>
        <label className="terms-check" htmlFor="migrationCheck" style={termsHighlight ? termsErrStyle : undefined}>
          <input
            type="checkbox"
            id="migrationCheck"
            checked={migrationCheck}
            onChange={(e) => setMigrationCheck(e.target.checked)}
          />
          <span className="terms-check-text">
            <strong>Migration Authorization</strong>
            <br />
            I authorize Tunefry to coordinate with my previous distributor for migration and metadata verification.
          </span>
        </label>
        <div style={{ marginTop: '28px' }}>
          <button
            onClick={submitTransferAlbum}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              fontSize: '15px',
              fontFamily: "'Syne',sans-serif",
              fontWeight: 800,
              letterSpacing: '.03em',
              color: '#fff',
              background: 'linear-gradient(135deg,#60a5fa,#3B82F6,#1d4ed8)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 28px rgba(59,130,246,0.4),inset 0 1px 0 rgba(255,255,255,0.15)',
              transition: 'opacity .2s,transform .2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {submitting ? 'Submitting…' : 'Submit Transfer Request'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.6 }}>
            Typical migration timeline: 7–14 working days depending on platform response.
          </p>
        </div>
      </div>

      <div
        className="toast"
        id="successToast"
        style={toastVisible ? { opacity: 1, transform: 'translateY(0)' } : undefined}
      >
        <span style={{ fontSize: '20px' }}>&#127881;</span>
        <div>
          <strong style={{ fontFamily: "'Syne',sans-serif" }}>Album Transfer Submitted!</strong>
          <br />
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            Our migration team will reach out within 2 business days.
          </span>
        </div>
      </div>
    </>
  );
}
