import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target) } }),
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach((el) => io.observe(el))
    document.querySelectorAll('.price-hero .au').forEach((el) => el.classList.add('vis'))
    return () => io.disconnect()
  }, [])
}

function CkIcon({ type }) {
  if (type === 'cross') return (
    <span className={`ck ${type}`}><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>
  )
  return (
    <span className={`ck ${type}`}><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></span>
  )
}

const PLANS = [
  {
    id: 'free', name: 'Free', tag: 'Get started at zero cost',
    priceStrike: null, price: '0', per: 'forever free',
    royalty: { cls: 'or', text: '★ 75% royalties' },
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    feats: [
      { ck: 'faded', text: 'Up to 10 song releases' },
      { ck: 'faded', text: '100+ DSPs' },
      { ck: 'faded', text: '75% performing royalties' },
      { ck: 'faded', text: 'Lifetime legacy' },
      { ck: 'faded', text: 'Customised caller tune' },
      { ck: 'faded', text: 'Customised release date' },
      { ck: 'faded', text: 'Spotify verification' },
      { ck: 'faded', text: '7-day mail support only' },
      { ck: 'cross', text: 'Instagram account linking' },
      { ck: 'cross', text: 'Content ID' },
      { ck: 'cross', text: 'Catalogue transfer & migration' },
      { ck: 'cross', text: 'Album releases' },
      { ck: 'cross', text: 'Playlist & radio pitching' },
      { ck: 'cross', text: 'Custom label name' },
      { ck: 'cross', text: 'No collaboration' },
      { ck: 'cross', text: 'Official Artist Channel' },
      { ck: 'cross', text: 'Second primary artist' },
    ],
    cta: 'Get Started Free', ctaCls: 'out', link: '/',
    info: '4 working days approval · Live within 10 working days*',
  },
  {
    id: 'single-song', name: 'Single Song', tag: 'Perfect for one release',
    priceStrike: '₹299', price: '269', per: 'per song',
    royalty: { cls: 'or', text: '★ 85% royalties' },
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    feats: [
      { ck: 'orange', text: '1 song release' },
      { ck: 'orange', text: '100+ DSPs' },
      { ck: 'orange', text: '85% performing royalties' },
      { ck: 'orange', text: 'Lifetime legacy' },
      { ck: 'orange', text: 'Customised caller tune' },
      { ck: 'orange', text: 'Customised release date' },
      { ck: 'orange', text: 'Spotify verification' },
      { ck: 'orange', text: '7-day mail support only' },
      { ck: 'cross', text: 'Instagram account linking' },
      { ck: 'cross', text: 'Content ID' },
      { ck: 'cross', text: 'Catalogue transfer & migration' },
      { ck: 'cross', text: 'Album releases' },
      { ck: 'cross', text: 'Playlist & radio pitching' },
      { ck: 'cross', text: 'Custom label name' },
      { ck: 'cross', text: 'No collaboration' },
      { ck: 'cross', text: 'Official Artist Channel' },
      { ck: 'cross', text: 'Second primary artist' },
    ],
    cta: 'Choose Plan', ctaCls: 'out', link: '/checkout?plan=single-song',
    info: '48 working hrs approval · Live within 4 working days*',
  },
  {
    id: 'starter', name: 'Starter', tag: 'More releases, growing control',
    priceStrike: '₹999', price: '899', per: 'per year · unlimited releases',
    royalty: { cls: 'or', text: '★ 90% royalties' },
    badge: <div style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(45,202,114,0.12)',border:'0.5px solid rgba(45,202,114,0.3)',borderRadius:100,padding:'4px 12px',fontSize:10.5,fontWeight:600,color:'#2DCA72',marginBottom:8,width:'fit-content' }}>✦ Newly Added</div>,
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
    feats: [
      { ck: 'orange', text: 'Unlimited releases (1 artist)' },
      { ck: 'orange', text: 'Singles only (no albums)' },
      { ck: 'orange', text: '100+ DSPs' },
      { ck: 'orange', text: '90% performing royalties' },
      { ck: 'orange', text: 'Content ID' },
      { ck: 'orange', text: 'Lifetime legacy' },
      { ck: 'orange', text: 'Customised caller tune' },
      { ck: 'orange', text: 'Customised release date' },
      { ck: 'orange', text: 'Spotify verification' },
      { ck: 'orange', text: 'Instagram account linking' },
      { ck: 'green',  text: '3-day support response' },
      { ck: 'cross', text: 'Catalogue transfer & migration' },
      { ck: 'cross', text: 'Album releases' },
      { ck: 'cross', text: 'Playlist & radio pitching' },
      { ck: 'cross', text: 'Custom label name' },
      { ck: 'cross', text: 'No collaboration' },
      { ck: 'cross', text: 'Official Artist Channel' },
      { ck: 'cross', text: 'Second primary artist' },
    ],
    cta: 'Choose Plan', ctaCls: 'out', link: '/checkout?plan=starter',
    info: '48 working hrs approval · Live within 4 working days*',
  },
  {
    id: 'single-artist', name: 'Single Artist', tag: 'For serious independent artists', pop: true,
    priceStrike: '₹1,599', price: '1,439', per: 'per year · unlimited releases',
    royalty: { cls: 'gr', text: '✓ 100% royalties' },
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 013 3v7a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>,
    feats: [
      { ck: 'green', text: 'Unlimited releases (1 artist)' },
      { ck: 'green', text: 'Singles & album releases' },
      { ck: 'green', text: 'Catalogue transfer & migration' },
      { ck: 'green', text: '100+ DSPs' },
      { ck: 'green', text: '100% performing royalties' },
      { ck: 'green', text: 'Playlist & radio pitching' },
      { ck: 'green', text: 'Content ID' },
      { ck: 'green', text: 'Lifetime legacy' },
      { ck: 'green', text: 'Customised caller tune' },
      { ck: 'green', text: 'Customised release date' },
      { ck: 'green', text: 'Spotify verification' },
      { ck: 'green', text: 'Instagram account linking' },
      { ck: 'green', text: 'Official Artist Channel (YouTube)' },
      { ck: 'green', text: 'Mail / call / WhatsApp support' },
      { ck: 'cross', text: 'Custom label name' },
      { ck: 'cross', text: 'Second primary artist' },
    ],
    cta: 'Start Distributing', ctaCls: 'solid', link: '/checkout?plan=single-artist',
    info: '24 working hrs approval · Live within 48 working hrs*',
  },
  {
    id: 'double-artist', name: 'Double Artist', tag: 'For duos & collaborators',
    priceStrike: '₹2,999', price: '2,699', per: 'per year · 2 artists',
    royalty: { cls: 'gr', text: '✓ 100% royalties' },
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    feats: [
      { ck: 'green', text: 'Custom label name' },
      { ck: 'green', text: 'Unlimited releases (2 artists)' },
      { ck: 'green', text: 'Singles & album releases' },
      { ck: 'green', text: 'Catalogue transfer & migration' },
      { ck: 'green', text: 'Collab with multiple artists' },
      { ck: 'green', text: '100+ DSPs' },
      { ck: 'green', text: '100% performing royalties' },
      { ck: 'green', text: 'Playlist & radio pitching' },
      { ck: 'green', text: 'Content ID' },
      { ck: 'green', text: 'Lifetime legacy' },
      { ck: 'green', text: 'Customised caller tune' },
      { ck: 'green', text: 'Customised release date' },
      { ck: 'green', text: 'Spotify verification' },
      { ck: 'green', text: 'Instagram account linking' },
      { ck: 'green', text: 'Official Artist Channel (YouTube)' },
      { ck: 'green', text: 'Mail / call / WhatsApp support' },
    ],
    cta: 'Choose Plan', ctaCls: 'out', link: '/checkout?plan=double-artist',
    info: '24 working hrs approval · Live within 48 working hrs*',
  },
  {
    id: 'label', name: 'Label Plan', tag: 'Scale your roster', hasInfo: true,
    priceStrike: '₹7,000', price: '6,300', per: 'per year · up to 5 artists',
    royalty: { cls: 'gr', text: '✓ 100% royalties' },
    royaltyNote: 'Max 5 artists included',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="17"/><line x1="9.5" y1="14.5" x2="14.5" y2="14.5"/></svg>,
    feats: [
      { ck: 'green', text: 'Custom label name' },
      { ck: 'green', text: 'Unlimited releases (up to 5 artists)' },
      { ck: 'green', text: 'Singles & album releases' },
      { ck: 'green', text: 'Catalogue transfer & migration' },
      { ck: 'green', text: 'Collab with multiple artists' },
      { ck: 'green', text: '100+ DSPs' },
      { ck: 'green', text: '100% performing royalties' },
      { ck: 'green', text: 'Playlist & radio pitching' },
      { ck: 'green', text: 'Content ID' },
      { ck: 'green', text: 'Lifetime legacy' },
      { ck: 'green', text: 'Customised caller tune' },
      { ck: 'green', text: 'Customised release date' },
      { ck: 'green', text: 'Spotify verification' },
      { ck: 'green', text: 'Instagram account linking' },
      { ck: 'green', text: 'Official Artist Channel (YouTube)' },
      { ck: 'green', text: 'Priority mail / call / WhatsApp' },
    ],
    cta: 'Choose Plan', ctaCls: 'out', link: '/checkout?plan=label',
    info: '24 working hrs approval · Live within 48 working hrs*',
    warning: '⚠ Max. 5 artists. Royalties will be reduced if artist count exceeds 5.',
  },
]

