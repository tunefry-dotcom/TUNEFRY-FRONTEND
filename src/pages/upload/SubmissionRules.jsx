import '../../styles/submission-rules.css';

export default function SubmissionRules() {
  return (
    <>
      <div className="page-label animate-in">
        <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
        Policies
      </div>

      <div className="page-header animate-in animate-in-delay-1">
        <div>
          <h1 className="page-title">Submission Rules &amp; Terms</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Read these carefully before submitting any release. Effective May 2026.</p>
        </div>
        <div className="page-header-actions">
          <button onClick={() => window.close()} className="btn btn-outline">&#8592; Close</button>
        </div>
      </div>

      {/* Key Stats Strip */}
      <div className="summary-grid animate-in animate-in-delay-2">
        <div className="summary-item">
          <div className="summary-item-label">Business Hours</div>
          <div className="summary-item-val">11 AM – 5 PM IST</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Working Days</div>
          <div className="summary-item-val">Mon – Fri Only</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Recommended Lead Time</div>
          <div className="summary-item-val">7–10 Working Days</div>
        </div>
        <div className="summary-item">
          <div className="summary-item-label">Playlist Pitch Deadline</div>
          <div className="summary-item-val">20–25 Days Prior</div>
        </div>
      </div>

      {/* Rule 1 */}
      <div className="glass-card rule-card animate-in animate-in-delay-2">
        <div className="rule-num">01</div>
        <div className="rule-title">Working Hours &amp; Business Days</div>
        <ul className="rule-list">
          <li>Tunefry Artist Services Pvt. Ltd. operates from <strong>11:00 AM to 5:00 PM (IST)</strong>.</li>
          <li>Working days are <strong>Monday to Friday only</strong>.</li>
          <li><strong>Saturdays, Sundays, and Government Holidays are non-working days</strong> and are not counted in any approval, release, support, or processing timelines.</li>
        </ul>
      </div>

      {/* Rule 2 */}
      <div className="glass-card rule-card animate-in animate-in-delay-2">
        <div className="rule-num">02</div>
        <div className="rule-title">Release Submission &amp; Processing Timeline</div>
        <p className="rule-body">To ensure smooth processing and avoid delays, artists are strongly advised to submit releases <strong>at least 7–10 days before the intended live date</strong>.</p>
        <div className="rule-sub">Important Guidelines</div>
        <ul className="rule-list">
          <li>Any timeline mentioned in your plan (such as 24 working hours approval or Live within 48 working hours) is intended for <strong>urgent release requests only</strong> and <strong>cannot be guaranteed for every release</strong>.</li>
          <li>Artists requiring an urgent release must <strong>inform the Tunefry team via email or chat support</strong> at the time of submission.</li>
          <li>Urgent release timelines are only applicable if the release is submitted <strong>before 12:00 PM (IST)</strong> on a working day.</li>
          <li>If any issue, metadata error, copyright concern, artwork issue, audio issue, or DSP rejection occurs, the release may be delayed by <strong>up to 72 working hours or more</strong>, depending on the issue.</li>
          <li>Tunefry will make reasonable efforts to process urgent releases, but <strong>final approval depends on DSPs (Spotify, Apple Music, YouTube Music, etc.)</strong>.</li>
        </ul>
      </div>

      {/* Rule 3 */}
      <div className="glass-card rule-card animate-in animate-in-delay-2">
        <div className="rule-num">03</div>
        <div className="rule-title">Playlist Pitching Policy</div>
        <p className="rule-body">For editorial playlist pitching and radio pitching consideration:</p>
        <ul className="rule-list">
          <li>Songs must be submitted <strong>20–25 days before the scheduled release date</strong>.</li>
          <li>Artists must specifically <strong>inform the Tunefry team</strong> that they wish to pitch the song for playlists.</li>
          <li>Playlist placement is <strong>not guaranteed</strong>, as acceptance depends entirely on DSP/editorial teams.</li>
        </ul>
      </div>

      {/* Rule 4 */}
      <div className="glass-card rule-card animate-in animate-in-delay-2">
        <div className="rule-num">04</div>
        <div className="rule-title">Catalogue Transfer &amp; Migration Policy</div>
        <ul className="rule-list">
          <li>Catalogue transfer or migration requests may take <strong>up to 10 working days</strong> for proper processing.</li>
          <li>Artists must provide <strong>accurate metadata</strong>, including: Song title, Artist names, ISRC codes, UPC/EAN, Release dates, and Existing DSP links.</li>
        </ul>
        <div className="rule-sub">Disclaimer</div>
        <ul className="rule-list">
          <li>Tunefry will <strong>not be responsible for any stream loss, profile mismatch, or metadata issues</strong> if incorrect or incomplete information is provided by the artist.</li>
          <li>Wrong metadata may result in <strong>loss of previous streams, playlist placements, or merging issues</strong> on DSPs.</li>
        </ul>
        <div className="rule-warn">
          <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <p>Always double-check your ISRC and UPC codes before submitting a transfer request. Errors here can permanently affect your streaming history.</p>
        </div>
      </div>

      {/* Rule 5 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">05</div>
        <div className="rule-title">Content ID Eligibility Policy</div>
        <p className="rule-body">Content ID is available only for eligible content.</p>
        <div className="rule-sub">Content ID Cannot Be Approved If</div>
        <ul className="rule-list">
          <li>The beat/music is downloaded from <strong>YouTube</strong>.</li>
          <li>The instrumental is marked as <strong>"Free Beat"</strong>, <strong>"Free for Profit Beat"</strong>, or similar.</li>
          <li>The music is derived from non-exclusive publicly available sources.</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Required Documentation</div>
        <p className="rule-body">To claim Content ID, artists must provide:</p>
        <ul className="rule-list">
          <li>A <strong>valid commercial beat license</strong>, or</li>
          <li>Proper ownership documentation proving exclusive rights.</li>
        </ul>
        <div className="rule-info">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p>Tunefry reserves the right to reject Content ID requests if ownership cannot be verified.</p>
        </div>
      </div>

      {/* Rule 6 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">06</div>
        <div className="rule-title">Main Artist &amp; Collaboration Policy</div>
        <div className="rule-sub">Single Artist, Starter, Single Song &amp; Free Plans <span className="plan-badge blue" style={{ marginLeft: '6px' }}>Basic</span></div>
        <ul className="rule-list">
          <li>Only <strong>one primary/main artist</strong> is allowed.</li>
          <li>Additional artists may only be added as <strong>Featured Artists (Feat.)</strong>.</li>
          <li>Adding a <strong>second primary artist is not permitted</strong> under these plans.</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Double Artist Plan &amp; Label Plan <span className="plan-badge green" style={{ marginLeft: '6px' }}>Pro</span></div>
        <ul className="rule-list">
          <li>Artists may add <strong>multiple main/primary artists</strong>.</li>
          <li>Collaboration releases with multiple primary artists are supported.</li>
        </ul>
      </div>

      {/* Rule 7 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">07</div>
        <div className="rule-title">Album / EP / Mixtape Processing Policy</div>
        <p className="rule-body">Albums, EPs, and mixtapes require additional processing and platform review time.</p>
        <div className="rule-sub">Submission Guidelines</div>
        <ul className="rule-list">
          <li>Artists should submit albums, EPs, or mixtapes <strong>15–20 days before the live date</strong>.</li>
          <li>Album projects generally require a <strong>minimum of 10 working days</strong> for processing and delivery.</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Delay Policy</div>
        <ul className="rule-list">
          <li>If all metadata, artwork, and audio files are correct, the release will be processed for the intended date.</li>
          <li>In case of errors, metadata issues, copyright concerns, DSP review, or technical issues, the release may be delayed by <strong>up to 72 working hours or more</strong>.</li>
          <li><strong>Non-working days and holidays are excluded from timeline calculations</strong>.</li>
        </ul>
      </div>

      {/* Rule 8 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">08</div>
        <div className="rule-title">Approval &amp; Delivery Timeline Disclaimer</div>
        <p className="rule-body">All approval and delivery timelines mentioned in subscription plans are <strong>estimated timelines only</strong>.</p>
        <p className="rule-body">Tunefry does <strong>not guarantee fixed approval or live dates</strong>, as music platforms may: review content manually, reject metadata, delay releases, or request additional verification.</p>
        <div className="rule-sub">Final Publishing Timelines Depend On</div>
        <ul className="rule-list">
          <li>Correct submission</li>
          <li>DSP review process</li>
          <li>Copyright checks</li>
          <li>Metadata accuracy</li>
          <li>Technical approval</li>
        </ul>
      </div>

      {/* Rule 9 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">09</div>
        <div className="rule-title">Artist Responsibility</div>
        <div className="rule-sub">The Artist Is Solely Responsible For</div>
        <ul className="rule-list">
          <li>Copyright ownership</li>
          <li>Sample clearance</li>
          <li>Beat licenses</li>
          <li>Metadata accuracy</li>
          <li>Trademark or legal disputes</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Violations May Result In</div>
        <ul className="rule-list">
          <li>Release takedown</li>
          <li>Revenue withholding</li>
          <li>Content ID removal</li>
          <li>Account suspension or termination</li>
        </ul>
        <div className="rule-warn">
          <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <p><strong>Any false claims or copyright violations</strong> may result in permanent account termination with no refund. Ensure you hold full rights to all content before submitting.</p>
        </div>
      </div>

      {/* Rule 10 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">10</div>
        <div className="rule-title">Support Response Timeline</div>
        <ul className="rule-list">
          <li>Premium plans receive <strong>faster priority support</strong>.</li>
          <li>Free and lower-tier plans may experience <strong>longer response times</strong>.</li>
          <li>Support is available only during <strong>working hours and business days</strong>.</li>
          <li>Response times are not guaranteed and depend on ticket volume at the time of request.</li>
        </ul>
        <div className="rule-info" style={{ marginTop: '16px' }}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <p>For the fastest support, always include your <strong>artist name, release title, and submission date</strong> in your support message.</p>
        </div>
      </div>

      {/* Rule 11 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3">
        <div className="rule-num">11</div>
        <div className="rule-title">Artwork Specifications</div>
        <div className="rule-sub">Resolution</div>
        <ul className="rule-list">
          <li>Artwork must be in <strong>3000px × 3000px square format</strong>.</li>
          <li>Low-quality, stretched, blurry, or pixelated artwork <strong>may be rejected</strong> during the review process.</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Content &amp; Consistency</div>
        <ul className="rule-list">
          <li>The <strong>song title and artist/singer name</strong> should be clearly mentioned on the artwork.</li>
          <li>The song title on the artwork must <strong>exactly match</strong> the title entered in the upload form.</li>
          <li>Artist names, spellings, and formatting must remain <strong>consistent across metadata and artwork</strong>.</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Prohibited Elements</div>
        <ul className="rule-list">
          <li>Phone numbers</li>
          <li>Barcodes</li>
          <li>QR codes</li>
          <li>Addresses or contact details</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Brand Names &amp; Logos Not Allowed</div>
        <p className="rule-body">Artwork must not contain any brand name, trademark, or logo, including but not limited to:</p>
        <ul className="rule-list">
          <li>YouTube, Facebook, Instagram, Spotify</li>
          <li>Adidas, Nike</li>
          <li>Any other third-party brand or company logo</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Video-Related Logos Not Allowed</div>
        <ul className="rule-list">
          <li>HD Video, High Quality Video</li>
          <li>HD 1080p, Full HD, 4K</li>
          <li>Any video-style promotional graphics</li>
        </ul>
        <div className="rule-divider"></div>
        <div className="rule-sub">Artwork Template Policy</div>
        <ul className="rule-list">
          <li>Artwork for multiple songs <strong>should not follow the same template repeatedly</strong>.</li>
          <li>Excessively repetitive or duplicate-looking artwork may be <strong>flagged or rejected by DSPs</strong> due to content quality guidelines.</li>
        </ul>
      </div>

      {/* Rule 12 */}
      <div className="glass-card rule-card animate-in animate-in-delay-3" style={{ marginBottom: '0' }}>
        <div className="rule-num">12</div>
        <div className="rule-title">Track Content Rules</div>
        <div className="rule-sub">Intro / Outro Policy</div>
        <p className="rule-body">Any kind of intro or outro is <strong>not allowed</strong>, including:</p>
        <ul className="rule-list">
          <li>Logo stings</li>
          <li>Production intros</li>
          <li>Promotional intros/outros</li>
          <li>Company branding audio</li>
        </ul>
        <p className="rule-body" style={{ marginTop: '12px' }}>Tracks should begin and end cleanly without any unnecessary branding elements.</p>
        <div className="rule-divider"></div>
        <div className="rule-sub">Prohibited Genres &amp; Content</div>
        <p className="rule-body">The following types of content are <strong>not accepted</strong> for distribution:</p>
        <ul className="rule-list">
          <li>Political content</li>
          <li>Advertisements or promotional tracks</li>
          <li>Prank tracks</li>
          <li>National anthems</li>
          <li>Current affairs content</li>
          <li>IVR tunes / caller recordings</li>
        </ul>
        <div className="rule-warn" style={{ marginTop: '16px' }}>
          <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          <p>Tunefry reserves the right to <strong>reject any content</strong> that violates DSP policies or is considered unsuitable for digital music distribution.</p>
        </div>
      </div>

      <div style={{ marginTop: '24px', padding: '20px 24px', borderRadius: '14px', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7' }}>These rules are subject to change. Tunefry reserves the right to update policies at any time. Continued use of the platform constitutes acceptance of the latest terms.</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Tunefry Artist Services Pvt. Ltd. &nbsp;·&nbsp; Last updated: May 2026</p>
      </div>
    </>
  );
}
