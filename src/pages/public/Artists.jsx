import { useState } from 'react'
import { Link } from 'react-router-dom'

const CARDS = [
  {
    id:'a1', delay:'', genre:'pop', genreLabel:'Pop', name:'Artist Name', meta:'Pop · Mumbai',
    bgGrad:'linear-gradient(135deg,#1a0a2e,#16213e)',
    overlayGrad:'linear-gradient(135deg,rgba(255,107,0,0.3),rgba(139,92,246,0.3))',
  },
  {
    id:'a2', delay:' au-d1', genre:'folk', genreLabel:'Folk', name:'Artist Name', meta:'Folk · Delhi',
    bgGrad:'linear-gradient(135deg,#0d1f0d,#1a3a1a)',
    overlayGrad:'linear-gradient(135deg,rgba(45,202,114,0.3),rgba(6,182,212,0.3))',
  },
  {
    id:'a3', delay:' au-d2', genre:'hiphop', genreLabel:'Hip-Hop', name:'Artist Name', meta:'Hip-Hop · Bangalore',
    bgGrad:'linear-gradient(135deg,#1f0a0a,#3a1a1a)',
    overlayGrad:'linear-gradient(135deg,rgba(239,68,68,0.3),rgba(255,107,0,0.3))',
  },
  {
    id:'a4', delay:' au-d3', genre:'electronic', genreLabel:'Electronic', name:'Artist Name', meta:'Electronic · Pune',
    bgGrad:'linear-gradient(135deg,#0a1a2e,#0a0a3a)',
    overlayGrad:'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(168,85,247,0.3))',
  },
  {
    id:'a5', delay:' au-d1', genre:'punjabi', genreLabel:'Punjabi', name:'Artist Name', meta:'Punjabi · Chandigarh',
    bgGrad:'linear-gradient(135deg,#1a1500,#2e2200)',
    overlayGrad:'linear-gradient(135deg,rgba(234,179,8,0.3),rgba(255,107,0,0.3))',
  },
  {
    id:'a6', delay:' au-d2', genre:'rnb', genreLabel:'R&B', name:'Artist Name', meta:'R&B · Chennai',
    bgGrad:'linear-gradient(135deg,#0f0a1a,#1a0f2e)',
    overlayGrad:'linear-gradient(135deg,rgba(236,72,153,0.3),rgba(139,92,246,0.3))',
  },
]

const FILTERS = [
  {value:'all',label:'All'},
  {value:'pop',label:'Pop'},
  {value:'hiphop',label:'Hip-Hop'},
  {value:'electronic',label:'Electronic'},
  {value:'folk',label:'Folk'},
  {value:'rnb',label:'R&B'},
  {value:'indie',label:'Indie'},
  {value:'punjabi',label:'Punjabi'},
]

