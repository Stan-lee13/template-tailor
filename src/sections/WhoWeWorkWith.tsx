import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const industries = [
  'Ecommerce Brands',
  'Retail Brands',
  'Food & Beverage Chains',
  'Beauty & Cosmetics',
  'Fashion & Apparel',
  'Health & Wellness',
  'Subscription Businesses',
  'Consumer Brands'
];

export default function WhoWeWorkWith() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.www-head', { opacity: 0, y: 50 }, { 
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', 
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } 
      });
      gsap.fromTo('.industry-tag', { opacity: 0, scale: 0.8 }, { 
        opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)', 
        scrollTrigger: { trigger: '.industry-grid', start: 'top 80%' } 
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="who-we-work-with" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-32 px-6 lg:px-20">
      <div className="max-w-[1300px] mx-auto text-center">
        <div className="www-head mb-16 lg:mb-24" style={{ opacity: 0 }}>
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-6">
            Who We Work With
          </span>
          <h2 className="text-3xl lg:text-7xl font-bold text-white mb-8 tracking-tighter">
            Retention works best where customers have a <span className="text-gradient-cyan">reason to come back.</span>
          </h2>
          <p className="text-lg lg:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            We partner with customer-based businesses where repeat customers matter.
          </p>
        </div>

        <div className="industry-grid flex flex-wrap justify-center gap-4 lg:gap-6">
          {industries.map((item, i) => (
            <div 
              key={i} 
              className="industry-tag px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white/80 font-bold text-lg lg:text-xl hover:bg-[#00D4FF]/10 hover:border-[#00D4FF]/30 hover:text-white transition-all duration-500 cursor-default"
              style={{ opacity: 0 }}
            >
              {item}
            </div>
          ))}
        </div>
        
        <p className="mt-16 text-white/40 font-medium italic">
          If repeat customers matter to your business, we can help.
        </p>
      </div>
    </section>
  );
}
