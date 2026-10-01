import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories, getPosts } from '../../lib/blog'
import { API_BASE } from '../../lib/config'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('vis'); io.unobserve(en.target) } }),
      { threshold: 0.07, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach((el) => io.observe(el))
    document.querySelectorAll('.daily-hero .au').forEach((el) => el.classList.add('vis'))
    return () => io.disconnect()
  }, [])
}

const PER_PAGE = 12

const FALLBACK_CATEGORIES = [
  { id: 'artist_journey', label: 'Artist Journey' },
  { id: 'song_release', label: 'Song Release' },
  { id: 'informative', label: 'Informative' },
  { id: 'success_story', label: 'Success Story' },
]

const CATEGORY_TAG_CLASS = {
  artist_journey: 'tag-pu',
  song_release: 'tag-gr',
  informative: 'tag-or',
  success_story: 'tag-bl',
}

const CATEGORY_DOT_COLOR = {
  artist_journey: '#a78bfa',
  song_release: '#2DCA72',
  informative: '#FF6B00',
  success_story: '#ec4899',
}

const TOPICS = ['Royalties', 'Spotify', 'Distribution', 'Playlist Pitching', 'JioSaavn', 'Content ID', 'Hip-Hop', 'CRBT', 'Analytics', 'India']

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function AuthorBadge({ authorType }) {
  const isTunefry = authorType === 'tunefry'
  return <span className={`tag ${isTunefry ? 'tag-tunefry' : 'tag-artist'}`}>{isTunefry ? 'Tunefry' : 'Artist'}</span>
}

