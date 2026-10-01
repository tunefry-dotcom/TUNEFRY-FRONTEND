import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPostBySlug, getRelatedPosts } from '../../lib/blog'
import { API_BASE } from '../../lib/config'
import '../../styles/article.css'

const CATEGORY_LABELS = {
  artist_journey: 'Artist Journey',
  song_release: 'Song Release',
  informative: 'Informative',
  success_story: 'Success Story',
}

const CATEGORY_TAG_CLASS = {
  artist_journey: 'tag-pu',
  song_release: 'tag-gr',
  informative: 'tag-or',
  success_story: 'tag-bl',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function AuthorBadge({ authorType }) {
  const isTunefry = authorType === 'tunefry'
  return <span className={`tag ${isTunefry ? 'tag-tunefry' : 'tag-artist'}`}>{isTunefry ? 'Tunefry' : 'Artist'}</span>
}

export default function Article() {
  const { slug } = useParams()
  const [progress, setProgress] = useState(0)
  const [post, setPost] = useState(undefined) // undefined = loading, null = not found
  const [related, setRelated] = useState([])

  useEffect(() => {
    let cancelled = false
    setPost(undefined)
    setRelated([])
    getPostBySlug(slug)
      .then((data) => { if (!cancelled) setPost(data) })
      .catch(() => { if (!cancelled) setPost(null) })
    return () => { cancelled = true }
  }, [slug])

  useEffect(() => {
    if (!post) return
    let cancelled = false
    getRelatedPosts(slug, 6)
      .then((list) => { if (!cancelled) setRelated(Array.isArray(list) ? list : []) })
      .catch(() => { if (!cancelled) setRelated([]) })
    return () => { cancelled = true }
  }, [post, slug])

  // Scroll reveal for .au elements (matches shared public.css .au/.vis)
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('vis')
            io.unobserve(en.target)
          }
        }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [post])

  // Reading progress bar
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const height = doc.scrollHeight - doc.clientHeight
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shareTwitter = () => {
    const url = encodeURIComponent(window.location.href)
    const text = encodeURIComponent(document.title)
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener')
  }

  const copyLink = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(window.location.href)
  }

  if (post === undefined) {
    return <div className="au" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Loading article...</div>
  }

  if (post === null) {
    return (
      <div className="au" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--t3)', fontSize: 13, marginBottom: 16 }}>This article couldn't be found.</p>
        <Link to="/daily-public" className="btn-read">Back to Tunefry Daily &rarr;</Link>
      </div>
    )
  }

  const paragraphs = (post.body || '').split('\n\n').filter((p) => p.trim())
  const secondImageKey = post.cover_image_keys?.[1]
  const heroImageKey = post.cover_image_keys?.[0]
  const byline = post.author_name || (post.author_type === 'tunefry' ? 'Tunefry Team' : 'Artist')
  const related3 = related.slice(0, 3)
  const related6 = related.slice(3, 6)

  return (
    <>
      {/* ===================== READING PROGRESS ===================== */}
      <div className="art-progress" style={{ width: `${progress}%` }} />

      {/* ===================== BREADCRUMB ===================== */}
      <div className="breadcrumb au">
        <Link to="/daily-public">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          Tunefry Daily
        </Link>
      </div>

      {/* ===================== ARTICLE HEADER ===================== */}
      <div className="art-header au">
        <div className="art-meta-top">
          <span className={`tag ${CATEGORY_TAG_CLASS[post.category] || 'tag-or'}`}>{CATEGORY_LABELS[post.category] || post.category}</span>
          <AuthorBadge authorType={post.author_type} />
          <span className="art-sep"></span>
          <span className="art-date">{formatDate(post.published_at)}</span>
        </div>
        <h1 className="art-title">{post.title}</h1>
        <div className="art-byline">
          <div className="art-author">
            <div className="art-avatar">{byline.charAt(0).toUpperCase()}</div>
            <div>
              <div className="art-author-name">{byline}</div>
              <div className="art-author-role">{post.author_type === 'tunefry' ? 'Music Industry Insights' : 'Tunefry Artist'}</div>
            </div>
          </div>
          <div className="art-share">
            <span className="art-share-label">Share</span>
            <div className="share-btn" title="Share on Twitter" onClick={shareTwitter}>
              <svg viewBox="0 0 24 24"><path d="M4 4l11.73 16h4.27L8.27 4z" /><path d="M4 20l6.77-6.77" /><path d="M20 4l-6.77 6.77" /></svg>
            </div>
            <div className="share-btn" title="Copy link" onClick={copyLink}>
              <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== HERO IMAGE ===================== */}
      {heroImageKey && (
        <div className="art-hero-img au">
          <img src={`${API_BASE}/blog/assets/${heroImageKey}`} alt={post.title} />
        </div>
      )}

      {/* ===================== ARTICLE WRAP ===================== */}
      <div className={`art-wrap${related3.length === 0 ? ' no-aside' : ''}`}>

        {/* MAIN CONTENT */}
        <div className="art-main au">
          <div className="prose">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {secondImageKey && paragraphs.length > 0 && (
              <img src={`${API_BASE}/blog/assets/${secondImageKey}`} alt="" style={{ width: '100%', borderRadius: 12, margin: '24px 0' }} />
            )}
          </div>
        </div>

        {/* SIDEBAR */}
        {related3.length > 0 && (
          <div className="art-aside">
            <div className="side-block au">
              <div className="side-title">Related articles</div>
              <div className="rel-list">
                {related3.map((r) => (
                  <Link key={r.id} to={`/article/${r.slug}`} className="rel-item">
                    <div className="rel-thumb">
                      {r.cover_image_key && <img src={`${API_BASE}/blog/assets/${r.cover_image_key}`} alt={r.title} />}
                    </div>
                    <div>
                      <div className="rel-title">{r.title}</div>
                      <div className="rel-date">{formatDate(r.published_at)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================== RELATED ARTICLES ===================== */}
      {related6.length > 0 && (
        <div className="related-section">
          <div className="rel-sec-head au">More from Tunefry Daily</div>
          <div className="rel-grid au">
            {related6.map((r) => (
              <Link key={r.id} to={`/article/${r.slug}`} className="rel-card">
                <div className="rel-card-img">
                  {r.cover_image_key && <img src={`${API_BASE}/blog/assets/${r.cover_image_key}`} alt={r.title} />}
                </div>
                <div className="rel-card-body">
                  <div className="rel-card-meta">
                    <span className={`tag ${CATEGORY_TAG_CLASS[r.category] || 'tag-or'}`}>{CATEGORY_LABELS[r.category] || r.category}</span>
                    <span className="rel-card-date">{formatDate(r.published_at)}</span>
                  </div>
                  <div className="rel-card-title">{r.title}</div>
                  <div className="rel-card-foot">
                    <span>{r.author_name || (r.author_type === 'tunefry' ? 'Tunefry Team' : 'Artist')}</span>
                    <span className="rel-card-arrow">&rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
