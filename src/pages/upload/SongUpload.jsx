import { Link } from 'react-router-dom'
import '../../styles/upload-choice.css'

export default function SongUpload() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-label">Releases</span>
          <h1 className="page-title">Song Upload</h1>
        </div>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Back</Link>
        </div>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px' }}>Choose how you'd like to submit your song.</p>

      <div className="upload-option-grid">

        {/* Card 1: New Song Submission */}
        <div className="upload-option-card">
          <div className="upload-option-icon" style={{ background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.3)' }}>
            <svg viewBox="0 0 24 24" stroke="#F26522" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h2 className="upload-option-title">New Song Submission</h2>
          <p className="upload-option-desc">Submit a brand new song for distribution across 100+ streaming platforms worldwide.</p>
          <div className="upload-option-pills">
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Original release</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Full metadata control</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Custom release date</div>
          </div>
          <Link to="/upload/new-song" className="upload-option-cta orange">Start New Submission →</Link>
        </div>

        {/* Card 2: Transfer Existing Song */}
        <div className="upload-option-card">
          <div className="upload-option-icon" style={{ background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)' }}>
            <svg viewBox="0 0 24 24" stroke="#3B82F6" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4" />
              <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <h2 className="upload-option-title">Transfer Existing Song</h2>
          <p className="upload-option-desc">Already distributed elsewhere? Move your existing song to Tunefry without losing streams or playlist positions.</p>
          <div className="upload-option-pills">
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Keep stream count</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Zero downtime</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>We handle everything</div>
          </div>
          <Link to="/upload/transfer-song" className="upload-option-cta blue">Transfer My Song →</Link>
        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '24px' }}>Not sure which to choose? <Link to="/help" style={{ color: 'var(--accent)' }}>Visit the Help Center →</Link></p>
    </>
  )
}
