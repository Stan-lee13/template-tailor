import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import BreathingMatrix from '../components/BreathingMatrix';
import { useBooking } from '../hooks/useBooking';
import { useDeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { track } from '../lib/analytics';

export default function Hero() {
  const { open } = useBooking();
  const { lowPower, reducedMotion } = useDeviceCapabilities();
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
    if (headlineRef.current) {
      const words = headlineRef.current.querySelectorAll('.word');
      tl.fromTo(words, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 }, '-=0.3');
    }
    tl.fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    tl.fromTo(ctaRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
    return () => { tl.kill(); };
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full overflow-hidden" style={{ height: '100vh', minHeight: '600px', background: '#0A0A0A' }}>
      {(lowPower || reducedMotion) ? (
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(249,115,22,0.18), transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(65,105,225,0.10), transparent 60%), #0A0A0A' }} aria-hidden />
      ) : (
        <BreathingMatrix />
      )}

      {/* Decorative floating elements */}
      <div className="absolute top-[20%] left-[8%] w-3 h-3 rounded-full opacity-20 animate-pulse hidden sm:block" style={{ background: '#4169E1', filter: 'blur(4px)' }} />
      <div className="absolute top-[35%] right-[12%] w-2 h-2 opacity-15 hidden sm:block" style={{ background: '#10B981', transform: 'rotate(45deg)', filter: 'blur(2px)' }} />
      <div className="absolute bottom-[30%] left-[15%] w-4 h-[1px] opacity-20 hidden sm:block" style={{ background: 'linear-gradient(90deg, #F59E0B, transparent)' }} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-5 sm:px-6" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <span
          ref={eyebrowRef}
          className="block uppercase tracking-widest mb-4 sm:mb-6"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', fontWeight: 500, color: '#A0A0A0', letterSpacing: '0.08em', opacity: 0 }}
        >
          <span style={{ color: '#F97316' }}>●</span>&nbsp;&nbsp;Retention Marketing Agency
        </span>

        <h1
          ref={headlineRef}
          className="font-outfit font-medium"
          style={{ fontSize: 'clamp(32px, 6.5vw, 88px)', lineHeight: 1, color: '#f1ece4', letterSpacing: '-0.02em' }}
        >
          <span className="word inline-block opacity-0">Turn&nbsp;</span>
          <span className="word inline-block opacity-0">Your&nbsp;</span>
          <span className="word inline-block opacity-0">Existing&nbsp;</span>
          <span className="word inline-block opacity-0">Customers&nbsp;</span>
          <span className="word inline-block opacity-0">Into&nbsp;</span>
          <span className="word inline-block opacity-0">Your&nbsp;</span>
          <span className="word inline-block opacity-0" style={{ color: '#F97316' }}>Most&nbsp;</span>
          <span className="word inline-block opacity-0" style={{ color: '#F97316' }}>Profitable&nbsp;</span>
          <span className="word inline-block opacity-0">Growth&nbsp;</span>
          <span className="word inline-block opacity-0">Engine</span>
        </h1>

        <p
          ref={subRef}
          className="mt-5 sm:mt-7 mx-auto"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.6, color: 'rgba(241,236,228,0.8)', maxWidth: '580px', letterSpacing: '-0.01em', opacity: 0 }}
        >
          We help ecommerce brands increase repeat purchases, boost customer lifetime value, and unlock hidden revenue—without increasing ad spend.
        </p>

        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto" style={{ opacity: 0 }}>
          <button
            onClick={() => { track('cta_click', { location: 'hero', label: 'Book a Growth Audit' }); open('hero'); }}
            className="font-inter font-medium text-white transition-all duration-200 w-full sm:w-auto"
            style={{ background: '#F97316', padding: '14px 32px', borderRadius: '9999px', fontSize: '15px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EA580C'; e.currentTarget.style.transform = 'scale(1.02)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F97316'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            Book a Growth Audit
          </button>
          <button
            onClick={() => scrollTo('#process')}
            className="font-inter font-medium transition-all duration-200 w-full sm:w-auto"
            style={{ background: 'transparent', padding: '14px 32px', borderRadius: '9999px', fontSize: '15px', color: '#f1ece4', border: '1px solid rgba(241,236,228,0.3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(241,236,228,0.08)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.4)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(241,236,228,0.3)'; }}
          >
            See How It Works
          </button>
        </div>
      </div>

      {/* Bottom gradient — curved feel */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '200px', background: 'linear-gradient(to bottom, transparent 0%, #0A0A0A 100%)', zIndex: 5 }} />

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" style={{ zIndex: 10 }}>
        <div className="w-px mx-auto" style={{ height: '40px', background: 'rgba(241,236,228,0.4)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>

      <style>{`@keyframes scrollPulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }`}</style>
    </section>
  );
}
