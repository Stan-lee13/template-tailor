import MarketingLayout from '../components/MarketingLayout';
import { SITE } from '../config/site';

export default function Careers() {
  return (
    <MarketingLayout
      path="/careers"
      eyebrow="Talent Protocol"
      title="Join the Cluster."
      description="We're a small team. We hire selectively, and only when we can make someone successful."
      intro="Current recruitment status: Selective. We maintain a high-priority roster of operators for future system expansion."
    >
      <div className="mt-20 space-y-24">
        <section className="space-y-12">
          <div className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#C56A4A]">Ideal Entity Profile</div>
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase">Who We <span className="text-gradient-warm">Recruit</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { title: "Lifecycle Operators", desc: "Entities who have deployed high-performance revenue architectures within DTC brands." },
              { title: "System Strategists", desc: "Analytical minds capable of diagnosing complex Klaviyo/Shopify friction points." },
              { title: "Conversion Architects", desc: "Writers who produce high-precision copy that bypasses generic templates." },
              { title: "Data Analysts", desc: "Operators who treat retention as a mathematical optimization problem first." }
            ].map((role, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-500 group">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-[#C56A4A] transition-colors">{role.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-white/40">{role.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="p-10 lg:p-20 rounded-[3rem] bg-white/[0.02] border border-white/10 relative overflow-hidden text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#C56A4A]/5 blur-[100px] rounded-full -translate-y-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none uppercase mb-8">Establish <span className="text-gradient-warm">Signal</span></h2>
            <p className="text-lg lg:text-xl font-medium text-white/40 max-w-2xl mx-auto leading-relaxed mb-12">
              Send a concise transmission regarding your past deployments and future trajectory to <a href={`mailto:${SITE.email}`} className="text-white hover:text-[#C56A4A] transition-colors">{SITE.email}</a>.
              Use subject: <span className="text-white font-black uppercase tracking-widest">CAREERS_PROTOCOL</span>.
            </p>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">Every transmission is analyzed.</p>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
