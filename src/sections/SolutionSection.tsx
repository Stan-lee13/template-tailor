import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSectionContent } from '../hooks/useSectionContent';
import solutionImg from '../assets/sections/solution.jpg';

gsap.registerPlugin(ScrollTrigger);

type Benefit = { text: string; color: string };
type SolutionContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  benefits: Benefit[]; closer_prefix: string; closer_highlight: string;
};

export default function SolutionSection() {
  const c = useSectionContent<SolutionContent>('/', 'solution', 'solution');
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgSrc = c.image && c.image.startsWith('/assets/') ? solutionImg : (c.image || solutionImg);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.solution-head', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } });
      gsap.fromTo('.solution-media', { opacity: 0, scale: 1.04 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' } });
      gsap.fromTo('.solution-card', { opacity: 0, y: 30, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#f1ece4', padding: '12vh clamp(20px, 5vw, 80px) 10vh' }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr,1.1fr] gap-10 lg:gap-14 items-center">
        <div className="solution-media relative rounded-2xl overflow-hidden order-2 lg:order-1" style={{ opacity: 0, aspectRatio: '4/3', boxShadow: '0 30px 80px rgba(4,33,63,0.18)' }}>
          <img src={imgSrc} alt="" loading="lazy" width={1600} height={1200} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(4,33,63,0.15), rgba(4,33,63,0))' }} />
        </div>

        <div className="order-1 lg:order-2">
          <div className="solution-head mb-8 sm:mb-10" style={{ opacity: 0 }}>
            <span className="block font-inter font-medium uppercase mb-4 sm:mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
              <span style={{ color: '#10B981' }}>●</span>&nbsp;&nbsp;{c.eyebrow}
            </span>
            <h2 className="font-outfit font-medium mb-4 sm:mb-5" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
              {c.headline}
            </h2>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, color: '#2D2D2D', maxWidth: '540px' }}>{c.body}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {(c.benefits || []).map((b, i) => (
              <div key={i} className="solution-card p-4 sm:p-5 rounded-xl" style={{ opacity: 0, background: '#FFFFFF', border: '1px solid #D6D3CC' }}>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: b.color + '15' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={b.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="font-inter" style={{ fontSize: 'clamp(13px, 1.9vw, 15px)', color: '#0A0A0A', lineHeight: 1.5 }}>{b.text}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="font-inter font-medium mt-6 sm:mt-8" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#0A0A0A' }}>
            {c.closer_prefix} <span style={{ color: '#F97316' }}>{c.closer_highlight}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
