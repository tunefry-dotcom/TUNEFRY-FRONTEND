import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/ai-blog.css'
import ComingSoon from '../../components/ComingSoon'

function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1) }

function generatePlaceholderArticle(topic, tone, length, keywords) {
  var intro = '# ' + topic + '\n\n'
  var toneNote = tone === 'professional' ? 'In the music industry today,' : tone === 'casual' ? 'Let\'s talk about something every artist needs to know —' : tone === 'inspirational' ? 'Every great artist starts with a dream.' : 'Understanding the music industry is essential for every creator.'

  intro += toneNote + ' ' + topic.toLowerCase() + ' is one of the most important skills you can develop as an independent artist.\n\n'
  intro += 'Whether you\'re just starting out or already have releases on major platforms, knowing how to navigate this aspect of the music business can make a significant difference in your career.\n\n'

  var body = '## Why This Matters\n\nThe music industry has evolved dramatically over the past decade. With streaming platforms now dominating how music is consumed, independent artists have more opportunities than ever — but also more competition.\n\n'
  body += '## Getting Started\n\nHere are the key steps every artist should follow:\n\n'
  body += '**1. Build Your Foundation**\nBefore anything else, ensure your music is professionally produced and your artist profile is complete on all major platforms.\n\n'
  body += '**2. Understand the Process**\nTake time to learn the specifics of ' + topic.toLowerCase() + '. Research, connect with other artists, and seek guidance from industry experts.\n\n'
  body += '**3. Take Action Consistently**\nSuccess in music doesn\'t happen overnight. Consistent effort, strategic planning, and genuine artistic expression are the keys to long-term growth.\n\n'

  if (length === 'long') {
    body += '## Advanced Strategies\n\nOnce you have the basics down, consider these advanced approaches:\n\n'
    body += '- Leverage data analytics to understand your audience\n- Collaborate with other artists in complementary genres\n- Build a direct relationship with your fans through social media\n- Explore sync licensing opportunities for additional revenue\n\n'
    body += '## Common Mistakes to Avoid\n\nMany artists make these mistakes — learn from them:\n\n'
    body += '1. Rushing the release without proper planning\n2. Ignoring the importance of metadata and artwork\n3. Neglecting to register with performing rights organizations\n4. Underestimating the value of playlisting and radio promotion\n\n'
  }

  var conclusion = '## Final Thoughts\n\n'
  if (tone === 'inspirational') {
    conclusion += 'Remember, every successful artist was once where you are now. The journey is the destination. Keep creating, keep sharing, and trust the process.\n\n'
  } else {
    conclusion += 'By following these guidelines and staying consistent, you\'ll be well on your way to achieving your goals as an independent artist. The music industry rewards those who are prepared and persistent.\n\n'
  }

  if (keywords) {
    conclusion += '*Keywords: ' + keywords + '*\n'
  }
  conclusion += '\n---\n*Published on Tunefry Daily — India\'s Music Industry Blog*'

  return intro + body + conclusion
}

