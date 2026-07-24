import MarketingLayout from '../components/MarketingLayout';

const partners = [
  { name: 'Klaviyo', desc: 'Email + SMS marketing platform — our primary deployment environment for ecommerce brands.' },
  { name: 'Postscript', desc: 'Conversational SMS for ecommerce. Used for time-sensitive lifecycle moments.' },
  { name: 'Attentive', desc: 'Enterprise SMS marketing. For scaled brands needing deeper segmentation and compliance.' },
  { name: 'Shopify', desc: 'The commerce backbone. We integrate retention logic against Shopify customer and order data.' },
  { name: 'Recharge', desc: 'Subscription infrastructure. Retention flows mapped against subscription lifecycle states.' },
  { name: 'Yotpo', desc: 'Reviews, loyalty, and SMS. Used for review velocity and loyalty mechanics.' },
  { name: 'Segment', desc: 'Customer data infrastructure. We work in Segment-piped warehouses for advanced personalization.' },
  { name: 'Triple Whale', desc: 'Attribution and analytics. Retention impact measured alongside paid performance.' },
];

export default function Integrations() {
  return (
    <MarketingLayout
      path="/integrations"
      eyebrow="Integrations"
      title="The stack we deploy in"
      description="Our retention systems are built on the platforms ecommerce teams already trust."
      intro="We don't sell software. We build the strategy, architecture, and execution inside the platforms you already use."
    >
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {partners.map((p) => (
          <div key={p.name} className="p-5 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #D6D3CC' }}>
            <h3 className="font-outfit font-medium" style={{ fontSize: '18px', color: '#000000', marginBottom: 6 }}>{p.name}</h3>
            <p className="font-inter" style={{ fontSize: '14px', lineHeight: 1.55, color: '#555' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
