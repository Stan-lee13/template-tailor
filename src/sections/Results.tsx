import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import resultsImg from '../assets/sections/results.jpg';

gsap.registerPlugin(ScrollTrigger);

type Outcome = { text: string; icon: string; color: string };
type ResultsContent = { eyebrow: string; headline: string; image?: string | null; outcomes: Outcome[]; closer: string };

export default function Results() {
  const c = useSectionContent<ResultsContent>('/', 'results', 'results');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgSrc = c.image && c.image.startsWith('/assets/') ? resultsImg : (c.image || resultsImg);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.results-head', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.result-item', { opacity: 0, y: 30, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 55%' } });
      gsap.fromTo('.result-closer', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 40%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="results" className="relative overflow-hidden" style={{ background: '#000000', padding: '14vh clamp(24px, 5vw, 80px)' }}>
      {/* Editorial image backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src={imgSrc} alt="" loading="lazy" width={1600} height={1008} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.06 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.98))' }} />
      </div>

      <div className="relative max-w-[1000px] mx-auto text-center">
        <div className="results-head mb-10 sm:mb-16" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-bold mb-0" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>{c.headline}</h2>
        </div>

        <div className="flex flex-col gap-4 sm:gap-5 max-w-[700px] mx-auto">
          {(c.outcomes || []).map((item, i) => (
            <div key={i} className="result-item flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-400"
              style={{ opacity: 0, background: 'rgba(26,32,53,0.6)', border: '1px solid rgba(0,212,255,0.08)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#00D4FF'; e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,212,255,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.08)'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-outfit font-bold" style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF', fontSize: '15px' }}>{item.icon}</span>
              <span className="font-inter font-medium" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#FFFFFF' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p className="result-closer text-center font-inter font-medium mt-10 sm:mt-12" style={{ opacity: 0, fontSize: 'clamp(16px, 2.5vw, 18px)', color: '#00D4FF' }}>{c.closer}</p>
      </div>
    </section>
  );
}
