import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function DifferentiationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.diff-content', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.diff-card', { opacity: 0, scale: 0.95 }, {
        opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden" style={{ background: '#0A0A0A', padding: '14vh clamp(24px, 5vw, 80px)' }}>
      {/* Subtle blue glow */}
      <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(65,105,225,0.06) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[10%] left-[10%] w-[200px] h-[200px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)' }} />

      <div className="relative max-w-[1000px] mx-auto">
        <div className="diff-content mb-14" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            <span style={{ color: '#4169E1' }}>●</span>&nbsp;&nbsp;Why Us
          </span>
          <h2 className="font-outfit font-medium mb-6" style={{ fontSize: 'clamp(30px, 5vw, 56px)', lineHeight: 0.95, color: '#EBE8E0', letterSpacing: '-0.02em' }}>
            We're Not Another<br />"Email Marketing Agency"
          </h2>
          <p className="font-inter" style={{ fontSize: '18px', lineHeight: 1.7, color: 'rgba(235,232,224,0.7)', maxWidth: '550px' }}>
            Most agencies send emails. We build revenue systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="diff-card p-8 rounded-2xl" style={{ opacity: 0, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <h4 className="font-outfit font-medium mb-5" style={{ fontSize: '16px', color: 'rgba(235,232,224,0.5)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              We Don't Focus On
            </h4>
            <div className="flex flex-col gap-3">
              {['Open rates', 'Click rates'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span style={{ color: 'rgba(239,68,68,0.5)', fontSize: '14px' }}>✕</span>
                  <span className="font-inter" style={{ fontSize: '16px', color: 'rgba(235,232,224,0.5)', textDecoration: 'line-through' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="diff-card p-8 rounded-2xl" style={{ opacity: 0, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <h4 className="font-outfit font-medium mb-5" style={{ fontSize: '16px', color: '#10B981', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
              We Focus On
            </h4>
            <div className="flex flex-col gap-3">
              {['Revenue per customer', 'Lifetime value', 'Retention-driven growth'].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span style={{ color: '#10B981', fontSize: '14px' }}>✓</span>
                  <span className="font-inter font-medium" style={{ fontSize: '16px', color: '#EBE8E0' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="font-inter font-medium mt-10" style={{ fontSize: '17px', color: '#F97316' }}>
          → If it doesn't make you more money, we don't do it.
        </p>
      </div>
    </section>
  );
}
