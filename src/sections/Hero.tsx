import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import HeroBackground from '../components/HeroBackground';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import WordRotate from '../components/ui/word-rotate';
import { LiquidButton } from '../components/ui/liquid-glass-button';
import { useSectionContent } from '../hooks/useSectionContent';

type HeroContent = {
  eyebrow: string; title_left: string; title_right: string; title_right_suffix: string;
  subtitle_prefix: string; subtitle_suffix: string; rotating_words: { word: string }[];
  primary_cta_label: string; secondary_cta_label: string; secondary_cta_target: string;
  background_image?: string | null;
};

export default function Hero() {
  const c = useSectionContent<HeroContent>('/', 'hero', 'hero');
  const { open } = useBooking();
  const [rotateStarted, setRotateStarted] = useState(false);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const leftRef = useRef<HTMLSpanElement>(null);
  const rightRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      gsap.set([eyebrowRef.current, leftRef.current, rightRef.current, subRef.current, ctaRef.current], { opacity: 1, x: 0, y: 0 });
      setRotateStarted(true);
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.5 });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.2 })
      .fromTo(leftRef.current, { opacity: 0, x: -100, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5 }, '-=0.8')
      .fromTo(rightRef.current, { opacity: 0, x: 100, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.5 }, '<')
      .fromTo(subRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2, onComplete: () => setRotateStarted(true) }, '-=1')
      .fromTo(ctaRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1.2 }, '-=0.8');

    return () => { tl.kill(); };
  }, []);

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="hero-section relative w-full overflow-hidden"
      style={{ minHeight: '100svh', background: '#050505', touchAction: 'pan-y' }}
    >
      <HeroBackground />

      <div
        className="hero-content relative z-10 flex flex-col items-start justify-center px-6 lg:px-20 text-left"
        style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100svh' }}
      >
        <span
          ref={eyebrowRef}
          className="inline-block max-w-[310px] sm:max-w-none px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] leading-relaxed mb-8 lg:mb-10"
          style={{ opacity: 0 }}
        >
          We Live and Breathe Loyalty and Retention.
        </span>

        <h1
          className="font-black"
          style={{
            fontSize: 'clamp(36px, 8.5vw, 120px)',
            lineHeight: 0.9,
            color: '#FFFFFF',
            letterSpacing: '-0.05em',
          }}
        >
          <span ref={leftRef} className="block opacity-0">Build a Brand</span>
          <span ref={rightRef} className="block opacity-0">
            <span className="hero-warm-accent">Customers Keep</span> Coming Back To.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-8 lg:mt-10 text-lg lg:text-2xl text-white/60 max-w-2xl leading-snug tracking-tight"
          style={{ opacity: 0 }}
        >
          We help customer-based brands build retention systems that increase repeat purchases, customer lifetime value, and long-term profit.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-row items-stretch justify-start gap-3 sm:gap-4 mt-10 lg:mt-12 w-full sm:w-auto max-w-full"
          style={{ opacity: 0 }}
        >
          <button
            onClick={() => { track('cta_click', { location: 'hero', label: c.primary_cta_label }); open('hero'); }}
            className="group relative flex-1 sm:flex-none sm:w-52 px-3 sm:px-6 py-4 rounded-full bg-[#F3EBDD] text-black font-black text-[10px] sm:text-xs uppercase tracking-[0.12em] leading-none whitespace-nowrap transition-all duration-500 hover:bg-[#E8DCC6] hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(243,235,221,0.22)]"
          >
            Book an Intro Call
          </button>
          <LiquidButton
            onClick={() => {
              const t = c.secondary_cta_target || '#process';
              if (t.startsWith('#')) scrollTo(t); else window.location.assign(t);
            }}
            className="flex-1 sm:flex-none sm:w-52 px-3 sm:px-6 py-4 rounded-full border border-[#F3EBDD]/35 text-[#F3EBDD] font-black text-[10px] sm:text-xs uppercase tracking-[0.12em] leading-none whitespace-nowrap transition-all duration-500 hover:bg-[#F3EBDD] hover:text-black"
          >
            {c.secondary_cta_label}
          </LiquidButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div
          className="w-px mx-auto"
          style={{
            height: '40px',
            background: 'rgba(239,239,244,0.4)',
            animation: 'scrollPulse 2.4s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`@keyframes scrollPulse { 0%, 100% { opacity: 0.3; transform: scaleY(0.7); transform-origin: top; } 50% { opacity: 0.85; transform: scaleY(1); } }`}</style>
    </section>
  );
}
