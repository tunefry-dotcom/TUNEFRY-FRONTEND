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
    document.querySelectorAll('.ref-hero .au').forEach((el) => el.classList.add('vis'))
    return () => io.disconnect()
  }, [])
}

const REF_FAQS = [
  { q: 'Who can join the Refer & Earn program?', a: 'Any registered Tunefry artist can join. Simply log into your dashboard, go to the Refer & Earn section, and copy your unique referral link to get started.' },
  { q: 'How and when do I get paid?', a: 'Earnings are credited to your Tunefry wallet within 7 working days of your referral\'s successful payment. You can withdraw to your bank account once your balance reaches ₹1,500.' },
  { q: 'Is there a limit on how many people I can refer?', a: 'No limit at all. You can refer as many artists as you like — the more you refer, the more you earn. There is no maximum cap on your earnings.' },
  { q: 'What counts as a valid referral?', a: 'A valid referral is a new user who signs up via your unique referral link and purchases any paid Tunefry plan. Free plan sign-ups do not count towards your commission.' },
]

const AVG_PLAN = 1439

export default function ReferEarnPublic() {
  useScrollReveal()
  const [refCount, setRefCount] = useState(10)
  const [copied, setCopied] = useState(false)
  const [faqOpen, setFaqOpen] = useState(null)
  const inputRef = useRef(null)

  const REFERRAL_URL = 'https://tunefry.com/register?ref=YOUR_CODE'
  const monthly = Math.round(refCount * AVG_PLAN * 0.10)
  const annual  = monthly * 12
  const pct     = ((refCount - 1) / (100 - 1) * 100).toFixed(1) + '%'

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(REFERRAL_URL).then(() => flash())
    } else {
      inputRef.current?.select()
      document.execCommand('copy')
      flash()
    }
  }

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: 'Join Tunefry', text: 'Use my referral link to join Tunefry and distribute your music!', url: REFERRAL_URL })
    } else {
      copyLink()
    }
  }

  const flash = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <>
      {/* ── HERO ── */}
      <section className="ref-hero">
        <div className="hero-orb" />
        <div className="pill au"><span className="pill-dot" />Refer &amp; Earn Program</div>
        <h1 className="au au-d1">Earn with every <em>referral</em></h1>
        <p className="hero-sub au au-d2">
          Share Tunefry with fellow artists. Every time a friend joins and subscribes, you earn a flat 10% commission — with no cap on how much you can earn.
        </p>
        <div className="ref-badges au au-d3">
          <div className="ref-badge"><span className="rb-val">10%</span> Commission per referral</div>
          <div className="ref-badge"><span className="rb-val">∞</span> No cap on earnings</div>
          <div className="ref-badge"><span className="rb-val">Fast</span> Quick payout</div>
        </div>

        {/* Referral link widget */}
        <div className="ref-link-widget au au-d4" style={{ position: 'relative' }}>
          <div className="ref-copied" style={copied ? { opacity: 1 } : {}}>✓ Copied to clipboard!</div>
          <div className="ref-link-lbl">Your referral link</div>
          <div className="ref-link-row">
            <input ref={inputRef} type="text" readOnly value={REFERRAL_URL} />
            <button className="ref-copy-btn" onClick={copyLink}>Copy</button>
            <button className="ref-share-btn" onClick={shareLink}>Share</button>
          </div>
          <p style={{ fontSize: 11.5, color: 'var(--t3)', marginTop: 12, textAlign: 'center' }}>
            Log in to get your unique referral link with your Artist ID.
          </p>
          <Link to="/login" className="btn-or" style={{ width: '100%', justifyContent: 'center', marginTop: 10, display: 'flex' }}>
            Log in to Get Your Link →
          </Link>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="ref-how-sec">
        <div className="ref-how-inner">
          <div className="ref-how-header au">
            <div className="sec-eyebrow">Simple Process</div>
            <h2 className="sec-title">How it works</h2>
            <p className="sec-sub" style={{ maxWidth: 480, margin: '0 auto' }}>Three easy steps to start earning from your network.</p>
          </div>
          <div className="how-steps">
            {[
              {
                num: '01',
                icon: <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>,
                title: 'Share your link',
                desc: 'Login to your Tunefry dashboard and copy your unique referral link. Share it with fellow artists via social media, DMs, or anywhere you like.',
              },
              {
                num: '02',
                icon: <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
                title: 'Friend signs up',
                desc: 'Your friend clicks your link, creates an account on Tunefry, and subscribes to any paid plan. That\'s all they need to do.',
              },
              {
                num: '03',
                icon: <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
                title: 'You earn 10%',
                desc: 'Once your referral\'s payment is confirmed, you receive 10% of their plan value directly to your Tunefry wallet — instantly.',
              },
            ].map(({ num, icon, title, desc }, i) => (
              <div key={num} className={`how-step au${i > 0 ? ` au-d${i}` : ''}`}>
                <div className="how-num">STEP {num}</div>
                <div className="how-icon-box">{icon}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARNINGS CALCULATOR ── */}
      <section style={{ padding: '96px 40px', background: 'var(--bg)', borderTop: '0.5px solid var(--bd)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }} className="au">
            <div className="sec-eyebrow">Calculate Your Earnings</div>
            <h2 className="sec-title">How much can you earn?</h2>
            <p className="sec-sub" style={{ maxWidth: 460, margin: '0 auto' }}>Drag the slider to see your estimated monthly earnings.</p>
          </div>
          <div className="calc-card au au-d1">
            <div className="calc-label">
              Number of referrals per month:{' '}
              <strong style={{ color: 'var(--or)' }}>{refCount}</strong>
            </div>
            <input
              type="range" min={1} max={100} value={refCount}
              className="calc-range"
              style={{ '--pct': pct }}
              onChange={(e) => setRefCount(Number(e.target.value))}
            />
            <div className="calc-result-row">
              <div className="calc-result-box">
                <div className="calc-result-label">Monthly Earnings</div>
                <div className="calc-result-val orange">₹{monthly.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Based on Single Artist plan avg.</div>
              </div>
              <div className="calc-result-box">
                <div className="calc-result-label">Annual Earnings</div>
                <div className="calc-result-val">₹{annual.toLocaleString('en-IN')}</div>
                <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 4 }}>Projected at same referral rate</div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--t3)', lineHeight: 1.6, textAlign: 'center' }}>
              *Calculation based on average Single Artist plan (₹1,439/yr) at 10% commission. Actual earnings depend on the plan your referrals choose.
            </p>
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Link to="/login" className="btn-hero" style={{ fontSize: 14, padding: '13px 32px' }}>Start Referring Now →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="ref-stats-band">
        <div className="ref-stats-inner">
          {[
            { num: '10%', lbl: 'Commission per successful referral' },
            { num: '₹0', lbl: 'Zero cost to join the program' },
            { num: '∞', lbl: 'No cap on referrals or earnings' },
          ].map(({ num, lbl }, i) => (
            <div key={num} className={`stat-col au${i > 0 ? ` au-d${i}` : ''}`}>
              <div className="stat-num">{num}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px', background: 'var(--s1)', borderTop: '0.5px solid var(--bd)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }} className="au">
            <div className="sec-eyebrow">FAQ</div>
            <h2 className="sec-title">Questions about the program</h2>
          </div>
          <div className="ref-faq-list">
            {REF_FAQS.map(({ q, a }, i) => (
              <div
                key={q}
                className={`faq-item au${i > 0 ? ` au-d${Math.min(i, 4)}` : ''}${faqOpen === i ? ' open' : ''}`}
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

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="cta-band-glow" />
        <div className="au">
          <h2>Start <em>earning</em> today</h2>
          <p>Login to your Tunefry dashboard and get your referral link now. Every share is a potential earning.</p>
          <Link to="/login" className="btn-hero">Get My Referral Link →</Link>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>
    </>
  )
}
