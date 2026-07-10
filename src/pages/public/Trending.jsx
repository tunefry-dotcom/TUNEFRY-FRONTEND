import { useState } from 'react'
import { Link } from 'react-router-dom'

const GENRE_FILTERS = [
  {value:'all',label:'All'},
  {value:'pop',label:'Pop'},
  {value:'hiphop',label:'Hip-Hop'},
  {value:'electronic',label:'Electronic'},
  {value:'folk',label:'Folk'},
  {value:'rnb',label:'R&B'},
  {value:'indie',label:'Indie'},
  {value:'punjabi',label:'Punjabi'},
]

const BADGE_FILTERS = [
  {value:'hot',label:'🔥 Hot'},
  {value:'rising',label:'↑ Rising'},
]

const TRACKS = [
  {id:'t1',delay:'',genre:'pop',genreLabel:'Pop',badge:'hot',grad:'linear-gradient(135deg,rgba(255,107,0,0.45),rgba(139,92,246,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
  {id:'t2',delay:' au-d1',genre:'folk',genreLabel:'Folk',badge:'hot',grad:'linear-gradient(135deg,rgba(45,202,114,0.45),rgba(6,182,212,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
  {id:'t3',delay:' au-d2',genre:'hiphop',genreLabel:'Hip-Hop',badge:'hot',grad:'linear-gradient(135deg,rgba(59,130,246,0.45),rgba(168,85,247,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
  {id:'t4',delay:' au-d3',genre:'rnb',genreLabel:'R&B',badge:'rising',grad:'linear-gradient(135deg,rgba(236,72,153,0.45),rgba(255,107,0,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
  {id:'t5',delay:' au-d4',genre:'punjabi',genreLabel:'Punjabi',badge:'rising',grad:'linear-gradient(135deg,rgba(234,179,8,0.45),rgba(255,107,0,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
  {id:'t6',delay:' au-d5',genre:'electronic',genreLabel:'Electronic',badge:'hot',grad:'linear-gradient(135deg,rgba(139,92,246,0.45),rgba(59,130,246,0.45),#0a0a0a)',track:'Track Name',artist:'Artist Name'},
]

export default function Trending() {
  const [activeGenre, setActiveGenre] = useState('all')
  const [activeBadge, setActiveBadge] = useState('')

  function handleGenre(val) {
    setActiveGenre(val)
    setActiveBadge('')
  }
  function handleBadge(val) {
    setActiveBadge(activeBadge === val ? '' : val)
    setActiveGenre('all')
  }

  const visible = TRACKS.filter(t => {
    const gMatch = activeGenre === 'all' || t.genre === activeGenre
    const bMatch = !activeBadge || t.badge === activeBadge
    return gMatch && bMatch
  })

  return (
    <>
      <section className="pg-hero">
        <div className="pg-hero-grid"></div>
        <div className="pg-hero-glow"></div>
        <div className="pg-hero-inner">
          <div className="pg-eyebrow au"><span className="pg-eyebrow-dot"></span>What's Hot</div>
          <h1 className="au au-d1">Trending on <em>Tunefry</em></h1>
          <p className="pg-hero-sub au au-d2">The hottest tracks and rising stars from Tunefry artists — updated regularly. Discover what's moving right now.</p>
          <div className="pg-stats au au-d3">
            <div className="pg-stat"><span className="pg-stat-val"><span>50</span>+</span><span className="pg-stat-lbl">Tracks</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>8</span>+</span><span className="pg-stat-lbl">Genres</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>100</span>+</span><span className="pg-stat-lbl">Platforms</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>10K</span>+</span><span className="pg-stat-lbl">Monthly Plays</span></div>
          </div>
        </div>
      </section>

      <div className="filter-bar au">
        {GENRE_FILTERS.map(f => (
          <button key={f.value} className={`filter-btn${activeGenre === f.value && !activeBadge ? ' active' : ''}`} onClick={() => handleGenre(f.value)}>
            {f.label}
          </button>
        ))}
        <div className="filter-sep"></div>
        {BADGE_FILTERS.map(f => (
          <button key={f.value} className={`filter-btn${activeBadge === f.value ? ' active' : ''}`} onClick={() => handleBadge(f.value)}>
            {f.label}
          </button>
        ))}
        <span className="filter-count"><span>{visible.length}</span> tracks</span>
      </div>

      <section className="trending-section">
        <div className="trending-inner">
          <div className="tr-grid">
            {visible.map(track => (
              <div key={track.id} className={`tr-card au${track.delay}`}>
                <div className="tr-art">
                  <div className="tr-art-bg" style={{background:track.grad}}></div>
                  <img className="tr-cover" src="" alt="" />
                  <div className="tr-genre-tag">{track.genreLabel}</div>
                  <div className={`tr-badge ${track.badge}`}>{track.badge === 'hot' ? '🔥 Hot' : '↑ Rising'}</div>
                  <div className="tr-play-overlay">
                    <div className="tr-play-btn">
                      <svg viewBox="0 0 24 24"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
                    </div>
                  </div>
                </div>
                <div className="tr-info">
                  <div className="tr-track">{track.track}</div>
                  <div className="tr-artist">{track.artist}</div>
                </div>
              </div>
            ))}

            {visible.length === 0 && (
              <div className="tr-empty" style={{display:'block'}}>
                <div className="tr-empty-icon">&#127925;</div>
                <p>No tracks found for this filter.<br />More coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-glow"></div>
        <div className="au">
          <h2>Ready to <em>Trend?</em></h2>
          <p>Distribute your music on Tunefry and reach listeners across 100+ platforms. Your track could be next.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-hero">Start Distributing Free</Link>
            <Link to="/pricing" className="btn-hero-outline">View Plans</Link>
          </div>
        </div>
      </section>
    </>
  )
}
