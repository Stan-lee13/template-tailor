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
      gsap.fromTo('.cta-animate', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0A0A0A 0%, #0C1622 50%, #0A0A0A 100%)', padding: '12vh clamp(20px, 5vw, 80px) 14vh' }}>
      <div className="absolute top-[20%] left-[10%] w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(44,145,225,0.07) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(197,201,209,0.04) 0%, transparent 70%)' }} />

      {showSparkles && (
        <div className="absolute inset-0 pointer-events-none hidden md:block" style={{ maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 75%)' }}>
          <SparklesCore background="transparent" minSize={0.3} maxSize={0.8} particleDensity={35} particleColor="#C5C9D1" speed={0.6} className="w-full h-full" />
        </div>
      )}
      <div className="relative max-w-[640px] mx-auto text-center px-1">
        <h2 className="cta-animate font-outfit font-medium mb-2" style={{ fontSize: 'clamp(24px, 5vw, 52px)', lineHeight: 1, color: '#f1ece4', letterSpacing: '-0.02em', opacity: 0 }}>
          {c.headline_1}
        </h2>
        <h2 className="cta-animate font-outfit font-medium mb-5 sm:mb-6" style={{ fontSize: 'clamp(24px, 5vw, 52px)', lineHeight: 1, letterSpacing: '-0.02em', opacity: 0 }}>
          <span style={{ color: '#F97316' }}>{c.headline_2}</span>
        </h2>
        <p className="cta-animate font-inter mx-auto mb-4" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.6, color: 'rgba(241,236,228,0.7)', maxWidth: '560px', opacity: 0 }}>
          {c.body}
        </p>
        <p className="cta-animate font-inter font-medium mb-8 sm:mb-10" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#F97316', opacity: 0 }}>
          {c.kicker}
        </p>
        <div className="cta-animate" style={{ opacity: 0 }}>
          <button
            onClick={() => { track('cta_click', { location: 'final_cta', label: c.cta_label }); open('final_cta'); }}
            className="font-inter font-medium text-white transition-all duration-200 w-full sm:w-auto"
            style={{ background: '#F97316', padding: '16px 40px', borderRadius: '9999px', fontSize: '16px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EA580C'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F97316'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {c.cta_label}
          </button>
        </div>
        <p className="cta-animate font-inter font-medium uppercase mt-5" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.04em', opacity: 0 }}>
          No commitment required. Results in 48 hours.
        </p>
      </div>
    </section>
  );
}
