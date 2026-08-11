import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import StackCard from '../components/layout/StackCard';
import processVisual from '../assets/sections/process-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Step = { number: string; title: string; description: string; deliverables: string; accent: string };
type ProcessContent = { eyebrow: string; headline: string; image?: string | null; steps: Step[] };

const defaultSteps: Step[] = [
  { number: '01', title: 'Discovery & Retention Audit', description: 'We learn how your business currently acquires, serves and retains customers — then identify where customers drop off and where the biggest loyalty opportunities exist.', deliverables: 'Revenue leak analysis, Customer journey mapping, Competitor benchmarking, 30-day action plan', accent: '' },
  { number: '02', title: 'Retention Strategy', description: 'A tailored retention roadmap specific to your business. No cookie-cutter playbooks — every recommendation is built around your customers, products and buying behaviour.', deliverables: 'Strategic roadmap, Performance benchmarks, Channel strategy, Segmentation plan', accent: '' },
  { number: '03', title: 'System Implementation', description: 'Strategy becomes execution. We build email/SMS flows, automation and loyalty systems that work together as one engine.', deliverables: 'Email & SMS flows, Customer journey automation, Loyalty programs, Referral systems', accent: '' },
  { number: '04', title: 'Continuous Growth', description: 'Customer behaviour changes. We continuously analyse performance and refine campaigns so loyalty compounds over time.', deliverables: 'A/B testing, Performance reporting, Strategy refinement, Revenue scaling', accent: '' },
];

/** 06 — Sticky brass timeline; steps dock onto the ledger one by one. */
export default function Process() {
  const c = useSectionContent<ProcessContent>('/', 'process', 'process');
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const steps = c.steps?.length ? c.steps : defaultSteps;

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.proc-el', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
      gsap.fromTo('.proc-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      });
      gsap.fromTo('.proc-img', { yPercent: -6, scale: 1.12 }, {
        yPercent: 6, scale: 1.03, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.proc-steps', start: 'top 70%', end: 'bottom 70%', scrub: true },
      });
      gsap.utils.toArray<HTMLElement>('.proc-step').forEach((step) => {
        gsap.fromTo(step, { opacity: 0, y: 44 }, {
          opacity: 1, y: 0, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: step, start: 'top 88%' },
        });
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.proc-el, .proc-step', { opacity: 1, y: 0 });
      gsap.set('.proc-frame', { clipPath: 'none' });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [steps.length] });

  return (
    <div ref={ref}>
      <StackCard id="process" index="06" label="The work" tone="ink" width="full">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,360px),1fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="proc-frame relative overflow-hidden rounded-[22px] border border-border lg:rounded-[28px]">
              <div className="relative aspect-[4/5]">
                <img
                  src={processVisual}
                  alt="Strategy session reviewing a retention roadmap"
                  loading="lazy"
                  width={1280}
                  height={1600}
                  className="proc-img absolute inset-0 h-full w-full object-cover will-change-transform"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink))] via-transparent to-transparent" />
              </div>
              <span className="absolute bottom-6 left-6 rounded-full border border-primary/40 bg-[hsl(var(--ink))]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-primary">
                Four phases, one engine
              </span>
            </div>

            <div className="mt-10">
              <span className="proc-el eyebrow mb-5" style={{ opacity: 0 }}>
                <span className="h-px w-8 bg-primary" />
                {c.eyebrow}
              </span>
              <SplitHeadline
                text="Loyalty isn't one campaign. It's a system."
                className="text-2xl leading-[1.05] text-foreground lg:text-4xl"
              />
            </div>
          </div>

          <div className="proc-steps relative pl-8 lg:pl-14">
            <div className="absolute bottom-0 left-0 top-0 w-px bg-foreground/10" />
            <div ref={lineRef} className="absolute bottom-0 left-0 top-0 w-px origin-top bg-primary" />

            <div className="space-y-14 lg:space-y-20">
              {steps.map((step, i) => (
                <div key={step.number || i} className="proc-step relative" style={{ opacity: 0 }}>
                  <div className="absolute -left-8 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-[hsl(var(--ink))] lg:-left-14" />

                  <span className="font-display text-sm tracking-[0.2em] text-primary">{step.number}</span>
                  <h3 className="mb-4 mt-3 text-2xl leading-tight text-foreground lg:text-4xl">{step.title}</h3>
                  <p className="mb-7 max-w-xl text-lg leading-relaxed text-foreground/55">{step.description}</p>

                  <div className="rounded-[20px] border border-border bg-[hsl(var(--ink-raised))] p-6">
                    <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">Key deliverables</h4>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                        <div key={d} className="flex items-center gap-3">
                          <span className="h-1 w-1 rounded-full bg-primary" />
                          <span className="text-sm font-medium text-foreground/70">{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
