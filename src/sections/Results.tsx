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
        opacity: 1, y: 0, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.result-card', { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.results-grid', start: 'top 75%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="results" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="absolute inset-0 pointer-events-none opacity-[0.08]">
        <img src={resultsVisual} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative max-w-[1300px] mx-auto">
        <div className="results-object" style={{ opacity: 1 }}>
          <div className="results-head results-object__head" style={{ opacity: 0 }}>
            <div>
              <span className="rf-object-eyebrow">{c.eyebrow}</span>
              <h2>We Help Brands <span>Grow Sustainably</span></h2>
            </div>
            <div className="results-object__stamp"><span>Observed outcomes</span><strong>04 / 05</strong></div>
          </div>

          <div className="results-grid">
            {(c.outcomes || []).map((item, i) => (
              <div
                key={i}
                className={`result-card result-card--${i === 0 ? 'wide' : i % 2 === 0 ? 'ochre' : 'milk'}`}
                style={{ opacity: 0 }}
              >
                <div className="result-card__top">
                  <span className="result-card__index">0{i + 1}</span>
                  <span className="result-card__icon" aria-hidden="true">{item.icon}</span>
                </div>
                <p>{item.text}</p>
                <span className="result-card__signal" aria-hidden="true">↗</span>
              </div>
            ))}
          </div>

          <div className="results-object__footer">
            <span aria-hidden="true">→</span>
            <p>{c.closer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
