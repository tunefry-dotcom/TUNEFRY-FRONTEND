import { useEffect } from 'react'
import { Link } from 'react-router-dom'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target) } }),
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach((el) => io.observe(el))
    document.querySelectorAll('.svc-hero .au').forEach((el) => el.classList.add('vis'))
    return () => io.disconnect()
  }, [])
}

const SERVICES = [
  {
    id: 'distribution',
    faccent: '#3B82F6',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="42"/><ellipse cx="50" cy="50" rx="22" ry="42"/>
        <line x1="8" y1="50" x2="92" y2="50"/><line x1="50" y1="8" x2="50" y2="92"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    name: 'Digital Music Distribution',
    backBg: 'linear-gradient(145deg,rgba(59,130,246,0.28),rgba(4,10,32,0.96))',
    desc: 'Publish your songs across 100+ platforms including Spotify, Apple Music, JioSaavn, Amazon Music, and more with reliable digital music distribution.',
  },
  {
    faccent: '#2DCA72',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#2DCA72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="15" y="15" width="70" height="70" rx="10"/>
        <line x1="28" y1="36" x2="72" y2="36"/>
        <line x1="28" y1="50" x2="72" y2="50"/>
        <line x1="28" y1="64" x2="58" y2="64"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#2DCA72" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    id: 'playlist-pitching',
    name: 'Music Marketing & Playlist Pitching',
    backBg: 'linear-gradient(145deg,rgba(45,202,114,0.28),rgba(0,26,12,0.96))',
    desc: 'Promote your songs through editorial playlists on Spotify, curated marketing strategies, and targeted audience discovery.',
  },
  {
    faccent: '#FF6B00',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="28" y="10" width="44" height="80" rx="8"/>
        <rect x="33" y="16" width="34" height="56" rx="4" opacity="0.15" fill="currentColor"/>
        <line x1="42" y1="78" x2="58" y2="78" strokeWidth="3"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
    id: 'callertune',
    name: 'Callertune (CRBT)',
    backBg: 'linear-gradient(145deg,rgba(255,107,0,0.28),rgba(32,12,0,0.96))',
    desc: 'Turn your songs into caller tunes and reach millions of mobile users across India through all major telecom operators.',
  },
  {
    faccent: '#A855F7',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="35" cy="30" r="14"/>
        <path d="M10 80 Q10 56 35 56 Q60 56 60 80"/>
        <circle cx="70" cy="32" r="12"/>
        <path d="M52 80 Q52 58 70 58 Q88 58 88 80"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    id: 'artist-services',
    name: 'Artist Services',
    backBg: 'linear-gradient(145deg,rgba(168,85,247,0.28),rgba(20,0,38,0.96))',
    desc: 'Access professional one-on-one support designed for creators. Our dedicated team helps you grow your career and navigate the music industry.',
  },
  {
    faccent: '#06B6D4',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="38"/>
        <polyline points="35,35 20,50 35,65"/>
        <polyline points="65,35 80,50 65,65"/>
        <line x1="20" y1="50" x2="80" y2="50"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9"/>
        <path d="M3 11V9a4 4 0 014-4h14"/>
        <polyline points="7 23 3 19 7 15"/>
        <path d="M21 13v2a4 4 0 01-4 4H3"/>
      </svg>
    ),
    id: 'song-transfer',
    name: 'Song Transfer & Portability',
    backBg: 'linear-gradient(145deg,rgba(6,182,212,0.28),rgba(0,20,30,0.96))',
    desc: 'Easily transfer your entire music catalog from DistroKid, TuneCore, CD Baby, or any other distributor to Tunefry without losing stream counts.',
  },
  {
    faccent: '#EF4444',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="22" width="84" height="56" rx="12"/>
        <polygon points="40,45 65,58 40,71" fill="currentColor" opacity="0.25" strokeWidth="2"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
    id: 'content-id',
    name: 'Content ID (YouTube)',
    backBg: 'linear-gradient(145deg,rgba(239,68,68,0.28),rgba(38,0,0,0.96))',
    desc: 'Protect your music on YouTube with Content ID and automatically monetize every video that uses your tracks across the platform.',
  },
  {
    faccent: '#EC4899',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="12" width="76" height="76" rx="8"/>
        <line x1="24" y1="30" x2="76" y2="30"/>
        <line x1="24" y1="44" x2="76" y2="44"/>
        <line x1="24" y1="58" x2="60" y2="58"/>
        <line x1="24" y1="72" x2="50" y2="72"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EC4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="17" y1="10" x2="3" y2="10"/>
        <line x1="21" y1="6" x2="3" y2="6"/>
        <line x1="21" y1="14" x2="3" y2="14"/>
        <line x1="17" y1="18" x2="3" y2="18"/>
      </svg>
    ),
    name: 'Lyrics Distribution',
    backBg: 'linear-gradient(145deg,rgba(236,72,153,0.28),rgba(38,0,18,0.96))',
    desc: 'Distribute your song lyrics to Spotify, Apple Music, and other major streaming platforms for enhanced listener engagement.',
  },
  {
    faccent: '#8B5CF6',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="10" width="80" height="80" rx="8" fill="currentColor" opacity="0.04"/>
        <line x1="10" y1="75" x2="90" y2="75"/>
        <line x1="20" y1="75" x2="20" y2="55" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>
        <line x1="36" y1="75" x2="36" y2="35" strokeWidth="8" strokeLinecap="round" opacity="0.7"/>
        <line x1="52" y1="75" x2="52" y2="45" strokeWidth="8" strokeLinecap="round" opacity="0.6"/>
        <line x1="68" y1="75" x2="68" y2="25" strokeWidth="8" strokeLinecap="round" opacity="0.8"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
        <path d="M3 3v18h18"/>
      </svg>
    ),
    name: 'Reports & Analytics',
    backBg: 'linear-gradient(145deg,rgba(139,92,246,0.28),rgba(18,0,40,0.96))',
    desc: 'Track your music performance with detailed real-time analytics across all platforms — streams, revenue, audience location, and growth trends.',
  },
  {
    faccent: '#EAB308',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="38"/>
        <circle cx="50" cy="50" r="28" strokeDasharray="5 4"/>
        <line x1="50" y1="22" x2="50" y2="78"/>
        <path d="M62 32 Q74 32 74 44 Q74 56 50 56 Q26 56 26 68 Q26 80 50 80"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    name: 'Affordable Plans',
    backBg: 'linear-gradient(145deg,rgba(234,179,8,0.28),rgba(30,22,0,0.96))',
    desc: 'Start free and scale as you grow. Tunefry offers the most affordable distribution plans for independent artists — starting at ₹0.',
  },
  {
    faccent: '#6366F1',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 10 L86 24 L86 52 Q86 78 50 90 Q14 78 14 52 L14 24 Z" opacity="0.15" fill="currentColor"/>
        <path d="M50 10 L86 24 L86 52 Q86 78 50 90 Q14 78 14 52 L14 24 Z"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    name: 'Copyright Protection',
    backBg: 'linear-gradient(145deg,rgba(99,102,241,0.28),rgba(10,10,40,0.96))',
    desc: 'Secure your music rights with robust copyright protection. We register your releases and defend your ownership across all digital platforms.',
  },
  {
    faccent: '#F97316',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="40"/>
        <line x1="18" y1="18" x2="82" y2="82" strokeWidth="8" strokeLinecap="round"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    name: 'Illegal Takedown',
    backBg: 'linear-gradient(145deg,rgba(249,115,22,0.28),rgba(40,8,0,0.96))',
    desc: 'Remove unauthorized copies of your music from online platforms. We file DMCA takedowns and protect your content from piracy.',
  },
  {
    faccent: '#14B8A6',
    bgSvg: (
      <svg viewBox="0 0 100 100" fill="none" stroke="#14B8A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="50" r="38"/>
        <path d="M26 50 Q26 26 50 26 Q74 26 74 50 Q74 74 50 74 Q26 74 26 50" fill="none"/>
        <path d="M35 50 Q35 38 50 38 Q65 38 65 50 Q65 62 50 62 Q35 62 35 50" fill="none"/>
      </svg>
    ),
    iconSvg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
      </svg>
    ),
    name: 'Lifetime Availability',
    backBg: 'linear-gradient(145deg,rgba(20,184,166,0.28),rgba(0,22,20,0.96))',
    desc: 'Your music stays live on all streaming platforms forever — no annual renewals needed. One upload, permanent presence.',
  },
]

