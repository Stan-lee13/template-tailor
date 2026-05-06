import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Growth Audit',
    description: 'We identify where you\'re leaking revenue and missing opportunities.',
    accent: '#F97316',
  },
  {
    number: '02',
    title: 'System Build',
    description: 'We install your retention infrastructure and flows.',
    accent: '#4169E1',
  },
  {
    number: '03',
    title: 'Optimization',
    description: 'We continuously improve performance and increase revenue.',
    accent: '#10B981',
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.process-head', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.process-step', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative overflow-hidden" style={{ background: '#0A0A0A', padding: '14vh clamp(24px, 5vw, 80px)' }}>
      {/* Subtle decorative elements */}
      <div className="absolute top-[30%] left-[5%] w-[1px] h-[200px] opacity-10" style={{ background: 'linear-gradient(to bottom, transparent, #F97316, transparent)' }} />
      <div className="absolute bottom-[20%] right-[8%] w-5 h-5 rounded-full opacity-5" style={{ background: '#4169E1', filter: 'blur(10px)' }} />

      <div className="relative max-w-[1000px] mx-auto">
        <div className="process-head text-center mb-16" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            Our Process
          </span>
          <h2 className="font-outfit font-medium" style={{ fontSize: 'clamp(30px, 5vw, 60px)', lineHeight: 0.95, color: '#EBE8E0', letterSpacing: '-0.02em' }}>
            How We Work
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line on desktop */}
          <div className="hidden md:block absolute top-[80px] left-[16%] right-[16%] h-[1px]" style={{ background: 'linear-gradient(90deg, #F97316, #4169E1, #10B981)', opacity: 0.15 }} />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="process-step text-center p-8 rounded-2xl transition-all duration-300 relative"
              style={{
                opacity: 0,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                transform: i === 1 ? 'translateY(-10px)' : undefined,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = step.accent + '30';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div className="w-14 h-14 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: step.accent + '10', border: `1px solid ${step.accent}20` }}>
                <span className="font-outfit font-bold" style={{ fontSize: '20px', color: step.accent }}>{step.number}</span>
              </div>
              <h3 className="font-outfit font-medium mb-3" style={{ fontSize: '22px', color: '#EBE8E0', letterSpacing: '-0.01em' }}>
                {step.title}
              </h3>
              <p className="font-inter" style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(235,232,224,0.6)' }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
