const items = [
  'Trusted by 50+ DTC brands',
  'Avg. 3.2× LTV increase',
  '$12M+ in retained revenue',
  '40% avg. churn reduction',
  '28% avg. repeat purchase lift',
  'Klaviyo & Attentive certified',
];

export default function SocialProofTicker() {
  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '14px 0' }}>
      <div className="ticker-track flex items-center gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="font-inter flex items-center gap-3" style={{ fontSize: '13px', color: 'rgba(235,232,224,0.35)', letterSpacing: '0.01em' }}>
            <span style={{ color: '#F97316', fontSize: '6px' }}>●</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        .ticker-track {
          animation: ticker 30s linear infinite;
          width: max-content;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
