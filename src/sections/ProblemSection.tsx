import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const painPoints = [
  'Customers buy once and disappear',
  'CAC keeps rising',
  'Profit margins shrink',
  'Growth becomes unpredictable',
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.problem-headline', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.problem-item', { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#0A0A0A', padding: '12vh clamp(20px, 5vw, 80px) 10vh' }}>
      <div className="absolute top-12 right-[10%] w-[200px] h-[1px] opacity-10 hidden sm:block" style={{ background: 'linear-gradient(90deg, transparent, #4169E1, transparent)', transform: 'rotate(-8deg)' }} />
      
      <div className="max-w-[800px] mx-auto">
        <div className="problem-headline" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4 sm:mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            <span style={{ color: '#EF4444' }}>●</span>&nbsp;&nbsp;The Problem
          </span>
          <h2 className="font-outfit font-medium mb-3 sm:mb-4" style={{ fontSize: 'clamp(26px, 5vw, 56px)', lineHeight: 1, color: '#EBE8E0', letterSpacing: '-0.02em' }}>
            You're Not Losing Money on Ads…
          </h2>
          <h2 className="font-outfit font-medium mb-6 sm:mb-8" style={{ fontSize: 'clamp(26px, 5vw, 56px)', lineHeight: 1, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#F97316' }}>You're Losing It After the First Purchase</span>
          </h2>
          <p className="font-inter mb-8 sm:mb-10" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, color: 'rgba(235,232,224,0.7)', maxWidth: '600px' }}>
            Most brands spend thousands acquiring customers… but fail to bring them back, increase their value, or build real loyalty. So what happens?
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="problem-item flex items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all duration-300"
              style={{
                opacity: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
                e.currentTarget.style.background = 'rgba(239,68,68,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: '#EF4444', fontSize: '16px' }}>✕</span>
              <span className="font-inter" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(235,232,224,0.85)', lineHeight: 1.5 }}>{point}</span>
            </div>
          ))}
        </div>

        <p className="font-inter font-medium mt-8 sm:mt-10" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#F97316', letterSpacing: '-0.01em' }}>
          → You're paying for customers… but not keeping them.
        </p>
      </div>
    </section>
  );
}
