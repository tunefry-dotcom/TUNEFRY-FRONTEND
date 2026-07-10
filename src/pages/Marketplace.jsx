import { useState } from 'react'

const CATEGORIES = ['All Services', 'YouTube', 'Spotify', 'Instagram Reels', 'Instagram Audio']

const SERVICES = [
  { id: 1, platform: 'youtube', emoji: '🔴', badge: 'Popular', title: 'YouTube Channel Promo', provider: 'by ViralView Media', price: '$89', bg: 'linear-gradient(135deg, rgba(255,0,0,0.22) 0%, rgba(255,255,255,0.02) 100%)' },
  { id: 2, platform: 'spotify', emoji: '🎵', badge: 'Hot', title: 'Spotify Playlist Pitch', provider: 'by PlaylistPush Pro', price: '$49', bg: 'linear-gradient(135deg, rgba(29,185,84,0.22) 0%, rgba(255,255,255,0.02) 100%)' },
  { id: 3, platform: 'instagram-reels', emoji: '🎬', badge: 'Trending', title: 'Instagram Reels Boost', provider: 'by ReelRocket Agency', price: '$129', bg: 'linear-gradient(135deg, rgba(193,53,132,0.22) 0%, rgba(255,120,0,0.1) 100%)' },
  { id: 4, platform: 'instagram-audio', emoji: '🎧', badge: 'New', title: 'Instagram Audio Trending', provider: 'by SoundWave Social', price: '$79', bg: 'linear-gradient(135deg, rgba(168,85,247,0.22) 0%, rgba(193,53,132,0.12) 100%)' },
]

const PREMIUM = [
  { id: 5, platform: 'youtube', emoji: '🎥', badge: 'Elite', title: 'YouTube Shorts Campaign', provider: 'by ShortsBurst Studio', price: '$249', bg: 'linear-gradient(135deg, rgba(255,0,0,0.3) 0%, rgba(234,179,8,0.12) 100%)' },
  { id: 6, platform: 'spotify', emoji: '📊', badge: 'Elite', title: 'Spotify Editorial Pitch', provider: 'by CurateStream Pro', price: '$199', bg: 'linear-gradient(135deg, rgba(29,185,84,0.3) 0%, rgba(6,182,212,0.1) 100%)' },
  { id: 7, platform: 'instagram-reels', emoji: '✨', badge: 'Elite', title: 'Premium Reels Campaign', provider: 'by VisualBeats Social', price: '$349', bg: 'linear-gradient(135deg, rgba(193,53,132,0.3) 0%, rgba(168,85,247,0.15) 100%)' },
  { id: 8, platform: 'instagram-audio', emoji: '🔥', badge: 'Elite', title: 'Viral Audio Push', provider: 'by TrendAudio Agency', price: '$399', bg: 'linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(242,101,34,0.12) 100%)' },
]

const FILTER_KEY = { 'All Services': null, 'YouTube': 'youtube', 'Spotify': 'spotify', 'Instagram Reels': 'instagram-reels', 'Instagram Audio': 'instagram-audio' }

function ServiceCard({ svc, delay }) {
  return (
    <div className="glass-card service-card animate-in" style={{ animationDelay: delay }}>
      <div className="service-banner" style={{ background: svc.bg }}>
        <span className="service-emoji">{svc.emoji}</span>
        <span className="service-badge-top">{svc.badge}</span>
      </div>
      <div className="service-body">
        <div className="service-title">{svc.title}</div>
        <div className="service-provider">{svc.provider}</div>
        <div className="service-footer">
          <div className="service-price">{svc.price}</div>
          <button className="service-buy-btn">Buy Now</button>
        </div>
      </div>
    </div>
  )
}

export default function Marketplace() {
  const [active, setActive] = useState('All Services')
  const filter = FILTER_KEY[active]

  const filtered = (list) => filter ? list.filter((s) => s.platform === filter) : list

  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        Services
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Marketplace</h1>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            <svg viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="category-tabs animate-in animate-in-delay-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`category-tab${active === c ? ' active' : ''}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="glass-card animate-in animate-in-delay-3" style={{ padding: 32, marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 300, height: '100%', background: 'radial-gradient(ellipse at right, rgba(242,101,34,0.15) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>Featured</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Boost Your Streams This Month</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 500, marginBottom: 18 }}>Get 20% off all playlist pitching services through October. Reach new audiences and grow your fanbase with curated editorial playlists.</div>
          <button className="btn btn-primary">Explore Deals</button>
        </div>
      </div>

      {/* Popular Services */}
      {filtered(SERVICES).length > 0 && (
        <>
          <div className="section-header animate-in animate-in-delay-4">
            <h2 className="section-title">Popular Services</h2>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          <div className="service-grid">
            {filtered(SERVICES).map((s, i) => (
              <ServiceCard key={s.id} svc={s} delay={`${0.4 + i * 0.05}s`} />
            ))}
          </div>
        </>
      )}

      {/* Premium Services */}
      {filtered(PREMIUM).length > 0 && (
        <>
          <div className="section-header animate-in" style={{ animationDelay: '0.55s', marginTop: 12 }}>
            <h2 className="section-title">Premium Services</h2>
            <button className="btn btn-sm btn-ghost">View All</button>
          </div>
          <div className="service-grid">
            {filtered(PREMIUM).map((s, i) => (
              <ServiceCard key={s.id} svc={s} delay={`${0.6 + i * 0.05}s`} />
            ))}
          </div>
        </>
      )}

      {filtered(SERVICES).length === 0 && filtered(PREMIUM).length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🛍️</div>
          <div className="empty-title">No services found</div>
          <div className="empty-desc">No services match the selected category. Try a different filter.</div>
        </div>
      )}
    </>
  )
}
