import MarketingLayout from '../components/MarketingLayout';

export default function Compliance() {
  return (
    <MarketingLayout
      path="/compliance"
      eyebrow="Compliance"
      title="How we handle data."
      description="Our compliance and data handling posture as a retention marketing partner."
      intro="We work inside our partners' marketing platforms — handling customer data is part of the job. Here's how we treat it."
    >
      <h2>Data access</h2>
      <p>We access partner data through dedicated, named user accounts inside the partner's own platforms (Klaviyo, Shopify, Postscript, etc.). We do not export, store, or sync customer data outside those platforms unless contractually required.</p>
      <h2>GDPR</h2>
      <p>Where applicable, we operate as a data processor under the partner's data controller relationship with their end customers. Data subject access and deletion requests are handled within the partner's platform, on their normal SLA.</p>
      <h2>CCPA / CPRA</h2>
      <p>We support partners' CCPA and CPRA obligations, including the right to opt out of sale or sharing. See <a href="/legal/ccpa-opt-out">CCPA opt-out</a> and <a href="/legal/privacy-choices">your privacy choices</a>.</p>
      <h2>Security posture</h2>
      <ul>
        <li>SSO / 2FA on all platform access</li>
        <li>Least-privilege access — operators have only the platform permissions required for the engagement</li>
        <li>Quarterly access reviews on every active engagement</li>
        <li>NDA + DPA available on request</li>
      </ul>
    </MarketingLayout>
  );
}