const HIW_STEPS = [
  { num: '1', icon: '👤', title: 'Sign Up', desc: 'Create your free Tunefry account in under 2 minutes. No credit card required to get started.' },
  { num: '2', icon: '⬆️', title: 'Upload', desc: 'Upload your track, add artwork and metadata, choose your release date, and select your target platforms.' },
  { num: '3', icon: '🌐', title: 'Distribute', desc: 'We deliver your music to 100+ platforms worldwide within 24–48 hours. Fully automated, zero hassle.' },
  { num: '4', icon: '💰', title: 'Earn', desc: 'Track your streams in real-time and collect 100% of your royalties directly to your bank account.' },
]

export default function Services() {
  useScrollReveal()

  return (
    <>
      {/* ── HERO ── */}
      <section className="svc-hero">
        <div className="hero-orb" />
        <div className="pill au"><span className="pill-dot" />Artist Services</div>
        <h1 className="au au-d1">Tools to <em>Amplify</em><br />Your Career</h1>
        <p className="hero-sub au au-d2">
          From distribution to marketing consultation, playlist pitching to radio pitching — real services built for independent artists since 2020.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }} className="au au-d3">
          <Link to="/signup" className="btn-hero">Start Distributing Free →</Link>
          <Link to="/pricing" className="btn-hero-ghost">View Pricing</Link>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>

      {/* ── SERVICES FLIP GRID ── */}
      <section className="svc-grid-sec">
        <div className="svc-grid">
          {SERVICES.map(({ id, faccent, bgSvg, iconSvg, name, backBg, desc }, i) => (
            <div key={name} id={id} className={`svc-flip-wrap au${i > 0 ? ` au-d${Math.min(i % 4, 4)}` : ''}`} style={{ '--faccent': faccent }}>
              <div className="svc-flip-inner">
                <div className="svc-face svc-front">
                  <div className="svc-bg-svg">{bgSvg}</div>
                  <div className="svc-icon-wrap">{iconSvg}</div>
                  <div className="svc-name">{name}</div>
                  <div className="flip-hint">↻ hover for details</div>
                </div>
                <div className="svc-face svc-back" style={{ background: backBg }}>
                  <div className="fb-title">{name}</div>
                  <div className="fb-desc">{desc}</div>
                  <span className="fb-btn">Learn more →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="svc-hiw-sec">
        <div className="svc-hiw-inner">
          <div className="svc-hiw-header au">
            <div className="sec-eyebrow">Process</div>
            <h2 className="sec-title">How It Works</h2>
            <p className="sec-sub" style={{ maxWidth: 460, margin: '0 auto' }}>From sign-up to streaming in four simple steps.</p>
          </div>
          <div className="svc-hiw-steps">
            {HIW_STEPS.map(({ num, icon, title, desc }, i) => (
              <div key={num} className={`svc-step au${i > 0 ? ` au-d${i}` : ''}`}>
                <div className="svc-step-ghost">{num}</div>
                <div className="svc-step-icon">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-band">
        <div className="au cta-inner">
          <div className="cta-band-glow" />
          <h2>Ready to Take Your Music <em>Further</em>?</h2>
          <p>Join thousands of independent artists who trust Tunefry to amplify their careers. Start distributing, promoting, and earning today.</p>
          <div className="cta-btns">
            <Link to="/signup" className="btn-hero">Get Started Free →</Link>
            <Link to="/pricing" className="btn-hero-ghost">View Pricing</Link>
          </div>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>
    </>
  )
}
