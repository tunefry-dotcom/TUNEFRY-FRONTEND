import { Link } from 'react-router-dom'
import '../../styles/upload-choice.css'

export default function AlbumUpload() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-label">Releases</span>
          <h1 className="page-title">Album Upload</h1>
        </div>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Back</Link>
        </div>
      </div>

      <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '40px' }}>Choose how you'd like to submit your album.</p>

      <div className="upload-option-grid">

        {/* Card 1: New Album Submission */}
        <div className="upload-option-card">
          <div className="upload-option-icon" style={{ background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.3)' }}>
            <svg viewBox="0 0 24 24" stroke="#F26522" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
          </div>
          <h2 className="upload-option-title">New Album Submission</h2>
          <p className="upload-option-desc">Submit a full album or EP for distribution. Add multiple tracks, custom artwork, and set your release date.</p>
          <div className="upload-option-pills">
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Multi-track support</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Full album metadata</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Up to 20 tracks</div>
          </div>
          <Link to="/upload/new-album" className="upload-option-cta orange">Start Album Submission →</Link>
        </div>

        {/* Card 2: Transfer Existing Album */}
        <div className="upload-option-card">
          <div className="upload-option-icon" style={{ background: 'rgba(59,130,246,0.15)', border: '0.5px solid rgba(59,130,246,0.3)' }}>
            <svg viewBox="0 0 24 24" stroke="#3B82F6" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4" />
              <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </div>
          <h2 className="upload-option-title">Transfer Existing Album</h2>
          <p className="upload-option-desc">Move your existing album from DistroKid, TuneCore, CD Baby, or any other distributor to Tunefry.</p>
          <div className="upload-option-pills">
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>All tracks transferred</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Stream history preserved</div>
            <div className="upload-pill"><div className="upload-pill-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3" /></svg></div>Expert migration</div>
          </div>
          <Link to="/upload/transfer-album" className="upload-option-cta blue">Transfer My Album →</Link>
        </div>

      </div>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-secondary)', marginTop: '24px' }}>Not sure which to choose? <Link to="/help" style={{ color: 'var(--accent)' }}>Visit the Help Center →</Link></p>
    </>
  )
}