const CMP_DATA = [
  { feat: 'Royalty rate',        tunefry: '100%',                    others: '70–85%',             boldT: true },
  { feat: 'Indian platforms',    tunefry: true,                      others: 'International only' },
  { feat: 'Callertune',          tunefry: 'Customised',              others: false },
  { feat: 'Playlist pitching',   tunefry: 'Included',                others: 'Paid add-on' },
  { feat: 'Scheduled release',   tunefry: 'All plans',               others: 'Premium only' },
  { feat: 'Lifetime availability', tunefry: 'Free',                  others: 'Paid annually' },
  { feat: 'Customer support',    tunefry: 'Mail / call / WhatsApp',  others: 'Limited' },
  { feat: 'Starting price',      tunefry: '₹0 Free',                 others: '$24.99/yr+',         boldT: true },
]

const FAQ_ITEMS = [
  {
    q: 'What is Tunefry?',
    a: 'Tunefry is India\'s fastest-growing music distribution platform. We help independent artists and labels distribute their music to 100+ streaming services worldwide, including Spotify, Apple Music, JioSaavn, and more — all while letting you keep the maximum share of your royalties.',
  },
  {
    q: 'What does 100% Royalties mean?',
    a: 'With our Single Artist, Double Artist, and Label plans, you keep 100% of the royalties your music earns on every platform. We charge a flat annual fee instead of taking a cut of your earnings — so every rupee your listeners generate goes straight to you.',
  },
  {
    q: 'How fast does music go live?',
    a: 'Approval times depend on your plan: 72 hours for the Free plan, 48 hours for Single Song, and just 24 hours for premium plans. After approval, music typically goes live on major platforms within 48 hours to 7 days, depending on the store and plan.',
  },
  {
    q: 'Can I upgrade later?',
    a: 'Absolutely. You can start with the Free plan and upgrade anytime. When you upgrade, you\'ll immediately unlock all the benefits of your new plan. Your existing releases remain live, and there\'s no disruption to your music or earnings.',
  },
  {
    q: 'What is the Label Plan?',
    a: 'The Label Plan is designed for record labels and managers handling multiple artists. It covers up to 5 artist profiles with unlimited releases each, a custom label name, and all premium features including Content ID, YouTube OAC, and priority support. If the number of artists on the plan exceeds 5, royalties will be subject to reduction.',
  },
  {
    q: 'How do I join?',
    a: 'Getting started is easy. Create a free account, choose a plan that fits your needs, upload your music with artwork and metadata, and we handle the rest. Your first release can be live on stores in as little as 48 hours.',
  },
]

