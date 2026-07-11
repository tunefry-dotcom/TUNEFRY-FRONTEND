import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { PLANS } from '../../data/plans'

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
                <Link to="/login" className={`plan-cta ${p.ctaCls}`}>{p.cta}</Link>
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
