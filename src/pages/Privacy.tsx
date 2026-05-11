import LegalLayout from '../components/LegalLayout';
import SEO from '../components/SEO';
import { SITE } from '../config/site';

export default function Privacy() {
  return (
    <>
      <SEO title="Privacy Policy" description={`How ${SITE.name} collects, uses, and protects information.`} path="/privacy" />
      <LegalLayout title="Privacy Policy" updated="December 2025">
        <p>
          This Privacy Policy explains how {SITE.name} ("we", "us") collects, uses, and protects information when
          you visit {SITE.domain} or engage with our services. We aim to keep this short, plain, and accurate.
        </p>

        <h2>1. Information we collect</h2>
        <p>We collect three categories of information:</p>
        <ul>
          <li><strong>Information you provide</strong> — when you book a call, email us, or fill out a form, we collect the details you submit (name, business email, company, message).</li>
          <li><strong>Information collected automatically</strong> — when you visit the site, we collect basic technical information (IP address, device type, browser, referring page) and engagement signals (pages viewed, time on page) using cookies and similar technologies. See our <a href="/cookies">Cookie Policy</a>.</li>
          <li><strong>Information from third parties</strong> — if you book through Calendly or interact with our social channels, those providers share limited information with us in line with their own policies.</li>
        </ul>

        <h2>2. How we use information</h2>
        <ul>
          <li>To respond to enquiries and schedule consultations.</li>
          <li>To provide retention marketing services to clients we engage with.</li>
          <li>To improve the website and understand how visitors use it.</li>
          <li>To send occasional updates and insights, where you have opted in.</li>
          <li>To meet legal, accounting, and security obligations.</li>
        </ul>

        <h2>3. Legal bases (where applicable)</h2>
        <p>
          Where the GDPR or similar laws apply, we rely on: your consent (analytics, marketing communications);
          performance of a contract (service delivery); legitimate interests (improving the site, securing it,
          replying to enquiries); and legal obligations (record keeping).
        </p>

        <h2>4. Sharing</h2>
        <p>
          We do not sell personal information. We share it only with vetted service providers that help us run
          the business — for example, email infrastructure, scheduling, analytics, hosting — and only with what
          they need to perform their function. We may also disclose information when required by law.
        </p>

        <h2>5. Retention</h2>
        <p>
          We keep information only as long as needed for the purposes described above, or as required by law.
          Enquiry records are typically retained for up to 24 months unless we have an active engagement.
        </p>

        <h2>6. Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, delete, port, or restrict the
          processing of your personal information, and to object to certain processing. To exercise any of these
          rights, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>7. Security</h2>
        <p>
          We use industry-standard administrative, technical, and physical safeguards to protect information. No
          system is perfectly secure, and we encourage you to use strong passwords and to share sensitive data
          through secure channels.
        </p>

        <h2>8. Children</h2>
        <p>The site and our services are not intended for individuals under 16, and we do not knowingly collect their information.</p>

        <h2>9. Changes</h2>
        <p>We may update this policy from time to time. The "Last updated" date at the top reflects the most recent revision.</p>

        <h2>10. Contact</h2>
        <p>Questions about this policy can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </LegalLayout>
    </>
  );
}
