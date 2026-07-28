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
    <div className="relative overflow-hidden bg-black py-8 border-y border-white/5">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <div className="ticker-track flex items-center gap-20 whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-white/20">
              {item}
            </span>
            <div className="w-2 h-2 rounded-full bg-[#00D4FF]/20" />
          </div>
        ))}
      </div>
      <style>{`
        .ticker-track { animation: ticker 40s linear infinite; width: max-content; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .ticker-track { animation: none; } }
      `}</style>
    </div>
  );
}
