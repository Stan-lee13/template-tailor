import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section ref={sectionRef} id="cta" className="relative overflow-hidden" style={{ background: '#0A0A0A', padding: '14vh clamp(24px, 5vw, 80px)' }}>
      {/* Gradient orbs */}
      <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[200px] h-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(65,105,225,0.05) 0%, transparent 70%)' }} />

      <div className="relative max-w-[640px] mx-auto text-center">
        <h2 className="cta-animate font-outfit font-medium mb-2" style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 0.95, color: '#EBE8E0', letterSpacing: '-0.02em', opacity: 0 }}>
          You Already Paid for Your Customers…
        </h2>
        <h2 className="cta-animate font-outfit font-medium mb-6" style={{ fontSize: 'clamp(28px, 5vw, 52px)', lineHeight: 0.95, letterSpacing: '-0.02em', opacity: 0 }}>
          <span style={{ color: '#F97316' }}>Now It's Time to Profit From Them</span>
        </h2>
        <p className="cta-animate font-inter mx-auto mb-4" style={{ fontSize: '18px', lineHeight: 1.6, color: 'rgba(235,232,224,0.7)', maxWidth: '560px', opacity: 0 }}>
          Every day you don't fix your retention… you're losing revenue you've already earned.
        </p>
        <p className="cta-animate font-inter font-medium mb-10" style={{ fontSize: '17px', color: '#F97316', opacity: 0 }}>
          → Let's turn that around.
        </p>
        <div className="cta-animate" style={{ opacity: 0 }}>
          <button
            className="font-inter font-medium text-white transition-all duration-200"
            style={{ background: '#F97316', padding: '16px 40px', borderRadius: '9999px', fontSize: '16px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EA580C'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F97316'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Book Your Free Growth Audit
          </button>
        </div>
        <p className="cta-animate font-inter font-medium uppercase mt-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em', opacity: 0 }}>
          No commitment required. Results in 48 hours.
        </p>
      </div>
    </section>
  );
}
