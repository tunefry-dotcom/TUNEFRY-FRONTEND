import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

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

const FILTER_TABS = [
  { id: 'all', label: 'All', count: 15 },
  { id: 'tunefry-daily', label: 'Tunefry Daily', count: 7 },
  { id: 'guides', label: 'Guides', count: 1 },
  { id: 'new-release', label: 'New Release', count: 6 },
  { id: 'events', label: 'Events', count: 1 },
]

const ARTICLES = [
  {
    id: 1, type: 'tunefry-daily', tag: 'Tunefry Daily', tagCls: 'tag-pu',
    date: 'April 5, 2026',
    title: '12 Hidden Revenue Streams You\'re Missing When Understanding Music Royalties',
    exc: 'Most independent artists only scratch the surface of royalty collection. We break down every revenue channel available to you and show you exactly how to claim what you\'re owed.',
    img: 'https://www.tunefry.com/uploads/understanding music royalties.jpg',
    featured: true,
  },
  {
    id: 2, type: 'guides', tag: 'Guide', tagCls: 'tag-gr',
    date: 'March 30, 2026',
    title: 'The Beginner\'s Roadmap to Playlist Pitching Through an Indian Music Distribution Platform',
    exc: 'Playlist pitching can 10x your streams. Here\'s the complete guide to pitching your tracks as an independent artist.',
    img: 'https://www.tunefry.com/uploads/Indian music distribution.png',
  },
  {
    id: 3, type: 'tunefry-daily', tag: 'Tunefry Daily', tagCls: 'tag-pu',
    date: 'March 26, 2026',
    title: 'The Truth About Unlimited Upload Plans When You Distribute Music Online',
    exc: '',
    img: 'https://www.tunefry.com/uploads/Distribute Music Online.jpg',
  },
  {
    id: 4, type: 'new-release', tag: 'New Release', tagCls: 'tag-or',
    date: 'March 22, 2026',
    title: 'Chote Se Bada — Out Soon',
    exc: '',
    img: 'https://www.tunefry.com/uploads/1000156552.jpg',
  },
]

const ROW_ARTICLES = [
  {
    id: 5, type: 'tunefry-daily', tag: 'Tunefry Daily', tagCls: 'tag-pu',
    date: 'March 18, 2026',
    title: 'Building a Release Strategy Around 100% Royalties to Maximize Catalog Value',
    exc: 'Learn how to time your releases, stack your catalog, and retain full ownership so every track keeps earning long after drop day.',
    readTime: '6 min read',
    img: 'https://www.tunefry.com/uploads/a-contemporary-workspace-photograph-show_hsp35n5rQ9a2moQZgM9yCA_QrtKtFWnT-aatRhzG9RlMQ (1).jpeg',
  },
  {
    id: 6, type: 'tunefry-daily', tag: 'Tunefry Daily', tagCls: 'tag-pu',
    date: 'March 14, 2026',
    title: 'Distribute Music in India Like a Brand: Building a Release Calendar',
    exc: 'A strategic release calendar turns singles into a narrative. Here is how to plan a quarter of drops that build momentum and listener habits.',
    readTime: '5 min read',
    img: 'https://www.tunefry.com/uploads/Lucid_Origin_Highquality_closeup_of_a_computer_screen_displayi_3.jpg',
  },
]

const POPULAR = [
  { title: 'How Independent Artists Are Reshaping the Music Industry in 2026', date: 'April 5, 2026' },
  { title: 'Understanding Mechanical vs Performance Royalties', date: 'March 24, 2026' },
  { title: 'TikTok Marketing: A Complete Guide for Musicians', date: 'March 28, 2026' },
  { title: '10 Mistakes to Avoid When Releasing Your First Single', date: 'April 2, 2026' },
]

const TOPICS = ['Royalties', 'Spotify', 'Distribution', 'Playlist Pitching', 'JioSaavn', 'Content ID', 'Hip-Hop', 'CRBT', 'Analytics', 'India']

const CATS = [
  { label: 'All', count: 15, color: '#FF6B00' },
  { label: 'Tunefry Daily', count: 7, color: '#a78bfa' },
  { label: 'New Release', count: 6, color: '#2DCA72' },
  { label: 'Guides', count: 1, color: '#FF6B00' },
  { label: 'Events', count: 1, color: '#ec4899' },
]

const NL_ICON = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