export default function Artists() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredCard, setHoveredCard] = useState(null)
  const [lockedCard, setLockedCard] = useState(null)

  const visible = CARDS.filter(c => activeFilter === 'all' || c.genre === activeFilter)

  function handleMouseEnter(id) {
    if (lockedCard === id) return
    setHoveredCard(id)
  }
  function handleMouseLeave(id) {
    if (lockedCard === id) return
    setHoveredCard(null)
  }
  function handleClick(id) {
    if (lockedCard === id) {
      setLockedCard(null)
      setHoveredCard(null)
    } else {
      setLockedCard(id)
      setHoveredCard(null)
    }
  }

  return (
    <>
      <section className="pg-hero">
        <div className="pg-hero-grid"></div>
        <div className="pg-hero-glow"></div>
        <div className="pg-hero-inner">
          <div className="pg-eyebrow au"><span className="pg-eyebrow-dot"></span>Tunefry Family</div>
          <h1 className="au au-d1">Meet the <em>Artists</em></h1>
          <p className="pg-hero-sub au au-d2">Independent artists across India and beyond — distributed, promoted, and growing on Tunefry. Hover or tap any card to hear their story.</p>
          <div className="pg-stats au au-d3">
            <div className="pg-stat"><span className="pg-stat-val"><span>50</span>+</span><span className="pg-stat-lbl">Artists</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>100</span>+</span><span className="pg-stat-lbl">Platforms</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>10K</span>+</span><span className="pg-stat-lbl">Monthly Listeners</span></div>
            <div className="pg-stat"><span className="pg-stat-val"><span>8</span>+</span><span className="pg-stat-lbl">Genres</span></div>
          </div>
        </div>
      </section>

      <div className="filter-bar au">
        {FILTERS.map(f => (
          <button key={f.value} className={`filter-btn${activeFilter === f.value ? ' active' : ''}`} onClick={() => setActiveFilter(f.value)}>
            {f.label}
          </button>
        ))}
        <span className="filter-count"><span>{visible.length}</span> artists</span>
      </div>

      <section className="artists-section">
        <div className="artists-inner">
          <div className="ag-grid">
            {visible.map(card => {
              const flipped = lockedCard === card.id || hoveredCard === card.id
              return (
                <div
                  key={card.id}
                  className={`ag-card au${card.delay}`}
                  onMouseEnter={() => handleMouseEnter(card.id)}
                  onMouseLeave={() => handleMouseLeave(card.id)}
                  onClick={() => handleClick(card.id)}
                >
                  <div className="flip-inner" style={{
                    position:'relative',width:'100%',height:'100%',
                    transition:'transform 0.7s cubic-bezier(0.4,0.2,0.2,1)',
                    transformStyle:'preserve-3d',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}>
                    {/* FRONT */}
                    <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',borderRadius:'16px',overflow:'hidden',display:'flex',alignItems:'flex-end'}}>
                      <div style={{position:'absolute',inset:0,background:card.bgGrad}}></div>
                      <div style={{position:'absolute',inset:0,background:card.overlayGrad}}></div>
                      <img className="ac-img" alt="" src="" />
                      <div className="ac-scrim"></div>
                      <div className="ac-genre-tag">{card.genreLabel}</div>
                      <div style={{position:'relative',padding:'18px',width:'100%',zIndex:1}}>
                        <div style={{fontFamily:'var(--font-d)',fontSize:'18px',fontWeight:800,color:'#fff'}}>{card.name}</div>
                        <div style={{fontSize:'11px',color:'rgba(255,255,255,0.6)',marginTop:'3px'}}>{card.meta}</div>
                      </div>
                    </div>
                    {/* BACK */}
                    <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:'rotateY(180deg)',borderRadius:'16px',overflow:'hidden',background:'#0a0a0a',display:'flex',flexDirection:'column'}}>
                      <div style={{position:'relative',flex:1,overflow:'hidden'}}>
                        <div className="ac-video-wrap">
                          <iframe src="about:blank" title={card.name} loading="lazy" allowFullScreen allow="autoplay"></iframe>
                        </div>
                      </div>
                      <div style={{padding:'12px 14px',background:'rgba(0,0,0,0.88)',flexShrink:0}}>
                        <div style={{fontFamily:'var(--font-d)',fontSize:'12px',fontWeight:700,color:'#fff'}}>{card.name}</div>
                        <div style={{fontSize:'10px',color:'rgba(255,255,255,0.5)'}}>Watch testimonial &#9654;</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {visible.length === 0 && (
              <div className="ag-empty" style={{display:'block'}}>
                <div className="ag-empty-icon">&#127925;</div>
                <p>No artists found for this genre yet.<br />More coming soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-glow"></div>
        <div className="au">
          <h2>Are You an <em>Artist?</em></h2>
          <p>Join the Tunefry family. Distribute your music to 100+ platforms, keep 100% of your royalties, and grow your audience.</p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-hero">Join Tunefry Free</Link>
            <Link to="/pricing" className="btn-hero-outline">View Plans</Link>
          </div>
        </div>
      </section>
    </>
  )
}
