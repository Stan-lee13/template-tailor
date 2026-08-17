import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SEO from '../components/SEO';
import { SITE } from '../config/site';
import { track } from '../lib/analytics';

export default function ThankYou() {
  useEffect(() => {
    track('booking_thankyou_view', {});
  }, []);

  return (
    <div className="bg-black min-h-screen selection:bg-[#00D4FF] selection:text-black">
      <SEO
        title="Thanks — your audit is booked"
        description="Your RetentionFirm growth audit is confirmed. Here's what happens next."
        path="/thank-you"
        noindex
      />
      <Navigation />
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D4FF]/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00D4FF]/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Hero */}
          <div className="text-center mb-20">
            <div className="mx-auto mb-10 w-20 h-20 rounded-3xl bg-[#00D4FF] flex items-center justify-center shadow-[0_0_40px_rgba(0,212,255,0.3)] rotate-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00D4FF] mb-6">
              Transmission Confirmed
            </p>
            <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
              Audit <span className="text-gradient-cyan">Secured.</span>
            </h1>
            <p className="text-xl font-medium text-white/40 leading-relaxed max-w-xl mx-auto">
              Your growth audit is locked in. Check your inbox for the briefing package and meeting link.
            </p>
          </div>

          {/* What happens next */}
          <div className="rounded-[2.5rem] p-10 lg:p-12 mb-12 bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-10">
              The Protocol
            </p>
            <div className="space-y-10">
              {[
                { t: 'Immediate Sync', d: 'Check your inbox for the confirmation email + calendar invite.' },
                { t: 'Prep Briefing', d: 'Within 24 hours, you\'ll receive a short questionnaire to help us prep your data.' },
                { t: 'Live Diagnosis', d: '30-minute session: we dive deep into your store and reveal the 3 highest-leverage retention fixes.' },
                { t: 'The Blueprint', d: 'Post-call, you get a written execution plan. Zero pitch, pure strategy.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-8 group/item">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black text-white group-hover/item:bg-[#00D4FF] group-hover/item:text-black transition-all duration-500">
                    0{i + 1}
                  </div>
                  <div className="pt-1">
                    <p className="text-xl font-black text-white tracking-tight mb-2">{s.t}</p>
                    <p className="text-white/40 font-medium leading-relaxed">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact + resources */}
          <div className="grid sm:grid-cols-2 gap-6 mb-16">
            <div className="rounded-[2rem] p-8 bg-black border border-white/10 hover:border-[#00D4FF]/30 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Direct Support</p>
              <p className="text-2xl font-black text-white tracking-tight mb-6">Questions before the sync?</p>
              <a href={`mailto:${SITE.email}`} className="text-lg font-black text-[#00D4FF] hover:text-white transition-colors duration-300">
                {SITE.email}
              </a>
            </div>
            <div className="rounded-[2rem] p-8 bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4">Intel</p>
              <p className="text-2xl font-black text-white tracking-tight mb-6">Read our retention playbooks</p>
              <Link to="/insights" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-[#00D4FF] transition-colors duration-300">
                Browse insights →
              </Link>
            </div>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/case-studies" 
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-[#00D4FF] transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              See the Results
            </Link>
            <Link 
              to="/" 
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all duration-500"
            >
              Back to Base
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
