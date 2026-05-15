import MarketingLayout from '../components/MarketingLayout';
import { SITE } from '../config/site';

export default function Careers() {
  return (
    <MarketingLayout
      path="/careers"
      eyebrow="Careers"
      title="Build retention systems with us."
      description="We're a small team. We hire selectively, and only when we can make someone successful."
      intro="We're not actively hiring right now — but we keep a short list of operators we want to talk to when the right seat opens."
    >
      <h2>The kind of people we hire</h2>
      <ul>
        <li>Lifecycle operators who've shipped real revenue inside ecommerce brands</li>
        <li>Strategists who can read a Klaviyo dashboard and tell you what's actually wrong</li>
        <li>Writers who can produce conversion-grade copy without sounding like a template</li>
        <li>Analysts who treat retention as a math problem first and a creative problem second</li>
      </ul>
      <h2>Get on our radar</h2>
      <p>Send a short note about what you've built and what you want to build next to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> with subject line "Careers". We read every one.</p>
    </MarketingLayout>
  );
}
