import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/help-category.css';

const faqs = [
  {
    q: 'How do I change my artist name?',
    a: 'Go to Profile and update your Artist Name field. Note that changing your artist name after releases are live may cause a mismatch on streaming platforms. Use our Profile Mismatch tool to flag any discrepancies on platforms after a name change.',
  },
  {
    q: 'How do I update my bank account or UPI details?',
    a: 'Navigate to Profile → Payment Settings. Enter your new bank account number or UPI ID and save. Changes to payment details require an OTP verification for security. Pending transfers will resume once verification is complete.',
  },
  {
    q: 'How do I upgrade or change my plan?',
    a: 'Go to Account → Current Plan and click "Upgrade Plan." You\'ll be taken to the pricing page to choose a new plan. Upgrades take effect immediately and the cost difference is prorated for the remaining billing period.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Account deletion is permanent and removes all releases, earnings history, and data. To initiate deletion, contact our support team at support@tunefry.com. We recommend taking down all releases first to ensure your music is removed from all platforms before the account is closed.',
  },
  {
    q: 'How do I get my Spotify for Artists profile verified?',
    a: 'Once your first release is live on Spotify, visit artists.spotify.com, log in, and search for your artist name to claim it. Tunefry also offers a Spotify verification service through the Services section of your dashboard that can help expedite this process.',
  },
  {
    q: 'Can I have multiple artist profiles under one account?',
    a: 'Currently, each Tunefry account is associated with one primary artist profile. If you need to manage releases under different artist names, you can use the artist name field on individual releases or contact support to discuss multi-profile options.',
  },
];

export default function HelpAccount() {
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

      <Link to="/help" className="back-link">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Help Center
      </Link>

      {/* Hero */}
      <div className="glass-card topic-hero">
        <div className="topic-hero-icon" style={{ background: 'rgba(59,130,246,0.12)', border: '0.5px solid rgba(59,130,246,0.22)', color: '#3B82F6' }}>
          <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
        </div>
        <div className="topic-hero-info">
          <div className="topic-hero-title">Account &amp; Profile</div>
          <div className="topic-hero-sub">Managing your Tunefry account settings, plans, and artist profile.</div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="section-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
        Tutorial Videos
      </div>
      <div className="videos-grid">
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Setting up your artist profile"></iframe>
          <div className="video-label">Setting Up Your Artist Profile</div>
        </div>
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Managing your plan and billing"></iframe>
          <div className="video-label">Managing Your Plan &amp; Billing</div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card faq-card">
        <div className="faq-card-title">Frequently Asked Questions</div>
        <div className="faq-card-sub">Common questions about your account and profile settings</div>

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
    </>
  );
}
