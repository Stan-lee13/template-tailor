import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SparklesCore } from '../components/ui/sparkles';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import CalendlyInline from '../components/CalendlyInline';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { lowPower, reducedMotion } = useDeviceCapabilities();
  const showSparkles = !lowPower && !reducedMotion;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.cta-animate', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative overflow-hidden bg-[#050505] px-6 py-20 lg:px-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(216,166,61,0.12),transparent_38%)] pointer-events-none" />
      {showSparkles && <div className="absolute inset-0 pointer-events-none opacity-40" style={{ maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 80%)' }}><SparklesCore background="transparent" minSize={0.4} maxSize={1.2} particleDensity={30} particleColor="#D8A63D" speed={0.6} className="w-full h-full" /></div>}

      <div className="relative max-w-[1300px] mx-auto">
        <div className="cta-object">
          <div className="cta-object__bar"><span>RETENTION FIRM / NEXT MOVE</span><span>READY TO SCALE?</span></div>
          <div className="cta-object__body cta-object__body--solo">
            <div className="cta-copy cta-animate" style={{ opacity: 0 }}>
              <span className="cta-kicker">Ready to scale?</span>
              <h2 className="cta-title cta-animate" style={{ opacity: 0 }}>Build a Brand <span>Customers Come Back To.</span></h2>
              <p className="cta-description cta-animate" style={{ opacity: 0 }}>If you&apos;re ready to build a more profitable business through stronger customer relationships, we&apos;d love to talk.</p>
            </div>
          </div>
          <div className="cta-proof cta-animate" style={{ opacity: 0 }}>
            <span><i />No Long-Term Contracts</span>
            <span><i />Results in 48 Hours</span>
            <span><i />100% Satisfaction</span>
          </div>
          <div className="cta-calendly-shell cta-animate" style={{ opacity: 0 }}>
            <div className="cta-calendly-shell__bar"><span>RETENTION FIRM / INTRO CALL</span><span>OPEN CALENDAR</span></div>
            <CalendlyInline location="final_cta_inline" />
          </div>
        </div>
      </div>
    </section>
  );
}
