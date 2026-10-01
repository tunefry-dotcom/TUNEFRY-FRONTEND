import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  getCategories, getCreditStatus, uploadBlogImage, submitArticle, buyCreditPack,
} from '../../lib/blog'
import '../../styles/ai-blog.css'

const FALLBACK_CATEGORIES = [
  { id: 'artist_journey', label: 'Artist Journey' },
  { id: 'song_release', label: 'Song Release' },
  { id: 'informative', label: 'Informative' },
  { id: 'success_story', label: 'Success Story' },
]

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export default function AiBlog() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [creditStatus, setCreditStatus] = useState(undefined) // undefined = loading, null = error
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState(FALLBACK_CATEGORIES[0].id)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [imageError, setImageError] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [purchasing, setPurchasing] = useState(null) // 'single' | 'bundle_20' | null
  const [purchaseError, setPurchaseError] = useState('')

  const imageInputRef = useRef(null)

  useEffect(() => {
    getCreditStatus().then(setCreditStatus).catch(() => setCreditStatus(null))
    getCategories().then((list) => { if (Array.isArray(list) && list.length) setCategories(list) }).catch(() => {})
  }, [])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setImageError('Please choose a JPEG, PNG, or WebP image.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setImageError('Image must be under 5 MB.')
      return
    }
    setImageError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function handleSubmit() {
    const trimmedTitle = title.trim()
    const trimmedBody = body.trim()
    if (!trimmedTitle || !trimmedBody) {
      setFormError('Title and article body are required.')
      return
    }
    if (!imageFile) {
      setFormError('Please add a cover image.')
      return
    }
    setFormError('')
    setSubmitting(true)
    try {
      const { key } = await uploadBlogImage(imageFile)
      await submitArticle({
        title: trimmedTitle,
        body: trimmedBody,
        category,
        cover_image_key: key,
      })
      setSubmitted(true)
    } catch (err) {
      setFormError(err.message || 'Could not submit your article. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleBuy(pack) {
    setPurchaseError('')
    setPurchasing(pack)
    try {
      await buyCreditPack(pack, { name: user?.artistName || user?.full_name, email: user?.email })
      const fresh = await getCreditStatus()
      setCreditStatus(fresh)
    } catch (err) {
      setPurchaseError(err.message || 'Payment could not be completed.')
    } finally {
      setPurchasing(null)
    }
  }

  return (
    <div className="blog-writer-page">
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
        Tunefry Daily
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Write a Blog</h1>
        <div className="page-header-actions">
          <Link to="/daily" className="btn btn-outline">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Tunefry Daily
          </Link>
        </div>
      </div>

      {creditStatus === undefined && (
        <div className="glass-card blog-form-card animate-in animate-in-delay-2" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          Loading...
        </div>
      )}

      {creditStatus === null && (
        <div className="glass-card blog-form-card animate-in animate-in-delay-2" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
          Couldn't load your publishing status. Please refresh the page.
        </div>
      )}

      {creditStatus && submitted && (
        <div className="glass-card blog-form-card animate-in animate-in-delay-2" style={{ textAlign: 'center', padding: '40px 24px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Submitted for review</div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Our team will review your draft and let you know once it's published. You'll get a notification either way.
          </p>
          <Link to="/daily" className="btn btn-create">Back to Tunefry Daily</Link>
        </div>
      )}

      {/* Compose form — only when a free article or a paid credit is available */}
      {creditStatus && creditStatus.can_publish && !submitted && (
        <div className="glass-card blog-form-card animate-in animate-in-delay-2">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>Submit Your Draft</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Just give us a basic overview — our team will polish it before it goes live.</div>
            </div>
          </div>

          <div className="blog-form-grid">
            <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
              <label className="blog-form-label">Article Title *</label>
              <input type="text" className="blog-form-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} placeholder="e.g. My Journey From Bedroom Producer to My First Release" />
            </div>

            <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
              <label className="blog-form-label">Article Body *</label>
              <textarea className="blog-form-input" style={{ minHeight: '180px', resize: 'vertical', fontFamily: 'var(--font-body)' }} value={body} onChange={(e) => setBody(e.target.value)} maxLength={20000} placeholder="Write your draft here — don't worry about polish, we'll take care of that." />
            </div>

            <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
              <label className="blog-form-label">Category</label>
              <div className="tone-selector">
                {categories.map((c) => (
                  <button key={c.id} type="button" className={'tone-btn' + (category === c.id ? ' active' : '')} onClick={() => setCategory(c.id)}>{c.label}</button>
                ))}
              </div>
            </div>

            <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
              <label className="blog-form-label">Cover Image *</label>
              <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="blog-form-input" onChange={handleImageChange} />
              {imageError && <p style={{ fontSize: '12px', color: '#f87171', margin: 0 }}>{imageError}</p>}
              {imagePreview && (
                <img src={imagePreview} alt="Cover preview" style={{ marginTop: '10px', maxHeight: '160px', borderRadius: '10px', border: '0.5px solid var(--border-subtle)' }} />
              )}
            </div>
          </div>

          {formError && <p style={{ fontSize: '12px', color: '#f87171', marginBottom: '12px' }}>{formError}</p>}

          <button className={'blog-generate-btn' + (submitting ? ' loading' : '')} onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </button>
        </div>
      )}

      {/* Publishing Plans — shown once the free article and any paid credits are used up */}
      {creditStatus && !creditStatus.can_publish && !submitted && (
        <div className="animate-in animate-in-delay-2">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Article Publishing Plans</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>You've used your free article. Grab a credit pack to keep publishing on Tunefry Daily.</div>

          {purchaseError && <p style={{ fontSize: '12.5px', color: '#f87171', marginBottom: '16px' }}>{purchaseError}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>

            {/* Free — already used */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>Free</div>
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 0</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>1 free article, ever</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Basic visibility</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Tunefry branding</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Standard formatting</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Community rating</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} disabled>Already Used</button>
            </div>

            {/* Pay Per Article */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderColor: 'rgba(242,101,34,0.35)', background: 'rgba(242,101,34,0.04)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>Pay Per Article</div>
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 49</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/article</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>1 article credit</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Enhanced visibility</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Author branding</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Advanced formatting</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Priority placement</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Basic analytics</li>
              </ul>
              <button className="btn-create" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }} onClick={() => handleBuy('single')} disabled={purchasing !== null}>
                {purchasing === 'single' ? 'Processing...' : 'Publish Now'}
              </button>
            </div>

            {/* 20-Article Pack */}
            <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>20-Article Pack</div>
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 799</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>one-time</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>20 article credits</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Top placement</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Verified author badge</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Custom design options</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Newsletter feature</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Advanced analytics</li>
                <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Promotion on social media</li>
              </ul>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleBuy('bundle_20')} disabled={purchasing !== null}>
                {purchasing === 'bundle_20' ? 'Processing...' : 'Publish Now'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
