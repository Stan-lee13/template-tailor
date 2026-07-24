import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import solutionImg from '../assets/sections/solution.jpg';

gsap.registerPlugin(ScrollTrigger);

type Benefit = { text: string; color: string };
type SolutionContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  benefits: Benefit[]; closer_prefix: string; closer_highlight: string;
};

export default function SolutionSection() {
  const c = useSectionContent<SolutionContent>('/', 'solution', 'solution');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgSrc = c.image && c.image.startsWith('/assets/') ? solutionImg : (c.image || solutionImg);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.solution-head', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.solution-media', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
      gsap.fromTo('.solution-card', { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
      gsap.fromTo('.solution-closer', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 40%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 12vh' }}>
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }} />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-10 lg:gap-14 items-center">
        <div className="solution-media relative rounded-2xl overflow-hidden order-2 lg:order-1" style={{ opacity: 0, aspectRatio: '4/3', boxShadow: '0 30px 80px rgba(0,212,255,0.08)' }}>
          <img src={imgSrc} alt="" loading="lazy" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05), transparent)' }} />
        </div>

        <div className="order-1 lg:order-2">
          <div className="solution-head mb-8 sm:mb-10" style={{ opacity: 0 }}>
            <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>
              {c.eyebrow}
            </span>
            <h2 className="font-outfit font-bold mb-4 sm:mb-5" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
              {c.headline}
            </h2>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '540px' }}>{c.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {(c.benefits || []).map((b, i) => (
              <div key={i} className="solution-card p-5 sm:p-6 rounded-2xl transition-all duration-400" style={{ opacity: 0, background: 'rgba(26,32,53,0.6)', border: '1px solid rgba(0,212,255,0.08)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,212,255,0.06)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.12)' }}>
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#00D4FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="font-inter" style={{ fontSize: 'clamp(13px, 1.9vw, 15px)', color: '#FFFFFF', lineHeight: 1.6 }}>{b.text}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="solution-closer font-inter font-medium mt-8 sm:mt-10" style={{ opacity: 0, fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#FFFFFF' }}>
            {c.closer_prefix} <span style={{ color: '#00D4FF' }}>{c.closer_highlight}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
