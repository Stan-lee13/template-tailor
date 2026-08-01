import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import solutionVisual from '../assets/solution-visual.png';

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
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } 
      });
      gsap.fromTo('.solution-media', { opacity: 0, scale: 1.1, x: -50 }, { 
        opacity: 1, scale: 1, x: 0, duration: 1.5, ease: 'expo.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } 
      });
      gsap.fromTo('.solution-card', { opacity: 0, y: 30 }, { 
        opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', 
        scrollTrigger: { trigger: '.solution-grid', start: 'top 80%' } 
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="solution" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-32 px-6 lg:px-20">
      {/* Background radial gradient for depth */}
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#00D4FF]/10 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-16 lg:gap-24 items-center">
        <div className="solution-media relative group" style={{ opacity: 0 }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-[#00D4FF] to-[#0082FF] rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
          <div className="relative rounded-[2rem] overflow-hidden border border-white/10 aspect-square lg:aspect-[4/5]">
            <img src={solutionVisual} alt="The Engine" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        <div className="solution-head" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
          <h2 className="text-3xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
            Customer <span className="text-gradient-cyan">Loyalty Is Our Business</span>
          </h2>
          <p className="text-lg lg:text-xl text-white/60 mb-12 leading-relaxed max-w-xl">
            Everything we do is built around one goal: Creating customers who buy more often, stay longer and recommend your brand to others.
          </p>

          <div className="solution-grid grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            {[
              "Retention Systems, Not Random Marketing",
              "Built Around Your Customers Journey",
              "Focused On Business Metrics"
            ].map((text, i) => (
              <div key={i} className="solution-card flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00D4FF]/30 transition-all duration-500" style={{ opacity: 0 }}>
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-white/90 font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/10">
            <p className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              We care about the numbers that actually grow businesses: <span className="text-gradient-cyan">Repeat Purchase Rate, LTV, and Churn Reduction.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