export default function AiBlog() {
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [showOutput, setShowOutput] = useState(false)
  const [loading, setLoading] = useState(false)
  const [output, setOutput] = useState('')
  const [history, setHistory] = useState([
    { title: 'How to Pitch Your Music to Spotify Playlists', date: 'April 10, 2026 · Professional · Medium' },
    { title: 'Understanding Music Royalties in India', date: 'April 8, 2026 · Educational · Long' },
    { title: '5 Tips for Independent Artists in 2026', date: 'April 5, 2026 · Inspirational · Medium' },
  ])

  const topicRef = useRef(null)
  const keywordsRef = useRef(null)
  const outputCardRef = useRef(null)

  useEffect(() => {
    if (showOutput && outputCardRef.current) {
      outputCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [showOutput])

  function generateArticle() {
    var topic = topicRef.current.value.trim()
    if (!topic) {
      topicRef.current.focus()
      topicRef.current.style.borderColor = 'var(--red)'
      setTimeout(function () { if (topicRef.current) topicRef.current.style.borderColor = '' }, 2000)
      return
    }

    setLoading(true)

    var keywords = keywordsRef.current.value

    setTimeout(function () {
      var article = generatePlaceholderArticle(topic, tone, length, keywords)
      setOutput(article)
      setShowOutput(true)
      setLoading(false)

      setHistory(function (prev) {
        return [{ title: topic, date: 'Just now · ' + capitalize(tone) + ' · ' + capitalize(length) }, ...prev]
      })
    }, 1800)
  }

  function copyArticle() {
    var text = output
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function () { alert('Article copied to clipboard!') })
    } else {
      alert('Article copied to clipboard!')
    }
  }

  function clearOutput() {
    setOutput('')
    setShowOutput(false)
  }

  return (
    <ComingSoon>
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
        AI Tools
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <h1 className="page-title">Blog Writer</h1>
        <div className="page-header-actions">
          <Link to="/daily" className="btn btn-outline">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
            Back to Tunefry Daily
          </Link>
        </div>
      </div>

      {/* AI Writer Form */}
      <div className="glass-card blog-form-card animate-in animate-in-delay-2">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(242,101,34,0.15)', border: '0.5px solid rgba(242,101,34,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700 }}>AI Article Generator</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Create music industry blog posts in seconds</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent)', background: 'rgba(242,101,34,0.1)', border: '0.5px solid rgba(242,101,34,0.2)', borderRadius: '100px', padding: '4px 10px' }}>Beta</div>
        </div>

        <div className="blog-form-grid">

          <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
            <label className="blog-form-label">Article Topic *</label>
            <input type="text" className="blog-form-input" id="blogTopic" ref={topicRef} placeholder="e.g. How to pitch your music to Spotify playlists" />
          </div>

          <div className="blog-form-group">
            <label className="blog-form-label">Keywords (comma separated)</label>
            <input type="text" className="blog-form-input" id="blogKeywords" ref={keywordsRef} placeholder="e.g. Spotify, playlist pitching, independent artists" />
          </div>

          <div className="blog-form-group">
            <label className="blog-form-label">Article Length</label>
            <div className="length-selector">
              <button className={'tone-btn' + (length === 'short' ? ' active' : '')} onClick={() => setLength('short')}>Short</button>
              <button className={'tone-btn' + (length === 'medium' ? ' active' : '')} onClick={() => setLength('medium')}>Medium</button>
              <button className={'tone-btn' + (length === 'long' ? ' active' : '')} onClick={() => setLength('long')}>Long</button>
            </div>
            <input type="hidden" id="blogLength" value={length} />
          </div>

          <div className="blog-form-group" style={{ gridColumn: '1/-1' }}>
            <label className="blog-form-label">Writing Tone</label>
            <div className="tone-selector">
              <button className={'tone-btn' + (tone === 'professional' ? ' active' : '')} onClick={() => setTone('professional')}>Professional</button>
              <button className={'tone-btn' + (tone === 'casual' ? ' active' : '')} onClick={() => setTone('casual')}>Casual</button>
              <button className={'tone-btn' + (tone === 'inspirational' ? ' active' : '')} onClick={() => setTone('inspirational')}>Inspirational</button>
              <button className={'tone-btn' + (tone === 'educational' ? ' active' : '')} onClick={() => setTone('educational')}>Educational</button>
            </div>
            <input type="hidden" id="blogTone" value={tone} />
          </div>

        </div>

        <button className={'blog-generate-btn' + (loading ? ' loading' : '')} id="generateBtn" onClick={generateArticle} disabled={loading}>
          {loading ? (
            'âš¡ Generating...'
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '8px' }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              Generate Article
            </>
          )}
        </button>
      </div>

      {/* Output */}
      <div className="glass-card blog-output-card animate-in animate-in-delay-3" id="outputCard" ref={outputCardRef} style={{ display: showOutput ? 'block' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700 }}>Generated Article</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-outline" onClick={copyArticle} title="Copy to clipboard">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
              Copy
            </button>
            <button className="btn btn-sm btn-outline" onClick={clearOutput} title="Clear">Clear</button>
          </div>
        </div>
        <textarea className="blog-output-area" id="blogOutput" placeholder="Your generated article will appear here..." value={output} onChange={(e) => setOutput(e.target.value)}></textarea>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Review and edit the article before publishing. AI-generated content may require human review.</p>
          <button className="blog-publish-btn" title="Backend integration required to publish">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'inline', marginRight: '6px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            Publish to Tunefry Daily
          </button>
        </div>
      </div>

      {/* Article History */}
      <div className="glass-card animate-in animate-in-delay-4" style={{ padding: '20px', marginTop: '16px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>Recent Articles</div>
        <div id="articleHistory">
          {history.map((h, i) => (
            <div className="blog-history-item" key={i}>
              <div className="blog-history-title">{h.title}</div>
              <div className="blog-history-date">{h.date}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Publishing Plans */}
      <div className="animate-in animate-in-delay-4" style={{ marginTop: '16px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, marginBottom: '4px' }}>Article Publishing Plans</div>
        <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Choose the perfect plan to share your music knowledge with our community.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>

          {/* Free */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>Free</div>
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 0</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/article</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>1 free article per month</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Basic visibility</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Tunefry branding</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Standard formatting</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Community rating</li>
            </ul>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Publish Now</button>
          </div>

          {/* Pay Per Article */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderColor: 'rgba(242,101,34,0.35)', background: 'rgba(242,101,34,0.04)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>Pay Per Article</div>
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 49</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/article</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>No monthly limit</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Enhanced visibility</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Author branding</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Advanced formatting</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Priority placement</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Basic analytics</li>
            </ul>
            <button className="btn-create" style={{ width: '100%', justifyContent: 'center', borderRadius: '8px' }}>Publish Now</button>
          </div>

          {/* Unlimited Yearly */}
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '15px', marginBottom: '14px' }}>Unlimited Yearly</div>
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '32px', letterSpacing: '-.03em' }}>₹ 799</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>/article</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '20px' }}>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Unlimited articles</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Top placement</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Verified author badge</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Custom design options</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Newsletter feature</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Advanced analytics</li>
              <li style={{ fontSize: '12.5px', color: 'var(--text-secondary)', paddingLeft: '18px', position: 'relative' }}><span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 700 }}>✓</span>Promotion on social media</li>
            </ul>
            <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Publish Now</button>
          </div>

        </div>
      </div>
    </>
    </ComingSoon>
  )
}
