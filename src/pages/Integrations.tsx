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
      <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {partners.map((p) => (
          <div key={p.name} className="group p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-500 hover:-translate-y-1">
            <h3 className="text-xl font-black text-white tracking-tight mb-4 group-hover:text-[#C56A4A] transition-colors">{p.name}</h3>
            <p className="text-sm font-medium leading-relaxed text-white/40">{p.desc}</p>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
