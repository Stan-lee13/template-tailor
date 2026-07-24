import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import diffImg from '../assets/sections/differentiation.jpg';

gsap.registerPlugin(ScrollTrigger);

type Item = { text: string };
type DiffContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  dont_focus: Item[]; do_focus: Item[]; closer: string;
};

export default function DifferentiationSection() {
  const c = useSectionContent<DiffContent>('/', 'differentiation', 'differentiation');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgSrc = c.image && c.image.startsWith('/assets/') ? diffImg : (c.image || diffImg);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.diff-content', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.diff-media', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
      gsap.fromTo('.diff-card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
      gsap.fromTo('.diff-closer', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 40%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 14vh' }}>
      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-16 items-center">
        <div>
          <div className="diff-content mb-8 sm:mb-10" style={{ opacity: 0 }}>
            <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>
              {c.eyebrow}
            </span>
            <h2 className="font-outfit font-bold mb-5 sm:mb-6" style={{ fontSize: 'clamp(26px, 5vw, 56px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>{c.headline}</h2>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', maxWidth: '520px' }}>{c.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="diff-card p-6 sm:p-7 rounded-2xl transition-all duration-400" style={{ opacity: 0, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <h4 className="font-outfit font-bold mb-4 sm:mb-5" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>We Don't Focus On</h4>
              <div className="flex flex-col gap-3">
                {(c.dont_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ color: 'rgba(239,68,68,0.5)', fontSize: '13px' }}>✕</span>
                    <span className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', textDecoration: 'line-through' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="diff-card p-6 sm:p-7 rounded-2xl transition-all duration-400" style={{ opacity: 0, background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <h4 className="font-outfit font-bold mb-4 sm:mb-5" style={{ fontSize: '12px', color: '#00D4FF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>We Focus On</h4>
              <div className="flex flex-col gap-3">
                {(c.do_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ color: '#00D4FF', fontSize: '13px' }}>✓</span>
                    <span className="font-inter font-medium" style={{ fontSize: '14px', color: '#FFFFFF' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="diff-closer font-inter font-medium mt-8 sm:mt-10" style={{ opacity: 0, fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#00D4FF' }}>{c.closer}</p>
        </div>

        <div className="diff-media relative rounded-2xl overflow-hidden" style={{ opacity: 0, aspectRatio: '4/5', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
          <img src={imgSrc} alt="" loading="lazy" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.5))' }} />
        </div>
      </div>
    </section>
  );
}
