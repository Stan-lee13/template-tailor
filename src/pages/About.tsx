import MarketingLayout from '../components/MarketingLayout';

export default function About() {
  return (
    <MarketingLayout
      path="/about"
      eyebrow="Mission Protocol"
      title="Architects of Enterprise Value."
      description="RetentionFirm is a high-performance retention marketing studio for growth-stage ecommerce brands."
      intro="We are operators. We've scaled the brands we now build for — and we've seen first-hand how much revenue is lost when retention is treated as a secondary metric."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 mt-20">
        <section className="space-y-8">
          <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#C56A4A]">Core Thesis</div>
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase">Unit Economic <span className="text-gradient-warm">Survival</span></h2>
          <p className="text-lg font-medium leading-relaxed text-white/40">
            E-commerce profitability is a function of the second, third, and fourth purchase. Acquisition is the entry point; retention is the mechanism that ensures unit economics survive Meta volatility, platform shifts, and market cycles.
          </p>
        </section>

        <section className="space-y-8">
          <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#C56A4A]">Operational Model</div>
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase">Senior <span className="text-gradient-warm">Execution</span></h2>
          <p className="text-lg font-medium leading-relaxed text-white/40">
            Elite team. Senior operators. Direct accountability. We have eliminated the junior account manager layer. The strategist who diagnoses your retention friction is the engineer who builds the deployment.
          </p>
        </section>

        <section className="space-y-8 lg:col-span-2 p-12 lg:p-20 rounded-[3rem] bg-white/[0.02] border border-white/10 mt-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C56A4A]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#C56A4A] mb-8">Ideal Partner Profile</div>
            <h2 className="text-3xl lg:text-6xl font-black text-white tracking-tighter leading-none uppercase mb-8">Built for <span className="text-gradient-warm">Scale</span></h2>
            <p className="text-xl lg:text-2xl font-medium leading-relaxed text-white/40 max-w-4xl">
              We partner with growth-stage ecommerce entities that have established product-market fit and a strategic mandate to stop renting their growth from advertising platforms.
            </p>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
