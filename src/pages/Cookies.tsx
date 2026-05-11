import LegalLayout from '../components/LegalLayout';
import SEO from '../components/SEO';
import { SITE } from '../config/site';

export default function Cookies() {
  return (
    <>
      <SEO title="Cookie Policy" description={`How ${SITE.name} uses cookies and similar technologies.`} path="/cookies" />
      <LegalLayout title="Cookie Policy" updated="December 2025">
        <p>
          This Cookie Policy explains how {SITE.name} uses cookies and similar technologies on {SITE.domain}, what
          they do, and the choices you have. Read alongside our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>1. What cookies are</h2>
        <p>
          Cookies are small text files placed on your device when you visit a website. They allow the site to
          recognize your device, remember preferences, and understand how the site is being used.
        </p>

        <h2>2. Categories we use</h2>
        <h3>Essential</h3>
        <p>
          Required for the site to function — for example, remembering your cookie preferences themselves. These
          cannot be turned off.
        </p>
        <h3>Analytics</h3>
        <p>
          Help us understand how visitors use the site (pages viewed, time on page, scroll depth). We use this in
          aggregate to improve content and structure. Set only with your consent.
        </p>
        <h3>Marketing</h3>
        <p>
          May be set if you choose to opt in, to measure the performance of campaigns and to deliver more relevant
          content. Set only with your consent.
        </p>

        <h2>3. Third-party services</h2>
        <p>
          We may use a small number of third parties to operate the site, including analytics providers and
          scheduling tools (Calendly). These providers may set their own cookies. Their use of data is governed
          by their respective policies.
        </p>

        <h2>4. Your choices</h2>
        <p>
          You can accept all cookies, reject non-essential cookies, or open the preferences panel from the cookie
          banner that appears on first visit. You can also clear cookies and reset your choice through your
          browser settings.
        </p>

        <h2>5. Do Not Track</h2>
        <p>
          Some browsers offer a "Do Not Track" signal. There is no universal standard for how sites should respond
          to it; we honor your explicit cookie preferences as set in our banner.
        </p>

        <h2>6. Contact</h2>
        <p>Questions can be sent to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
      </LegalLayout>
    </>
  );
}
