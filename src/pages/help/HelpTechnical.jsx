import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/help-category.css';

const faqs = [
  {
    q: 'Why is my audio upload failing?',
    a: 'Common causes: file size too large (max 500 MB per track), unsupported format (only WAV and FLAC accepted), or a slow/unstable connection. Try re-exporting your file as a 16-bit or 24-bit WAV at 44.1 kHz, then upload again. If the issue persists, try a different browser.',
  },
  {
    q: 'What audio formats are accepted?',
    a: 'Tunefry accepts WAV (16-bit or 24-bit) and FLAC files. Sample rate must be 44.1 kHz or 48 kHz. MP3 and AAC files are not accepted — they are lossy formats and do not meet platform quality standards. Export from your DAW directly to WAV for best results.',
  },
  {
    q: 'Why is my release rejected by a platform?',
    a: 'Platforms reject releases for: artwork not meeting size or content requirements, audio quality below standard, incorrect or missing metadata (ISRC, UPC), or duplicate releases. Check the rejection email for the specific reason. Fix the flagged issue and resubmit — no extra fee applies.',
  },
  {
    q: 'My release is live but not appearing on a specific platform — why?',
    a: 'Some platforms index new releases with a delay of 1–3 extra days. Also check whether that platform is included in your current plan. If a platform shows as "Delivered" in your dashboard but the music isn\'t searchable after 7 days, contact support with your release URL.',
  },
  {
    q: 'My artwork upload keeps failing — what should I check?',
    a: 'Artwork must be between 3000×3000 px and 3500×3500 px, JPG or PNG format, sRGB colour space. File size should be under 20 MB. Ensure the image has no transparent layers (use a white or solid background), then re-upload.',
  },
  {
    q: 'The dashboard is not loading correctly — how do I fix it?',
    a: 'Try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R), clear your browser cache, or open in an incognito window. If the issue continues across browsers, it may be a temporary server issue. Check our status page or contact support at support@tunefry.com.',
  },
];

export default function HelpTechnical() {
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
        <div className="topic-hero-icon" style={{ background: 'rgba(168,85,247,0.12)', border: '0.5px solid rgba(168,85,247,0.22)', color: '#A855F7' }}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" /><path d="M15.54 8.46a5 5 0 010 7.07M8.46 8.46a5 5 0 000 7.07" /></svg>
        </div>
        <div className="topic-hero-info">
          <div className="topic-hero-title">Technical Issues</div>
          <div className="topic-hero-sub">Troubleshooting upload errors, playback problems, and platform delivery issues.</div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="section-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
        Tutorial Videos
      </div>
      <div className="videos-grid">
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Troubleshooting upload failures"></iframe>
          <div className="video-label">Troubleshooting Upload Failures</div>
        </div>
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Fixing release delivery errors"></iframe>
          <div className="video-label">Fixing Release Delivery Errors</div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card faq-card">
        <div className="faq-card-title">Frequently Asked Questions</div>
        <div className="faq-card-sub">Common technical questions from artists on Tunefry</div>

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