export default function DailyPublic() {
  useScrollReveal()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [activecat, setActivecat] = useState('All')

  const filterAll = (articles) => {
    if (activeTab === 'all') return articles
    return articles.filter(a => a.type === activeTab)
  }

  const cards = filterAll(ARTICLES.filter(a => !a.featured))
  const rows  = filterAll(ROW_ARTICLES)

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
            {FILTER_TABS.map(({ id, label, count }) => (
              <div
                key={id}
                className={`daily-tab${activeTab === id ? ' on' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                {label}
                {count > 0 && <span className="tab-ct">{count}</span>}
              </div>
            ))}
            <Link to="/daily/ai-blog" className="daily-tab">Artist Blog</Link>
          </div>

          {/* Featured */}
          <div className="sec-label au">Featured article</div>
          {ARTICLES.filter(a => a.featured).map(a => (
            <div key={a.id} className="feat-card au" onClick={() => navigate('/article')} style={{ cursor: 'pointer' }}>
              <div className="feat-img">
                <img src={a.img} alt={a.title} />
              </div>
              <div className="feat-over" />
              <div className="feat-num">01</div>
              <div className="feat-body">
                <span className={`tag ${a.tagCls}`}>{a.tag}</span>
                <div className="feat-date">{a.date}</div>
                <div className="feat-title">{a.title}</div>
                <div className="feat-exc">{a.exc}</div>
                <Link to="/article" className="btn-read">Read Article &rarr;</Link>
              </div>
            </div>
          ))}

          {/* Card Grid */}
          {cards.length > 0 && (
            <>
              <div className="sec-label au">Latest articles</div>
              <div className="card-grid au">
                {cards.map(a => (
                  <div key={a.id} className="d-card" onClick={() => navigate('/article')} style={{ cursor: 'pointer' }}>
                    <div className="d-card-img"><img src={a.img} alt={a.title} /></div>
                    <div className="d-card-body">
                      <div className="d-card-meta">
                        <span className={`tag ${a.tagCls}`}>{a.tag}</span>
                        <span className="d-card-date">{a.date}</span>
                      </div>
                      <div className="d-card-title">{a.title}</div>
                      <div className="d-card-foot">
                        <span className="d-card-author">Tunefry Team</span>
                        <span className="d-card-arrow">&rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Row Cards */}
          {rows.length > 0 && (
            <>
              <div className="sec-label au">More articles</div>
              <div className="row-cards">
                {rows.map(a => (
                  <div key={a.id} className="row-card au" onClick={() => navigate('/article')} style={{ cursor: 'pointer' }}>
                    <div className="row-card-img"><img src={a.img} alt={a.title} /></div>
                    <div className="row-card-body">
                      <span className={`tag ${a.tagCls}`}>{a.tag}</span>
                      <div className="row-card-title">{a.title}</div>
                      <div className="row-card-exc">{a.exc}</div>
                      <div className="row-card-foot">
                        <span>{a.date}</span>
                        <span>&bull;</span>
                        <span>{a.readTime}</span>
                        <span className="row-card-read">Read &rarr;</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          <div className="pagi au">
            <div className="pagi-btn pagi-btn-wide">&larr;</div>
            {[1,2,3].map(n => (
              <div key={n} className={`pagi-btn${n === 1 ? ' on' : ''}`}>{n}</div>
            ))}
            <span className="pagi-dots">&hellip;</span>
            <div className="pagi-btn pagi-btn-wide">Next &rarr;</div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="daily-aside">
          {/* Categories */}
          <div className="side-block">
            <div className="side-title">Browse by category</div>
            <div className="cat-list">
              {CATS.map(({ label, count, color }) => (
                <div key={label} className={`cat-row${activecat === label ? ' on' : ''}`} onClick={() => setActivecat(label)}>
                  <span className="cat-dot" style={{ background: color }} />
                  {label}
                  <span className="cat-ct">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="side-block">
            <div className="nl-card">
              <div className="nl-ico">{NL_ICON}</div>
              <div className="nl-h">Stay in the loop</div>
              <p className="nl-p">Get the latest music industry insights delivered to your inbox every week. Join thousands of artists who stay ahead.</p>
              <input className="nl-input" type="email" placeholder="your@email.com" />
              <button className="nl-btn">Subscribe Free</button>
              <div className="nl-note">No spam. Unsubscribe anytime.</div>
            </div>
          </div>

          {/* Popular */}
          <div className="side-block">
            <div className="side-title">Popular articles</div>
            <div className="pop-list">
              {POPULAR.map(({ title, date }, i) => (
                <div key={title} className="pop-item">
                  <div className="pop-num">0{i+1}</div>
                  <div>
                    <div className="pop-ttl">{title}</div>
                    <div className="pop-date">{date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="side-block">
            <div className="side-title">Topics</div>
            <div className="topic-cloud">
              {TOPICS.map(t => (
                <span key={t} className="topic-tag">{t}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
