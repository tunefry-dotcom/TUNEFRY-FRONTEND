import { useState } from 'react'
import { Link } from 'react-router-dom'

const ELIGIBLE = [
  { title: 'Midnight Echoes', release: '15 days away', genre: 'Pop', mood: 'Melancholic' },
  { title: 'Neon Dreams', release: '18 days away', genre: 'Electronic', mood: 'Energetic' },
]

export default function PitchSong() {
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ description: '', mood: '', similar: '', story: '' })
  const [submitted, setSubmitted] = useState(false)

  const submit = () => {
    if (!selected || !form.description) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 16, textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, stroke: '#22C55E', fill: 'none', strokeWidth: 2 }}><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Pitch Submitted!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 420 }}>Your pitch for <strong style={{ color: '#fff' }}>{selected.title}</strong> has been submitted for editorial review. We'll notify you within 5–7 business days.</p>
        <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', marginTop: 8 }}>Back to Overview</Link>
      </div>
    )
  }

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        Pitching
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Pitch Your Song</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 28, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Eligible Releases</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ELIGIBLE.map((s) => (
            <div key={s.title} onClick={() => setSelected(s)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 12, border: `0.5px solid ${selected?.title === s.title ? 'rgba(242,101,34,0.4)' : 'rgba(255,255,255,0.08)'}`, background: selected?.title === s.title ? 'rgba(242,101,34,0.06)' : 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'all .2s' }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.8 }}><circle cx="5.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="15.5" r="2.5"/><path d="M8 17V5l12-2v12"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Release: {s.release} · {s.genre}</div>
              </div>
              {selected?.title === s.title && (
                <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, stroke: 'var(--accent)', fill: 'none', strokeWidth: 2.5 }}><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="glass-card animate-in" style={{ padding: 28 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Pitch Details for "{selected.title}"</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Song Description <span style={{ color: 'var(--accent)' }}>*</span></label>
              <textarea className="form-input" rows={4} placeholder="Describe the song — its vibe, story, production style, and what makes it unique to playlists..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Mood / Vibe</label>
                <input type="text" className="form-input" placeholder="e.g. Melancholic, Chill, Uplifting" value={form.mood} onChange={(e) => setForm((f) => ({ ...f, mood: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Similar Artists</label>
                <input type="text" className="form-input" placeholder="e.g. The Weeknd, Billie Eilish" value={form.similar} onChange={(e) => setForm((f) => ({ ...f, similar: e.target.value }))} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Story Behind the Song</label>
              <textarea className="form-input" rows={3} placeholder="What inspired this song? Share the story..." value={form.story} onChange={(e) => setForm((f) => ({ ...f, story: e.target.value }))} style={{ resize: 'vertical' }} />
            </div>
            <button className="btn btn-primary" onClick={submit} style={{ alignSelf: 'flex-start' }}>
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: '#fff', fill: 'none', strokeWidth: 2 }}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Submit Pitch
            </button>
          </div>
        </div>
      )}
    </>
  )
}
