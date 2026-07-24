import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';

gsap.registerPlugin(ScrollTrigger);

type ProblemContent = {
  eyebrow: string; headline_1: string; headline_2: string; intro: string;
  pain_points: { text: string }[]; closer: string;
};

export default function ProblemSection() {
  const c = useSectionContent<ProblemContent>('/', 'problem', 'problem');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.problem-headline', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.problem-item', { opacity: 0, y: 30, scale: 0.95 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      });
      gsap.fromTo('.problem-closer', { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 40%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [c.pain_points?.length]);

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 12vh' }}>
      {/* Subtle cyan glow at top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent)' }} />

      <div className="max-w-[800px] mx-auto text-center">
        <div className="problem-headline" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>
            {c.eyebrow}
          </span>
          <h2 className="font-outfit font-bold mb-3 sm:mb-4" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            {c.headline_1}
          </h2>
          <h2 className="font-outfit font-bold mb-6 sm:mb-8" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#00D4FF' }}>{c.headline_2}</span>
          </h2>
          <p className="font-inter mb-10 sm:mb-12 mx-auto" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '560px' }}>
            {c.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {(c.pain_points || []).map((p, i) => (
            <div
              key={i}
              className="problem-item flex items-start gap-4 p-6 sm:p-7 rounded-2xl transition-all duration-400"
              style={{ opacity: 0, background: 'rgba(26,32,53,0.6)', border: '1px solid rgba(0,212,255,0.08)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.background = 'rgba(26,32,53,0.9)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,212,255,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'; e.currentTarget.style.background = 'rgba(26,32,53,0.6)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444', fontSize: '14px' }}>✕</span>
              <span className="font-inter" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{p.text}</span>
            </div>
          ))}
        </div>

        <p className="problem-closer font-inter font-medium mt-10 sm:mt-12" style={{ opacity: 0, fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#00D4FF', letterSpacing: '-0.01em' }}>
          {c.closer}
        </p>
      </div>
    </section>
  );
}
