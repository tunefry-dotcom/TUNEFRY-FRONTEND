import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Contact() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function submitForm() {
    setSubmitted(true)
  }

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="au vis">
          <h1>Contact <em>Us</em></h1>
          <p>Feel free to contact us any time. We&apos;ll get back to you as soon as we can!</p>
        </div>
      </section>

      <div className="contact-layout">
        {/* FORM */}
        <div className="contact-form-wrap au">
          <h2>Send Us a Message</h2>
          <p className="sub">We typically respond within 24 hours on business days.</p>
          {!submitted && (
            <div id="contactForm">
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input type="text" placeholder="Arjun" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                <div className="form-group"><label>Last Name</label><input type="text" placeholder="Sharma" value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Email Address</label><input type="email" placeholder="arjun@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <div className="form-group">
                <label>Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="" disabled>Select a topic</option>
                  <option>Distribution &amp; Releases</option>
                  <option>Royalties &amp; Payments</option>
                  <option>Content ID &amp; Copyright</option>
                  <option>Account &amp; Billing</option>
                  <option>Song Transfer</option>
                  <option>Playlist Pitching</option>
                  <option>Technical Issue</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group"><label>Message</label><textarea placeholder="Describe your issue or question in detail..." value={message} onChange={(e) => setMessage(e.target.value)} /></div>
              <button className="btn-submit" onClick={submitForm}>Send Message</button>
              <p className="form-note">By submitting, you agree to our <Link to="/privacy" style={{ color: 'var(--or)' }}>Privacy Policy</Link>.</p>
            </div>
          )}
          {submitted && (
            <div className="form-success" id="formSuccess" style={{ display: 'block' }}>
              <div className="check"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. Our team will get back to you within 24 hours at the email address you provided.</p>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="contact-sidebar au au-d1">
          <div className="contact-card">
            <h3>Contact Details</h3>
            <div className="contact-item">
              <div className="ci-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
              <div className="ci-text"><div className="label">Email</div><div className="val"><a href="mailto:support@tunefry.com">support@tunefry.com</a></div></div>
            </div>
            <div className="contact-item">
              <div className="ci-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.7A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg></div>
              <div className="ci-text"><div className="label">Phone</div><div className="val"><a href="tel:+917428028995">+91 7428028995</a></div></div>
            </div>
            <div className="contact-item">
              <div className="ci-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg></div>
              <div className="ci-text"><div className="label">Address</div><div className="val">j57, Paryavaran complex,<br />saket, delhi, 110030</div></div>
            </div>
          </div>

          <div className="contact-card">
            <h3>Support Hours</h3>
            <div className="hours-list">
              <div className="hour-row"><span className="day">Monday &ndash; Friday</span><span className="time">9 AM &ndash; 7 PM IST</span></div>
              <div className="hour-row"><span className="day">Saturday</span><span className="time">10 AM &ndash; 4 PM IST</span></div>
              <div className="hour-row"><span className="day">Sunday</span><span className="time">Closed</span></div>
            </div>
          </div>

          <div className="contact-card">
            <h3>Quick Links</h3>
            <Link to="/help" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--t2)', padding: '8px 0', borderBottom: '.5px solid var(--bd)', transition: 'color .2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--or)' }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--t2)' }}>
              <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 1.8, fill: 'none', flexShrink: 0 }}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              Help Center
            </Link>
            <Link to="/terms" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--t2)', padding: '8px 0', borderBottom: '.5px solid var(--bd)', transition: 'color .2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--or)' }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--t2)' }}>
              <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 1.8, fill: 'none', flexShrink: 0 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              Terms of Service
            </Link>
            <Link to="/refund" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', color: 'var(--t2)', padding: '8px 0', transition: 'color .2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--or)' }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--t2)' }}>
              <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 1.8, fill: 'none', flexShrink: 0 }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
              Refund Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="faq-section">
        <div className="faq-inner">
          <h2 className="faq-title au">Frequently Asked Questions</h2>
          <div className="faq-item au">
            <h3>What is TuneFry?</h3>
            <p>TuneFry is a music promotion marketplace that helps artists get real visibility with playlisting, content promotion, and expert guidance.</p>
          </div>
          <div className="faq-item au au-d1">
            <h3>How does TuneFry promote music?</h3>
            <p>We use curated playlists, social media influencer collaborations, and targeted strategies based on your music genre and goals.</p>
          </div>
          <div className="faq-item au au-d2">
            <h3>How can I join Tunefry?</h3>
            <p>Joining Tunefry is simple &mdash; you just need to create an account, complete your artist profile, and upload your music content to start sharing it with the world.</p>
          </div>
          <div className="faq-item au au-d3">
            <h3>Is there a fee to use Tunefry?</h3>
            <p>Tunefry offers both free and premium plans; the premium plan unlocks extra distribution, analytics, and marketing support for professional growth.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
