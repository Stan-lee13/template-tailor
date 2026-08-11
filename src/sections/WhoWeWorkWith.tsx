import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import StackCard from '../components/layout/StackCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

/** Compact chip-cluster card. */
export default function WhoWeWorkWith() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.www-el', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.85, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.www-el', { opacity: 1, y: 0 });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref}>
      <StackCard id="who-we-work-with" index="02" label="Who we work with" tone="raised" width="narrow" align="right">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr,1.2fr] lg:items-center lg:gap-20">
          <h2 className="www-el text-3xl leading-[1.05] text-foreground lg:text-5xl" style={{ opacity: 0 }}>
            Retention works best where customers have a{' '}
            <span className="text-brass">reason to come back.</span>
          </h2>

          <div className="flex flex-wrap gap-3">
            {industries.map((item) => (
              <span
                key={item}
                className="www-el rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/75 transition-colors duration-300 hover:border-primary hover:text-primary lg:text-base"
                style={{ opacity: 0 }}
              >
                {item}
              </span>
            ))}
            <span className="www-el w-full pt-4 text-sm italic text-foreground/40" style={{ opacity: 0 }}>
              If repeat customers matter to your business, we can help.
            </span>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
