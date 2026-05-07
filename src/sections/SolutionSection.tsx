import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { text: 'Converts first-time buyers into repeat customers', color: '#10B981' },
  { text: 'Increases average order value (AOV)', color: '#F59E0B' },
  { text: 'Maximizes customer lifetime value (LTV)', color: '#4169E1' },
  { text: 'Builds loyalty that competitors can\'t steal', color: '#F97316' },
];

export default function SolutionSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.solution-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.solution-card', { opacity: 0, y: 30, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ background: '#f1ece4', padding: '12vh clamp(20px, 5vw, 80px) 10vh' }}>
      <div className="absolute top-20 right-[8%] w-6 h-6 rounded-full opacity-10 hidden sm:block" style={{ background: '#4169E1', filter: 'blur(12px)' }} />
      <div className="absolute bottom-32 left-[5%] w-3 h-3 opacity-10 hidden sm:block" style={{ background: '#10B981', transform: 'rotate(45deg)', filter: 'blur(6px)' }} />

      <div className="max-w-[900px] mx-auto">
        <div className="solution-head mb-10 sm:mb-14" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4 sm:mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            <span style={{ color: '#10B981' }}>●</span>&nbsp;&nbsp;The Solution
          </span>
          <h2 className="font-outfit font-medium mb-4 sm:mb-5" style={{ fontSize: 'clamp(28px, 5vw, 60px)', lineHeight: 1, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            We Build Your Retention Revenue Engine
          </h2>
          <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 18px)', lineHeight: 1.7, color: '#2D2D2D', maxWidth: '600px' }}>
            At RetentionFirm, we don't "run email campaigns." We engineer a complete system that drives predictable revenue growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="solution-card p-5 sm:p-7 rounded-xl sm:rounded-2xl transition-all duration-300"
              style={{
                opacity: 0,
                background: '#FFFFFF',
                border: '1px solid #D6D3CC',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = b.color + '40';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 30px ${b.color}10`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D6D3CC';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="flex-shrink-0 mt-1 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: b.color + '15' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke={b.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="font-inter" style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: '#0A0A0A', lineHeight: 1.5 }}>{b.text}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="font-inter font-medium mt-8 sm:mt-10" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', color: '#0A0A0A', letterSpacing: '-0.01em' }}>
          → Your customers stop being one-time transactions… and start becoming{' '}
          <span style={{ color: '#F97316' }}>long-term revenue assets.</span>
        </p>
      </div>
    </section>
  );
}
