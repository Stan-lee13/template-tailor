import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import diffVisual from '../assets/differentiation-visual.png';

gsap.registerPlugin(ScrollTrigger);

type Item = { text: string };
type DiffContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  dont_focus: Item[]; do_focus: Item[]; closer: string;
};

export default function DifferentiationSection() {
  const c = useSectionContent<DiffContent>('/', 'differentiation', 'differentiation');
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.diff-content', { opacity: 0, y: 60 }, { 
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } 
      });
      gsap.fromTo('.diff-media', { opacity: 0, scale: 0.9, rotate: -2 }, { 
        opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: 'expo.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } 
      });
      gsap.fromTo('.diff-card', { opacity: 0, x: 40 }, { 
        opacity: 1, x: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } 
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-black py-24 lg:py-32 px-6 lg:px-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4FF]/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-16 lg:gap-24 items-center">
        <div className="diff-content" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
            {c.eyebrow}
          </span>
          <h2 className="text-4xl lg:text-7xl font-bold text-white mb-8 tracking-tighter leading-tight">
            {c.headline}
          </h2>
          <p className="text-lg lg:text-xl text-white/60 mb-12 leading-relaxed max-w-xl">
            {c.body}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            <div className="diff-card group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-red-500/30 transition-all duration-500" style={{ opacity: 0 }}>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8">We Don't Focus On</h4>
              <div className="space-y-4">
                {(c.dont_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group-hover:translate-x-1 transition-transform duration-500">
                    <span className="text-red-500/40 font-bold">✕</span>
                    <span className="text-white/40 line-through decoration-red-500/20">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="diff-card group p-8 rounded-[2rem] bg-[#00D4FF]/5 border border-[#00D4FF]/20 hover:border-[#00D4FF]/50 transition-all duration-500" style={{ opacity: 0 }}>
              <h4 className="text-xs font-bold text-[#00D4FF] uppercase tracking-widest mb-8">We Focus On</h4>
              <div className="space-y-4">
                {(c.do_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group-hover:translate-x-2 transition-transform duration-500">
                    <div className="w-5 h-5 rounded-full bg-[#00D4FF] flex items-center justify-center text-black">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span className="text-white font-bold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-grow bg-white/10" />
            <p className="text-[#00D4FF] font-bold text-lg lg:text-xl whitespace-nowrap tracking-tight">
              {c.closer}
            </p>
            <div className="h-px flex-grow bg-white/10" />
          </div>
        </div>

        <div className="diff-media relative group" style={{ opacity: 0 }}>
          <div className="absolute -inset-4 bg-[#00D4FF]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
            <img src={diffVisual} alt="Precision Marketing" className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-1000" />
          </div>
        </div>
      </div>
    </section>
  );
}
