import MarketingLayout from '../components/MarketingLayout';
import { SITE } from '../config/site';
import { useBooking } from '../hooks/useBooking';

export default function Contact() {
  const { open } = useBooking();
  return (
    <MarketingLayout
      path="/contact"
      eyebrow="Communication Protocol"
      title="Initiate Contact."
      description="Get in touch with the RetentionFirm team."
      intro="The most efficient entry point is a 30-minute Growth Audit. No slide decks. No sales pitches. We audit your retention architecture and identify immediate revenue leakage."
    >
      <div className="mt-20 space-y-24">
        <section className="p-10 lg:p-20 rounded-[3rem] bg-white/[0.03] border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#00D4FF]/10 transition-colors duration-700" />
          
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-8 leading-none uppercase">Priority <span className="text-gradient-cyan">Access</span></h2>
            <p className="text-lg font-medium text-white/40 mb-12 leading-relaxed">
              Direct line to our senior operators. We analyze your Klaviyo/Shopify cluster and deliver a high-impact diagnostic.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={() => open('contact_page')} 
                className="px-10 py-5 rounded-2xl bg-[#00D4FF] text-black text-xs font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
              >
                Book Growth Audit
              </button>
              <a 
                href={`mailto:${SITE.email}`} 
                className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white/40 text-xs font-black uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all duration-500 flex items-center justify-center"
              >
                Inquire via Email
              </a>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Direct Channels</h3>
            <div className="space-y-4">
              <p className="text-lg font-medium text-white/40">
                Email: <a href={`mailto:${SITE.email}`} className="text-white hover:text-[#00D4FF] transition-colors">{SITE.email}</a>
              </p>
              <p className="text-lg font-medium text-white/40">
                LinkedIn: <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#00D4FF] transition-colors">RetentionFirm Protocol</a>
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Response Latency</h3>
            <p className="text-lg font-medium text-white/40 leading-relaxed">
              We operate across global clusters. Expected response latency is &lt; 24 hours. Usually instantaneous during market hours.
            </p>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
