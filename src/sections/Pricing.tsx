import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Foundation',
    price: '$3K–$4K',
    period: '/month',
    bestFor: 'Brands doing $20K–$80K/mo',
    description: 'Fix leaks + build foundation',
    featured: false,
    accent: '#F97316',
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
    accent: '#4169E1',
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

const scrollTo = (href: string) => {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

function PricingCard({ plan, large = false }: { plan: typeof plans[0]; large?: boolean }) {
  const isDark = plan.featured;
  return (
    <div
      className="relative rounded-xl transition-colors duration-300 h-full"
      style={{
        background: isDark ? '#0A0A0A' : '#FFFFFF',
        border: isDark ? `2px solid ${plan.accent}25` : '1px solid #D6D3CC',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = plan.accent + '50';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = isDark ? plan.accent + '25' : '#D6D3CC';
      }}
    >
      <div className={`${large ? 'p-6 sm:p-9 md:p-11' : 'p-6 sm:p-7 md:p-8'} h-full flex flex-col`}>
        <span className="font-inter text-xs font-medium px-2.5 py-1 rounded-md inline-block self-start mb-3 sm:mb-4" style={{ background: plan.accent + '10', color: plan.accent, fontSize: '11px' }}>
          {plan.bestFor}
        </span>
        <h3 className="font-outfit font-medium mb-2" style={{ fontSize: large ? 'clamp(22px, 3.5vw, 28px)' : 'clamp(20px, 3vw, 22px)', color: isDark ? '#EBE8E0' : '#0A0A0A' }}>
          {plan.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="font-outfit font-bold" style={{ fontSize: large ? 'clamp(30px, 5vw, 40px)' : 'clamp(26px, 4vw, 32px)', color: plan.accent }}>{plan.price}</span>
          <span className="font-inter" style={{ fontSize: '14px', color: isDark ? '#8A8A8A' : '#555555' }}>{plan.period}</span>
        </div>
        <p className="font-inter text-sm mb-5 sm:mb-6" style={{ color: isDark ? 'rgba(235,232,224,0.55)' : '#555555' }}>
          {plan.description}
        </p>

        <div className="h-px mb-5 sm:mb-6" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#E8E5DE' }} />

        <div className="flex flex-col gap-2.5 mb-6 sm:mb-8 flex-1">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-start gap-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                <path d="M3 8l4 4 6-6" stroke={plan.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-inter text-sm" style={{ color: isDark ? 'rgba(235,232,224,0.75)' : '#2D2D2D', lineHeight: 1.5 }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        <button
          className="w-full font-inter font-medium text-sm py-3 rounded-lg transition-all duration-200"
          style={{
            background: isDark ? plan.accent : 'transparent',
            color: isDark ? '#FFFFFF' : '#0A0A0A',
            border: isDark ? 'none' : '1px solid #D6D3CC',
          }}
          onMouseEnter={(e) => {
            if (isDark) {
              e.currentTarget.style.opacity = '0.88';
            } else {
              e.currentTarget.style.background = '#0A0A0A';
              e.currentTarget.style.color = '#EBE8E0';
              e.currentTarget.style.borderColor = '#0A0A0A';
            }
          }}
          onMouseLeave={(e) => {
            if (isDark) {
              e.currentTarget.style.opacity = '1';
            } else {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#0A0A0A';
              e.currentTarget.style.borderColor = '#D6D3CC';
            }
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.pricing-head', { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.pricing-card', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 65%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const featured = plans.find((p) => p.featured)!;
  const others = plans.filter((p) => !p.featured);

  return (
    <section ref={sectionRef} id="pricing" className="relative" style={{ background: '#EBE8E0', padding: '10vh clamp(20px, 5vw, 80px) 12vh' }}>
      <div className="relative max-w-[1100px] mx-auto">
        <div className="pricing-head mb-10 sm:mb-14" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            Pricing
          </span>
          <h2 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="font-inter" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.6, color: '#2D2D2D', maxWidth: '480px' }}>
            Choose a plan that fits your retention goals. All plans include a 30-day satisfaction guarantee.
          </p>
        </div>

        {/* On mobile: stack all cards vertically with featured first. On desktop: asymmetric layout */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch">
          <div className="pricing-card lg:w-[52%]" style={{ opacity: 0 }}>
            <PricingCard plan={featured} large />
          </div>

          <div className="lg:w-[48%] flex flex-col gap-4 sm:gap-5">
            {others.map((plan) => (
              <div key={plan.name} className="pricing-card flex-1" style={{ opacity: 0 }}>
                <PricingCard plan={plan} />
              </div>
            ))}
          </div>
        </div>

        <p className="font-inter text-center mt-8 sm:mt-10" style={{ fontSize: 'clamp(14px, 2vw, 15px)', color: '#555555' }}>
          Not sure which plan?{' '}
          <button onClick={() => scrollTo('#cta')} className="font-medium underline underline-offset-2 transition-colors duration-200" style={{ color: '#F97316' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#EA580C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F97316')}
          >
            Book a free audit and we'll recommend one.
          </button>
        </p>
      </div>
    </section>
  );
}
