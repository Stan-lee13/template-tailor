import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import { useSectionContent } from '../hooks/useSectionContent';
import StackCard from '../components/layout/StackCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FinalCTAContent = { headline_1: string; headline_2: string; body: string; kicker: string; cta_label: string };

export default function FinalCTA() {
  const c = useSectionContent<FinalCTAContent>('/', 'final_cta', 'final_cta');
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const { open } = useBooking();

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.cta-el', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      });
      gsap.to('.cta-sweep', {
        xPercent: 40, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(hover: hover) and (prefers-reduced-motion: no-preference)', () => {
      const btn = btnRef.current;
      if (!btn) return;
      const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
      const move = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const reset = () => { xTo(0); yTo(0); };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', reset);
      return () => { btn.removeEventListener('mousemove', move); btn.removeEventListener('mouseleave', reset); };
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.cta-el', { opacity: 1, y: 0 });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref}>
      <StackCard id="cta" index="08" label="Start here" tone="raised" width="full" className="lg:py-32">
        <div
          className="cta-sweep pointer-events-none absolute -inset-x-1/3 top-0 h-full opacity-60"
          style={{ background: 'radial-gradient(60% 60% at 40% 40%, hsl(var(--brass)/0.18), transparent 70%)' }}
        />
        <div className="relative mx-auto max-w-[820px] text-center">
          <span className="cta-el eyebrow mb-8" style={{ opacity: 0 }}>{c.kicker || 'Ready to scale?'}</span>

          <h2 className="cta-el text-4xl leading-[1.02] text-foreground lg:text-7xl" style={{ opacity: 0 }}>
            {c.headline_1 || 'Build a brand'}{' '}
            <span className="text-brass">{c.headline_2 || 'customers come back to.'}</span>
          </h2>

          <p className="cta-el mx-auto mt-8 max-w-xl text-lg leading-relaxed text-foreground/60 lg:text-xl" style={{ opacity: 0 }}>
            {c.body}
          </p>

          <div className="cta-el mt-12" style={{ opacity: 0 }}>
            <button
              ref={btnRef}
              onClick={() => { track('cta_click', { location: 'final_cta', label: c.cta_label }); open('final_cta'); }}
              className="btn-brass text-base"
            >
              {c.cta_label || 'Book your intro call'}
            </button>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
