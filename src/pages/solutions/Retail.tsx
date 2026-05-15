import MarketingLayout from '../../components/MarketingLayout';

export default function Retail() {
  return (
    <MarketingLayout
      path="/solutions/retail"
      eyebrow="Solutions"
      title="Retention for retail and omnichannel brands"
      description="Bridge in-store and online behavior into a single lifecycle program that grows repeat visits and basket size."
      intro="Retail customers don't think in channels. We build retention systems that don't either — unifying in-store, online, and mobile signals into one coherent customer journey."
    >
      <h2>One customer, one program</h2>
      <p>Most retailers run email separately from POS, separately from app, separately from loyalty. The result is duplicated messaging, missed signals, and a customer experience that feels disjointed. We fix that.</p>
      <h2>What we deploy</h2>
      <ul>
        <li>Unified customer profiles across POS, ecommerce, and app</li>
        <li>Lifecycle programs that respond to in-store and online behavior</li>
        <li>Loyalty mechanics tied to real purchase frequency and basket data</li>
        <li>Channel orchestration so customers don't get the same message three times</li>
        <li>Reporting that ties retention KPIs to actual revenue contribution</li>
      </ul>
      <h2>Who this is for</h2>
      <p>Multi-location retail brands, omnichannel operators, and DTC brands with a meaningful wholesale or in-person presence.</p>
    </MarketingLayout>
  );
}
