import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import { SparklesCore } from '../components/ui/sparkles';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type FinalCTAContent = { headline_1: string; headline_2: string; body: string; kicker: string; cta_label: string };

export default function FinalCTA() {
  const c = useSectionContent<FinalCTAContent>('/', 'final_cta', 'final_cta');
  const sectionRef = useRef<HTMLDivElement>(null);
  const { open } = useBooking();
  const { lowPower, reducedMotion } = useDeviceCapabilities();
  const showSparkles = !lowPower && !reducedMotion;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-animate', { opacity: 0, scale: 0.9, y: 30 }, {
        opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative overflow-hidden bg-[#0a0f1a] py-32 lg:py-48 px-6 lg:px-20">
      {/* Immersive background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1a] via-[#00D4FF]/5 to-[#0a0f1a]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-[#00D4FF]/10 rounded-full blur-[180px] pointer-events-none" />

      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }}>
          <SparklesCore background="transparent" minSize={0.4} maxSize={1.2} particleDensity={40} particleColor="#00D4FF" speed={0.8} className="w-full h-full" />
        </div>
      )}

      <div className="relative max-w-[900px] mx-auto text-center">
        <div className="cta-animate inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-10" style={{ opacity: 0 }}>
          Ready to scale?
        </div>
        
        <h2 className="cta-animate text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none" style={{ opacity: 0 }}>
          Build a Brand <br />
          <span className="text-gradient-cyan">Customers Come Back To.</span>
        </h2>
        
        <p className="cta-animate text-xl lg:text-2xl text-white/60 mb-12 leading-relaxed max-w-2xl mx-auto" style={{ opacity: 0 }}>
          If you're ready to build a more profitable business through stronger customer relationships, we'd love to talk.
        </p>

        <div className="cta-animate" style={{ opacity: 0 }}>
          <button
            onClick={() => { track('cta_click', { location: 'final_cta', label: c.cta_label }); open('final_cta'); }}
            className="group relative inline-flex items-center justify-center px-12 py-6 rounded-full bg-[#00D4FF] text-black font-black text-lg overflow-hidden transition-all duration-500 hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(0,212,255,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Book Your Intro Call
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-2 transition-transform duration-500"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </button>
        </div>

        <div className="cta-animate mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-12" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 text-white/40 text-sm font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            No Long-Term Contracts
          </div>
          <div className="flex items-center gap-3 text-white/40 text-sm font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            Results in 48 Hours
          </div>
          <div className="flex items-center gap-3 text-white/40 text-sm font-bold uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            100% Satisfaction
          </div>
        </div>
      </div>
    </section>
  );
}
