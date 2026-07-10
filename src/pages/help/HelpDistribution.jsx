import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/help-category.css';

const faqs = [
  {
    q: 'How long does distribution take?',
    a: 'Once submitted and approved, your music typically goes live on most streaming platforms within 24–72 hours. Spotify and Apple Music may take up to 5 business days. We recommend submitting at least 2 weeks before your intended release date.',
  },
  {
    q: 'What stores does Tunefry distribute to?',
    a: 'Tunefry distributes to 150+ platforms including Spotify, Apple Music, Amazon Music, YouTube Music, JioSaavn, Gaana, Wynk, Hungama, Resso, Deezer, Tidal, and more. Platform availability may vary by plan.',
  },
  {
    q: 'Can I update my release after it goes live?',
    a: 'Yes — you can update metadata (title, artist name, genre, release date) after going live. Audio and artwork changes require a new submission. Some platforms like Spotify apply updates within 3–7 days.',
  },
  {
    q: 'How do I take down a release?',
    a: 'Go to Releases, click the release you want to remove, and select "Request Takedown." Takedowns process within 7–14 business days. Note that streaming history is permanently removed when a release is taken down.',
  },
  {
    q: 'What happens if my release is rejected?',
    a: 'You will receive an email explaining the reason for rejection. Common reasons include artwork not meeting specifications, audio quality issues, or missing metadata. Fix the issue and resubmit — there is no additional charge for resubmissions.',
  },
];

export default function HelpDistribution() {
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
        <div className="topic-hero-icon" style={{ background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.25)', color: '#F26522' }}>
          <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
        </div>
        <div className="topic-hero-info">
          <div className="topic-hero-title">Distribution &amp; Releases</div>
          <div className="topic-hero-sub">Everything about uploading, distributing, and managing your music releases on Tunefry.</div>
        </div>
      </div>

      {/* Tutorial Videos */}
      <div className="section-title">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" /></svg>
        Tutorial Videos
      </div>
      <div className="videos-grid">
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="How to upload your first release"></iframe>
          <div className="video-label">How to Upload Your First Release</div>
        </div>
        <div className="video-placeholder">
          <iframe src="" data-src="" allowFullScreen title="Distribution timeline explained"></iframe>
          <div className="video-label">Distribution Timeline Explained</div>
        </div>
      </div>

      {/* Artwork Specifications */}
      <div className="glass-card spec-card">
        <div className="spec-card-title">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
          Artwork Specifications
        </div>
        <div className="spec-list">
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Dimensions:</strong> Minimum 3000×3000 px, maximum 3500×3500 px. Square format only.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>File format:</strong> JPG or PNG, sRGB colour space, 72 dpi.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Image quality:</strong> No pixelation, blurriness, or visible compression artefacts.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Content rules:</strong> No explicit imagery visible on the cover. No faces obscured or distorted.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>No social handles or URLs:</strong> Do not include Instagram handles, website links, or any social media text on the artwork.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>No third-party logos:</strong> Platform logos (Spotify, Apple Music, etc.) are not permitted on cover art.</div>
          </div>
        </div>
      </div>

      {/* Track Content Rules */}
      <div className="glass-card spec-card">
        <div className="spec-card-title">
          <svg viewBox="0 0 24 24"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
          Track Content Rules
        </div>
        <div className="spec-list">
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Audio format:</strong> 16-bit WAV or higher (24-bit preferred). Sample rate: 44.1 kHz.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Silence:</strong> No more than 2 seconds of silence at the start or end of the track.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Copyrighted samples:</strong> All samples must be cleared. Tracks with unlicensed samples will be rejected or taken down.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Lyrics accuracy:</strong> Submitted lyrics must match the audio exactly. Placeholder or test lyrics are not permitted.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>No duplicate releases:</strong> Do not submit the same track more than once across releases unless it is an official remix or remaster.</div>
          </div>
          <div className="spec-item">
            <div className="spec-bullet"></div>
            <div className="spec-text"><strong>Language tag:</strong> Set the correct primary language for the track. Mislabelled language can delay delivery to regional platforms.</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="glass-card faq-card">
        <div className="faq-card-title">Frequently Asked Questions</div>
        <div className="faq-card-sub">Common questions about distributing and managing releases</div>

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
