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

function PricingCard({ plan, large = false, onSelect }: { plan: typeof plans[0]; large?: boolean; onSelect: () => void }) {
  const isDark = plan.featured;
  return (
    <div
      className="relative rounded-2xl transition-all duration-400 h-full"
      style={{
        background: isDark ? 'rgba(26,32,53,0.8)' : 'rgba(26,32,53,0.4)',
        border: isDark ? `2px solid ${plan.accent}40` : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isDark ? `0 20px 60px rgba(0,212,255,0.06)` : 'none',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = plan.accent + '50';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? plan.accent + '40' : 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className={`${large ? 'p-6 sm:p-9 md:p-11' : 'p-6 sm:p-7 md:p-8'} h-full flex flex-col`}>
        <span className="font-inter text-xs font-medium px-3 py-1.5 rounded-full inline-block self-start mb-4 sm:mb-5" style={{ background: plan.accent + '12', color: plan.accent, fontSize: '11px' }}>
          {plan.bestFor}
        </span>
        <h3 className="font-outfit font-bold mb-2" style={{ fontSize: large ? 'clamp(22px, 3.5vw, 28px)' : 'clamp(20px, 3vw, 22px)', color: '#FFFFFF' }}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="font-outfit font-bold" style={{ fontSize: large ? 'clamp(30px, 5vw, 40px)' : 'clamp(26px, 4vw, 32px)', color: plan.accent }}>{plan.price}</span>
          <span className="font-inter" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>{plan.period}</span>
        </div>
        <p className="font-inter text-sm mb-5 sm:mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {plan.description}
        </p>

        <div className="h-px mb-5 sm:mb-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

        <div className="flex flex-col gap-3 mb-6 sm:mb-8 flex-1">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                <path d="M3 8l4 4 6-6" stroke={plan.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onSelect}
          className="w-full font-inter font-bold text-sm py-3.5 rounded-full transition-all duration-300"
          style={{
            background: isDark ? `linear-gradient(135deg, ${plan.accent}, #0099cc)` : 'transparent',
            color: isDark ? '#000000' : '#FFFFFF',
            border: isDark ? 'none' : '1px solid rgba(255,255,255,0.15)',
          }}
          onMouseEnter={(e) => {
            if (isDark) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 25px ${plan.accent}40`; }
            else { e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            if (!isDark) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }
          }}
        >
          Get Started
        </button>
      </div>
    </div>
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
