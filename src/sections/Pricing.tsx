import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Foundation',
    price: '$3K–$4K',
    period: '/month',
    bestFor: 'Brands doing $20K–$80K/mo',
    description: 'Fix leaks + build foundation',
    featured: false,
    accent: '#00D4FF',
    features: [
      'Email/SMS setup',
      'Core flows (welcome, cart, post-purchase)',
      'Monthly campaigns (4–6)',
      'Basic segmentation',
    ],
  },
  {
    name: 'Growth',
    price: '$5K–$7K',
    period: '/month',
    bestFor: 'Brands doing $80K–$250K/mo',
    description: 'Increase LTV + repeat purchases',
    featured: true,
    accent: '#00D4FF',
    features: [
      'Everything in Foundation',
      'Advanced segmentation',
      'Weekly campaigns',
      'AOV optimization strategy',
      'Customer journey mapping',
      'Monthly reporting & strategy',
    ],
  },
  {
    name: 'Scale',
    price: '$8K–$10K+',
    period: '/month',
    bestFor: 'Brands doing $250K+/mo',
    description: 'Retention becomes primary growth channel',
    featured: false,
    accent: '#10B981',
    features: [
      'Everything in Growth',
      'Full retention strategy ownership',
      'Loyalty & referral systems',
      'Advanced personalization',
      'Offer creation & testing',
      'CRO collaboration',
      'Dedicated strategist',
    ],
  },
];

import { ThreeDCard, ThreeDCardItem } from '../components/ui/three-d-card';

function PricingCard({ plan, large = false, onSelect }: { plan: typeof plans[0]; large?: boolean; onSelect: () => void }) {
  const isFeatured = plan.featured;
  return (
    <ThreeDCard className="h-full">
      <ThreeDCardItem translateZ={30} className={`relative rounded-[2.5rem] overflow-hidden h-full flex flex-col p-8 lg:p-12 ${isFeatured ? 'bg-gradient-to-br from-[#00D4FF]/20 to-black border-2 border-[#00D4FF]/30 shadow-[0_0_50px_rgba(0,212,255,0.1)]' : 'bg-white/5 border border-white/10 hover:border-white/20'} transition-all duration-500`}>
        {isFeatured && (
          <div className="absolute top-0 right-0 px-6 py-2 bg-[#00D4FF] text-black text-xs font-black uppercase tracking-widest rounded-bl-2xl">
            Most Popular
          </div>
        )}
        
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-8 self-start border border-white/5">
          {plan.bestFor}
        </span>
        
        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2 tracking-tight">
          {plan.name}
        </h3>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl lg:text-5xl font-black text-white tracking-tighter">{plan.price}</span>
          <span className="text-white/40 font-medium">{plan.period}</span>
        </div>
        
        <p className="text-white/50 mb-10 leading-relaxed">
          {plan.description}
        </p>

        <div className="h-px bg-white/10 mb-10" />

        <div className="space-y-4 mb-12 flex-1">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#00D4FF]/10 flex items-center justify-center text-[#00D4FF]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-white/70 text-sm font-medium leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onSelect}
          className={`w-full py-5 rounded-2xl font-bold text-sm transition-all duration-500 ${isFeatured ? 'bg-[#00D4FF] text-black hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-white/10 text-white hover:bg-white hover:text-black'} transform hover:-translate-y-1`}
        >
          Get Started Now
        </button>
      </ThreeDCardItem>
    </ThreeDCard>
  );
}

export default function Pricing() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { open } = useBooking();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-head', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.pricing-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = plans.find((p) => p.featured)!;
  const others = plans.filter((p) => !p.featured);

  const select = (planName: string) => { track('cta_click', { location: 'pricing', label: planName }); open(`pricing_${planName}`); };

  return (
    <section ref={sectionRef} id="pricing" className="relative" style={{ background: '#000000', padding: '14vh clamp(20px, 5vw, 80px) 12vh' }}>
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }} />

      <div className="relative max-w-[1100px] mx-auto">
        <div className="pricing-head mb-10 sm:mb-14 text-center" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-5 sm:mb-6" style={{ fontSize: '13px', color: '#00D4FF', letterSpacing: '0.15em' }}>
            Pricing
          </span>
          <h2 className="font-outfit font-bold mb-4" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 1.1, color: '#FFFFFF', letterSpacing: '-0.03em' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="font-inter mx-auto" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.7, color: 'rgba(255,255,255,0.5)', maxWidth: '480px' }}>
            Choose a plan that fits your retention goals. All plans include a 30-day satisfaction guarantee.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch">
          <div className="pricing-card lg:w-[52%]" style={{ opacity: 0 }}>
            <PricingCard plan={featured} large onSelect={() => select(featured.name)} />
          </div>

          <div className="lg:w-[48%] flex flex-col gap-4 sm:gap-5">
            {others.map((plan) => (
              <div key={plan.name} className="pricing-card flex-1" style={{ opacity: 0 }}>
                <PricingCard plan={plan} onSelect={() => select(plan.name)} />
              </div>
            ))}
          </div>
        </div>

        <p className="font-inter text-center mt-8 sm:mt-10" style={{ fontSize: 'clamp(14px, 2vw, 15px)', color: 'rgba(255,255,255,0.4)' }}>
          Not sure which plan?{' '}
          <button onClick={() => select('not_sure')} className="font-medium underline underline-offset-2 transition-colors duration-300" style={{ color: '#00D4FF' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#00D4FF')}
          >
            Book a free audit and we'll recommend one.
          </button>
        </p>
      </div>
    </section>
  );
}
