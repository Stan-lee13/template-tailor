import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import processImg from '../assets/sections/process.jpg';

gsap.registerPlugin(ScrollTrigger);

type Step = { number: string; title: string; description: string; deliverables: string; accent: string };
type ProcessContent = { eyebrow: string; headline: string; image?: string | null; steps: Step[] };

export default function Process() {
  const c = useSectionContent<ProcessContent>('/', 'process', 'process');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgSrc = c.image && c.image.startsWith('/assets/') ? processImg : (c.image || processImg);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-head', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.process-step', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.7, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden" style={{ background: '#0A0A0A', padding: '12vh clamp(20px, 5vw, 80px) 14vh' }}>
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src={imgSrc} alt="" loading="lazy" width={1600} height={912} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.22 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,10,10,0.7), rgba(4,33,63,0.85))' }} />
      </div>

      <div className="relative max-w-[900px] mx-auto">
        <div className="process-head mb-12 sm:mb-16 md:mb-20" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: 'rgba(239,239,244,0.6)', letterSpacing: '0.04em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-medium" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.95, color: '#f1ece4', letterSpacing: '-0.02em' }}>{c.headline}</h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, rgba(249,115,22,0.3), rgba(44,145,225,0.3), rgba(16,185,129,0.3))' }} />
          <div className="flex flex-col gap-8 sm:gap-12 md:gap-16">
            {(c.steps || []).map((step) => (
              <div key={step.number} className="process-step relative md:pl-12" style={{ opacity: 0 }}>
                <div className="hidden md:block absolute left-0 top-0 w-[3px] rounded-full" style={{ height: '48px', background: step.accent, marginLeft: '-1px' }} />
                <div className="p-5 sm:p-7 md:p-9 rounded-xl transition-colors duration-300" style={{ background: 'rgba(255,255,255,0.04)', borderLeft: `2px solid ${step.accent}40`, border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
                  <div className="flex items-baseline gap-3 sm:gap-4 mb-2 sm:mb-3">
                    <span className="font-inter font-medium" style={{ fontSize: '13px', color: step.accent, opacity: 0.9 }}>{step.number}</span>
                    <h3 className="font-outfit font-medium" style={{ fontSize: 'clamp(20px, 3vw, 24px)', color: '#f1ece4', letterSpacing: '-0.01em' }}>{step.title}</h3>
                  </div>
                  <p className="font-inter mb-4 sm:mb-5" style={{ fontSize: 'clamp(14px, 2vw, 15px)', lineHeight: 1.65, color: 'rgba(241,236,228,0.7)' }}>{step.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: step.accent, opacity: 0.6 }} />
                        <span className="font-inter" style={{ fontSize: '13px', color: 'rgba(241,236,228,0.55)' }}>{d}</span>
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
