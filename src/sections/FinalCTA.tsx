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
      gsap.fromTo('.cta-animate', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative overflow-hidden" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 14vh' }}>
      {/* Subtle cyan glow orbs */}
      <div className="absolute top-[20%] left-[10%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[200px] sm:w-[280px] h-[200px] sm:h-[280px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.04) 0%, transparent 70%)' }} />

      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }}>
          <SparklesCore background="transparent" minSize={0.3} maxSize={0.8} particleDensity={35} particleColor="#00D4FF" speed={0.6} className="w-full h-full" />
        </div>
      )}
      <div className="relative max-w-[640px] mx-auto text-center px-1">
        <h2 className="cta-animate font-outfit font-bold mb-2" style={{ fontSize: 'clamp(24px, 5vw, 52px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em', opacity: 0 }}>
          {c.headline_1}
        </h2>
        <h2 className="cta-animate font-outfit font-bold mb-5 sm:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.03em', opacity: 0 }}>
          <span style={{ color: '#00D4FF' }}>{c.headline_2}</span>
        </h2>
        <p className="cta-animate font-inter mx-auto mb-4" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', maxWidth: '560px', opacity: 0 }}>
          {c.body}
        </p>
        <p className="cta-animate font-inter font-medium mb-8 sm:mb-10" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#00D4FF', opacity: 0 }}>
          {c.kicker}
        </p>
        <div className="cta-animate" style={{ opacity: 0 }}>
          <button
            onClick={() => { track('cta_click', { location: 'final_cta', label: c.cta_label }); open('final_cta'); }}
            className="font-inter font-bold transition-all duration-300 w-full sm:w-auto"
            style={{ background: 'linear-gradient(135deg, #00D4FF, #0099cc)', color: '#000000', padding: '18px 48px', borderRadius: '9999px', fontSize: '16px', letterSpacing: '-0.01em' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,212,255,0.35)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {c.cta_label}
          </button>
        </div>
        <p className="cta-animate font-inter font-medium uppercase mt-5" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', opacity: 0 }}>
          No commitment required. Results in 48 hours.
        </p>
      </div>
    </section>
  );
}
