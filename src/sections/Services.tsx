import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: '01',
    title: 'Retention Infrastructure Setup',
    items: ['Email + SMS system setup', 'CRM & segmentation', 'Tracking & analytics'],
    accent: '#F97316',
  },
  {
    number: '02',
    title: 'Lifecycle Marketing Systems',
    items: ['Welcome flows', 'Post-purchase flows', 'Abandonment recovery', 'Re-engagement campaigns'],
    accent: '#4169E1',
  },
  {
    number: '03',
    title: 'Revenue Optimization',
    items: ['Upsells & cross-sells', 'Offer strategy', 'AOV boosters', 'Subscription models'],
    accent: '#10B981',
  },
  {
    number: '04',
    title: 'Personalization & Segmentation',
    items: ['Behavior-based targeting', 'Customer segmentation', 'Dynamic messaging'],
    accent: '#F59E0B',
  },
  {
    number: '05',
    title: 'Loyalty & Retention Strategy',
    items: ['Loyalty programs', 'Referral systems', 'Retention loops'],
    accent: '#06B6D4',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.services-left', { opacity: 0, x: -30 }, {
        opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
      gsap.fromTo('.service-card', { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="services" className="relative" style={{ background: '#f1ece4', padding: '10vh clamp(20px, 5vw, 80px) 12vh' }}>
      <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      <div className="relative flex flex-col lg:flex-row gap-10 lg:gap-16 max-w-[1280px] mx-auto">
        <div className="services-left lg:w-[38%] lg:sticky lg:top-[120px] lg:self-start" style={{ opacity: 0 }}>
          <span className="block font-inter font-medium uppercase mb-4" style={{ fontSize: '12px', color: '#555555', letterSpacing: '0.04em' }}>
            What We Do
          </span>
          <h2 className="font-outfit font-medium mb-5 sm:mb-6" style={{ fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.95, color: '#0A0A0A', letterSpacing: '-0.02em' }}>
            Everything You Need to Turn Customers Into Revenue
          </h2>
          <p className="font-inter mb-6 sm:mb-8" style={{ fontSize: 'clamp(15px, 2.5vw, 17px)', lineHeight: 1.65, color: '#2D2D2D', maxWidth: '400px' }}>
            From infrastructure to loyalty — every service is engineered to maximize lifetime value and reduce churn.
          </p>
          <div className="h-[3px] w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #F97316, #4169E1)' }} />
        </div>

        <div className="lg:w-[62%] flex flex-col gap-3 sm:gap-4">
          {services.map((service) => (
            <div
              key={service.number}
              className="service-card p-5 sm:p-7 lg:p-8 transition-all duration-300 cursor-default rounded-xl sm:rounded-2xl"
              style={{
                background: '#F5F3EE',
                border: '1px solid #D6D3CC',
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = service.accent + '40';
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 30px ${service.accent}12`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D6D3CC';
                e.currentTarget.style.background = '#F5F3EE';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="font-outfit font-medium flex-shrink-0" style={{ fontSize: '13px', color: service.accent, opacity: 0.6 }}>
                  {service.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-outfit font-medium mb-3" style={{ fontSize: 'clamp(17px, 2.5vw, 20px)', color: '#0A0A0A', letterSpacing: '-0.01em' }}>
                    {service.title}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {service.items.map((item) => (
                      <span
                        key={item}
                        className="font-inter px-2.5 sm:px-3 py-1 rounded-full"
                        style={{ fontSize: 'clamp(12px, 1.8vw, 14px)', background: service.accent + '08', color: '#2D2D2D', border: `1px solid ${service.accent}15` }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
