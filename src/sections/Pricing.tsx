import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: 'Foundation',
    price: '$3K–$4K',
    period: '/month',
    bestFor: 'Brands doing $20K–$80K/month',
    description: 'Fix leaks + build foundation',
    featured: false,
    accent: '#F97316',
    features: [
      'Email/SMS setup',
      'Core flows (welcome, abandoned cart, post-purchase)',
      'Monthly campaigns (4–6 emails)',
      'Basic segmentation',
    ],
  },
  {
    name: 'Growth',
    price: '$5K–$7K',
    period: '/month',
    bestFor: 'Brands doing $80K–$250K/month',
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
    bestFor: 'Brands doing $250K+/month',
    description: 'Turn retention into primary growth channel',
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

  return (
    <section ref={sectionRef} id="pricing" className="relative" style={{ background: '#EBE8E0', padding: '12vh clamp(24px, 5vw, 80px)' }}>
      {/* Subtle decorative elements */}
      <div className="absolute top-16 left-[12%] w-[100px] h-[2px] opacity-10" style={{ background: 'linear-gradient(90deg, #F59E0B, transparent)', transform: 'rotate(-5deg)' }} />

      <div className="relative max-w-[1100px] mx-auto">
        <div className="pricing-head text-center mb-16" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>
            Pricing
          </span>
          <h2 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(30px, 5vw, 60px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Simple, Transparent Pricing
          </h2>
          <p className="font-inter mx-auto" style={{ fontSize: '17px', lineHeight: 1.6, color: '#2D2D2D', maxWidth: '500px' }}>
            Choose a plan that fits your retention goals. All plans include a 30-day satisfaction guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className="pricing-card relative rounded-2xl transition-all duration-300"
              style={{
                opacity: 0,
                transform: plan.featured ? 'scale(1.03) translateY(-8px)' : undefined,
              }}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 font-inter font-medium uppercase" style={{ fontSize: '11px', color: '#FFFFFF', background: plan.accent, padding: '5px 16px', borderRadius: '20px', letterSpacing: '0.04em' }}>
                  Most Popular
                </div>
              )}

              <div
                className="p-8 md:p-9 h-full rounded-2xl"
                style={{
                  background: plan.featured ? '#0A0A0A' : '#FFFFFF',
                  border: `1px solid ${plan.featured ? plan.accent + '30' : '#D6D3CC'}`,
                }}
                onMouseEnter={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 12px 40px ${plan.accent}12`;
                    e.currentTarget.style.borderColor = plan.accent + '30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.featured) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#D6D3CC';
                  }
                }}
              >
                <div className="mb-1">
                  <span className="font-inter text-xs font-medium px-2 py-1 rounded-full" style={{ background: plan.accent + '12', color: plan.accent }}>
                    {plan.bestFor}
                  </span>
                </div>
                <h3 className="font-outfit font-medium mt-4 mb-2" style={{ fontSize: '24px', color: plan.featured ? '#EBE8E0' : '#0A0A0A' }}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="font-outfit font-bold" style={{ fontSize: '36px', color: plan.accent }}>{plan.price}</span>
                  <span className="font-inter" style={{ fontSize: '14px', color: plan.featured ? '#8A8A8A' : '#555555' }}>{plan.period}</span>
                </div>
                <p className="font-inter text-sm mb-6" style={{ color: plan.featured ? 'rgba(235,232,224,0.6)' : '#555555' }}>
                  Goal: {plan.description}
                </p>

                <div className="h-px mb-6" style={{ background: plan.featured ? 'rgba(255,255,255,0.08)' : '#D6D3CC' }} />

                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M3 8l4 4 6-6" stroke={plan.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="font-inter text-sm" style={{ color: plan.featured ? 'rgba(235,232,224,0.8)' : '#2D2D2D', lineHeight: 1.5 }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  className="w-full font-inter font-medium text-sm py-3 rounded-full transition-all duration-200"
                  style={{
                    background: plan.featured ? plan.accent : 'transparent',
                    color: plan.featured ? '#FFFFFF' : '#0A0A0A',
                    border: plan.featured ? 'none' : '1px solid #D6D3CC',
                  }}
                  onMouseEnter={(e) => {
                    if (plan.featured) {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    } else {
                      e.currentTarget.style.background = '#0A0A0A';
                      e.currentTarget.style.color = '#EBE8E0';
                      e.currentTarget.style.borderColor = '#0A0A0A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.featured) {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'scale(1)';
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
          ))}
        </div>
      </div>
    </section>
  );
}
