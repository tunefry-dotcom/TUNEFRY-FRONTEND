import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyPosts } from '../../lib/blog'
import { API_BASE } from '../../lib/config'

const CATEGORY_LABELS = {
  artist_journey: 'Artist Journey',
  song_release: 'Song Release',
  informative: 'Informative',
  success_story: 'Success Story',
}

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function Daily() {
  const [posts, setPosts] = useState(undefined) // undefined = loading, null = error

  useEffect(() => {
    getMyPosts('approved').then(setPosts).catch(() => setPosts(null))
  }, [])

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
        Tunefry Daily
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Tunefry Daily</h1>
        <div className="page-header-actions">
          <Link to="/daily/ai-blog" className="btn btn-primary" style={{ textDecoration: 'none' }}>Write a New Article</Link>
        </div>
      </div>

      <Link to="/daily/ai-blog" style={{ textDecoration: 'none' }}>
        <div className="glass-card animate-in animate-in-delay-2" style={{ padding: 28, marginBottom: 24, cursor: 'pointer', borderColor: 'rgba(242,101,34,0.15)', transition: 'border-color .2s' }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(242,101,34,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(242,101,34,0.15)'}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: 'var(--accent)', fill: 'none', strokeWidth: 1.8 }}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Write a New Article</div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>Share your journey, a new release, or a success story — our team polishes it before it goes live on Tunefry Daily.</p>
        </div>
      </Link>

      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Your Published Articles</div>

      {posts === undefined && (
        <div className="glass-card" style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>Loading...</div>
      )}

      {posts === null && (
        <div className="glass-card" style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>Couldn't load your articles. Please refresh the page.</div>
      )}

      {Array.isArray(posts) && posts.length === 0 && (
        <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Nothing published yet. Once your first article is approved, it'll show up here.</p>
        </div>
      )}

      {Array.isArray(posts) && posts.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map((post) => (
            <Link key={post.id} to={`/article/${post.slug}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ overflow: 'hidden', height: '100%' }}>
                <div style={{ height: 140, background: 'rgba(255,255,255,0.04)' }}>
                  {post.cover_image_key && (
                    <img
                      src={`${API_BASE}/blog/assets/${post.cover_image_key}`}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <span style={{ display: 'inline-block', marginBottom: 8, padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.25)', color: 'var(--accent)' }}>
                    {CATEGORY_LABELS[post.category] || post.category}
                  </span>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>{post.title}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{formatDate(post.published_at)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
