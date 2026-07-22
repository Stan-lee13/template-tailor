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
      gsap.fromTo('.results-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.result-item', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="results" className="relative overflow-hidden" style={{ background: '#f1ece4', padding: '12vh clamp(24px, 5vw, 80px)' }}>
      {/* Editorial image backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <img src={imgSrc} alt="" loading="lazy" width={1600} height={1008} className="absolute inset-0 w-full h-full object-cover" style={{ opacity: 0.08 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(241,236,228,0.85), rgba(241,236,228,0.98))' }} />
      </div>

      <div className="relative max-w-[1000px] mx-auto">
        <div className="results-head text-center mb-10 sm:mb-16" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>{c.eyebrow}</span>
          <h2 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>{c.headline}</h2>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 max-w-[700px] mx-auto">
          {(c.outcomes || []).map((item, i) => (
            <div key={i} className="result-item flex items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl transition-all duration-300"
              style={{ opacity: 0, background: '#FFFFFF', border: '1px solid #D6D3CC' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = item.color + '40'; e.currentTarget.style.transform = 'translateX(8px)'; e.currentTarget.style.boxShadow = `0 4px 20px ${item.color}12`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#D6D3CC'; e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <span className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-outfit font-bold" style={{ background: item.color + '10', color: item.color, fontSize: '15px' }}>{item.icon}</span>
              <span className="font-inter font-medium" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#0A0A0A' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-center font-inter font-medium mt-10 sm:mt-12" style={{ fontSize: 'clamp(16px, 2.5vw, 18px)', color: '#F97316' }}>{c.closer}</p>
      </div>
    </section>
  );
}
