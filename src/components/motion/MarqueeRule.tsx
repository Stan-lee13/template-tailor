import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Section hand-off: a hairline rule with a slow scroll-linked label strip.
 * Replaces the static divider so one section flows into the next.
 */
export default function MarqueeRule({ label, reverse = false }: { label: string; reverse?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const items = Array.from({ length: 8 });

  useGSAP(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    gsap.to('.mr-track', {
      xPercent: reverse ? 50 : -50,
      ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
    });
    gsap.fromTo('.mr-line', { scaleX: 0 }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'bottom 60%', scrub: true },
    });
  }, { scope: root });

  return (
    <div ref={root} className="relative overflow-hidden bg-[#0a0f1a] py-10" aria-hidden>
      <div className="mr-line h-px w-full origin-left bg-gradient-to-r from-transparent via-[#00D4FF]/40 to-transparent" />
      <div className="mt-6 overflow-hidden">
        <div className="mr-track flex w-[200%] gap-16 will-change-transform">
          {items.concat(items).map((_, i) => (
            <span key={i} className="whitespace-nowrap text-[11px] font-black uppercase tracking-[0.45em] text-white/15">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
