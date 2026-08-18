import { useEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type Step = { number: string; title: string; description: string; deliverables: string; accent: string };
type ProcessContent = { eyebrow: string; headline: string; image?: string | null; steps: Step[] };

export default function Process() {
  const c = useSectionContent<ProcessContent>('/', 'process', 'process');
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const defaultSteps = [
    { number: '01', title: 'Discovery & Retention Audit', description: 'We learn how your business currently acquires, serves and retains customers. Then we identify where customers are dropping off—and where the biggest loyalty opportunities exist.', deliverables: 'Revenue leak analysis, Customer journey mapping, Competitor benchmarking, 30-day action plan', accent: '#C56A4A' },
    { number: '02', title: 'Retention Strategy', description: 'We develop a tailored retention roadmap specific to your business. No cookie-cutter playbooks. Every recommendation is built around your customers, products and buying behaviour.', deliverables: 'Strategic roadmap, Performance benchmarks, Channel strategy, Segmentation plan', accent: '#D8A63D' },
    { number: '03', title: 'System Implementation', description: 'This is where strategy becomes execution. We build out email/SMS flows, automation, and loyalty systems that work together as one engine.', deliverables: 'Email & SMS flows, Customer journey automation, Loyalty programs, Referral systems', accent: '#F3EBDD' },
    { number: '04', title: 'Continuous Growth', description: 'Customer behaviour changes. Markets change. We continuously analyse performance and optimise campaigns to improve customer loyalty over time.', deliverables: 'A/B testing, Performance reporting, Strategy refinement, Revenue scaling', accent: '#D8A63D' },
  ];

  const steps = c.steps?.length > 0 ? c.steps : defaultSteps;
  const stageAccents = ['#C56A4A', '#D8A63D', '#F3EBDD', '#D8A63D'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: '.process-steps-container', start: 'top 60%', end: 'bottom 60%', scrub: true },
      });
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        gsap.fromTo(step, { opacity: 0, y: 28 }, {
          opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 82%', toggleActions: 'play none none reverse' },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden bg-[#fbfaf7] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="process-head process-object__head" style={{ opacity: 0 }}>
          <div>
            <span className="rf-object-eyebrow">{c.eyebrow}</span>
            <h2 className="process-title">Building Loyalty Isn&apos;t One Campaign. <span>It&apos;s A System.</span></h2>
          </div>
          <div className="process-object__stamp"><span>Operating sequence</span><strong>01 — 04</strong></div>
        </div>

        <div className="process-object">
          <div className="process-object__bar"><span>RETENTION FIRM / METHOD</span><span>FROM SIGNAL → SYSTEM → SCALE</span></div>
          <div className="process-steps-container relative">
            <div className="process-spine" aria-hidden="true" />
            <div ref={lineRef} className="process-spine process-spine--active" aria-hidden="true" />

            <div className="process-step-list">
              {steps.map((step, i) => (
                <article key={step.number} className={`process-step ${i % 2 === 0 ? 'process-step--left' : 'process-step--right'}`} style={{ opacity: 0 }}>
                  <div className="process-step__index" style={{ '--step-accent': stageAccents[i % stageAccents.length] } as CSSProperties}>
                    <span>{step.number}</span>
                  </div>
                  <div className="process-step__copy">
                    <span className="process-step__phase">Stage {step.number}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                  <div className="process-step__deliverables">
                    <div className="process-step__deliverables-head"><span>Key Deliverables</span><span aria-hidden="true">↗</span></div>
                    <div className="process-step__deliverables-list">
                      {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                        <span key={d}>{d}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
