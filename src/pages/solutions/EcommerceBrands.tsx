import MarketingLayout from '../../components/MarketingLayout';

export default function EcommerceBrands() {
  return (
    <MarketingLayout
      path="/solutions/ecommerce-brands"
      eyebrow="Solutions"
      title="Retention systems for ecommerce brands"
      description="Lifecycle email, SMS, and loyalty systems built for DTC and ecommerce brands serious about LTV."
      intro="We build the retention infrastructure that growth-stage ecommerce brands rely on to make every customer worth more — without burning more on acquisition."
    >
      <h2>Built for the way ecommerce actually grows</h2>
      <p>Most ecommerce brands hit a ceiling not because their ads stop working, but because their <strong>second purchase rate is too low</strong>. We fix the part of the funnel that compounds: the relationship after the sale.</p>
      <h2>What we typically deploy</h2>
      <ul>
        <li>Welcome, browse, cart, checkout, and post-purchase flows in Klaviyo or your ESP of choice</li>
        <li>SMS architecture in Postscript or Attentive — designed to convert, not annoy</li>
        <li>Replenishment and winback sequences mapped to your real purchase cycle</li>
        <li>VIP and loyalty mechanics that don't cannibalize margin</li>
        <li>Segmentation built on RFM and predicted CLV — not generic tags</li>
      </ul>
      <h2>Who this is for</h2>
      <p>Ecommerce brands doing roughly $50K–$500K/month, with a real product, real customers, and a desire to stop renting growth from Meta and Google.</p>
    </MarketingLayout>
  );
}
