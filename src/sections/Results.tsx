import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import resultsVisual from '../assets/results-visual.png';

gsap.registerPlugin(ScrollTrigger);

type Outcome = { text: string; icon: string; color: string };
type ResultsContent = { eyebrow: string; headline: string; image?: string | null; outcomes: Outcome[]; closer: string };

export default function Results() {
  const c = useSectionContent<ResultsContent>('/', 'results', 'results');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.results-head', { opacity: 0, y: 50 }, { 
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } 
      });
      gsap.fromTo('.result-card', { opacity: 0, scale: 0.9, y: 30 }, { 
        opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', 
        scrollTrigger: { trigger: '.results-grid', start: 'top 70%' } 
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="results" className="relative overflow-hidden bg-black py-24 lg:py-32 px-6 lg:px-20">
      {/* Background image with subtle parallax */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src={resultsVisual} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative max-w-[1300px] mx-auto">
        <div className="results-head text-center mb-16 lg:mb-24" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-7xl font-bold text-white mb-6 tracking-tighter">
            {c.headline}
          </h2>
        </div>

        <div className="results-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {(c.outcomes || []).map((item, i) => (
            <div 
              key={i} 
              className={`result-card group relative p-8 lg:p-10 rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#00D4FF]/40 transition-all duration-700 overflow-hidden ${i === 0 ? 'lg:col-span-2' : ''}`}
              style={{ opacity: 0 }}
            >
              <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                {item.icon}
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#00D4FF]/10 flex items-center justify-center text-2xl mb-8 group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <p className="text-xl lg:text-2xl font-bold text-white leading-snug group-hover:text-[#00D4FF] transition-colors duration-500">
                  {item.text}
                </p>
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#00D4FF]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>
          ))}
        </div>

        <div className="mt-16 lg:mt-24 text-center">
          <p className="text-2xl lg:text-3xl font-bold text-white/90 tracking-tight">
            → <span className="text-gradient-cyan">{c.closer}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
