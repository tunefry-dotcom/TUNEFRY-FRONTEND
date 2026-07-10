import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import '../../styles/checkout.css';

// ── Plan Data ──────────────────────────────────────────────
const PLANS = {
  'free'          : { name:'Free',          sub:'forever free · 1 artist', price:0, origPrice:0, royalty:'75%',  labelField:false, artistCounter:false },
  'single-song'   : { name:'Single Song',   sub:'one-time · per song',     price:269, origPrice:299, royalty:'85%',  labelField:false, artistCounter:false },
  'starter'       : { name:'Starter',       sub:'per year · unlimited releases', price:899, origPrice:999, royalty:'90%',  labelField:false, artistCounter:false },
  'single-artist' : { name:'Single Artist', sub:'per year · unlimited releases', price:1439, origPrice:1599, royalty:'100%', labelField:false, artistCounter:false },
  'double-artist' : { name:'Double Artist', sub:'per year · 2 artists',    price:2699, origPrice:2999, royalty:'100%', labelField:true, artistCounter:false },
  'label'         : { name:'Label Plan',    sub:'per year · min. 5 artists', price:6300, origPrice:7000, royalty:'100%', labelField:true, artistCounter:true }
};

const PER_ARTIST = 1260;

export default function Checkout() {
  const [searchParams] = useSearchParams();

  // ── Resolve plan from ?plan= ─────────────────────────────
  let planKey = searchParams.get('plan') || 'single-artist';
  if (!PLANS[planKey]) planKey = 'single-artist';
  const currentPlan = planKey;
  const p = PLANS[currentPlan];

  const [artistCount, setArtistCount] = useState(5);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paying, setPaying] = useState(false);

  const [errors, setErrors] = useState({ fullName: false, email: false, phone: false, labelName: false });
  const [toast, setToast] = useState({ msg: '', type: 'success', show: false });
  const toastTimer = useRef(null);

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const labelNameRef = useRef(null);

  // ── document.title ───────────────────────────────────────
  useEffect(() => {
    document.title = p.name + ' Checkout — Tunefry';
  }, [p.name]);

  // ── Nav scroll ───────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Price calculation ────────────────────────────────────
  const base = p.price;
  const extraArtists = p.artistCounter ? Math.max(0, artistCount - 5) : 0;
  const extras = extraArtists * PER_ARTIST;
  const total = base + extras;
  const savings = p.artistCounter ? (p.origPrice - p.price) : (p.origPrice - p.price);

  const baseLabel = p.artistCounter ? 'Base plan (5 artists)' : 'Plan price';
  const basePriceText = '₹' + base.toLocaleString('en-IN');
  const extraLabelText = 'Extra artists (' + extraArtists + ' × ₹' + PER_ARTIST.toLocaleString('en-IN') + ')';
  const extraPriceText = '₹' + extras.toLocaleString('en-IN');
  const savingsText = savings > 0 ? '−₹' + savings.toLocaleString('en-IN') : '—';
  const totalText = total === 0 ? 'Free' : '₹' + total.toLocaleString('en-IN');

  function changeArtists(delta) {
    setArtistCount((prev) => {
      const next = prev + delta;
      if (next < 5) return prev;
      return next;
    });
  }

  function showToast(msg, type) {
    setToast({ msg, type: type === 'error' ? 'error' : 'success', show: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3200);
  }

  // ── Submit ───────────────────────────────────────────────
  function submitOrder() {
    const nextErrors = { fullName: false, email: false, phone: false, labelName: false };
    let valid = true;

    const fullNameVal = (fullNameRef.current?.value || '').trim();
    const emailVal = (emailRef.current?.value || '').trim();
    const phoneVal = (phoneRef.current?.value || '').trim();
    const labelNameVal = (labelNameRef.current?.value || '').trim();

    if (!fullNameVal) { nextErrors.fullName = true; valid = false; }
    if (!emailVal) { nextErrors.email = true; valid = false; }
    if (!phoneVal) { nextErrors.phone = true; valid = false; }
    if (p.labelField && !labelNameVal) { nextErrors.labelName = true; valid = false; }

    // Basic email check
    const emailRaw = emailRef.current?.value || '';
    if (emailRaw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw)) {
      nextErrors.email = true;
      valid = false;
    }

    setErrors(nextErrors);

    if (!valid) { showToast('Please fill in all required fields.', 'error'); return; }

    setPaying(true);

    const extrasCalc = p.artistCounter ? Math.max(0, artistCount - 5) * PER_ARTIST : 0;
    const payload = {
      plan: currentPlan,
      full_name: fullNameVal,
      email: emailVal,
      phone_number: phoneVal,
      label_name: p.labelField ? labelNameVal : undefined,
      artist_count: p.artistCounter ? artistCount : undefined,
      total_amount: p.price + extrasCalc
    };

    fetch('/api/checkout/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then((res) => (res.ok ? res.json() : res.json().then((e) => { throw e; })))
      .then(() => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch((err) => {
        showToast((err && err.message) ? err.message : 'Submission failed. Please try again.', 'error');
        setPaying(false);
      });
  }

  return (
    <>
      {/* NAV */}
      <nav className={'nav' + (scrolled ? ' scrolled' : '')} id="nav">
        <Link to="/home" className="nav-logo">
          <img src="PHOTOS/tunefry-logo.png" alt="Tunefry" style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }} />
        </Link>
        <Link to="/pricing" className="nav-back">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
          Back to Pricing
        </Link>
      </nav>

      {/* PAGE */}
      <div className="page">
        <div className="page-eyebrow">Secure Checkout</div>
        <h1 className="page-title">Complete your plan</h1>

        {/* Success state */}
        <div className={'success-card' + (submitted ? ' show' : '')} id="successCard">
          <div className="success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
          <div className="success-h">Order Confirmed! 🎉</div>
          <p className="success-p">Your plan has been submitted. Our team will reach out on your email shortly to activate your account.</p>
          <a href="index.html" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', background: 'linear-gradient(145deg,#FF9A60,var(--or),#CC5500)', borderRadius: '12px', fontFamily: 'var(--font-d)', fontSize: '14px', fontWeight: 700, color: '#fff', boxShadow: '0 4px 24px rgba(255,107,0,.4)' }}>Go to Dashboard &rarr;</a>
        </div>

        {!submitted && (
          <div className="checkout-grid" id="checkoutGrid">

            {/* LEFT: Form */}
            <div className="form-card">
              <div className="form-section-title">
                <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Your Details
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="req">*</span></label>
                  <input type="text" id="fullName" name="full_name" ref={fullNameRef} className={'form-input' + (errors.fullName ? ' err' : '')} placeholder="Your full name" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address <span className="req">*</span></label>
                  <input type="email" id="email" name="email" ref={emailRef} className={'form-input' + (errors.email ? ' err' : '')} placeholder="you@email.com" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number <span className="req">*</span></label>
                  <input type="tel" id="phone" name="phone_number" ref={phoneRef} className={'form-input' + (errors.phone ? ' err' : '')} placeholder="+91 98765 43210" maxLength="15" required />
                </div>

                {/* Label Name — only for double-artist / label */}
                <div className={'form-group cond-field' + (p.labelField ? ' show' : '')} id="fieldLabelName">
                  <label className="form-label">Label Name <span className="req">*</span></label>
                  <input type="text" id="labelName" name="label_name" ref={labelNameRef} className={'form-input' + (errors.labelName ? ' err' : '')} placeholder="Your label or band name" required={p.labelField} />
                </div>

                {/* Artists count — only for label plan */}
                <div className={'form-group full cond-field' + (p.artistCounter ? ' show' : '')} id="fieldArtists">
                  <label className="form-label" style={{ marginBottom: '8px' }}>Number of Artists <span className="req">*</span></label>
                  <div className="counter-row">
                    <button className="counter-btn" id="btnMinus" onClick={() => changeArtists(-1)} disabled={artistCount <= 5}>−</button>
                    <div className="counter-val" id="artistCount">{artistCount}</div>
                    <button className="counter-btn" id="btnPlus" onClick={() => changeArtists(1)}>+</button>
                    <span className="counter-hint">Minimum 5 artists &middot; each additional artist ₹1,260</span>
                  </div>
                </div>
              </div>

              <div className="form-section-title" style={{ marginTop: '8px' }}>
                <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                Payment
              </div>

              <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', border: '.5px solid rgba(255,255,255,0.07)', borderRadius: '12px', fontSize: '13px', color: 'var(--t2)', lineHeight: 1.75, marginBottom: '20px' }}>
                <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'var(--or)', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', verticalAlign: 'middle', marginRight: '6px' }}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                Payment is processed securely after our team verifies your order. You'll receive a payment link on your phone and email within 2–4 working hours.
              </div>

              <button className="btn-pay" id="btnPay" onClick={submitOrder} disabled={paying}>
                {paying ? (
                  'Processing…'
                ) : (
                  <>
                    <svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    Confirm &amp; Pay
                  </>
                )}
              </button>
              <div className="pay-note">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                Secure order. No card details collected on this page.
              </div>
            </div>

            {/* RIGHT: Summary */}
            <div className="summary-card">
              <div className="summary-title">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                Order Summary
              </div>

              <div className="plan-badge-row" id="summaryPlanBadge">
                <div className="plan-badge-icon" id="summaryIcon">
                  <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                </div>
                <div>
                  <div className="plan-badge-name" id="summaryPlanName">{p.name}</div>
                  <div className="plan-badge-sub" id="summaryPlanSub">{p.sub}</div>
                </div>
              </div>

              <div>
                <span className="discount-badge">✦ 10% OFF — Anniversary Special</span>
                <span className="royalty-badge" id="summaryRoyalty">★ {p.royalty} Royalties</span>
              </div>

              <div id="summaryLines" style={{ marginTop: '16px' }}>
                <div className="summary-line">
                  <span id="summaryBaseLabel">{baseLabel}</span>
                  <strong id="summaryBasePrice">{basePriceText}</strong>
                </div>
                <div className="summary-line cond-field" id="summaryExtraLine" style={{ display: p.artistCounter ? 'flex' : 'none' }}>
                  <span id="summaryExtraLabel">{extraLabelText}</span>
                  <strong id="summaryExtraPrice">{extraPriceText}</strong>
                </div>
                <div className="summary-line">
                  <span>10% discount applied</span>
                  <span className="or" id="summarySavings">{savingsText}</span>
                </div>
              </div>

              <div className="summary-total-row">
                <div className="summary-total-label">Total Today</div>
                <div className="summary-total-price" id="summaryTotal">{totalText}</div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Toast */}
      <div className={'toast' + (toast.show ? ' ' + (toast.type === 'error' ? 'toast-error' : 'toast-success') + ' show' : '')} id="toast">
        <svg viewBox="0 0 24 24" id="toastIcon"><polyline points="20 6 9 17 4 12" /></svg>
        <span id="toastMsg">{toast.msg}</span>
      </div>
    </>
  );
}
