import { useEffect, useRef, useState } from 'react';
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
  'Consumer Brands',
];

export default function WhoWeWorkWith() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndustry, setActiveIndustry] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.www-head', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.industry-tag', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.industry-grid', start: 'top 80%' },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="who-we-work-with" className="relative overflow-hidden bg-[#F3EBDD] px-6 py-20 lg:px-20 lg:py-28">
      <div className="max-w-[1300px] mx-auto">
        <div className="www-layout">
          <div className="www-head www-copy" style={{ opacity: 0 }}>
            <span className="www-eyebrow">Who We Work With</span>
            <h2 className="www-title">
              Retention works best where customers have a <span>reason to come back.</span>
            </h2>
            <p className="www-description">
              We partner with customer-based businesses where repeat customers matter.
            </p>
            <div className="www-active-readout" aria-live="polite">
              <span className="www-active-index">0{activeIndustry + 1}</span>
              <span>{industries[activeIndustry]}</span>
            </div>
          </div>

          <div className="industry-object">
            <div className="industry-object__top">
              <span>Customer fit map</span>
              <span>01 — 08</span>
            </div>

            <div className="industry-grid">
              {industries.map((item, i) => (
                <button
                  key={item}
                  type="button"
                  className={`industry-tag ${activeIndustry === i ? 'is-active' : ''}`}
                  onClick={() => setActiveIndustry(i)}
                  aria-pressed={activeIndustry === i}
                >
                  <span className="industry-tag__number">0{i + 1}</span>
                  <span className="industry-tag__label">{item}</span>
                  <span className="industry-tag__arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <div className="industry-object__footer">
              <p>If repeat customers matter to your business, we can help.</p>
              <span aria-hidden="true">↘</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
