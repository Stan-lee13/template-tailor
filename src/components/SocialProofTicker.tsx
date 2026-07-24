const items = [
  'Built for growth-stage ecommerce brands',
  'Retention systems designed for repeat-purchase businesses',
  'Lifecycle-focused email and SMS architecture',
  'Designed for brands serious about LTV',
  'Klaviyo and Attentive native deployments',
  'Operator-led, not template-led',
];

export default function SocialProofTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden" style={{ background: '#000000', borderTop: '1px solid rgba(0,212,255,0.06)', borderBottom: '1px solid rgba(0,212,255,0.06)', padding: '14px 0' }}>
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="font-inter flex items-center gap-3" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.01em' }}>
            <span style={{ color: '#00D4FF', fontSize: '6px' }}>●</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        .ticker-track { animation: ticker 36s linear infinite; width: max-content; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
    </div>
  );
}
