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
      gsap.fromTo('.process-head', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.process-step', { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 14vh' }}>
      {/* Subtle backdrop image */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src={imgSrc} alt="" loading="lazy" width={1600} height={912} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.15 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.95))' }} />
      </div>

      <div className="relative max-w-[900px] mx-auto">
        <div className="process-head mb-12 sm:mb-16 md:mb-20" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-bold" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>{c.headline}</h2>
        </div>

        <div className="relative">
          {/* Vertical line - cyan */}
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.4), rgba(0,212,255,0.1), transparent)' }} />
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-14">
            {(c.steps || []).map((step) => (
              <div key={step.number} className="process-step relative md:pl-14" style={{ opacity: 0 }}>
                {/* Step indicator dot */}
                <div className="hidden md:block absolute left-[-5px] top-1 w-[12px] h-[12px] rounded-full" style={{ background: '#00D4FF', boxShadow: '0 0 16px rgba(0,212,255,0.4)' }} />
                <div className="p-6 sm:p-7 md:p-9 rounded-2xl transition-all duration-400" style={{ background: 'rgba(26,32,53,0.5)', border: '1px solid rgba(0,212,255,0.08)', backdropFilter: 'blur(8px)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div className="flex items-baseline gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="font-inter font-bold" style={{ fontSize: '14px', color: '#00D4FF' }}>{step.number}</span>
                    <h3 className="font-outfit font-bold" style={{ fontSize: 'clamp(20px, 3vw, 24px)', color: '#FFFFFF', letterSpacing: '-0.02em' }}>{step.title}</h3>
                  </div>
                  <p className="font-inter mb-5 sm:mb-6" style={{ fontSize: 'clamp(14px, 2vw, 15px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>{step.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {(step.deliverables || '').split(',').map((d) => d.trim()).filter(Boolean).map((d) => (
                      <div key={d} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#00D4FF', opacity: 0.5 }} />
                        <span className="font-inter" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{d}</span>
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
