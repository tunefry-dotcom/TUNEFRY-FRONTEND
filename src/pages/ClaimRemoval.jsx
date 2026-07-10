import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../styles/claim-removal.css'

export default function ClaimRemoval() {
  const [songName, setSongName] = useState('')
  const [artistName, setArtistName] = useState('')
  const [youtubeLink, setYoutubeLink] = useState('')
  const [errors, setErrors] = useState({ songName: false, artistName: false, youtubeLink: false })

  const [dragOver, setDragOver] = useState(false)
  const [preview, setPreview] = useState(null) // { name, size }

  const [submitting, setSubmitting] = useState(false)

  const [toast, setToast] = useState({ show: false, type: '', msg: '' })
  const toastTimer = useRef(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current) }
  }, [])

  function showToast(type, msg) {
    setToast({ show: true, type, msg })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }))
    }, 4500)
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragOver(true)
  }
  function handleDragLeave() {
    setDragOver(false)
  }
  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }
  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
  }
  function processFile(file) {
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'File too large. Max 10MB allowed.'); return }
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowed.indexOf(file.type) === -1) { showToast('error', 'Invalid file type. Use PDF, JPG, or PNG.'); return }
    setPreview({ name: file.name, size: (file.size / 1024).toFixed(0) + ' KB' })
  }
  function removeFile() {
    if (fileInputRef.current) fileInputRef.current.value = ''
    setPreview(null)
  }

  function submitClaim() {
    const values = { songName, artistName, youtubeLink }
    const nextErrors = { songName: false, artistName: false, youtubeLink: false }
    let valid = true
    ;['songName', 'artistName', 'youtubeLink'].forEach(function (id) {
      if (!values[id].trim()) {
        nextErrors[id] = true
        valid = false
      }
    })
    setErrors(nextErrors)
    if (!valid) {
      showToast('error', 'Please fill in all required fields.')
      return
    }
    setSubmitting(true)

    const fd = new FormData()
    fd.append('song_name', songName.trim())
    fd.append('artist_name', artistName.trim())
    fd.append('youtube_link', youtubeLink.trim())
    const fileInput = fileInputRef.current
    if (fileInput && fileInput.files && fileInput.files[0]) {
      fd.append('evidence', fileInput.files[0])
    }

    /* ===== BACKEND CONTRACT =========================================
     * POST /api/support/claim-removal
     * Content-Type: multipart/form-data  (set automatically by browser)
     * Auth: session cookie (credentials: 'include')
     *
     * Text fields: song_name, artist_name, youtube_link
     * File field:
     *   evidence  (.jpg/.jpeg/.png/.pdf, required)
     *
     * Expected response:
     *   2xx -> { ok: true, ticket_id: string }
     *   4xx/5xx -> { message: string }
     * ================================================================ */
    fetch('/api/support/claim-removal', {
      method: 'POST',
      body: fd,
      credentials: 'include'
    })
      .then(function (res) {
        return res.ok ? res.json() : res.json().then(function (e) { throw e })
      })
      .then(function () {
        showToast('success', 'Claim removal submitted. Claim will be released within 48 hrs* (working days).')
        setSongName('')
        setArtistName('')
        setYoutubeLink('')
        removeFile()
        setSubmitting(false)
      })
      .catch(function (err) {
        showToast('error', (err && err.message) ? err.message : 'Submission failed. Please try again.')
        setSubmitting(false)
      })
  }

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Support
      </div>
      <div className="page-header">
        <h1 className="page-title">Claim Removal</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Intro Card */}
      <div className="glass-card cr-intro-card">
        <div className="cr-intro-icon">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <div className="cr-intro-text">
          <h3>What is Claim Removal?</h3>
          <p>If your music has been claimed by a third party on YouTube or another platform, submit the details below and our team will investigate and process the removal within 3–5 working days. We handle copyright claims, ownership disputes, and distribution errors.</p>
          <div className="cr-timeline">
            <div className="cr-timeline-item">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              3–5 Working Days
            </div>
            <div className="cr-timeline-item">
              <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07"/><path d="M14.05 2.07A19.79 19.79 0 0122 9.93"/><path d="M1 1l22 22"/><path d="M16.72 16.72A10 10 0 016.37 6.37"/></svg>
              Email Notification
            </div>
            <div className="cr-timeline-item">
              <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              Full Resolution
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card cr-form-card">
        <div className="form-section-title">
          <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          Claim Details
        </div>

        <div className="form-group">
          <label className="form-label">Name of the Song <span className="req">*</span></label>
          <input
            type="text"
            className={'form-input' + (errors.songName ? ' input-error' : '')}
            id="songName"
            name="song_name"
            placeholder="Enter the song name"
            required
            value={songName}
            onChange={(e) => { setSongName(e.target.value); setErrors((p) => ({ ...p, songName: false })) }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Artist Name <span className="req">*</span></label>
          <input
            type="text"
            className={'form-input' + (errors.artistName ? ' input-error' : '')}
            id="artistName"
            name="artist_name"
            placeholder="Your artist name"
            required
            value={artistName}
            onChange={(e) => { setArtistName(e.target.value); setErrors((p) => ({ ...p, artistName: false })) }}
          />
        </div>

        <div className="form-group">
          <label className="form-label">YouTube Link <span className="req">*</span></label>
          <input
            type="url"
            className={'form-input' + (errors.youtubeLink ? ' input-error' : '')}
            id="youtubeLink"
            name="youtube_link"
            placeholder="https://www.youtube.com/watch?v=..."
            required
            value={youtubeLink}
            onChange={(e) => { setYoutubeLink(e.target.value); setErrors((p) => ({ ...p, youtubeLink: false })) }}
          />
        </div>

        <div className="section-divider"></div>

        <div className="form-group">
          <label className="form-label">Supporting Documentation, License etc. <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>(Optional)</span></label>
          <div
            className={'file-upload-zone' + (dragOver ? ' drag-over' : '')}
            id="uploadZone"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="evidenceFile"
              name="evidence"
              accept=".jpg,.jpeg,.png,.pdf"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <div className="file-upload-icon">
              <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div className="file-upload-title">Click to upload files</div>
            <div className="file-upload-sub">or drag &amp; drop here</div>
            <div className="file-upload-types">
              <span className="file-type-pill">PDF</span>
              <span className="file-type-pill">JPG</span>
              <span className="file-type-pill">PNG</span>
              <span className="file-type-pill">Max 10MB</span>
            </div>
          </div>
          <div className={'file-preview' + (preview ? ' show' : '')} id="filePreview">
            <div className="file-preview-icon"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
            <div>
              <div className="file-preview-name" id="fileName">{preview ? preview.name : ''}</div>
              <div className="file-preview-size" id="fileSize">{preview ? preview.size : ''}</div>
            </div>
            <span className="file-preview-remove" onClick={removeFile}>&#215;</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '14px', marginTop: '8px' }}>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Claim will be released within 48 hrs* (working days)</p>
          <button className="btn-submit" onClick={submitClaim} disabled={submitting}>
            {submitting ? (
              'Submitting…'
            ) : (
              <>
                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={'toast' + (toast.type === 'success' ? ' toast-success' : toast.type === 'error' ? ' toast-error' : '') + (toast.show ? ' show' : '')} id="toast">
        <svg id="toastIcon" viewBox="0 0 24 24">
          {toast.type === 'success' ? (
            <polyline points="20 6 9 17 4 12"/>
          ) : (
            <>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </>
          )}
        </svg>
        <span id="toastMsg">{toast.msg}</span>
      </div>
    </>
  )
}
