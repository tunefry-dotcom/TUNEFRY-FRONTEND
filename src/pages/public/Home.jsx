import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/home-page.css'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target) }
        }),
      { threshold: 0.05, rootMargin: '0px 0px 60px 0px' }
    )
    els.forEach((el) => io.observe(el))
    document.querySelectorAll('.hero .au').forEach((el) => el.classList.add('vis'))
    const timer = { id: null }
    const onScroll = () => {
      clearTimeout(timer.id)
      timer.id = setTimeout(() => {
        document.querySelectorAll('.pub-page .au').forEach((e) => {
          const r = e.getBoundingClientRect()
          if (r.top < window.innerHeight + 120) e.classList.add('vis')
        })
      }, 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])
}

const PLATFORMS = [
  { name: 'Spotify', color: '#1DB954' },
  { name: 'Apple Music', color: '#FC3C44' },
  { name: 'YouTube Music', color: '#FF0000' },
  { name: 'JioSaavn', color: '#00AEB3' },
  { name: 'Hungama', color: '#FF6600' },
  { name: 'Deezer', color: '#00B3E3' },
  { name: 'Amazon Music', color: '#FF9900' },
  { name: 'Instagram Music', color: '#E1306C' },
  { name: 'SoundCloud', color: '#FF5500' },
  { name: 'Tidal', color: '#333', border: '1px solid #555' },
  { name: 'Pandora', color: '#0066CC' },
  { name: 'Mixcloud', color: '#4A154B' },
]

const ARTIST_CARDS = [
  { grad: 'linear-gradient(135deg,#1a0a2e,#16213e)', overlay: 'linear-gradient(135deg,rgba(255,107,0,0.3),rgba(139,92,246,0.3))', videoId: 'VIDEO_ID_1' },
  { grad: 'linear-gradient(135deg,#0d1f0d,#1a3a1a)', overlay: 'linear-gradient(135deg,rgba(45,202,114,0.3),rgba(6,182,212,0.3))', videoId: 'VIDEO_ID_2' },
  { grad: 'linear-gradient(135deg,#1f0a0a,#3a1a1a)', overlay: 'linear-gradient(135deg,rgba(239,68,68,0.3),rgba(255,107,0,0.3))', videoId: 'VIDEO_ID_3' },
  { grad: 'linear-gradient(135deg,#0a1a2e,#0a0a3a)', overlay: 'linear-gradient(135deg,rgba(59,130,246,0.3),rgba(168,85,247,0.3))', videoId: 'VIDEO_ID_4' },
  { grad: 'linear-gradient(135deg,#1a1500,#2e2200)', overlay: 'linear-gradient(135deg,rgba(234,179,8,0.3),rgba(255,107,0,0.3))', videoId: 'VIDEO_ID_5' },
  { grad: 'linear-gradient(135deg,#0f0a1a,#1a0f2e)', overlay: 'linear-gradient(135deg,rgba(236,72,153,0.3),rgba(139,92,246,0.3))', videoId: 'VIDEO_ID_6' },
]

const YT_CARDS = [
  { videoId: 'YOUTUBE_VIDEO_ID_A', bg: 'linear-gradient(135deg,#1a0a2e,#2d1060)', title: 'How to Distribute Your Music', channel: 'Tunefry Official' },
  { videoId: 'YOUTUBE_VIDEO_ID_B', bg: 'linear-gradient(135deg,#0a1a2e,#0a3060)', title: 'Playlist Pitching Guide', channel: 'Tunefry Official' },
  { videoId: 'YOUTUBE_VIDEO_ID_C', bg: 'linear-gradient(135deg,#0d1f0d,#1a3a1a)', title: 'Understanding Music Royalties', channel: 'Tunefry Official' },
  { videoId: 'YOUTUBE_VIDEO_ID_D', bg: 'linear-gradient(135deg,#1f0a0a,#3a1a1a)', title: 'Artist Success Story', channel: 'Tunefry Official' },
  { videoId: 'YOUTUBE_VIDEO_ID_E', bg: 'linear-gradient(135deg,#1a1500,#3a2e00)', title: 'Tunefry vs Other Distributors', channel: 'Tunefry Official' },
  { videoId: 'YOUTUBE_VIDEO_ID_F', bg: 'linear-gradient(135deg,#0a0a1a,#1a1a3a)', title: 'Getting Started on Tunefry', channel: 'Tunefry Official' },
]

const FAQS = [
  {
    q: 'What streaming platforms does Tunefry distribute to?',
    a: 'Tunefry distributes to 100+ platforms including Spotify, Apple Music, YouTube Music, Amazon Music, JioSaavn, Hungama, Tidal, Deezer, Pandora, Instagram Music, and many more — including all major Indian and global DSPs.',
    delay: '',
  },
  {
    q: 'What does 100% royalties mean?',
    a: 'With our Single Artist, Double Artist, and Label plans, every rupee your music earns on streaming platforms goes directly to you. We charge a flat annual fee — no percentage cut on your earnings, ever.',
    delay: ' au-d1',
  },
  {
    q: 'How long does it take for my music to go live?',
    a: 'Most releases go live within 24–48 working hours on premium plans. The Free plan typically takes up to 10 working days. Spotify and Apple Music usually reflect within 24 hours of approval.',
    delay: ' au-d2',
  },
  {
    q: 'Can I transfer my catalogue from another distributor?',
    a: 'Yes! We offer seamless catalogue migration from any distributor — DistroKid, TuneCore, Amuse, CD Baby, and more. Zero downtime means your music stays live throughout the transfer process.',
    delay: ' au-d3',
  },
  {
    q: 'What support do I get as a Tunefry artist?',
    a: "All artists get email support. Premium plan artists get mail, phone, and WhatsApp support with dedicated artist relations. We're a real team in Delhi — not a chatbot.",
    delay: ' au-d4',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: "Absolutely. You can start with the free plan and upgrade at any time. Your existing releases and earnings are never affected. Simply upgrade and immediately unlock the new plan's benefits.",
    delay: ' au-d5',
  },
]

