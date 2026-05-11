import LegalLayout from '../components/LegalLayout';
import SEO from '../components/SEO';
import { SITE } from '../config/site';

export default function Terms() {
  return (
    <>
      <SEO title="Terms of Service" description={`The terms governing use of ${SITE.domain} and ${SITE.name} services.`} path="/terms" />
      <LegalLayout title="Terms of Service" updated="December 2025">
        <p>
          These Terms govern your use of {SITE.domain} and any retention marketing services provided by {SITE.name}
          ("we", "us"). By accessing the site or engaging us, you agree to these Terms.
        </p>

        <h2>1. The site</h2>
        <p>
          The site is provided for informational purposes. Content may be updated, changed, or removed at any
          time. We make reasonable efforts to keep information accurate but make no warranties as to its
          completeness or fitness for any particular purpose.
        </p>

        <h2>2. Engagements</h2>
        <p>
          Any work we perform for a client is governed by a separate written agreement (typically a Statement of
          Work or Services Agreement) which controls the scope, fees, deliverables, IP, confidentiality, and
          termination. These Terms do not by themselves create a client relationship.
        </p>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the site to violate any law or third-party right.</li>
          <li>Attempt to gain unauthorized access to systems, accounts, or data.</li>
          <li>Scrape, copy, or republish substantial portions of the site without written permission.</li>
          <li>Interfere with the operation of the site or its security features.</li>
        </ul>

        <h2>4. Intellectual property</h2>
        <p>
          All content on the site — including copy, design, logos, illustrations, and code — is owned by
          {SITE.name} or licensed to us and is protected by applicable law. You may share short quotations with
          attribution and a link back to the source.
        </p>

        <h2>5. No professional advice</h2>
        <p>
          Articles, guides, and other content on the site are general in nature and do not constitute professional,
          legal, financial, or marketing advice for your specific situation.
        </p>

        <h2>6. Disclaimer</h2>
        <p>
          The site is provided "as is" and "as available" without warranties of any kind, express or implied,
          including merchantability, fitness for a particular purpose, and non-infringement.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE.name} will not be liable for indirect, incidental, special,
          consequential, or punitive damages arising from your use of the site. Our total liability for direct
          damages relating to the site will not exceed USD 100.
        </p>

        <h2>8. Indemnity</h2>
        <p>
          You agree to indemnify {SITE.name} against claims arising from your misuse of the site or breach of these
          Terms.
        </p>

        <h2>9. Governing law</h2>
        <p>These Terms are governed by the laws applicable to our principal place of business, without regard to conflict of laws principles.</p>

        <h2>10. Changes</h2>
        <p>We may update these Terms. Continued use of the site after changes are posted constitutes acceptance.</p>

        <h2>11. Contact</h2>
        <p>Questions can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </LegalLayout>
    </>
  );
}