export default function DailyPublic() {
  useScrollReveal()
  const navigate = useNavigate()

  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [category, setCategory] = useState(null) // null = All
  const [page, setPage] = useState(1)
  const [listData, setListData] = useState(undefined) // undefined = loading, null = error
  const [allPosts, setAllPosts] = useState([])

  useEffect(() => {
    getCategories().then((list) => { if (Array.isArray(list) && list.length) setCategories(list) }).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setListData(undefined)
    getPosts({ category: category || undefined, page, perPage: PER_PAGE })
      .then((data) => { if (!cancelled) setListData(data) })
      .catch(() => { if (!cancelled) setListData(null) })
    return () => { cancelled = true }
  }, [category, page])

  // Fetches every approved post once (across all pages) purely to derive the
  // Featured / Popular sections client-side — the backend has no is_featured
  // / is_popular query param, only the category filter.
  useEffect(() => {
    let cancelled = false
    async function loadAll() {
      try {
        const first = await getPosts({ page: 1, perPage: 15 })
        let all = first.posts || []
        const totalPages = first.total_pages || 1
        for (let p = 2; p <= totalPages; p++) {
          const next = await getPosts({ page: p, perPage: 15 })
          all = all.concat(next.posts || [])
        }
        if (!cancelled) setAllPosts(all)
      } catch {
        if (!cancelled) setAllPosts([])
      }
    }
    loadAll()
    return () => { cancelled = true }
  }, [])

  function selectCategory(id) {
    setCategory(id)
    setPage(1)
  }

  const categoryLabelMap = Object.fromEntries(categories.map((c) => [c.id, c.label]))
  const featured = allPosts.filter((p) => p.is_featured)
  const popular = allPosts.filter((p) => p.is_popular).slice(0, 4)
  const posts = Array.isArray(listData?.posts) ? listData.posts : []
  const totalPages = listData?.total_pages || 1

  return (
    <>
      {/* ── HERO ── */}
      <section className="daily-hero">
        <div className="hero-orb" />
        <div className="daily-hero-inner">
          <div>
            <div className="daily-eyebrow au"><span className="daily-eyebrow-dot" /> Updated weekly</div>
            <h1 className="au au-d1">Tunefry <em>Daily</em></h1>
            <p className="hero-sub au au-d2">
              Insights, guides, and stories helping independent artists navigate distribution, royalties, and growth across every platform.
            </p>
          </div>
          <div className="daily-hero-search au au-d3">
            <input type="text" placeholder="Search articles..." />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="gad-wrap">
        <div className="gad-inner"><span>Google Ad (728×90)</span></div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="daily-wrap">
        <div className="daily-main">
          {/* Filter Tabs */}
          <div className="daily-tabs au">
            <div className={`daily-tab${category === null ? ' on' : ''}`} onClick={() => selectCategory(null)}>All</div>
            {categories.map(({ id, label }) => (
              <div key={id} className={`daily-tab${category === id ? ' on' : ''}`} onClick={() => selectCategory(id)}>
                {label}
              </div>
            ))}
            <Link to="/daily/ai-blog" className="daily-tab">Artist Blog</Link>
          </div>

          {/* Featured */}
          {featured.length > 0 && (
            <>
              <div className="sec-label au">Featured article</div>
              {featured.slice(0, 1).map((post) => (
                <div key={post.id} className="feat-card au" onClick={() => navigate(`/article/${post.slug}`)} style={{ cursor: 'pointer' }}>
                  <div className="feat-img">
                    {post.cover_image_key && <img src={`${API_BASE}/blog/assets/${post.cover_image_key}`} alt={post.title} />}
                  </div>
                  <div className="feat-over" />
                  <div className="feat-num">01</div>
                  <div className="feat-body">
                    <span className={`tag ${CATEGORY_TAG_CLASS[post.category] || 'tag-or'}`}>{categoryLabelMap[post.category] || post.category}</span>
                    <AuthorBadge authorType={post.author_type} />
                    <div className="feat-date">{formatDate(post.published_at)}</div>
                    <div className="feat-title">{post.title}</div>
                    <Link to={`/article/${post.slug}`} className="btn-read">Read Article &rarr;</Link>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Card Grid */}
          {listData === undefined && (
            <div className="au" style={{ padding: '32px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Loading articles...</div>
          )}
          {listData === null && (
            <div className="au" style={{ padding: '32px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>Couldn't load articles. Please refresh.</div>
          )}
          {Array.isArray(listData?.posts) && posts.length === 0 && (
            <div className="au" style={{ padding: '32px 0', textAlign: 'center', color: 'var(--t3)', fontSize: 13 }}>No articles in this category yet.</div>
          )}
          {posts.length > 0 && (
            <>
              <div className="sec-label au">Latest articles</div>
              <div className="card-grid au">
                {posts.map((post) => (
                  <div key={post.id} className="d-card" onClick={() => navigate(`/article/${post.slug}`)} style={{ cursor: 'pointer' }}>
                    <div className="d-card-img">
                      {post.cover_image_key && <img src={`${API_BASE}/blog/assets/${post.cover_image_key}`} alt={post.title} />}
                    </div>
                    <div className="d-card-body">
                      <div className="d-card-meta">
                        <span className={`tag ${CATEGORY_TAG_CLASS[post.category] || 'tag-or'}`}>{categoryLabelMap[post.category] || post.category}</span>
                        <AuthorBadge authorType={post.author_type} />
                        <span className="d-card-date">{formatDate(post.published_at)}</span>
                      </div>
                      <div className="d-card-title">{post.title}</div>
                      <div className="d-card-foot">
                        <span className="d-card-author">{post.author_name || (post.author_type === 'tunefry' ? 'Tunefry Team' : '')}</span>
                        <span className="d-card-arrow">&rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagi au">
              <div className={`pagi-btn pagi-btn-wide${page <= 1 ? ' disabled' : ''}`} onClick={() => page > 1 && setPage(page - 1)}>&larr;</div>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <div key={n} className={`pagi-btn${n === page ? ' on' : ''}`} onClick={() => setPage(n)}>{n}</div>
              ))}
              <div className={`pagi-btn pagi-btn-wide${page >= totalPages ? ' disabled' : ''}`} onClick={() => page < totalPages && setPage(page + 1)}>Next &rarr;</div>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="daily-aside">
          {/* Categories */}
          <div className="side-block">
            <div className="side-title">Browse by category</div>
            <div className="cat-list">
              <div className={`cat-row${category === null ? ' on' : ''}`} onClick={() => selectCategory(null)}>
                <span className="cat-dot" style={{ background: '#FF6B00' }} />
                All
              </div>
              {categories.map(({ id, label }) => (
                <div key={id} className={`cat-row${category === id ? ' on' : ''}`} onClick={() => selectCategory(id)}>
                  <span className="cat-dot" style={{ background: CATEGORY_DOT_COLOR[id] || '#FF6B00' }} />
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Popular */}
          {popular.length > 0 && (
            <div className="side-block">
              <div className="side-title">Popular articles</div>
              <div className="pop-list">
                {popular.map((post, i) => (
                  <Link key={post.id} to={`/article/${post.slug}`} className="pop-item" style={{ textDecoration: 'none' }}>
                    <div className="pop-num">0{i + 1}</div>
                    <div>
                      <div className="pop-ttl">{post.title}</div>
                      <div className="pop-date">{formatDate(post.published_at)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          <div className="side-block">
            <div className="side-title">Topics</div>
            <div className="topic-cloud">
              {TOPICS.map((t) => (
                <span key={t} className="topic-tag">{t}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