export default function Pricing() {
  useScrollReveal()
  const [faqOpen, setFaqOpen] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)
  const gridRef = useRef(null)

  const slidePlans = (dir) => {
    const grid = gridRef.current
    if (!grid) return
    const card = grid.querySelector('.plan')
    const cardW = card ? card.offsetWidth + 12 : 272
    grid.scrollBy({ left: dir * cardW * 2, behavior: 'smooth' })
  }

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    let isDown = false, startX, scrollLeft

    const onMouseDown = (e) => {
      isDown = true
      startX = e.pageX - grid.offsetLeft
      scrollLeft = grid.scrollLeft
      grid.style.userSelect = 'none'
    }
    const onMouseUp = () => { isDown = false; grid.style.userSelect = '' }
    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - grid.offsetLeft
      grid.scrollLeft = scrollLeft - (x - startX) * 1.2
    }

    const updateArrows = () => {
      setPrevDisabled(grid.scrollLeft < 10)
      setNextDisabled(grid.scrollLeft + grid.offsetWidth >= grid.scrollWidth - 10)
    }

    grid.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    grid.addEventListener('mousemove', onMouseMove)
    grid.addEventListener('scroll', updateArrows)
    updateArrows()

    let observed = false
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting && !observed) {
          observed = true
          setTimeout(() => {
            grid.scrollTo({ left: grid.scrollWidth, behavior: 'smooth' })
          }, 800)
          io.disconnect()
        }
      })
    }, { threshold: 0.3 })
    io.observe(grid)

    return () => {
      grid.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      grid.removeEventListener('mousemove', onMouseMove)
      grid.removeEventListener('scroll', updateArrows)
      io.disconnect()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="price-hero">
        <div className="hero-orb" />
        <div className="pill au"><span className="pill-dot" />Simple, transparent pricing</div>
        <h1 className="au au-d1">Choose your <em>plan</em></h1>
        <p className="sub au au-d2">Simple and flexible pricing for every artist.</p>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>

      {/* ── PROMO BANNER ── */}
      <div className="promo-banner">
        <div className="promo-banner-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 24 }}>🎉</div>
            <div>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 15, fontWeight: 700, color: 'var(--or)' }}>
                4th Year Anniversary Special — Flat 10% Off All Plans!
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--t2)', marginTop: 2 }}>Discount automatically applied at checkout. Limited time offer.</div>
            </div>
          </div>
          <div className="promo-badge">10% OFF</div>
        </div>
      </div>

      {/* ── PLANS ── */}
      <section className="plans-sec">
        <div className="plans-sec-head au">
          <div style={{ fontFamily: 'var(--font-d)', fontSize: 13, fontWeight: 600, color: 'var(--t3)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>All Plans</div>
          <div className="carousel-arrows">
            <button className="carr-btn" onClick={() => slidePlans(-1)} disabled={prevDisabled} aria-label="Previous">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="carr-btn" onClick={() => slidePlans(1)} disabled={nextDisabled} aria-label="Next">
              <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"/></svg>
            </button>
          </div>
        </div>

        <div className="plans-track-wrap">
          <div className="plans-grid" ref={gridRef}>
            {PLANS.map((p, idx) => (
              <div key={p.id} className={`plan au${p.pop ? ' pop' : ''}${idx > 0 ? ` au-d${Math.min(idx, 4)}` : ''}`}>
                {p.pop && <div className="pop-badge">Most Popular</div>}
                {p.badge}
                <div className="plan-icon">{p.icon}</div>
                <div className="plan-name">
                  {p.name}
                  {p.hasInfo && (
                    <span style={{ fontSize: 11, marginLeft: 6, color: 'var(--t3)', cursor: 'default' }} title="Max 5 artists. Royalties reduced if artist count exceeds 5.">ℹ</span>
                  )}
                </div>
                <div className="plan-tag">{p.tag}</div>
                {p.priceStrike && <div style={{ fontSize: 12, color: 'var(--t3)', textDecoration: 'line-through', marginBottom: 2 }}>{p.priceStrike}</div>}
                <div className="plan-price">
                  <span className="price-cur">₹</span>
                  <span className="price-val">{p.price}</span>
                </div>
                <div className="price-per">{p.per}</div>
                <div className={`royalty ${p.royalty.cls}`}>{p.royalty.text}</div>
                {p.royaltyNote && <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>{p.royaltyNote}</div>}
                <div className="plan-div" />
                <ul className="plan-feats">
                  {p.feats.map(({ ck, text }) => (
                    <li key={text} className={ck === 'cross' ? 'excluded' : ''}>
                      <CkIcon type={ck} />
                      {text}
                    </li>
                  ))}
                </ul>
                <Link to={p.link} className={`plan-cta ${p.ctaCls}`}>{p.cta}</Link>
                <div className="plan-info">{p.info}</div>
                {p.warning && <div style={{ fontSize: 11, color: '#F97316', marginTop: 8, lineHeight: 1.5, textAlign: 'center' }}>{p.warning}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="compare-sec">
        <div className="compare-inner">
          <div className="compare-header au">
            <div className="sec-eyebrow">Why Tunefry wins</div>
            <h2 className="sec-title">Tunefry vs. everyone else</h2>
            <p className="sec-sub" style={{ maxWidth: 460, margin: '0 auto' }}>See how we stack up against other distributors</p>
          </div>
          <div className="cmp-wrap">
            <table className="cmp-tbl">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="hl">Tunefry</th>
                  <th>Others</th>
                </tr>
              </thead>
              <tbody>
                {CMP_DATA.map((row, i) => {
                  const renderT = (val) => {
                    if (val === true) return <span className="ico-yes">✓</span>
                    if (val === false) return <span className="ico-no">✗</span>
                    return <span style={{ fontSize: 12.5, fontWeight: row.boldT ? 700 : 400, color: row.boldT ? 'var(--t1)' : 'var(--t2)' }}>{val}</span>
                  }
                  const renderO = (val) => {
                    if (val === true) return <span className="ico-yes">✓</span>
                    if (val === false) return <span className="ico-no">✗</span>
                    return <span style={{ fontSize: 12.5, color: 'var(--t2)' }}>{val}</span>
                  }
                  return (
                    <tr key={i} className="feat-row">
                      <td>{row.feat}</td>
                      <td className="hl">{renderT(row.tunefry)}</td>
                      <td>{renderO(row.others)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="faq-sec">
        <div className="faq-inner">
          <div className="faq-header au">
            <div className="sec-eyebrow">FAQ</div>
            <h2 className="sec-title">Frequently asked questions</h2>
          </div>
          <div className="faq-grid">
            {FAQ_ITEMS.map(({ q, a }, i) => (
              <div
                key={q}
                className={`faq-item au${i > 0 ? ` au-d${Math.min(i % 2, 2)}` : ''}${faqOpen === i ? ' open' : ''}`}
              >
                <div className="faq-q" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                  <span>{q}</span>
                  <span className="faq-ico">+</span>
                </div>
                <div className="faq-a-wrap">
                  <div className="faq-a">{a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="contact-sec">
        <div className="contact-card">
          <div className="ct-eyebrow">Still have questions?</div>
          <h2>Get in touch</h2>
          <p className="ct-sub">We&apos;re a real team based in Delhi.</p>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Message sent!</div>
              <div style={{ fontSize: 13.5, color: 'var(--t2)' }}>We&apos;ll get back to you within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="What's this about?" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="Tell us more..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required />
              </div>
              <button type="submit" className="form-submit">Send Message →</button>
            </form>
          )}
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>
    </>
  )
}