const CHECK_SVG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

export default function Home() {
  useScrollReveal()
  const [ytId, setYtId] = useState(null)
  const [faqOpen, setFaqOpen] = useState(null)
  const [flipped, setFlipped] = useState({})
  const acRef = useRef(null)
  const drag = useRef({ on: false, startX: 0, scrollLeft: 0 })

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = ytId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [ytId])

  // Service flip card tap toggle (mirrors vanilla JS click handler)
  useEffect(() => {
    const cards = document.querySelectorAll('.h-flip-wrap')
    const handlers = []
    cards.forEach((w) => {
      const fn = () => w.classList.toggle('tapped')
      w.addEventListener('click', fn)
      handlers.push({ el: w, fn })
    })
    return () => handlers.forEach(({ el, fn }) => el.removeEventListener('click', fn))
  }, [])

  const acScroll = (dir) => { if (acRef.current) acRef.current.scrollBy({ left: dir * 260, behavior: 'smooth' }) }
  const toggleFaq = (i) => setFaqOpen(faqOpen === i ? null : i)
  const toggleFlip = (i) => setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))

  // Drag-to-scroll for artist carousel
  const onAcMouseDown = (e) => {
    const c = acRef.current; if (!c) return
    drag.current = { on: true, startX: e.pageX - c.offsetLeft, scrollLeft: c.scrollLeft }
    c.style.cursor = 'grabbing'
  }
  const onAcMouseMove = (e) => {
    if (!drag.current.on) return
    e.preventDefault()
    const c = acRef.current; if (!c) return
    c.scrollLeft = drag.current.scrollLeft - (e.pageX - c.offsetLeft - drag.current.startX) * 1.5
  }
  const onAcMouseUp = () => {
    drag.current.on = false
    if (acRef.current) acRef.current.style.cursor = ''
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-inner">
          {/* LEFT */}
          <div className="hero-left au">
            <div className="hero-badge">
              <span className="badge-dot" />
              100% Royalty &middot; 100+ Platforms &middot; Instant Distribution
            </div>
            <h1>
              Get Your Music<br />Heard <em>Worldwide</em>
            </h1>
            <p className="hero-sub">
              Distribute your music to 100+ streaming platforms, keep 100% of your royalties, and grow your fanbase with powerful analytics and promotion tools.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="btn-hero">Get Started Free</Link>
              <Link to="/pricing" className="btn-hero-outline">View Pricing</Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-val"><span>100</span>+</span>
                <span className="stat-lbl">Platforms</span>
              </div>
              <div className="hero-stat-sep" />
              <div className="hero-stat">
                <span className="stat-val"><span>100</span>%</span>
                <span className="stat-lbl">Royalties</span>
              </div>
              <div className="hero-stat-sep" />
              <div className="hero-stat">
                <span className="stat-val"><span>10K</span>+</span>
                <span className="stat-lbl">Artists</span>
              </div>
              <div className="hero-stat-sep" />
              <div className="hero-stat">
                <span className="stat-val">Since <span>'20</span></span>
                <span className="stat-lbl">Empowering Creators</span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="hero-right au au-d2"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}
          >
            <div style={{ position: 'relative' }}>
              {/* Dashboard card */}
              <div className="hero-card">
                <div className="card-top">
                  <span className="card-label">Now Playing</span>
                  <span className="live-badge"><span className="live-dot" /> LIVE</span>
                </div>
                <div className="now-playing">
                  <div className="np-title">Midnight Frequencies</div>
                  <div className="np-artist">by Krantiveer &bull; Spotify</div>
                  <div className="np-progress"><div className="np-bar" /></div>
                  <div className="np-times"><span>1:47</span><span>4:12</span></div>
                </div>
                <div className="eq-container">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="eq-bar" />
                  ))}
                </div>
                <div className="card-stats">
                  <div className="card-stat">
                    <div className="cs-label">Total Streams</div>
                    <div className="cs-val">230<span style={{ fontSize: '16px', color: 'var(--t3)' }}>K</span></div>
                  </div>
                  <div className="card-stat">
                    <div className="cs-label">Revenue</div>
                    <div className="cs-val green">$219</div>
                  </div>
                </div>
              </div>

              {/* Float badge — top right */}
              <div className="float-badge top-right">
                <div className="fb-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <div className="fb-text">
                  <span className="fb-val">100+</span>
                  <span className="fb-lbl">Platforms</span>
                </div>
              </div>

              {/* Float badge — bottom left */}
              <div className="float-badge bot-left">
                <div className="fb-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div className="fb-text">
                  <span className="fb-val">&#8377;1,599</span>
                  <span className="fb-lbl">/ year — Full plan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>

      {/* ── PLATFORM MARQUEE ── */}
      <div className="marquee-section">
        <div className="marquee-label">Distribute to every major platform</div>
        <div style={{ overflow: 'hidden' }}>
          <div className="marquee-track">
            {[...PLATFORMS, ...PLATFORMS].map((p, i) => (
              <div key={i} className="platform-pill">
                <span
                  className="pdot"
                  style={{ background: p.color, border: p.border || undefined }}
                />
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOPICS ── */}
      <div style={{ padding: '40px', background: 'var(--bg)', borderBottom: '0.5px solid var(--bd)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {[
              { icon: '🎵', label: 'Music Distribution' },
              { icon: '💰', label: '100% Royalties' },
              { icon: '🌍', label: 'Worldwide Distribution' },
              { icon: '🎯', label: 'Playlist & Radio Pitching' },
              { icon: '🔒', label: 'Copyright Protection' },
              { icon: '📊', label: 'Real-Time Analytics' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '14px 24px', background: 'var(--s1)',
                  border: '0.5px solid var(--bd)', borderRadius: '14px',
                  fontSize: '14px', fontWeight: 500,
                }}
              >
                <span style={{ fontSize: '20px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="how">
        <div className="sec-inner">
          <div className="sec-head au" style={{ textAlign: 'center' }}>
            <div className="sec-eyebrow">Simple Process</div>
            <h2 className="sec-title">Three steps to go global</h2>
            <p className="sec-sub" style={{ margin: '0 auto' }}>From recording to royalties in under 24 hours.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card au">
              <div className="step-num">01</div>
              <div className="step-icon">🎵</div>
              <h3>Upload your track</h3>
              <p>Upload your audio file, add cover art, set your release date, and fill in your track metadata. The whole process takes under 5 minutes.</p>
            </div>
            <div className="step-card au au-d1">
              <div className="step-num">02</div>
              <div className="step-icon">🌍</div>
              <h3>We distribute worldwide</h3>
              <p>Tunefry delivers your music to 100+ platforms within 24 hours. Spotify, Apple Music, JioSaavn, YouTube Music — all handled automatically.</p>
            </div>
            <div className="step-card au au-d2">
              <div className="step-num">03</div>
              <div className="step-icon">💸</div>
              <h3>Keep every rupee you earn</h3>
              <p>Streams turn into earnings. Watch your revenue grow in real-time on your dashboard and withdraw directly to your bank account — no cuts, no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW TUNEFRY HELPS ── */}
      <section className="pad-section" style={{ background: 'var(--bg)' }}>
        <div className="r2c" style={{ maxWidth: '1200px', margin: '0 auto', alignItems: 'center' }}>
          <div className="au">
            <div className="sec-eyebrow">How Tunefry Helps Artists</div>
            <h2 className="sec-title">
              Get Your Music Heard <em style={{ fontStyle: 'normal', color: 'var(--or)' }}>Worldwide</em>
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--t2)', lineHeight: 1.85, marginBottom: '24px', fontWeight: 300 }}>
              Tunefry is built from the ground up for independent artists who want global reach without sacrificing their earnings. We handle the technical complexity of getting your music onto every major platform — so you can focus on creating.
            </p>
            <p style={{ fontSize: '16px', color: 'var(--t2)', lineHeight: 1.85, marginBottom: '32px', fontWeight: 300 }}>
              From Spotify editorial playlists to radio stations across India, our dedicated team pitches your music to the right curators. Every stream on paid plans goes directly to you — no commissions, no deductions.
            </p>
            <Link
              to="/services"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--or)', color: '#fff', padding: '13px 28px',
                borderRadius: '10px', fontFamily: 'var(--font-d)', fontSize: '14px',
                fontWeight: 700, boxShadow: '0 0 28px rgba(255,107,0,.35)',
                transition: 'all .25s', textDecoration: 'none',
              }}
            >
              Explore All Services &rarr;
            </Link>
          </div>
          <div className="au au-d2 inner-grid2" style={{ gap: '14px' }}>
            {[
              { icon: '🎵', title: 'Music Distribution', desc: 'Reach 100+ platforms globally with a single upload.' },
              { icon: '🎯', title: 'Playlist Pitching', desc: 'Get featured in editorial and curated playlists.' },
              { icon: '📻', title: 'Radio Pitching', desc: 'Get your music played on FM and online radio.' },
              { icon: '💰', title: '100% Royalties', desc: 'Every rupee your music earns goes to you.', accent: true },
            ].map(({ icon, title, desc, accent }) => (
              <div
                key={title}
                style={{
                  background: accent
                    ? 'linear-gradient(135deg,rgba(255,107,0,0.06),var(--s1))'
                    : 'var(--s1)',
                  border: '0.5px solid var(--bd)', borderRadius: '16px', padding: '24px',
                  display: 'flex', flexDirection: 'column', gap: '10px',
                }}
              >
                <span style={{ fontSize: '28px' }}>{icon}</span>
                <div
                  style={{
                    fontFamily: 'var(--font-d)', fontSize: '15px', fontWeight: 700,
                    color: accent ? 'var(--or)' : undefined,
                  }}
                >
                  {title}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATALOGUE TRANSFER ── */}
      <section className="mig-section" style={{ background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div className="sec-eyebrow au">Seamless Migration</div>
          <h2 className="sec-title au au-d1" style={{ marginBottom: '16px' }}>
            Easiest Catalogue Transfer<br />&amp; Migration
          </h2>
          <p
            style={{
              fontSize: '16px', color: 'var(--t2)', maxWidth: '600px',
              margin: '0 auto 48px', lineHeight: 1.8, fontWeight: 300,
            }}
            className="au au-d2"
          >
            Already with another distributor? Switch to Tunefry without losing a single stream count, playlist placement, or release history. Our team handles the entire migration — zero downtime.
          </p>
          <div
            className="au au-d3"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: '16px', maxWidth: '900px', margin: '0 auto',
            }}
          >
            {[
              { icon: '📦', title: 'Transfer Your Catalog', desc: 'Move all your existing releases to Tunefry while keeping stream counts intact.' },
              { icon: '⚡', title: 'Zero Downtime', desc: 'Your music stays live throughout the migration process. No gaps in availability.' },
              { icon: '🤝', title: 'Dedicated Support', desc: 'Our team personally guides you through every step of the migration journey.' },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                style={{
                  background: 'var(--bg)', border: '0.5px solid var(--bd)',
                  borderRadius: '16px', padding: '28px 24px', textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: 'var(--or-d)', border: '0.5px solid var(--or-b)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', marginBottom: '16px',
                  }}
                >
                  {icon}
                </div>
                <div style={{ fontFamily: 'var(--font-d)', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                  {title}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '36px' }} className="au">
            <Link
              to="/"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'var(--or)', color: '#fff', padding: '13px 28px',
                borderRadius: '10px', fontFamily: 'var(--font-d)', fontSize: '14px',
                fontWeight: 700, boxShadow: '0 0 28px rgba(255,107,0,.3)',
                textDecoration: 'none',
              }}
            >
              Start Migration &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="stats-band-wrap">
        <div className="stats-inner au">
          {[
            { val: '100+', lbl: 'Global Platforms' },
            { val: '100%', lbl: 'Royalties to Artists' },
            { val: '10K+', lbl: 'Artists Served' },
            { val: '24h', lbl: 'Average Delivery Time' },
          ].map(({ val, lbl }) => (
            <div key={lbl} className="stat-block">
              <div className="stat-block-val">{val}</div>
              <div className="stat-block-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES / BENTO ── */}
      <section className="features">
        <div className="sec-inner">
          <div className="sec-head au">
            <div className="sec-eyebrow">What You Get</div>
            <h2 className="sec-title">Built for serious artists</h2>
            <p className="sec-sub">Every tool you need to release, protect, and grow your music career.</p>
          </div>
          <div className="bento-grid">
            <div className="bento-card large au">
              <div style={{ flex: '1.2' }}>
                <div className="bento-icon">💰</div>
                <h3>Keep everything you earn</h3>
                <p>Flat annual fee — that's it. No commission, no cut, no surprises. Your streams, your money.</p>
              </div>
              <div className="royalty-display">
                <div className="royalty-big">100%</div>
                <div className="royalty-sub">Royalties straight to you</div>
              </div>
            </div>
            <div className="bento-card au au-d1">
              <div className="bento-icon">🔒</div>
              <h3>Copyright protection</h3>
              <p>Automatic Content ID on YouTube and takedown tools to remove unauthorized uploads across the web.</p>
            </div>
            <div className="bento-card au au-d2">
              <div className="bento-icon">📊</div>
              <h3>Real-time analytics</h3>
              <p>Track streams, revenue, and audience data by platform, country, and date — all inside your dashboard.</p>
            </div>
            <div className="bento-card au">
              <div className="bento-icon">📱</div>
              <h3>Callertune (CRBT)</h3>
              <p>Turn your songs into caller tunes and reach millions on Airtel, Jio, and Vi networks.</p>
            </div>
            <div className="bento-card au au-d1">
              <div className="bento-icon">🎤</div>
              <h3>Lyrics distribution</h3>
              <p>Push your lyrics to Spotify, Apple Music, and Deezer so fans can follow along.</p>
            </div>
            <div className="bento-card au au-d2" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="bento-icon">🌐</div>
              <h3>Truly global reach</h3>
              <div className="platforms-display" style={{ marginTop: '16px' }}>
                <div className="platforms-big">100+</div>
                <div className="platforms-sub">Platforms in 180+ countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials">
        <div className="sec-inner">
          <div className="sec-head au" style={{ textAlign: 'center', maxWidth: '100%' }}>
            <div className="sec-eyebrow">Artists Love Us</div>
            <h2 className="sec-title">Trusted by thousands</h2>
          </div>
          <div className="testi-grid">
            {[
              {
                init: 'KV', name: 'Krantiveer', role: 'Independent Artist', delay: '',
                text: '"Tunefry made distributing my music incredibly easy. Within days I was on every major platform. The process was seamless from start to finish."',
              },
              {
                init: 'GD', name: 'Gold Doz', role: 'Hip-Hop Artist', delay: ' au-d1',
                text: '"The playlist pitching service alone was worth it. My streams tripled in the first month. 100% royalties mean more money in my pocket every time."',
              },
              {
                init: 'JS', name: 'Jerry Soni', role: 'Singer-Songwriter', delay: ' au-d2',
                text: '"100% royalties and transparent reporting — finally a distributor that actually respects artists. I\'ve recommended Tunefry to every musician I know."',
              },
              {
                init: 'RM', name: 'Rahul Mehra', role: 'Indie Pop Artist', delay: ' au-d3',
                text: '"The 24-hour approval is real. I uploaded on a Tuesday and was live on Spotify by Wednesday morning. No other distributor has come close to that speed."',
              },
              {
                init: 'PK', name: 'Priya Kaur', role: 'Punjabi Folk Artist', delay: ' au-d4',
                text: '"Switched from another distributor — the catalogue migration was completely seamless. All my streams and playlist positions were preserved. Highly recommend."',
              },
              {
                init: 'AV', name: 'Arjun Verma', role: 'Electronic Producer', delay: ' au-d5',
                text: '"The WhatsApp support alone sets Tunefry apart. Got a real person helping me fix a metadata issue within minutes. This is how artist relations should be done."',
              },
            ].map(({ init, name, role, delay, text }) => (
              <div key={name} className={`testi-card au${delay}`}>
                <div className="testi-stars">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testi-text">{text}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{init}</div>
                  <div>
                    <div className="testi-name">{name}</div>
                    <div className="testi-role">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR ARTISTS & PROJECTS ── */}
      <section className="pad-section" style={{ background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div className="sec-inner">
          <div
            className="sec-head au"
            style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '16px', marginBottom: '40px',
            }}
          >
            <div>
              <div className="sec-eyebrow">Meet the Artists</div>
              <h2 className="sec-title" style={{ marginBottom: '8px' }}>Our Artists &amp; Projects</h2>
              <p className="sec-sub" style={{ maxWidth: '480px', margin: 0 }}>
                Hover or tap a card to see their story and hear directly from them.
              </p>
            </div>
            <Link to="/artists" className="ac-view-all">View All Artists <span>&#8594;</span></Link>
          </div>

          <div className="ac-wrap">
            <button className="ac-arr prev" onClick={() => acScroll(-1)} aria-label="Previous">&#8249;</button>
            <div
              className="artist-grid"
              ref={acRef}
              onMouseDown={onAcMouseDown}
              onMouseMove={onAcMouseMove}
              onMouseUp={onAcMouseUp}
              onMouseLeave={onAcMouseUp}
            >
              {ARTIST_CARDS.map((a, i) => (
                <div
                  key={i}
                  className={`artist-card${flipped[i] ? ' flipped' : ''}`}
                  onClick={() => toggleFlip(i)}
                >
                  <div
                    className="flip-inner"
                    style={{
                      position: 'relative', width: '100%', height: '100%',
                      transition: 'transform 0.7s cubic-bezier(0.4,0.2,0.2,1)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* FRONT */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                        borderRadius: '16px', overflow: 'hidden',
                        display: 'flex', alignItems: 'flex-end',
                      }}
                    >
                      <div style={{ position: 'absolute', inset: 0, background: a.grad }} />
                      <div style={{ position: 'absolute', inset: 0, background: a.overlay }} />
                      <div
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(to top,rgba(0,0,0,0.8) 0%,transparent 60%)',
                        }}
                      />
                      <div style={{ position: 'relative', padding: '20px', width: '100%', zIndex: 1 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-d)', fontSize: '20px',
                            fontWeight: 800, color: '#fff',
                          }}
                        >
                          Artist Name
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                          Genre &middot; City
                        </div>
                      </div>
                    </div>
                    {/* BACK */}
                    <div
                      style={{
                        position: 'absolute', inset: 0,
                        backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)', borderRadius: '16px',
                        overflow: 'hidden', background: '#0a0a0a',
                        display: 'flex', flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', flex: 1, background: a.grad, overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div
                            style={{
                              width: '56px', height: '56px', borderRadius: '50%',
                              background: 'rgba(255,255,255,0.15)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '12px 16px',
                          background: 'rgba(0,0,0,0.85)',
                          flexShrink: 0,
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-d)', fontSize: '13px',
                            fontWeight: 700, color: '#fff',
                          }}
                        >
                          Artist Name
                        </div>
                        <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                          Watch testimonial &#9654;
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="ac-arr next" onClick={() => acScroll(1)} aria-label="Next">&#8250;</button>
          </div>
        </div>
      </section>

      {/* ── YOUTUBE VIDEOS ── */}
      <section style={{ background: 'var(--bg)', borderTop: '0.5px solid var(--bd)', padding: '96px 40px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto 40px' }}>
          <div className="sec-head au" style={{ textAlign: 'center' }}>
            <div className="sec-eyebrow">Watch &amp; Learn</div>
            <h2 className="sec-title">YouTube Videos</h2>
            <p className="sec-sub" style={{ maxWidth: '500px', margin: '0 auto' }}>
              Tips, tutorials and artist stories from the Tunefry team.
            </p>
          </div>
        </div>
        <div className="yt-slider-wrap">
          <div className="yt-track">
            {[...YT_CARDS, ...YT_CARDS].map((c, i) => (
              <div key={i} className="yt-card" onClick={() => setYtId(c.videoId)}>
                <div className="yt-thumb">
                  <div
                    className="yt-thumb-bg"
                    style={{ background: c.bg, position: 'absolute', inset: 0, borderRadius: '10px 10px 0 0' }}
                  />
                  <div className="yt-play-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
                <div className="yt-info">
                  <div className="yt-title">{c.title}</div>
                  <div className="yt-channel">{c.channel}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '28px' }}>
          <a
            href="https://www.youtube.com/@tunefry"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 24px', border: '0.5px solid rgba(255,255,255,0.15)',
              borderRadius: '100px', fontSize: '13px', color: 'var(--t2)',
              textDecoration: 'none', transition: 'all .2s',
            }}
          >
            View Channel &rarr;
          </a>
        </div>
      </section>

      {/* ── YOUTUBE LIGHTBOX ── */}
      <div
        className={`yt-lb${ytId ? ' open' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) setYtId(null) }}
      >
        <div className="yt-lb-inner">
          <button className="yt-lb-close" onClick={() => setYtId(null)}>&#10005;</button>
          <iframe
            src={ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1` : ''}
            title="YouTube video"
            allowFullScreen
            allow="autoplay;encrypted-media"
          />
        </div>
      </div>

      {/* ── TRENDING ON TUNEFRY ── */}
      <section className="pad-section" style={{ background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div className="sec-inner">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
            <div className="au">
              <div className="sec-eyebrow">What's Hot</div>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>Trending On Tunefry</h2>
            </div>
            <Link to="/trending" style={{ fontSize: '13px', color: 'var(--or)', whiteSpace: 'nowrap', textDecoration: 'none' }}>
              View all &rarr;
            </Link>
          </div>
          <div
            style={{
              display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '12px',
              scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {[
              { grad: 'linear-gradient(135deg,rgba(255,107,0,0.4),rgba(139,92,246,0.4),#111)', badge: 'hot', delay: '' },
              { grad: 'linear-gradient(135deg,rgba(45,202,114,0.4),rgba(6,182,212,0.4),#111)', badge: 'hot', delay: ' au-d1' },
              { grad: 'linear-gradient(135deg,rgba(59,130,246,0.4),rgba(168,85,247,0.4),#111)', badge: 'hot', delay: ' au-d2' },
              { grad: 'linear-gradient(135deg,rgba(236,72,153,0.4),rgba(255,107,0,0.4),#111)', badge: 'rising', delay: ' au-d3' },
              { grad: 'linear-gradient(135deg,rgba(234,179,8,0.4),rgba(45,202,114,0.4),#111)', badge: 'rising', delay: ' au-d4' },
              { grad: 'linear-gradient(135deg,rgba(139,92,246,0.4),rgba(59,130,246,0.4),#111)', badge: 'hot', delay: ' au-d1' },
            ].map((c, i) => (
              <div key={i} className={`tr-card au${c.delay}`}>
                <div className="tr-art">
                  <div className="tr-art-bg" style={{ background: c.grad, position: 'absolute', inset: 0 }} />
                  <div className={`tr-badge ${c.badge}`}>{c.badge === 'hot' ? '🔥 Hot' : '↑ Rising'}</div>
                </div>
                <div className="tr-info">
                  <div className="tr-track">Track Name</div>
                  <div className="tr-artist">Artist Name</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPOTIFY EMBEDS ── */}
      <section className="pad-section" style={{ background: 'var(--bg)', borderTop: '0.5px solid var(--bd)' }}>
        <div className="sec-inner">
          <div className="sec-head au" style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="sec-eyebrow">Stream Now</div>
            <h2 className="sec-title">On Spotify</h2>
            <p className="sec-sub" style={{ maxWidth: '480px', margin: '0 auto' }}>
              Listen to the latest releases and top hits from Tunefry artists.
            </p>
          </div>
          <div className="r2c" style={{ alignItems: 'start' }}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-d)', fontSize: '13px', fontWeight: 700,
                  color: 'var(--t2)', letterSpacing: '1px', textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                Latest Release
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
                  border: '0.5px solid rgba(255,255,255,0.08)', padding: '16px',
                }}
              >
                <iframe
                  style={{ borderRadius: '10px' }}
                  src="https://open.spotify.com/embed/track/TRACK_ID_HERE?utm_source=generator&theme=0"
                  width="100%" height="152" frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Latest Release"
                />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-d)', fontSize: '13px', fontWeight: 700,
                  color: 'var(--t2)', letterSpacing: '1px', textTransform: 'uppercase',
                  margin: '24px 0 14px',
                }}
              >
                Popular Artists
              </div>
              <div className="inner-grid2" style={{ gap: '12px' }}>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
                    border: '0.5px solid rgba(255,255,255,0.08)', padding: '12px',
                  }}
                >
                  <iframe
                    style={{ borderRadius: '8px' }}
                    src="https://open.spotify.com/embed/artist/ARTIST_ID_1?utm_source=generator&theme=0"
                    width="100%" height="152" frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Artist 1"
                  />
                </div>
                <div
                  style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
                    border: '0.5px solid rgba(255,255,255,0.08)', padding: '12px',
                  }}
                >
                  <iframe
                    style={{ borderRadius: '8px' }}
                    src="https://open.spotify.com/embed/artist/ARTIST_ID_2?utm_source=generator&theme=0"
                    width="100%" height="152" frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Artist 2"
                  />
                </div>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-d)', fontSize: '13px', fontWeight: 700,
                  color: 'var(--t2)', letterSpacing: '1px', textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                This Week's Top Hits
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: '14px',
                  border: '0.5px solid rgba(255,255,255,0.08)', padding: '16px',
                }}
              >
                <iframe
                  style={{ borderRadius: '10px' }}
                  src="https://open.spotify.com/embed/playlist/PLAYLIST_ID_HERE?utm_source=generator&theme=0"
                  width="100%" height="352" frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title="Top Hits Playlist"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES ── */}
      <section className="pad-section" style={{ background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div className="sec-inner">
          <div className="sec-head au" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <div className="sec-eyebrow">What We Offer</div>
            <h2 className="sec-title">Our Services</h2>
            <p className="sec-sub" style={{ maxWidth: '520px', margin: '0 auto' }}>
              Hover or tap any card to learn more.
            </p>
          </div>
          <div className="home-svc-grid">

            {/* 1 — Digital Music Distribution */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#3B82F6' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Digital Music Distribution</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(59,130,246,0.28),rgba(4,10,32,0.96))' }}>
                  <div className="h-fb-title">Digital Music Distribution</div>
                  <div className="h-fb-desc">Publish your songs across 100+ platforms including Spotify, Apple Music, JioSaavn, Amazon Music, and more with reliable digital music distribution.</div>
                </div>
              </div>
            </div>

            {/* 2 — Music Marketing & Playlist Pitching */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#2DCA72' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(45,202,114,0.15)', border: '0.5px solid rgba(45,202,114,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#2DCA72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Music Marketing &amp; Playlist Pitching</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(45,202,114,0.28),rgba(0,26,12,0.96))' }}>
                  <div className="h-fb-title">Music Marketing &amp; Playlist Pitching</div>
                  <div className="h-fb-desc">Promote your songs through editorial playlists on Spotify, curated marketing strategies, and targeted audience discovery.</div>
                </div>
              </div>
            </div>

            {/* 3 — Callertune (CRBT) */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#FF6B00' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(255,107,0,0.15)', border: '0.5px solid rgba(255,107,0,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 015.19 12a19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Callertune (CRBT)</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(255,107,0,0.28),rgba(32,12,0,0.96))' }}>
                  <div className="h-fb-title">Callertune (CRBT)</div>
                  <div className="h-fb-desc">Turn your songs into caller tunes and reach millions of mobile users across India through all major telecom operators.</div>
                </div>
              </div>
            </div>

            {/* 4 — Artist Services */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#A855F7' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(168,85,247,0.15)', border: '0.5px solid rgba(168,85,247,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Artist Services</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(168,85,247,0.28),rgba(20,0,38,0.96))' }}>
                  <div className="h-fb-title">Artist Services</div>
                  <div className="h-fb-desc">Access professional one-on-one support designed for creators. Our dedicated team helps you grow your career and navigate the music industry.</div>
                </div>
              </div>
            </div>

            {/* 5 — Song Transfer & Portability */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#06B6D4' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(6,182,212,0.15)', border: '0.5px solid rgba(6,182,212,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 014-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 01-4 4H3" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Song Transfer &amp; Portability</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(6,182,212,0.28),rgba(0,20,30,0.96))' }}>
                  <div className="h-fb-title">Song Transfer &amp; Portability</div>
                  <div className="h-fb-desc">Easily transfer your entire music catalog from DistroKid, TuneCore, CD Baby, or any other distributor to Tunefry without losing stream counts.</div>
                </div>
              </div>
            </div>

            {/* 6 — Content ID (YouTube) */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#EF4444' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(239,68,68,0.15)', border: '0.5px solid rgba(239,68,68,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Content ID (YouTube)</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(239,68,68,0.28),rgba(38,0,0,0.96))' }}>
                  <div className="h-fb-title">Content ID (YouTube)</div>
                  <div className="h-fb-desc">Protect your music on YouTube with Content ID and automatically monetize every video that uses your tracks across the platform.</div>
                </div>
              </div>
            </div>

            {/* 7 — Lyrics Distribution */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#EC4899' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(236,72,153,0.15)', border: '0.5px solid rgba(236,72,153,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="17" y1="10" x2="3" y2="10" />
                      <line x1="21" y1="6" x2="3" y2="6" />
                      <line x1="21" y1="14" x2="3" y2="14" />
                      <line x1="17" y1="18" x2="3" y2="18" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Lyrics Distribution</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(236,72,153,0.28),rgba(38,0,18,0.96))' }}>
                  <div className="h-fb-title">Lyrics Distribution</div>
                  <div className="h-fb-desc">Distribute your song lyrics to Spotify, Apple Music, and other major streaming platforms for enhanced listener engagement.</div>
                </div>
              </div>
            </div>

            {/* 8 — Reports & Analytics */}
            <div className="h-flip-wrap au" style={{ '--hfa': '#8B5CF6' }}>
              <div className="h-flip-inner">
                <div className="h-flip-face h-flip-front">
                  <div className="h-flip-icon" style={{ background: 'rgba(139,92,246,0.15)', border: '0.5px solid rgba(139,92,246,0.3)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                      <path d="M3 3v18h18" />
                    </svg>
                  </div>
                  <div className="h-flip-name">Reports &amp; Analytics</div>
                  <div className="h-flip-hint">&#8635;</div>
                </div>
                <div className="h-flip-face h-flip-back" style={{ background: 'linear-gradient(145deg,rgba(139,92,246,0.28),rgba(18,0,40,0.96))' }}>
                  <div className="h-fb-title">Reports &amp; Analytics</div>
                  <div className="h-fb-desc">Track your music performance with detailed real-time analytics across all platforms — streams, revenue, audience location, and growth trends.</div>
                </div>
              </div>
            </div>

          </div>
          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link
              to="/services"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px',
                background: 'linear-gradient(135deg,var(--or),#ff8a40)',
                borderRadius: '100px', fontFamily: 'var(--font-d)', fontSize: '13px',
                fontWeight: 700, color: '#fff', textDecoration: 'none',
                boxShadow: '0 6px 20px rgba(255,107,0,0.35)',
              }}
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRICING TEASER ── */}
      <section className="pricing-teaser">
        <div className="sec-inner">
          <div
            className="sec-head au"
            style={{
              display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
              flexWrap: 'wrap', gap: '20px',
            }}
          >
            <div>
              <div className="sec-eyebrow">Simple Pricing</div>
              <h2 className="sec-title" style={{ marginBottom: 0 }}>Plans for every artist</h2>
            </div>
            <Link
              to="/pricing"
              style={{
                fontSize: '14px', color: 'var(--or)',
                display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
              }}
            >
              See all plans &rarr;
            </Link>
          </div>
          <div className="pricing-teaser-grid au">
            {/* Free */}
            <div className="plan-card">
              <div className="plan-icon-big">🎵</div>
              <div className="plan-name">Free</div>
              <div className="plan-tagline">Get started at zero cost</div>
              <div className="plan-price-row">
                <span className="plan-cur">&#8377;</span>
                <span className="plan-val">0</span>
                <span className="plan-per">forever free</span>
              </div>
              <div className="royalty-badge or">&#9733; 75% royalties</div>
              <ul className="plan-feats-mini">
                {['100+ DSPs', 'Customised caller tune', 'Custom release date', 'Spotify verification', 'Lifetime legacy'].map((f) => (
                  <li key={f}><span className="fchk or">{CHECK_SVG}</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="plan-cta outline">Get Started Free</Link>
            </div>
            {/* Single Artist */}
            <div className="plan-card featured">
              <div className="plan-icon-big">&#9733;</div>
              <div className="plan-name">Single Artist</div>
              <div className="plan-tagline">For serious independent artists</div>
              <div className="plan-price-row">
                <span className="plan-cur">&#8377;</span>
                <span className="plan-val">1,599</span>
                <span className="plan-per">/ year</span>
              </div>
              <div className="royalty-badge gr">&#10003; 100% royalties</div>
              <ul className="plan-feats-mini">
                {['Unlimited releases', 'Playlist & radio pitching', 'Content ID protection', 'YouTube OAC setup', 'WhatsApp support'].map((f) => (
                  <li key={f}><span className="fchk gr">{CHECK_SVG}</span>{f}</li>
                ))}
              </ul>
              <Link to="/signup" className="plan-cta fill">Start Distributing</Link>
            </div>
          </div>
          <p className="pricing-teaser-more">
            Also available: Double Artist, Label Plan &mdash;{' '}
            <Link to="/pricing">see full pricing</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pad-section" style={{ background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="sec-head au" style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div className="sec-eyebrow">FAQ</div>
            <h2 className="sec-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: `0.5px solid ${faqOpen === i ? 'rgba(255,107,0,0.3)' : 'rgba(255,255,255,0.10)'}`,
                  borderRadius: '12px', overflow: 'hidden', transition: 'border-color .3s',
                }}
                className={`faq-home-item au${faq.delay}`}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 20px', cursor: 'pointer', userSelect: 'none',
                  }}
                  onClick={() => toggleFaq(i)}
                >
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{faq.q}</span>
                  <span
                    className="faq-h-ico"
                    style={{
                      fontSize: '18px', color: 'var(--t3)', lineHeight: 1,
                      transition: 'transform .3s',
                      transform: faqOpen === i ? 'rotate(45deg)' : 'none',
                    }}
                  >
                    +
                  </span>
                </div>
                <div
                  className="faq-h-ans"
                  style={{ maxHeight: faqOpen === i ? '400px' : 0, overflow: 'hidden', transition: 'max-height .4s ease' }}
                >
                  <p style={{ fontSize: '13.5px', color: 'var(--t2)', padding: '0 20px 18px', lineHeight: 1.7, margin: 0 }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT US ── */}
      <section className="about-section" style={{ background: 'var(--bg)', borderTop: '0.5px solid var(--bd)' }}>
        <div className="sec-inner">
          <div className="r2c" style={{ alignItems: 'center' }}>
            <div className="au">
              <div className="sec-eyebrow">Who We Are</div>
              <h2 className="sec-title">About Tunefry</h2>
              <p style={{ fontSize: '15px', color: 'var(--t2)', lineHeight: 1.85, marginBottom: '16px', fontWeight: 300 }}>
                Founded in 2020, Tunefry is India's fastest-growing music distribution platform. We empower independent artists and record labels to distribute their music to 100+ streaming platforms worldwide — all while keeping 100% of their royalties.
              </p>
              <p style={{ fontSize: '15px', color: 'var(--t2)', lineHeight: 1.85, marginBottom: '32px', fontWeight: 300 }}>
                From Delhi, we've helped thousands of artists across India get their music heard on Spotify, Apple Music, JioSaavn, and beyond. We believe every artist deserves a fair deal — zero commission, maximum reach.
              </p>
              <div
                style={{
                  display: 'flex', gap: 'clamp(12px,4vw,32px)',
                  paddingTop: '32px', borderTop: '0.5px solid var(--bd)', flexWrap: 'wrap',
                }}
              >
                {[
                  { val: '2020', lbl: 'Founded' },
                  { val: '10K+', lbl: 'Artists' },
                  { val: '100+', lbl: 'Platforms' },
                ].map(({ val, lbl }, idx) => (
                  <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,4vw,32px)' }}>
                    {idx > 0 && (
                      <div style={{ width: '1px', background: 'var(--bd)', height: '40px', flexShrink: 0 }} />
                    )}
                    <div>
                      <div style={{ fontFamily: 'var(--font-d)', fontSize: '28px', fontWeight: 800, color: 'var(--or)' }}>
                        {val}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--t3)', marginTop: '2px' }}>{lbl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="au au-d2" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                {
                  iconBg: 'rgba(255,107,0,0.15)', iconBorder: 'rgba(255,107,0,0.3)',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  title: 'Our Mission',
                  desc: 'To democratise music distribution for every Indian artist — making global reach affordable, transparent, and artist-first.',
                },
                {
                  iconBg: 'rgba(45,202,114,0.15)', iconBorder: 'rgba(45,202,114,0.3)',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2DCA72" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  ),
                  title: 'Our Team',
                  desc: 'A passionate team of music enthusiasts, tech builders, and industry veterans — all dedicated to helping you succeed.',
                },
                {
                  iconBg: 'rgba(59,130,246,0.15)', iconBorder: 'rgba(59,130,246,0.3)',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                  title: 'Our Vision',
                  desc: 'To be the most trusted music partner for independent artists across South Asia and globally.',
                },
              ].map(({ iconBg, iconBorder, icon, title, desc }) => (
                <div
                  key={title}
                  style={{
                    padding: '22px 24px',
                    background: 'linear-gradient(165deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))',
                    backdropFilter: 'blur(12px)', border: '0.5px solid rgba(255,255,255,0.10)',
                    borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'flex-start',
                  }}
                >
                  <div
                    style={{
                      width: '40px', height: '40px', flexShrink: 0, borderRadius: '10px',
                      background: iconBg, border: `0.5px solid ${iconBorder}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-d)', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
                      {title}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--t2)', lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="cta-glow" />
        <div className="sec-inner au">
          <h2>Your Music.<br /><em>Your Earnings.</em></h2>
          <p>
            Join thousands of independent artists who trust Tunefry to get their music on every major platform.<br />
            No hidden fees, no contracts — just music.
          </p>
          <div className="cta-actions">
            <Link to="/signup" className="btn-hero">Start Free Today</Link>
            <Link to="/pricing" className="btn-hero-outline">View Plans</Link>
          </div>
        </div>
      </section>

      {/* ── SECOND AD BANNER ── */}
      <div
        style={{
          width: '100%', padding: '20px 40px',
          background: 'var(--s1)', borderTop: '0.5px solid var(--bd)', textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '728px', margin: '0 auto', height: '90px',
            background: 'var(--bg)', border: '0.5px solid var(--bd)',
            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '11px', color: 'var(--t3)', letterSpacing: '0.3px' }}>
            Google Ad (728×90)
          </span>
        </div>
      </div>
    </>
  )
}
