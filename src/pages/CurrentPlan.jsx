import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/current-plan.css';

export default function CurrentPlan() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastTimer = useRef(null);

  function showToast(type, msg) {
    setToast({ show: true, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast((t) => ({ ...t, show: false }));
    }, 3500);
  }

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  return (
    <>
      <div className="page-label">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        Account
      </div>
      <div className="page-header">
        <h1 className="page-title">Current Plan</h1>
        <div className="page-header-actions">
          <Link to="/" className="btn btn-outline" style={{ textDecoration: 'none' }}>← Overview</Link>
        </div>
      </div>

      {/* Plan Hero Card */}
      <div className="glass-card plan-hero-card">
        <div className="plan-hero-top">
          <div className="plan-name-wrap">
            <div className="plan-icon">
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>
            <div>
              <div className="plan-name">Single Artist</div>
              <div className="plan-badge">
                <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                Gold Plan
              </div>
            </div>
          </div>
          <div className="plan-right">
            <div className="plan-price-wrap">
              <div className="plan-price-original">₹1,599</div>
              <div className="plan-price">₹1,439 <span>/ year</span></div>
            </div>
            <div className="status-pill">
              <div className="status-pill-dot"></div>
              Active
            </div>
          </div>
        </div>

        <div className="plan-meta-row">
          <div className="plan-meta-item">
            <div className="plan-meta-label">Renewal Date</div>
            <div className="plan-meta-value">October 15, 2026</div>
          </div>
          <div className="plan-meta-item">
            <div className="plan-meta-label">Days Remaining</div>
            <div className="plan-meta-value orange">185 days</div>
          </div>
          <div className="countdown-wrap">
            <div className="countdown-label">
              Plan Validity
              <span>50% remaining</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '50%' }}></div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="features-grid">
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Unlimited Releases</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>100% Royalties</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Playlist &amp; Radio Pitching</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Instagram Linking</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>YouTube OAC</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Content ID</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Spotify Verification</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>Mail / Call / WhatsApp Support</div>
          <div className="feature-item"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>24hr Approval</div>
        </div>

        <div className="plan-actions-row">
          <button className="btn-renew" onClick={() => showToast('success', "Renewal initiated! You'll be redirected to payment.")}>
            <svg viewBox="0 0 24 24"><path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
            Renew Plan
          </button>
          <button className="btn-upgrade" onClick={() => navigate('/pricing')}>
            <svg viewBox="0 0 24 24"><polyline points="17 11 12 6 7 11" /><line x1="12" y1="6" x2="12" y2="18" /></svg>
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-card compare-card">
        <div className="compare-title">Plan Comparison</div>
        <div className="compare-sub">See how your current plan compares to the next tier</div>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              <th className="current-col">
                <div className="plan-col-header">
                  <span className="plan-col-name">Single Artist</span>
                  <span className="plan-col-badge">Current</span>
                </div>
              </th>
              <th>
                <div className="plan-col-header">
                  <span className="plan-col-name">Double Artist</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(59,130,246,0.12)', border: '0.5px solid rgba(59,130,246,0.25)', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, color: '#3B82F6', display: 'inline-block', marginTop: '2px' }}>Upgrade</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Artist Profiles</td>
              <td className="current-col-data">1 Artist</td>
              <td className="next-col-data">2 Artists</td>
            </tr>
            <tr>
              <td>Annual Price</td>
              <td className="current-col-data">₹1,439/yr</td>
              <td className="next-col-data">₹2,499/yr</td>
            </tr>
            <tr>
              <td>Unlimited Releases</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>100% Royalties</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>Content ID</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>Priority Support</td>
              <td className="check-no">—</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>Dedicated Account Manager</td>
              <td className="check-no">—</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>Advanced Analytics</td>
              <td className="check-partial">Basic</td>
              <td className="check-yes"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg></td>
            </tr>
            <tr>
              <td>Faster Approvals</td>
              <td className="check-partial">24hrs</td>
              <td className="next-col-data">12hrs</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Billing Card */}
      <div className="glass-card billing-card">
        <div className="billing-title">Billing &amp; Invoices</div>
        <div className="billing-sub">Payment history and upcoming charges</div>

        <div className="billing-row">
          <span className="billing-label">Last Payment</span>
          <span className="billing-value">₹1,439 — October 15, 2025</span>
        </div>
        <div className="billing-row">
          <span className="billing-label">Next Payment</span>
          <span className="billing-value">₹1,439 — October 15, 2026</span>
        </div>
        <div className="billing-row">
          <span className="billing-label">Payment Status</span>
          <span className="billing-value green">Paid in Full</span>
        </div>
        <div className="billing-row">
          <span className="billing-label">Payment Method</span>
          <span className="billing-value">UPI</span>
        </div>

        <div className="billing-bottom">
          <div className="payment-method">
            <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: '#8A8A8A', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
            Paid via <span className="pm-badge" style={{ marginLeft: '4px' }}>UPI</span>
          </div>
          <button className="btn-invoice" onClick={() => showToast('success', 'Invoice downloaded successfully!')}>
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
            Download Invoice
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`toast toast-success${toast.show ? ' show' : ''}`} id="toast">
        <svg id="toastIcon" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>
        <span id="toastMsg">{toast.msg}</span>
      </div>
    </>
  );
}
