import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import solutionVisual from '../assets/solution-editorial.webp';
import RetentionLoop3D from '../components/RetentionLoop3D';

gsap.registerPlugin(ScrollTrigger);

type Benefit = { text: string; color: string };
type SolutionContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  benefits: Benefit[]; closer_prefix: string; closer_highlight: string;
};

export default function SolutionSection() {
  const c = useSectionContent<SolutionContent>('/', 'solution', 'solution');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.solution-head', { opacity: 0, x: 50 }, {
        opacity: 1, x: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.solution-loop-slot', { opacity: 0, scale: 1.05, x: -40 }, {
        opacity: 1, scale: 1, x: 0, duration: 1.3, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
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
        <div className="solution-object" style={{ opacity: 1 }}>
          <div className="solution-object__bar">
            <span>THE RETENTION ENGINE</span>
            <span>01 / 03 — SYSTEM LOGIC</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.02fr,0.98fr] gap-10 lg:gap-16 items-center">
            <div className="solution-loop-slot" style={{ opacity: 0 }}>
              <div className="solution-loop-meta"><span>Live system</span><span>Return / 01</span></div>
              <RetentionLoop3D fallbackSrc={solutionVisual} alt="A connected customer retention loop linking commerce touchpoints, post-purchase messaging, loyalty, and returning orders" />
              <div className="solution-loop-caption"><span>Retention infrastructure</span><span aria-hidden="true">↗</span></div>
            </div>

            <div className="solution-head" style={{ opacity: 0 }}>
              <span className="rf-object-eyebrow">{c.eyebrow}</span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
