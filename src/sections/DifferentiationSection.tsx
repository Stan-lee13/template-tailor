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
      gsap.fromTo('.diff-content', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.diff-media', { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
      gsap.fromTo('.diff-card', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: '#0A0A0A', padding: '12vh clamp(20px, 5vw, 80px) 14vh' }}>
      <div className="relative max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr,1fr] gap-10 lg:gap-16 items-center">
        <div>
          <div className="diff-content mb-8 sm:mb-10" style={{ opacity: 0 }}>
            <span className="block font-inter font-medium uppercase mb-4 sm:mb-5" style={{ fontSize: '12px', color: 'rgba(239,239,244,0.55)', letterSpacing: '0.04em' }}>
              <span style={{ color: '#2C91E1' }}>●</span>&nbsp;&nbsp;{c.eyebrow}
            </span>
            <h2 className="font-outfit font-medium mb-5 sm:mb-6" style={{ fontSize: 'clamp(26px, 5vw, 56px)', lineHeight: 1, color: '#f1ece4', letterSpacing: '-0.02em' }}>{c.headline}</h2>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, color: 'rgba(241,236,228,0.75)', maxWidth: '520px' }}>{c.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="diff-card p-5 sm:p-6 rounded-xl" style={{ opacity: 0, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)' }}>
              <h4 className="font-outfit font-medium mb-3 sm:mb-4" style={{ fontSize: '12px', color: 'rgba(241,236,228,0.5)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>We Don't Focus On</h4>
              <div className="flex flex-col gap-2">
                {(c.dont_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ color: 'rgba(239,68,68,0.6)', fontSize: '13px' }}>✕</span>
                    <span className="font-inter" style={{ fontSize: '14px', color: 'rgba(241,236,228,0.55)', textDecoration: 'line-through' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="diff-card p-5 sm:p-6 rounded-xl" style={{ opacity: 0, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.18)' }}>
              <h4 className="font-outfit font-medium mb-3 sm:mb-4" style={{ fontSize: '12px', color: '#10B981', letterSpacing: '0.04em', textTransform: 'uppercase' }}>We Focus On</h4>
              <div className="flex flex-col gap-2">
                {(c.do_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span style={{ color: '#10B981', fontSize: '13px' }}>✓</span>
                    <span className="font-inter font-medium" style={{ fontSize: '14px', color: '#f1ece4' }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="font-inter font-medium mt-6 sm:mt-8" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#F97316' }}>{c.closer}</p>
        </div>

        <div className="diff-media relative rounded-2xl overflow-hidden" style={{ opacity: 0, aspectRatio: '4/5', boxShadow: '0 40px 100px rgba(0,0,0,0.55)' }}>
          <img src={imgSrc} alt="" loading="lazy" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(4,33,63,0) 40%, rgba(10,10,10,0.55))' }} />
        </div>
      </div>
    </section>
  );
}
