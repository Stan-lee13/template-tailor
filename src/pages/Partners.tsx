import MarketingLayout from '../components/MarketingLayout';
import { SITE } from '../config/site';

export default function Partners() {
  return (
    <MarketingLayout
      path="/partners"
      eyebrow="Partners"
      title="We work alongside your existing team."
      description="RetentionFirm partners with agencies, platforms, and operators to deliver retention outcomes."
      intro="We don't compete with your paid agency, your creative shop, or your in-house team. Retention is a discipline of its own — and we slot in alongside the people already doing the rest of the work."
    >
      <h2>Agency partnerships</h2>
      <p>If you run a performance, creative, or brand agency and your clients keep asking about retention, lifecycle, or LTV — we white-label or co-deliver. You keep the relationship. We do the work.</p>
      <h2>Platform partnerships</h2>
      <p>We deploy primarily in Klaviyo, Postscript, Attentive, Recharge, and Yotpo. If you're a platform partner interested in joint customer success motion, get in touch.</p>
      <h2>Get in touch</h2>
      <p>Email partnerships at <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with a short note about what you'd want to build together.</p>
    </MarketingLayout>
  );
}
