import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionCTA from '../components/SectionCTA';

gsap.registerPlugin(ScrollTrigger);

export default function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.solution-head', { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.solution-card', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.solution-grid', start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="solution" className="relative overflow-hidden bg-[#050505] px-6 py-20 lg:px-20 lg:py-28">
      <div className="absolute bottom-0 right-1/4 h-[34rem] w-[34rem] rounded-full bg-[#C56A4A]/8 blur-[140px] pointer-events-none" />

      <div className="max-w-[1300px] mx-auto">
        <div className="solution-open-layout" style={{ opacity: 1 }}>
          <div className="solution-head max-w-[1050px] mx-auto" style={{ opacity: 0 }}>
              <h2 className="solution-title">Customer <span>Loyalty Is Our Business</span></h2>
              <p className="solution-description">
                Everything we do is built around one goal: Creating customers who buy more often, stay longer and recommend your brand to others.
              </p>

              <div className="solution-grid">
                {[
                  'Retention Systems, Not Random Marketing',
                  'Built Around Your Customers Journey',
                  'Focused On Business Metrics',
                ].map((text, i) => (
                  <div key={i} className="solution-card" style={{ opacity: 0 }}>
                    <span className={`solution-card__index solution-card__index--${i === 1 ? 'ochre' : i === 2 ? 'terracotta' : 'milk'}`}>0{i + 1}</span>
                    <span>{text}</span>
                    <span className="solution-card__arrow" aria-hidden="true">↗</span>
                  </div>
                ))}
              </div>

            <div className="solution-metric">
              <p>We care about the numbers that actually grow businesses: <span>Repeat Purchase Rate, LTV, and Churn Reduction.</span></p>
            </div>
            <SectionCTA location="solution" variant="solution" />
          </div>
        </div>
      </div>
    </section>
  );
}
