import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import processVisual from '../assets/sections/process-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Step = { number: string; title: string; description: string; deliverables: string; accent: string };
type ProcessContent = { eyebrow: string; headline: string; image?: string | null; steps: Step[] };

const defaultSteps: Step[] = [
  { number: '01', title: 'Discovery & Retention Audit', description: 'We learn how your business currently acquires, serves and retains customers. Then we identify where customers are dropping off—and where the biggest loyalty opportunities exist.', deliverables: 'Revenue leak analysis, Customer journey mapping, Competitor benchmarking, 30-day action plan', accent: '#00D4FF' },
  { number: '02', title: 'Retention Strategy', description: 'We develop a tailored retention roadmap specific to your business. No cookie-cutter playbooks. Every recommendation is built around your customers, products and buying behaviour.', deliverables: 'Strategic roadmap, Performance benchmarks, Channel strategy, Segmentation plan', accent: '#2C91E1' },
  { number: '03', title: 'System Implementation', description: 'This is where strategy becomes execution. We build out email/SMS flows, automation, and loyalty systems that work together as one engine.', deliverables: 'Email & SMS flows, Customer journey automation, Loyalty programs, Referral systems', accent: '#10B981' },
  { number: '04', title: 'Continuous Growth', description: 'Customer behaviour changes. Markets change. We continuously analyse performance and optimise campaigns to improve customer loyalty over time.', deliverables: 'A/B testing, Performance reporting, Strategy refinement, Revenue scaling', accent: '#F59E0B' },
];

/** Layout rhythm: sticky IMAGE RAIL LEFT — stepped timeline RIGHT */
export default function Process() {
  const c = useSectionContent<ProcessContent>('/', 'process', 'process');
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const steps = c.steps?.length > 0 ? c.steps : defaultSteps;

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.proc-fade', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
      });

      gsap.fromTo('.proc-rail', { opacity: 0, x: -50, rotateY: 10, clipPath: 'inset(0% 0% 100% 0%)' }, {
        opacity: 1, x: 0, rotateY: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });

      gsap.fromTo('.proc-rail-img', { yPercent: -8, scale: 1.15 }, {
        yPercent: 8, scale: 1.02, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });

      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.process-steps-container', start: 'top 65%', end: 'bottom 65%', scrub: true },
      });

      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step, i) => {
        gsap.fromTo(step,
          { opacity: 0, y: 70, rotateX: -10, transformOrigin: 'top center' },
          {
            opacity: 1, y: 0, rotateX: 0, duration: 1.1, ease: 'expo.out', delay: (i % 2) * 0.05,
            scrollTrigger: { trigger: step, start: 'top 88%' },
          }
        );
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.proc-fade, .process-step, .proc-rail', { opacity: 1, y: 0, x: 0, rotateX: 0, clipPath: 'none' });
    });

    return () => mm.revert();
  }, { scope: sectionRef, dependencies: [steps.length] });

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-36 px-6 lg:px-20">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[600px] w-[600px] rounded-full bg-[#00D4FF]/[0.07] blur-[160px]" />

      <div className="relative mx-auto max-w-[1400px] grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,380px),1fr] lg:gap-24">
        {/* Sticky image rail */}
        <div className="lg:sticky lg:top-28 lg:self-start" style={{ perspective: 1400 }}>
          <div className="proc-rail relative overflow-hidden rounded-[2rem] border border-white/10 aspect-[4/5] will-change-transform" style={{ opacity: 0 }}>
            <img src={processVisual} alt="Retention roadmap strategy session" loading="lazy" className="proc-rail-img absolute inset-0 h-full w-full object-cover will-change-transform" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-gradient-to-br from-[#00D4FF]/25 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-block rounded-full border border-white/10 bg-[#0d1626]/90 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur">
                Four phases, one engine
              </span>
            </div>
          </div>

          <div className="proc-fade mt-10" style={{ opacity: 0 }}>
            <span className="mb-6 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#00D4FF]">
              <span className="h-px w-8 bg-[#00D4FF]/50" />
              {c.eyebrow}
            </span>
            <SplitHeadline
              text="Loyalty Isn't One Campaign. It's A System."
              highlightFrom={3}
              className="text-3xl font-bold leading-[0.95] tracking-tighter text-white lg:text-5xl"
            />
          </div>
        </div>

        {/* Stepped timeline */}
        <div className="process-steps-container relative pl-8 lg:pl-14" style={{ perspective: 1200 }}>
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
          <div ref={lineRef} className="absolute left-0 top-0 bottom-0 w-px origin-top bg-gradient-to-b from-[#00D4FF] to-[#0082FF]" />

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`process-step relative will-change-transform ${i % 2 === 1 ? 'lg:ml-16' : ''}`}
                style={{ opacity: 0 }}
              >
                <div className="absolute -left-8 top-3 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#00D4FF] bg-[#0a0f1a] shadow-[0_0_18px_rgba(0,212,255,0.5)] lg:-left-14" />

                <div className="mb-5 flex items-baseline gap-5">
                  <span className="text-5xl font-black leading-none tracking-tighter text-white/[0.09] lg:text-7xl">{step.number}</span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <h3 className="mb-5 text-2xl font-bold tracking-tight text-white lg:text-4xl">{step.title}</h3>
                <p className="mb-8 max-w-xl text-lg leading-relaxed text-white/50">{step.description}</p>

                <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-7 transition-colors duration-500 hover:border-[#00D4FF]/30">
                  <h4 className="mb-6 text-[10px] font-black uppercase tracking-[0.25em] text-[#00D4FF]">Key deliverables</h4>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                      <div key={d} className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#00D4FF] opacity-50" />
                        <span className="font-medium text-white/70">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
