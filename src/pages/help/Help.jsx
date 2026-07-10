import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/help.css';

const faqs = [
  {
    q: 'How long does it take for my music to go live?',
    a: 'Once you submit your release, it typically takes 24–72 hours for music to appear on most streaming platforms. Spotify and Apple Music may take up to 5 business days. We recommend submitting at least 2 weeks before your intended release date for best results.',
  },
  {
    q: 'How do I claim my Spotify for Artists profile?',
    a: 'After your first release goes live on Spotify, visit artists.spotify.com and log in with your Spotify account. Search for your artist name and click "Claim." Verification usually takes 3–5 business days. Tunefry\'s Spotify verification feature can also help expedite this process.',
  },
  {
    q: 'When will I receive my royalty payment?',
    a: "Royalties are collected and processed monthly. Platforms typically report earnings with a 60–90 day delay. Payments are transferred to your registered bank account or UPI ID once your balance crosses ₹500. You'll receive an email notification when a transfer is initiated.",
  },
  {
    q: 'How do I transfer my music from another distributor?',
    a: 'To transfer music from another distributor, first take down your releases from your previous distributor. Then re-upload your tracks on Tunefry with the same ISRC codes if possible (this preserves your streaming history). Contact our support team for assistance with ISRC transfers.',
  },
  {
    q: 'Why is my music showing the wrong artist name?',
    a: "Artist name mismatches can occur when there's a discrepancy between the name on Tunefry and what the streaming platform shows. Use our Profile Mismatch tool to report this. Our team will coordinate with the platform to correct the display name within 5–7 working days.",
  },
  {
    q: 'How do I take down a release?',
    a: 'Go to your releases page and click on the release you want to remove. Click "Takedown Release" and confirm. Takedowns usually process within 7–14 business days across all platforms. Note: Taking down a release will remove all associated streaming data.',
  },
  {
    q: 'What is Content ID and how does it work?',
    a: 'YouTube Content ID is a system that scans all YouTube videos and matches them against a database of copyrighted content. When your music is registered with Content ID through Tunefry, you can monetize any YouTube video that uses your music — earning revenue whenever someone uses your tracks.',
  },
  {
    q: 'How do I upgrade my plan?',
    a: 'Go to Account → Current Plan and click "Upgrade Plan." You can upgrade at any time and the difference will be prorated for the remaining period. Your current plan benefits remain active until the upgrade is processed. All major UPI apps and cards are accepted.',
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (i) => {
    setOpenIndex((prev) => (prev === i ? null : i));
  };

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
        Support
      </div>
      <div className="page-header">
        <h1 className="page-title">Help Center</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Search Hero */}
      <div className="glass-card help-search-card">
        <div className="help-search-title">How can we help you?</div>
        <div className="help-search-sub">Search our knowledge base or browse categories below</div>
        <div className="help-search-input-wrap">
          <div className="help-search-input-icon">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>
          <input type="text" className="help-search-input" placeholder="Search for answers, articles, tutorials..." />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        <Link to="/help/distribution" className="glass-card category-card">
          <div className="category-icon" style={{ background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.25)', color: '#F26522' }}>
            <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          </div>
          <div className="category-info">
            <div className="category-title">Distribution &amp; Releases</div>
            <div className="category-meta">12 articles · Upload, takedowns, delivery</div>
          </div>
          <div className="category-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></div>
        </Link>

        <Link to="/help/royalties" className="glass-card category-card">
          <div className="category-icon" style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.22)', color: '#22C55E' }}>
            <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
          </div>
          <div className="category-info">
            <div className="category-title">Royalties &amp; Payments</div>
            <div className="category-meta">9 articles · Earnings, payouts, reporting</div>
          </div>
          <div className="category-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></div>
        </Link>

        <Link to="/help/account" className="glass-card category-card">
          <div className="category-icon" style={{ background: 'rgba(59,130,246,0.12)', border: '0.5px solid rgba(59,130,246,0.22)', color: '#3B82F6' }}>
            <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
          </div>
          <div className="category-info">
            <div className="category-title">Account &amp; Profile</div>
            <div className="category-meta">7 articles · Settings, plans, verification</div>
          </div>
          <div className="category-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></div>
        </Link>

        <Link to="/help/technical" className="glass-card category-card">
          <div className="category-icon" style={{ background: 'rgba(168,85,247,0.12)', border: '0.5px solid rgba(168,85,247,0.22)', color: '#A855F7' }}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /><path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07" /></svg>
          </div>
          <div className="category-info">
            <div className="category-title">Technical Issues</div>
            <div className="category-meta">10 articles · Errors, uploads, playback</div>
          </div>
          <div className="category-arrow"><svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" /></svg></div>
        </Link>
      </div>

      {/* FAQ Section */}
      <div className="glass-card faq-card">
        <div className="faq-card-title">Frequently Asked Questions</div>
        <div className="faq-card-sub">Quick answers to the most common questions from our artists</div>

        {faqs.map((item, i) => (
          <div className="faq-item" key={i}>
            <div className={`faq-question${openIndex === i ? ' open' : ''}`} onClick={() => toggleFaq(i)}>
              {item.q}
              <div className="faq-chevron"><svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg></div>
            </div>
            <div className={`faq-answer${openIndex === i ? ' open' : ''}`}>{item.a}</div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="glass-card contact-card">
        <div className="contact-title">Still need help?</div>
        <div className="contact-sub">Our support team is available 11 A.M to 5:00 P.M, Monday to Friday</div>
        <div className="contact-options">
          <a href="mailto:support@tunefry.com" className="contact-option">
            <div className="contact-icon" style={{ background: 'rgba(242,101,34,0.12)', border: '0.5px solid rgba(242,101,34,0.22)', color: '#F26522' }}>
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            </div>
            <div className="contact-text">
              <div className="contact-label">Email Support</div>
              <div className="contact-value">support@tunefry.com</div>
            </div>
            <span className="contact-badge">24hr reply</span>
          </a>
          <a href="https://wa.me/917428028995" className="contact-option">
            <div className="contact-icon" style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.22)', color: '#22C55E' }}>
              <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
            </div>
            <div className="contact-text">
              <div className="contact-label">WhatsApp Support</div>
              <div className="contact-value">7428028995</div>
            </div>
            <span className="contact-badge" style={{ background: 'rgba(34,197,94,0.12)', borderColor: 'rgba(34,197,94,0.25)', color: '#22C55E' }}>Fastest</span>
          </a>
        </div>
      </div>
    </>
  );
}
