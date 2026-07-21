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

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.25 });
    tl.fromTo(eyebrowRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo(leftRef.current, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 1.0 }, '-=0.2')
      .fromTo(rightRef.current, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 1.0 }, '<')
      .fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, onComplete: () => setRotateStarted(true) }, '-=0.35')
      .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3');

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
      style={{ minHeight: '100svh', background: '#0A0A0A', touchAction: 'pan-y' }}
    >
      <HeroBackground />

      <div
        className="relative z-10 flex flex-col items-center justify-center px-5 sm:px-6 text-center"
        style={{ maxWidth: '960px', margin: '0 auto', minHeight: '100svh' }}
      >
        <span
          ref={eyebrowRef}
          className="block uppercase tracking-widest mb-4 sm:mb-6"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(239,239,244,0.75)',
            letterSpacing: '0.12em',
            opacity: 0,
          }}
        >
          <span style={{ color: '#2C91E1' }}>●</span>&nbsp;&nbsp;{c.eyebrow}
        </span>

        <h1
          className="font-outfit font-medium"
          style={{
            fontSize: 'clamp(32px, 6.6vw, 84px)',
            lineHeight: 1.02,
            color: '#f1ece4',
            letterSpacing: '-0.025em',
            textShadow: '0 2px 28px rgba(0,0,0,0.45)',
          }}
        >
          <span ref={leftRef} className="inline-block opacity-0">{c.title_left}</span>
          <span ref={rightRef} className="inline-block opacity-0">
            <span style={{ color: '#F97316' }}>{c.title_right}</span>{c.title_right_suffix}
          </span>
        </h1>

        <p
          ref={subRef}
          className="mt-6 sm:mt-7 mx-auto"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(15px, 2.4vw, 18px)',
            lineHeight: 1.6,
            color: 'rgba(241,236,228,0.92)',
            maxWidth: '620px',
            letterSpacing: '-0.01em',
            opacity: 0,
            textShadow: '0 1px 16px rgba(0,0,0,0.4)',
          }}
        >
          {c.subtitle_prefix}{' '}
          {rotateStarted ? (
            <WordRotate
              words={(c.rotating_words || []).map((w) => w.word).filter(Boolean)}
              className="font-medium"
              motionProps={{ style: { color: '#F97316' } }}
            />
          ) : (
            <span className="font-medium" style={{ color: '#F97316' }}>{c.rotating_words?.[0]?.word || ''}</span>
          )}
          {' '}{c.subtitle_suffix}
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto"
          style={{ opacity: 0 }}
        >
          <button
            onClick={() => { track('cta_click', { location: 'hero', label: c.primary_cta_label }); open('hero'); }}
            className="font-inter font-medium text-white transition-colors duration-200 w-full sm:w-auto"
            style={{ background: '#F97316', padding: '14px 32px', borderRadius: '9999px', fontSize: '15px' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#EA580C'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#F97316'; }}
          >
            {c.primary_cta_label}
          </button>
          <LiquidButton
            onClick={() => {
              const t = c.secondary_cta_target || '#process';
              if (t.startsWith('#')) scrollTo(t); else window.location.assign(t);
            }}
            className="font-inter font-medium w-full sm:w-auto"
            style={{ fontSize: '15px' }}
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
