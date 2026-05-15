import MarketingLayout from '../../components/MarketingLayout';

export default function Publishers() {
  return (
    <MarketingLayout
      path="/solutions/publishers"
      eyebrow="Solutions"
      title="Retention for publishers and subscription brands"
      description="Reduce churn, grow renewal revenue, and turn casual readers into paying subscribers."
      intro="For publishers and subscription businesses, retention isn't a marketing channel — it's the entire business model. We build the lifecycle systems that keep readers paying."
    >
      <h2>Subscription growth is a retention problem</h2>
      <p>Acquiring a subscriber is expensive. Keeping them — through onboarding, the first renewal, and the long tail of engagement — is where the unit economics actually work.</p>
      <h2>What we deploy</h2>
      <ul>
        <li>Free-to-paid conversion flows that respect editorial voice</li>
        <li>Onboarding sequences calibrated to the first 30 days of subscriber behavior</li>
        <li>Pre-renewal and win-back logic that recovers churning subscribers before they cancel</li>
        <li>Reader segmentation based on real engagement, not just opens</li>
        <li>Bundle, gift, and upgrade campaigns that grow ARPU</li>
      </ul>
      <h2>Who this is for</h2>
      <p>Independent publishers, niche subscription products, newsletter businesses, and media brands building direct reader revenue.</p>
    </MarketingLayout>
  );
}
