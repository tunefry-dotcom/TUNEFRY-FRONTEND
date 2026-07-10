import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/help-category.css';

const faqs = [
  {
    q: 'When are royalties paid?',
    a: 'Royalties are collected and processed monthly. Streaming platforms report earnings with a 60–90 day delay, so streams from January typically appear in your dashboard by April. Payments are initiated to your registered bank account or UPI ID once your balance reaches the minimum threshold.',
  },
  {
    q: 'How are streams counted and valued?',
    a: "Each platform counts streams differently — Spotify requires a track to play for at least 30 seconds before it registers. The per-stream rate varies by platform, region, and the listener's subscription type. On average, streaming rates range from ₹0.003 to ₹0.08 per stream.",
  },
  {
    q: 'What is the minimum payout threshold?',
    a: 'The minimum payout is ₹500. Earnings below this amount remain in your account and accumulate. Once your balance reaches ₹500 or above, you can initiate a withdrawal from the Withdraw Earnings page. There are no fees for withdrawals.',
  },
  {
    q: 'Why do my earnings look lower than expected?',
    a: "Earning fluctuations are normal. Factors include the listener's country, platform, subscription tier, and the time of reporting. High streams from free-tier listeners in lower-rate regions will appear lower. Check your Stats page to break down earnings by platform and region.",
  },
  {
    q: 'How do I update my bank account or UPI details?',
    a: 'Go to Profile → Payment Settings to update your bank account or UPI ID. For security, changes to payment details may require verification. Pending payouts are held until verification is complete.',
  },
  {
    q: 'Are YouTube Content ID earnings included in my dashboard?',
    a: 'Yes — if you opted into YouTube Content ID for your releases, those earnings are collected and shown in your Stats dashboard under "YouTube" revenue. YouTube reports with a slightly longer delay than audio streaming platforms.',
  },
];

export default function HelpRoyalties() {
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
        <div className="topic-hero-icon" style={{ background: 'rgba(34,197,94,0.12)', border: '0.5px solid rgba(34,197,94,0.22)', color: '#22C55E' }}>
          <svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        </div>
        <div className="topic-hero-info">
          <div className="topic-hero-title">Royalties &amp; Payments</div>
          <div className="topic-hero-sub">How your earnings are collected, calculated, and paid out to you.</div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="section-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
        Tutorial Videos
      </div>
      <div className="videos-grid">
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="How royalties are calculated"></iframe>
          <div className="video-label">How Royalties Are Calculated</div>
        </div>
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Withdrawing your earnings"></iframe>
          <div className="video-label">Withdrawing Your Earnings</div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card faq-card">
        <div className="faq-card-title">Frequently Asked Questions</div>
        <div className="faq-card-sub">Common questions about royalties, streams, and payouts</div>

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
