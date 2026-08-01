import { useEffect, useRef } from 'react';
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
    { number: '01', title: 'Discovery & Retention Audit', description: 'We learn how your business currently acquires, serves and retains customers. Then we identify where customers are dropping off—and where the biggest loyalty opportunities exist.', deliverables: 'Revenue leak analysis, Customer journey mapping, Competitor benchmarking, 30-day action plan', accent: '#00D4FF' },
    { number: '02', title: 'Retention Strategy', description: 'We develop a tailored retention roadmap specific to your business. No cookie-cutter playbooks. Every recommendation is built around your customers, products and buying behaviour.', deliverables: 'Strategic roadmap, Performance benchmarks, Channel strategy, Segmentation plan', accent: '#2C91E1' },
    { number: '03', title: 'System Implementation', description: 'This is where strategy becomes execution. We build out email/SMS flows, automation, and loyalty systems that work together as one engine.', deliverables: 'Email & SMS flows, Customer journey automation, Loyalty programs, Referral systems', accent: '#10B981' },
    { number: '04', title: 'Continuous Growth', description: 'Customer behaviour changes. Markets change. We continuously analyse performance and optimise campaigns to improve customer loyalty over time.', deliverables: 'A/B testing, Performance reporting, Strategy refinement, Revenue scaling', accent: '#F59E0B' },
  ];

  const steps = c.steps?.length > 0 ? c.steps : defaultSteps;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.fromTo('.process-head', { opacity: 0, y: 50 }, { 
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } 
      });

      // Progress line animation
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-steps-container',
          start: 'top 60%',
          end: 'bottom 60%',
          scrub: true,
        }
      });

      // Steps animation
      gsap.utils.toArray<HTMLElement>('.process-step').forEach((step) => {
        gsap.fromTo(step, { opacity: 0, x: 50 }, {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [steps.length]);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-32 px-6 lg:px-20">
      <div className="max-w-[1100px] mx-auto">
        <div className="process-head mb-20 lg:mb-32 text-center" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
          <h2 className="text-3xl lg:text-7xl font-bold text-white mb-6 tracking-tighter">
            Building Loyalty Isn't One Campaign. <span className="text-gradient-cyan">It's A System.</span>
          </h2>
        </div>

        <div className="process-steps-container relative">
          {/* Central Progress Line */}
          <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2" />
          <div 
            ref={lineRef}
            className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00D4FF] to-[#0082FF] -translate-x-1/2 origin-top"
          />

          <div className="space-y-24 lg:space-y-32">
            {steps.map((step, i) => (
              <div 
                key={step.number} 
                className={`process-step flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-24 relative`}
                style={{ opacity: 0 }}
              >
                {/* Connector Dot */}
                <div className="absolute left-0 lg:left-1/2 top-0 w-4 h-4 rounded-full bg-black border-2 border-[#00D4FF] -translate-x-1/2 shadow-[0_0_15px_rgba(0,212,255,0.5)] z-10" />
                
                <div className={`w-full lg:w-1/2 ${i % 2 === 0 ? 'lg:text-right' : 'lg:text-left'} pl-8 lg:pl-0`}>
                  <span className="text-6xl lg:text-8xl font-black text-white/5 font-outfit block mb-4">
                    {step.number}
                  </span>
                  <h3 className="text-2xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                    {step.title}
                  </h3>
                  <p className={`text-lg text-white/50 leading-relaxed max-w-md ${i % 2 === 0 ? 'lg:ml-auto' : ''}`}>
                    {step.description}
                  </p>
                </div>

                <div className="w-full lg:w-1/2 pl-8 lg:pl-0">
                  <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group hover:border-[#00D4FF]/30 transition-all duration-500">
                    <h4 className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-6">Key Deliverables</h4>
                    <div className="grid grid-cols-1 gap-4">
                      {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                        <div key={d} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] opacity-40" />
                          <span className="text-white/70 font-medium">{d}</span>
                        </div>
                      ))}
                    </div>
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
