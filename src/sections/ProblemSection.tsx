import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import StackCard from '../components/layout/StackCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ProblemContent = {
  eyebrow: string; headline_1: string; headline_2: string; intro: string;
  pain_points: { text: string }[]; closer: string;
};

/** 03 — The leak. Light paper card: each row's bar drains as it enters view. */
export default function ProblemSection() {
  const c = useSectionContent<ProblemContent>('/', 'problem', 'problem');
  const ref = useRef<HTMLDivElement>(null);
  const points = c.pain_points?.length ? c.pain_points.map((p) => p.text) : [];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.leak-row', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: 'top 76%' },
      });
      gsap.fromTo('.leak-bar', { scaleX: 1 }, {
        scaleX: (i: number) => 0.72 - i * 0.16,
        duration: 1.4, ease: 'expo.out', stagger: 0.09,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      });
      gsap.fromTo('.leak-copy', { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.leak-row, .leak-copy', { opacity: 1, y: 0 });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [points.length] });

  return (
    <div ref={ref}>
      <StackCard id="problem" index="01" label="The leak" tone="paper" width="full">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr,1.1fr] lg:gap-24">
          <div>
            <span className="leak-copy mb-6 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--ink))]/50" style={{ opacity: 0 }}>
              <span className="h-px w-10 bg-[hsl(var(--brass))]" />
              {c.eyebrow}
            </span>
            <SplitHeadline
              text="Every brand pays to win customers. Almost none pay to keep them."
              className="mb-8 max-w-[16ch] text-3xl leading-[1.02] text-[hsl(var(--ink))] lg:text-6xl"
            />
            <p className="leak-copy max-w-md text-lg leading-relaxed text-[hsl(var(--ink))]/65" style={{ opacity: 0 }}>
              {c.intro}
            </p>
          </div>

          <div>
            <p className="leak-copy mb-8 text-[10px] font-bold uppercase tracking-[0.32em] text-[hsl(var(--ink))]/40" style={{ opacity: 0 }}>
              The usual growth loop
            </p>
            <div className="space-y-7">
              {points.map((text, i) => (
                <div key={i} className="leak-row" style={{ opacity: 0 }}>
                  <div className="mb-3 flex items-baseline justify-between gap-6">
                    <span className="font-display text-xl text-[hsl(var(--ink))] lg:text-2xl">{text}</span>
                    <span className="font-display text-sm text-[hsl(var(--ink))]/35">0{i + 1}</span>
                  </div>
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-[hsl(var(--ink))]/8">
                    <div
                      className="leak-bar h-full origin-left rounded-full"
                      style={{ background: 'linear-gradient(90deg, hsl(var(--brass)), hsl(var(--brass)/0.35))' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <p className="leak-copy mt-12 border-t border-[hsl(var(--ink))]/12 pt-8 text-xl leading-snug text-[hsl(var(--ink))] lg:text-2xl" style={{ opacity: 0 }}>
              {c.closer}
            </p>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
