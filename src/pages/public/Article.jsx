import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/article.css'

export default function Article() {
  const [progress, setProgress] = useState(0)

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
  }, [])

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
          <span className="tag tag-pu">Tunefry Daily</span>
          <span className="art-sep"></span>
          <span className="art-date">April 5, 2026</span>
          <span className="art-sep"></span>
          <span className="art-read-time">8 min read</span>
        </div>
        <h1 className="art-title">12 Hidden Revenue Streams You're Missing When Understanding Music Royalties</h1>
        <p className="art-excerpt">Most independent artists only scratch the surface of royalty collection. We break down every revenue channel available to you and show you exactly how to claim what you're owed.</p>
        <div className="art-byline">
          <div className="art-author">
            <div className="art-avatar">T</div>
            <div>
              <div className="art-author-name">Tunefry Team</div>
              <div className="art-author-role">Music Industry Insights</div>
            </div>
          </div>
          <div className="art-share">
            <span className="art-share-label">Share</span>
            <div className="share-btn" title="Share on Twitter" onClick={shareTwitter}>
              <svg viewBox="0 0 24 24"><path d="M4 4l11.73 16h4.27L8.27 4z" /><path d="M4 20l6.77-6.77" /><path d="M20 4l-6.77 6.77" /></svg>
            </div>
            <div className="share-btn" title="Share on Instagram">
              <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </div>
            <div className="share-btn" title="Copy link" onClick={copyLink}>
              <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== HERO IMAGE ===================== */}
      <div className="art-hero-img au">
        <img src="https://www.tunefry.com/uploads/understanding music royalties.jpg" alt="Understanding music royalties" />
        <div className="art-hero-caption">A comprehensive guide to every royalty stream available to independent artists in 2026</div>
      </div>

      {/* ===================== ARTICLE WRAP ===================== */}
      <div className="art-wrap">

        {/* MAIN CONTENT */}
        <div className="art-main au">
          <div className="prose">

            <p>If you've released music independently and collected royalties through a single distributor, you've likely left money on the table. The royalty landscape is fragmented across dozens of collection societies, platforms, and licensing bodies — and most artists only tap into one or two of them.</p>

            <p>This guide walks you through all 12 streams, who manages each one, and exactly what you need to do to start collecting.</p>

            <h2>The Two Types of Royalties You Need to Understand First</h2>

            <p>Before diving into the 12 streams, you need to understand the fundamental split that governs all music royalties:</p>

            <p><strong>Master royalties</strong> flow to the owner of the sound recording — typically the artist or their label. <strong>Publishing royalties</strong> flow to the songwriter and their publisher. If you write and record your own music, you're entitled to both. Most independent artists don't claim both.</p>

            <blockquote>
              <p>"Every unclaimed royalty is a permanent loss. There's no going back to collect earnings from streams that happened years ago if you weren't registered at the time."</p>
              <cite>— Tunefry Research Team</cite>
            </blockquote>

            <h2>The 12 Revenue Streams</h2>

            <h3>1. Mechanical Royalties (Digital)</h3>
            <p>Every time someone streams your song, a mechanical royalty is generated for the underlying composition. In India, this is collected by the <strong>Indian Performing Right Society (IPRS)</strong> and distributed to registered songwriters. If you're not a member, you're not collecting these.</p>

            <h3>2. Performance Royalties</h3>
            <p>When your music plays on radio, in a café, at a live venue, or in a film, performance royalties are due. IPRS handles this in India. Internationally, PROs like ASCAP, BMI, PRS for Music, and SOCAN collect on your behalf — but only if you're registered with the correct society for each territory.</p>

            <h3>3. Streaming Master Royalties</h3>
            <p>This is the stream most artists know about — the per-stream payment from Spotify, Apple Music, JioSaavn, Gaana, and others. Your distributor collects and passes these through. Ensure your distributor covers all active platforms and that your ISRC codes are correctly registered.</p>

            <h3>4. YouTube Content ID</h3>
            <p>When your music appears in user-generated content on YouTube, Content ID claims monetise those videos on your behalf. Without Content ID registration, every video using your song earns revenue for YouTube — not you. Tunefry's distribution includes Content ID at no extra cost.</p>

            <h3>5. Neighbouring Rights</h3>
            <p>When a master recording (not just the composition) is played on radio or in public spaces, neighbouring rights payments are owed to the rights holder. In India, the Phonographic Performance Limited (PPL) manages these. International neighbouring rights are collected by organisations like PPL UK and GVL in Germany.</p>

            <h3>6. Sync Licensing</h3>
            <p>Films, TV shows, advertisements, and video games all need to license music. A single sync placement can earn anywhere from ₹50,000 to several lakhs. You can pitch directly to music supervisors, list your catalogue on sync libraries, or work through a licensing agent.</p>

            <h3>7. CRBT (Caller Ring Back Tones)</h3>
            <p>In India, CRBT remains a significant revenue source. Every time a caller hears your song as someone's ring tone, a royalty is generated. These are collected by telecom operators and passed through to rights holders. Make sure your distributor has active CRBT deals with Airtel, Jio, Vi, and BSNL.</p>

            <h3>8. Micro-sync (Short-form Video)</h3>
            <p>Instagram Reels, YouTube Shorts, and similar platforms have their own licensing pools. When your music is used in short-form video content, micro-sync royalties are generated. These are often collected through your distributor's licensing agreements with these platforms — confirm your distributor has these deals active.</p>

            <h3>9. Physical Sales Royalties</h3>
            <p>CDs, vinyl, and cassettes may feel outdated but vinyl sales are at a 30-year high globally. If you press physical copies, mechanical royalties are due on each unit sold. IPRS membership covers you for domestic sales; international mechanicals require registration with the relevant society in each territory.</p>

            <h3>10. Background Music Licensing</h3>
            <p>Hotels, retail stores, restaurants, and gyms pay licensing fees to play music in their spaces. In India, this falls under PPL's blanket licensing scheme. You don't need to do anything beyond ensuring your recordings are registered with PPL — they collect on your behalf.</p>

            <h3>11. Live Performance Royalties</h3>
            <p>When you perform your original songs live, publishing royalties are owed — even if you're the one performing them. Venues with IPRS licences report their set lists, and IPRS distributes royalties to registered members. Always set-list your originals, even at small shows.</p>

            <h3>12. International Unclaimed Royalties</h3>
            <p>This is the most overlooked stream. Royalties generated internationally — particularly in the US, UK, and EU — sit unclaimed if you're not registered with the relevant societies. Services like SoundExchange (US digital radio), SOCAN (Canada), and PRS (UK) hold funds for unregistered rights holders for a limited window before the money is redistributed.</p>

            <hr className="art-divider" />

            <h2>Your Action Plan</h2>

            <ol>
              <li>Join IPRS as a songwriter/composer to start collecting mechanical and performance royalties in India.</li>
              <li>Register your recordings with PPL India for neighbouring rights and CRBT collection.</li>
              <li>Ensure your distributor has Content ID, CRBT, and short-form video licensing active on all releases.</li>
              <li>Register with SoundExchange if you have any US digital radio play — it's free and there's no deadline to join, but unclaimed funds have a window.</li>
              <li>Audit your existing releases: check that all ISRC and ISWC codes are correctly assigned and that your catalogue is registered with every relevant society.</li>
            </ol>

            <p>The royalty system rewards artists who understand it. Most of the registrations above are free or have a small one-time membership fee. The money you leave unclaimed by not registering is simply redistributed to those who did.</p>

          </div>

          {/* Article tags */}
          <div className="art-tags">
            <span className="art-tag-item">Royalties</span>
            <span className="art-tag-item">Distribution</span>
            <span className="art-tag-item">IPRS</span>
            <span className="art-tag-item">PPL India</span>
            <span className="art-tag-item">Content ID</span>
            <span className="art-tag-item">CRBT</span>
            <span className="art-tag-item">Sync Licensing</span>
            <span className="art-tag-item">Independent Artists</span>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="art-aside">

          {/* Newsletter */}
          <div className="side-block au">
            <div className="nl-card">
              <div className="nl-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--or)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div className="nl-h">Stay in the loop</div>
              <div className="nl-p">Get the latest music industry insights delivered to your inbox every week.</div>
              <input type="email" className="nl-input" placeholder="your@email.com" />
              <button className="nl-btn">Subscribe Free</button>
              <div className="nl-note">No spam. Unsubscribe anytime.</div>
            </div>
          </div>

          {/* Related in sidebar */}
          <div className="side-block au">
            <div className="side-title">Related articles</div>
            <div className="rel-list">
              <Link to="/article" className="rel-item">
                <div className="rel-thumb">
                  <img src="https://www.tunefry.com/uploads/Indian music distribution.png" alt="Indian music distribution" />
                </div>
                <div>
                  <div className="rel-title">The Beginner's Roadmap to Playlist Pitching Through an Indian Music Distribution Platform</div>
                  <div className="rel-date">March 30, 2026</div>
                </div>
              </Link>
              <Link to="/article" className="rel-item">
                <div className="rel-thumb">
                  <img src="https://www.tunefry.com/uploads/a-contemporary-workspace-photograph-show_hsp35n5rQ9a2moQZgM9yCA_QrtKtFWnT-aatRhzG9RlMQ (1).jpeg" alt="Release strategy" />
                </div>
                <div>
                  <div className="rel-title">Building a Release Strategy Around 100% Royalties to Maximize Catalog Value</div>
                  <div className="rel-date">March 18, 2026</div>
                </div>
              </Link>
              <Link to="/article" className="rel-item">
                <div className="rel-thumb">
                  <img src="https://www.tunefry.com/uploads/Distribute Music Online.jpg" alt="Distribute music online" />
                </div>
                <div>
                  <div className="rel-title">The Truth About Unlimited Upload Plans When You Distribute Music Online</div>
                  <div className="rel-date">March 26, 2026</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Topics */}
          <div className="side-block au">
            <div className="side-title">Topics</div>
            <div className="topic-cloud">
              <span className="topic-tag">Royalties</span>
              <span className="topic-tag">Spotify</span>
              <span className="topic-tag">Distribution</span>
              <span className="topic-tag">Playlist Pitching</span>
              <span className="topic-tag">JioSaavn</span>
              <span className="topic-tag">Content ID</span>
              <span className="topic-tag">CRBT</span>
              <span className="topic-tag">Analytics</span>
              <span className="topic-tag">India</span>
            </div>
          </div>

        </div>
      </div>

      {/* ===================== RELATED ARTICLES ===================== */}
      <div className="related-section">
        <div className="rel-sec-head au">More from Tunefry Daily</div>
        <div className="rel-grid au">
          {/* Related 1 */}
          <Link to="/article" className="rel-card">
            <div className="rel-card-img">
              <img src="https://www.tunefry.com/uploads/Indian music distribution.png" alt="Playlist pitching guide" />
            </div>
            <div className="rel-card-body">
              <div className="rel-card-meta">
                <span className="tag tag-gr">Guide</span>
                <span className="rel-card-date">March 30, 2026</span>
              </div>
              <div className="rel-card-title">The Beginner's Roadmap to Playlist Pitching Through an Indian Music Distribution Platform</div>
              <div className="rel-card-foot">
                <span>Tunefry Team</span>
                <span className="rel-card-arrow">&rarr;</span>
              </div>
            </div>
          </Link>
          {/* Related 2 */}
          <Link to="/article" className="rel-card">
            <div className="rel-card-img">
              <img src="https://www.tunefry.com/uploads/a-contemporary-workspace-photograph-show_hsp35n5rQ9a2moQZgM9yCA_QrtKtFWnT-aatRhzG9RlMQ (1).jpeg" alt="Release strategy" />
            </div>
            <div className="rel-card-body">
              <div className="rel-card-meta">
                <span className="tag tag-pu">Tunefry Daily</span>
                <span className="rel-card-date">March 18, 2026</span>
              </div>
              <div className="rel-card-title">Building a Release Strategy Around 100% Royalties to Maximize Catalog Value</div>
              <div className="rel-card-foot">
                <span>Tunefry Team</span>
                <span className="rel-card-arrow">&rarr;</span>
              </div>
            </div>
          </Link>
          {/* Related 3 */}
          <Link to="/article" className="rel-card">
            <div className="rel-card-img">
              <img src="https://www.tunefry.com/uploads/Lucid_Origin_Highquality_closeup_of_a_computer_screen_displayi_3.jpg" alt="Release calendar" />
            </div>
            <div className="rel-card-body">
              <div className="rel-card-meta">
                <span className="tag tag-pu">Tunefry Daily</span>
                <span className="rel-card-date">March 14, 2026</span>
              </div>
              <div className="rel-card-title">Distribute Music in India Like a Brand: Building a Release Calendar</div>
              <div className="rel-card-foot">
                <span>Tunefry Team</span>
                <span className="rel-card-arrow">&rarr;</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  )
}
