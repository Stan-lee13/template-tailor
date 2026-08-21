import { Link } from 'react-router-dom';
import MarketingLayout from '../components/MarketingLayout';

export default function CaseStudies() {
  return (
    <MarketingLayout
      path="/case-studies"
      eyebrow="Intelligence Reports"
      title="Real work, real outcomes"
      description="Anonymized retention case studies from RetentionFirm engagements."
      intro="Our case study library is a repository of successful deployments. Below is a detailed anonymized protocol of our work. Full named case studies are currently clearing partner security protocols for release."
    >
      <div className="space-y-24 mt-20">
        <section className="group relative p-10 lg:p-20 rounded-[3rem] bg-white/[0.03] border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-700 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#C56A4A]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C56A4A]/10 transition-colors duration-700" />

          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56A4A] mb-8">Case Protocol 001</p>
            <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter mb-12 leading-none">DTC Apparel Brand <span className="text-white/20">— Anonymized</span></h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">Situation</h3>
                <p className="text-sm font-medium leading-relaxed text-white/40">Growth-stage brand scaling ~$180K/mo. High Meta acquisition efficiency, but second-purchase rate stalled below 18%. Email contribution &lt; 12%.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">The Deployment</h3>
                <p className="text-sm font-medium leading-relaxed text-white/40">Full lifecycle architecture in Klaviyo: RFM-segmented campaigns + 12 automated flows. Strategic SMS layering via Postscript for high-intent moments.</p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-white">The Impact</h3>
                <p className="text-sm font-medium leading-relaxed text-[#C56A4A]">Retention contribution reached 30% within 90 days. Meaningful lift in second-purchase velocity and reduced reliance on paid acquisition channels.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center py-20">
          <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tighter mb-6 uppercase">Additional Protocols Loading</h2>
          <p className="text-sm font-medium text-white/20 max-w-xl mx-auto leading-relaxed mb-12">
            We are currently processing multiple partner deployments for public release. If you are an existing partner and wish to be featured, initiate contact.
          </p>
          <Link to="/contact" className="text-xs font-black uppercase tracking-widest text-[#C56A4A] hover:text-white transition-colors duration-300">
            Inquire for Feature →
          </Link>
        </section>
      </div>
    </MarketingLayout>
  );
}
