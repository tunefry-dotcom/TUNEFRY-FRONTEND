import { Link } from 'react-router-dom'

export default function Refund() {
  return (
    <>
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="breadcrumb"><Link to="/home">Home</Link> &nbsp;/&nbsp; Refund Policy</div>
          <h1>Refund Policy</h1>
          <div className="meta">Last updated: May 2026 &nbsp;&middot;&nbsp; Tunefry Artist Services Pvt. Ltd.</div>
        </div>
      </div>

      <div className="legal-body">

        <div className="notice-box">
          <p><strong>Summary:</strong> We do not offer refunds for any subscription or payments made on our platform. Services are rendered as soon as payment is received. For questions, contact <a href="mailto:support@tunefry.com">support@tunefry.com</a>.</p>
        </div>

        <h2>1. No-Refund Policy</h2>
        <p>We do not offer refunds for any subscription or payments made on our platform. Services are rendered as soon as payment is received and cannot be reversed. Once a plan is purchased, no changes can be made afterward.</p>

        <hr className="legal-divider" />

        <h2>2. Why We Don&apos;t Offer Refunds</h2>
        <p>We maintain a strict no-refund policy for the following reasons:</p>
        <ul>
          <li><strong>Immediate Access to Services:</strong> The moment your subscription is activated, you gain full access to our distribution platform and your music is queued for delivery. The service begins immediately and cannot be reversed.</li>
          <li><strong>Cost of Services:</strong> Your subscription fee covers real costs — DSP delivery infrastructure, royalty reporting systems, content ID registration, and support — that are incurred the moment your account is active.</li>
          <li><strong>Clarity and Fairness:</strong> Our pricing is clearly displayed before purchase. We believe in full transparency so artists can make informed decisions before subscribing.</li>
          <li><strong>Subscription Management:</strong> You can cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of your current billing cycle and you retain full access until then.</li>
          <li><strong>Plan Changes:</strong> If you wish to upgrade or change your plan, you may do so at any time. Unused time from your current plan is not refunded, but you will immediately benefit from the new plan&apos;s features.</li>
        </ul>

        <hr className="legal-divider" />

        <h2>3. Cancellation</h2>
        <p>You may cancel your subscription at any time from your account dashboard. Cancellation takes effect at the end of your current billing cycle — you will retain full access to all features until that date.</p>
        <p>Cancelling your subscription does not remove your music from streaming platforms. Your releases remain live after cancellation. See our <Link to="/terms">Terms of Service</Link> for details on takedown fees if you wish to remove your music.</p>

        <hr className="legal-divider" />

        <h2>4. Exceptions</h2>
        <p>Refunds will only be considered in the following exceptional circumstances:</p>
        <ul>
          <li>A duplicate charge was processed for the same billing period due to a technical error on our side.</li>
          <li>A charge was processed after a cancellation that was confirmed by Tunefry support in writing.</li>
        </ul>
        <p>To report an exceptional billing issue, contact us within 7 days of the charge at <a href="mailto:support@tunefry.com">support@tunefry.com</a> with your transaction reference.</p>

        <hr className="legal-divider" />

        <h2>5. Contact Us</h2>
        <p>For any billing queries, contact our support team:</p>
        <ul>
          <li>Email: <a href="mailto:support@tunefry.com">support@tunefry.com</a></li>
          <li>Phone: +91 7428028995</li>
          <li>Address: j57, Paryavaran complex, saket, delhi, 110030</li>
        </ul>
        <p>You can also visit our <a href="mailto:support@tunefry.com">Contact page</a> or <Link to="/song-transfer">Song Transfer &amp; Portability</Link> for faster answers to common questions.</p>

      </div>
    </>
  )
}
