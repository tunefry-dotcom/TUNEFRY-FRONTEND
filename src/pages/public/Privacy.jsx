import { Link } from 'react-router-dom'

export default function Privacy() {
  return (
    <>
      <div className="legal-hero">
        <div className="legal-hero-inner">
          <div className="breadcrumb"><Link to="/home">Home</Link> &nbsp;/&nbsp; Privacy Policy</div>
          <h1>Privacy Policy</h1>
          <div className="meta">Last updated: May 2026 &nbsp;&middot;&nbsp; Tunefry Artist Services Pvt. Ltd.</div>
        </div>
      </div>

      <div className="legal-body">

        <h2>1. Our Commitment</h2>
        <p>Tunefry Music Distributor aims to secure the personal data of each client (artists or you). Each customer of Tunefry is protected under the laws, ordinances, and corporate social responsibility. Tunefry&apos;s privacy policy mandates that information collected through this platform is safe and secured. The privacy policy affirms that the rights and dignity of the customers are protected under the laws of the constitution.</p>

        <hr className="legal-divider" />

        <h2>2. Source of Information</h2>
        <p>Tunefry will collect information about personal data when users sign up on the Tunefry platform. The following information is collected:</p>
        <ul>
          <li><strong>Personal information:</strong> Names, gender, date of birth, phone number, email address, user ID, membership period, plans purchased.</li>
          <li><strong>Transaction records:</strong> Debit/credit cards, UPI ID, transaction serial numbers, bank account details.</li>
          <li><strong>Usage information:</strong> Operating system of device used, webpages visited, browser, links clicked, IP address, countries of access.</li>
        </ul>

        <hr className="legal-divider" />

        <h2>3. Purpose of Data Collection</h2>
        <p>Regulatory and monitoring purposes are embodied in taking the personal information of the customers. Tunefry uses your data for:</p>
        <ul>
          <li>Regulatory and monitoring purposes.</li>
          <li>Maintenance, security, updates, and safety of services.</li>
          <li>Copyright and talent protection for artists.</li>
          <li>Sustaining obligatory provisions and agreements.</li>
          <li>Song, product, and service launches.</li>
          <li>Other purposeful actions based on prior consent.</li>
        </ul>

        <hr className="legal-divider" />

        <h2>4. Data Security</h2>
        <p>Tunefry executes lawful, technical, and supervisory courses of action to mitigate phishing activities and illegal access to personal data.</p>

        <hr className="legal-divider" />

        <h2>5. Data Processing</h2>
        <p>Tunefry transfers the personal data to respective music streaming platforms under privacy protection laws.</p>

        <hr className="legal-divider" />

        <h2>6. Data Retention</h2>
        <p>Tunefry keeps and use the personal information obtained from the artists until the song is streaming on different platforms. The data is also kept for future necessary actions.</p>

        <hr className="legal-divider" />

        <h2>7. Cookies &amp; Tracking</h2>
        <p>Tunefry may produce cookies and use other technologies for digital analytics and tracking web pages. Tunefry may also use social platforms to track and analyze online activities.</p>

        <hr className="legal-divider" />

        <h2>8. Your Rights</h2>
        <p>With the assurance to harness the privacy and confidentiality of personal data, Tunefry guarantees that the customers have the right to inquire about any breach of privacy. Customers can file a grievance with the Data Grievance Officer at <a href="mailto:support@tunefry.com">support@tunefry.com</a>.</p>

        <hr className="legal-divider" />

        <h2>9. Policy Updates</h2>
        <p>Tunefry is continuously doing innovation and improvement on its platform. Tunefry can make changes to this privacy policy in compliance with applicable laws and regulations from time to time.</p>

        <hr className="legal-divider" />

        <h2>10. Contact Us</h2>
        <p>For any privacy-related queries, contact us at <a href="mailto:support@tunefry.com">support@tunefry.com</a> or call +91 7428028995.</p>

      </div>
    </>
  )
}
