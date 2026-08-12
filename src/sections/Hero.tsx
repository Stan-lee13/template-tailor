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
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh', background: '#0B1A2A', touchAction: 'pan-y' }}
    >
      <HeroBackground />

      <div
        className="relative z-10 flex flex-col items-center justify-center px-6 lg:px-20 text-center"
        style={{ maxWidth: '1200px', margin: '0 auto', minHeight: '100svh' }}
      >
        <span
          ref={eyebrowRef}
          className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mb-7"
          style={{ opacity: 0 }}
        >
          {c.eyebrow}
        </span>

        <h1
          className="font-black"
          style={{
            fontSize: 'clamp(26px, 5.4vw, 68px)',
            lineHeight: 0.95,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
          }}
        >
          <span ref={leftRef} className="block opacity-0">Build a Brand</span>
          <span ref={rightRef} className="block opacity-0">
            <span className="text-gradient-cyan">Customers Keep</span> Coming Back To.
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-5 lg:mt-8 text-sm lg:text-lg text-white/60 max-w-2xl leading-relaxed tracking-tight"
          style={{ opacity: 0 }}
        >
          We design and manage customer retention systems that turn first-time buyers into loyal customers—helping brands increase repeat purchases, customer lifetime value, referrals, and long-term profitability.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 w-full sm:w-auto"
          style={{ opacity: 0 }}
        >

          <button
            onClick={() => { track('cta_click', { location: 'hero', label: c.primary_cta_label }); open('hero'); }}
            className="group relative px-9 py-4 rounded-full bg-[#C9A227] text-black font-black text-sm uppercase tracking-widest transition-all duration-500 hover:bg-white hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(201, 162, 39,0.3)] w-full sm:w-auto"
          >
            Book an Intro Call
          </button>
          <LiquidButton
            onClick={() => {
              const t = c.secondary_cta_target || '#process';
              if (t.startsWith('#')) scrollTo(t); else window.location.assign(t);
            }}
            className="px-9 py-4 rounded-full border border-white/10 text-white font-black text-sm uppercase tracking-widest transition-all duration-500 hover:bg-white hover:text-black w-full sm:w-auto"
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
