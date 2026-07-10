import { Link } from 'react-router-dom'

export default function Terms() {
  return (
    <>
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="breadcrumb"><Link to="/home">Home</Link> &nbsp;/&nbsp; Terms of Service</div>
          <h1>Terms of Service</h1>
          <div className="meta">
            <span>Last updated: May 2026 &nbsp;&middot;&nbsp; Tunefry Artist Services Pvt. Ltd.</span>
            <button onClick={() => window.history.back()} style={{display:'inline-flex',alignItems:'center',gap:'7px',padding:'8px 18px',background:'transparent',border:'0.5px solid rgba(255,255,255,0.15)',borderRadius:'8px',color:'rgba(255,255,255,0.55)',fontSize:'13px',cursor:'pointer',fontFamily:'var(--font-b)'}}>&#8592; Go Back</button>
          </div>
        </div>
      </div>

      <div className="legal-body">

        <h2>1. Working Hours &amp; Business Days</h2>
        <p>Tunefry Artist Services Pvt. Ltd. operates from <strong>11:00 AM to 5:00 PM (IST)</strong>. Working days are <strong>Monday to Friday only</strong>. Saturdays, Sundays, and Government Holidays are non-working days and are not counted in any approval, release, support, or processing timelines.</p>

        <hr className="legal-divider" />

        <h2>2. Release Submission &amp; Processing Timeline</h2>
        <p>To ensure smooth processing and avoid delays, artists are strongly advised to submit releases <strong>at least 7–10 days before the intended live date</strong>.</p>
        <ul>
          <li>Any timeline mentioned in your plan (such as 24 working hours approval or Live within 48 working hours) is intended for <strong>urgent release requests only</strong> and <strong>cannot be guaranteed for every release</strong>.</li>
          <li>Artists requiring an urgent release must <strong>inform the Tunefry team via email or chat support</strong> at the time of submission.</li>
          <li>Urgent release timelines are only applicable if the release is submitted <strong>before 12:00 PM (IST)</strong> on a working day.</li>
          <li>If any issue, metadata error, copyright concern, artwork issue, audio issue, or DSP rejection occurs, the release may be delayed by <strong>up to 72 working hours or more</strong>, depending on the issue.</li>
          <li>Tunefry will make reasonable efforts to process urgent releases, but <strong>final approval depends on DSPs</strong> (Spotify, Apple Music, YouTube Music, etc.).</li>
        </ul>

        <hr className="legal-divider" />

        <h2>3. Playlist Pitching Policy</h2>
        <p>For editorial playlist pitching and radio pitching consideration:</p>
        <ul>
          <li>Songs must be submitted <strong>20–25 days before the scheduled release date</strong>.</li>
          <li>Artists must specifically <strong>inform the Tunefry team</strong> that they wish to pitch the song for playlists.</li>
          <li>Playlist placement is <strong>not guaranteed</strong>, as acceptance depends entirely on DSP/editorial teams.</li>
        </ul>

        <hr className="legal-divider" />

        <h2>4. Catalogue Transfer &amp; Migration Policy</h2>
        <p>Catalogue transfer or migration requests may take <strong>up to 10 working days</strong> for proper processing. Artists must provide accurate metadata, including: song title, artist names, ISRC codes, UPC/EAN, release dates, and existing DSP links.</p>
        <p>Tunefry will <strong>not be responsible for any stream loss, profile mismatch, or metadata issues</strong> if incorrect or incomplete information is provided by the artist. Wrong metadata may result in <strong>loss of previous streams, playlist placements, or merging issues</strong> on DSPs.</p>

        <hr className="legal-divider" />

        <h2>5. Content ID Eligibility Policy</h2>
        <p>Content ID is available only for eligible content. Content ID <strong>cannot be approved</strong> if:</p>
        <ul>
          <li>The beat/music is downloaded from YouTube.</li>
          <li>The instrumental is marked as "Free Beat", "Free for Profit Beat", or similar.</li>
          <li>The music is derived from non-exclusive publicly available sources.</li>
        </ul>
        <p>To claim Content ID, artists must provide a <strong>valid commercial beat license</strong> or proper ownership documentation proving exclusive rights. Tunefry reserves the right to reject Content ID requests if ownership cannot be verified.</p>

        <hr className="legal-divider" />

        <h2>6. Main Artist &amp; Collaboration Policy</h2>
        <p><strong>Single Artist, Starter, Single Song &amp; Free Plans:</strong> Only one primary/main artist is allowed. Additional artists may only be added as Featured Artists (Feat.). Adding a second primary artist is not permitted under these plans.</p>
        <p><strong>Double Artist Plan &amp; Label Plan:</strong> Artists may add multiple main/primary artists. Collaboration releases with multiple primary artists are supported.</p>

        <hr className="legal-divider" />

        <h2>7. Album / EP / Mixtape Processing Policy</h2>
        <p>Albums, EPs, and mixtapes require additional processing and platform review time. Artists should submit albums, EPs, or mixtapes <strong>15–20 days before the live date</strong>. Album projects generally require a <strong>minimum of 10 working days</strong> for processing and delivery.</p>
        <p>If all metadata, artwork, and audio files are correct, the release will be processed for the intended date. In case of errors, metadata issues, copyright concerns, DSP review, or technical issues, the release may be delayed by <strong>up to 72 working hours or more</strong>. Non-working days and holidays are excluded from timeline calculations.</p>

        <hr className="legal-divider" />

        <h2>8. Approval &amp; Delivery Timeline Disclaimer</h2>
        <p>All approval and delivery timelines mentioned in subscription plans are <strong>estimated timelines only</strong>. Tunefry does <strong>not guarantee fixed approval or live dates</strong>, as music platforms may review content manually, reject metadata, delay releases, or request additional verification.</p>
        <p>Final publishing timelines always depend on: correct submission, DSP review process, copyright checks, metadata accuracy, and technical approval.</p>

        <hr className="legal-divider" />

        <h2>9. Artist Responsibility</h2>
        <p>The artist is solely responsible for copyright ownership, sample clearance, beat licenses, metadata accuracy, and trademark or legal disputes. Any false claims or copyright violations may result in release takedown, revenue withholding, Content ID removal, or account suspension or termination.</p>

        <hr className="legal-divider" />

        <h2>10. Support Response Timeline</h2>
        <p>Support timelines vary depending on the subscribed plan. Premium plans receive faster priority support. Free and lower-tier plans may experience longer response times. Support is available only during <strong>working hours and business days</strong>.</p>

        <hr className="legal-divider" />

        <h2>11. Privacy Policy</h2>
        <p>Tunefry Music Distributor is committed to securing the personal data of each client (artists). Every customer of Tunefry is protected under applicable laws, ordinances, and corporate social responsibility frameworks.</p>
        <p>Information collected through this platform is kept safe and secured. Tunefry affirms that the rights and dignity of all customers are protected under the laws of the constitution. For full details, please refer to our <Link to="/privacy">Privacy Policy</Link>.</p>

        <hr className="legal-divider" />

        <h2>12. Copyright &amp; Content Disclaimer</h2>
        <p>The artist who publishes content via Tunefry Music Distributor is solely responsible and liable for that content. Information, opinions, and views expressed in any content distributed through Tunefry shall not be construed as opinions or views of the platform.</p>
        <p>If any copyright dispute or infringement claim arises, Tunefry shall not be liable for any error or negligence related to content published by artists. The artist bears full legal and financial responsibility for ensuring their content does not violate any third-party rights.</p>

        <hr className="legal-divider" />

        <h2>13. No-Refund Policy</h2>
        <p>Once a plan is purchased by the customer, no changes can be made to that purchase afterward. Tunefry operates a strict <strong>no-refund policy</strong> — customers will not be entitled to any compensation or refund after purchasing any service or plan, regardless of the reason.</p>
        <p>Artists are advised to review all plan details carefully before completing any purchase. For further details, refer to our <Link to="/refund">Refund Policy</Link>.</p>

        <hr className="legal-divider" />

        <h2>14. Royalty Distribution</h2>
        <p>Tunefry provides artists with access to records and analytics for all songs published through the platform. Royalties earned from streaming and sales will be distributed to artists at regular intervals, without any undue delay or legal dispute.</p>
        <p>The exact payout schedule and minimum thresholds are communicated within the artist dashboard. Tunefry does not withhold royalties except in cases of suspected fraud, copyright violations, or pending disputes as outlined in the Anti-Fraud Policy.</p>

        <hr className="legal-divider" />

        <h2>15. Membership Policy</h2>
        <p>Tunefry is committed to protecting the financial interests of artists on the platform. Artists are <strong>not required to maintain an active or ongoing membership</strong> for their songs to continue streaming on partner platforms.</p>
        <p>Once a song is successfully published via Tunefry, it remains available for <strong>lifetime on all applicable platforms</strong>, subject to the terms of the respective DSPs and provided no copyright or anti-fraud violation occurs.</p>

        <hr className="legal-divider" />

        <h2>16. Anti-Fraud Policy</h2>
        <p>In cases of copyright infringement, fraudulent claims, or misuse of the platform, Tunefry reserves the right to take down artist content without prior notice. Tunefry will not be responsible for any legal actions, claims, penalties, or consequences resulting from copyright violations committed by the artist.</p>
        <p>Artists found to be engaging in fraudulent activity, fake streaming, or platform manipulation may face immediate account suspension or permanent termination, along with withholding of any unpaid royalties pending investigation.</p>

        <hr className="legal-divider" />

        <h2>17. Early Takedown Policy</h2>
        <p>By submitting your song for distribution, you agree to the following takedown fee structure:</p>
        <ul>
          <li>Takedown requests made <strong>before 2 years from the release date</strong> will be charged as follows:
            <ul style={{marginTop:'8px',marginLeft:'16px'}}>
              <li><strong>&#8377;9</strong> per individual song</li>
              <li><strong>&#8377;49</strong> per album</li>
              <li><strong>&#8377;299</strong> for a full catalogue takedown</li>
            </ul>
          </li>
          <li>These charges apply to <strong>both Free and Premium plan</strong> holders.</li>
          <li>Takedown requests made <strong>after 2 years from the release date</strong> are free of charge.</li>
        </ul>
        <p>Takedown fees are non-negotiable and must be paid before the takedown process is initiated. Processing timelines for takedowns follow the same working hours and business day rules as other requests.</p>

      </div>
    </>
  )
}
