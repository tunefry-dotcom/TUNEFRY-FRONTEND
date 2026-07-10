import { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import '../../styles/public.css'

function Logo() {
  return (
    <Link to="/home" className="nav-logo">
      <img src="/tunefry-logo.png" alt="Tunefry" style={{ height: '38px', width: 'auto', display: 'block', objectFit: 'contain' }} />
    </Link>
  )
}

function FooterLogo() {
  return (
    <div className="footer-logo">
      <img src="/tunefry-logo.png" alt="Tunefry" style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }} />
    </div>
  )
}

export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // shared scroll reveal for public pages
  useEffect(() => {
    const els = document.querySelectorAll('.pub-page .au')
    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('vis')
            io.unobserve(en.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px 80px 0px' }
    )

    els.forEach((el) => io.observe(el))
    document.querySelectorAll('.pub-page section:first-of-type .au').forEach((el) => el.classList.add('vis'))

    return () => io.disconnect()
  }, [location.pathname])

  const navLinks = [
    { to: '/home', label: 'Home' },
    { to: '/daily-public', label: 'Tunefry Daily' },
    { to: '/services', label: 'Artist Services' },
    { to: '/pricing', label: 'Pricing' },
  ]

  return (
    <div className="pub-page">
      {/* ── NAV ── */}
      <nav className={`pub-nav${scrolled ? ' scrolled' : ''}`}>
        <Logo />
        <div className="nav-ctr">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'act' : ''}>
              {label}
            </NavLink>
          ))}
          <NavLink to="/refer-earn-public" className={({ isActive }) => `nav-refer${isActive ? ' act' : ''}`}>
            Refer &amp; Earn
          </NavLink>
        </div>
        <div className="nav-rt">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/signup" className="btn-or">Start Distributing</Link>
        </div>
        <button
          className={`nav-ham${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`pub-mob-menu${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ to, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'act' : ''}>
            {label}
          </NavLink>
        ))}
        <NavLink to="/refer-earn-public" style={{ color: 'var(--or)' }}>
          Refer &amp; Earn
        </NavLink>
        <div className="mob-btns">
          <Link to="/login" className="btn-ghost">Log in</Link>
          <Link to="/signup" className="btn-or">Start Distributing</Link>
        </div>
      </div>

      {/* ── PAGE CONTENT ── */}
      <Outlet />

      {/* ── FOOTER ── */}
      <footer className="pub-footer">
        <div className="pub-footer-inner">
          <div className="footer-brand">
            <FooterLogo />
            <p>Empowering independent artists to distribute, promote, and monetize their music globally. Your sound, your terms.</p>
            <div className="footer-socials">
              {[
                { label: 'Instagram', path: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z M17.5 6.5 17.51 6.5 M2 2h20v20H2z', rx: 5 },
              ].map(() => null)}
              <a href="#" className="social-btn" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="Twitter / X">
                <svg viewBox="0 0 24 24"><path d="M4 4l11.73 16h4.27L8.27 4z"/><path d="M4 20l6.77-6.77"/><path d="M20 4l-6.77 6.77"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2A29 29 0 0023 11.75a29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="#" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link to="/home">Home</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/services">Artist Services</Link>
            <Link to="/daily-public">Tunefry Daily</Link>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <Link to="/distribution">Distribution</Link>
            <Link to="/playlist-pitching">Playlist Pitching</Link>
            <Link to="/content-id">Content ID</Link>
            <Link to="/callertune">Caller Tune</Link>
            <Link to="/song-transfer">Song Transfer &amp; Portability</Link>
          </div>
          <div className="footer-col">
            <h4>Support &amp; Legal</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Tunefry Artist Services Pvt. Ltd. All rights reserved.</span>
          <a href="mailto:support@tunefry.com">support@tunefry.com</a>
        </div>
      </footer>
    </div>
  )
}
