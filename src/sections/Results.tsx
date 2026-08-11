import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import CountUp from '../components/motion/CountUp';
import StackCard from '../components/layout/StackCard';
import resultsVisual from '../assets/sections/results-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Outcome = { text: string; icon: string; color: string };
type ResultsContent = { eyebrow: string; headline: string; image?: string | null; outcomes: Outcome[]; closer: string };

const METRICS = [
  { value: 2.4, suffix: 'x', label: 'Repeat purchase rate', decimals: 1 },
  { value: 38, suffix: '%', label: 'Lift in customer LTV', decimals: 0 },
  { value: 41, suffix: '%', label: 'Reduction in churn', decimals: 0 },
];

/** 04 — The centerpiece. Light paper card, oversized brass numerals. */
export default function Results() {
  const c = useSectionContent<ResultsContent>('/', 'results', 'results');
  const ref = useRef<HTMLDivElement>(null);
  const outcomes = c.outcomes || [];

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.res-el', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });
      gsap.fromTo('.res-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: '.res-frame', start: 'top 88%' },
      });
      gsap.fromTo('.res-img', { yPercent: -8, scale: 1.14 }, {
        yPercent: 8, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: '.res-frame', start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.res-el', { opacity: 1, y: 0 });
      gsap.set('.res-frame', { clipPath: 'none' });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [outcomes.length] });

  return (
    <div ref={ref}>
      <StackCard id="results" index="04" label="The numbers" tone="paper" width="full">
        <div className="mb-14 grid grid-cols-1 gap-8 lg:grid-cols-[220px,1fr] lg:items-end">
          <span className="res-el inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--ink))]/50" style={{ opacity: 0 }}>
            <span className="h-px w-8 bg-[hsl(var(--brass))]" />
            {c.eyebrow}
          </span>
          <SplitHeadline
            text="We help brands grow sustainably."
            className="text-3xl leading-[1.02] text-[hsl(var(--ink))] lg:text-[4.5rem]"
          />
        </div>

        {/* Metric ledger */}
        <div className="mb-14 grid grid-cols-1 border-t border-[hsl(var(--ink))]/12 sm:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="res-el border-b border-[hsl(var(--ink))]/12 py-9 pr-8 sm:border-r sm:last:border-r-0" style={{ opacity: 0 }}>
              <div className="font-display text-6xl leading-none tracking-tight text-[hsl(var(--brass))] lg:text-7xl">
                <CountUp to={m.value} suffix={m.suffix} decimals={m.decimals} />
              </div>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.24em] text-[hsl(var(--ink))]/45">{m.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr,0.85fr] lg:gap-16">
          <div className="res-frame relative overflow-hidden rounded-[20px]">
            <div className="relative aspect-[16/10]">
              <img
                src={resultsVisual}
                alt="Team reviewing customer retention cohort charts"
                loading="lazy"
                width={1792}
                height={1024}
                className="res-img absolute inset-0 h-full w-full object-cover will-change-transform"
              />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <div className="space-y-px overflow-hidden rounded-[20px] border border-[hsl(var(--ink))]/12">
              {outcomes.map((item, i) => (
                <div
                  key={i}
                  className="res-el flex items-start gap-4 bg-[hsl(var(--ink))]/[0.03] px-6 py-6 transition-colors duration-300 hover:bg-[hsl(var(--brass))]/10"
                  style={{ opacity: 0 }}
                >
                  <span className="font-display text-xs text-[hsl(var(--brass))]">0{i + 1}</span>
                  <p className="text-base font-medium leading-snug text-[hsl(var(--ink))] lg:text-lg">{item.text}</p>
                </div>
              ))}
            </div>

            {c.closer && (
              <p className="res-el font-display text-2xl leading-snug text-[hsl(var(--ink))] lg:text-3xl" style={{ opacity: 0 }}>
                {c.closer}
              </p>
            )}
          </div>
        </div>
      </StackCard>
    </div>
  );
}
