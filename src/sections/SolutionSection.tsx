import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import RevealImage from '../components/motion/RevealImage';
import SplitHeadline from '../components/motion/SplitHeadline';
import solutionVisual from '../assets/sections/solution-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Benefit = { text: string; color: string };
type SolutionContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  benefits: Benefit[]; closer_prefix: string; closer_highlight: string;
};

/** Layout rhythm: IMAGE LEFT — TEXT RIGHT */
export default function SolutionSection() {
  const c = useSectionContent<SolutionContent>('/', 'solution', 'solution');
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.sol-fade', { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.08,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 72%' },
      });
      gsap.fromTo('.sol-card', { opacity: 0, y: 44, rotateX: -14 }, {
        opacity: 1, y: 0, rotateX: 0, duration: 0.9, stagger: 0.09, ease: 'expo.out',
        scrollTrigger: { trigger: '.solution-grid', start: 'top 85%' },
      });
      gsap.to('.sol-copy', {
        yPercent: -6, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.sol-fade, .sol-card', { opacity: 1, y: 0, rotateX: 0 });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  const benefits = (c.benefits?.length ? c.benefits.map((b) => b.text) : [
    'Retention systems, not random marketing',
    'Built around your customer journey',
    'Focused on business metrics',
  ]);

  return (
    <section ref={sectionRef} id="solution" className="relative overflow-hidden bg-[#0a0f1a] pt-20 pb-28 lg:pt-28 lg:pb-40 px-6 lg:px-20">
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-[#00D4FF]/10 blur-[150px]" />

      <div className="relative mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.05fr,1fr] lg:gap-28">
        <RevealImage
          src={solutionVisual}
          alt="Customer lifecycle retention dashboard"
          from="left"
          ratio="aspect-square lg:aspect-[4/5]"
          caption="Lifecycle intelligence"
          index="01"
        />

        <div className="sol-copy lg:pt-10">
          <span className="sol-fade mb-7 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#00D4FF]" style={{ opacity: 0 }}>
            <span className="h-px w-10 bg-[#00D4FF]/50" />
            {c.eyebrow}
          </span>

          <SplitHeadline
            text="Customer Loyalty Is Our Business"
            highlightFrom={2}
            className="mb-8 text-4xl font-bold leading-[0.95] tracking-tighter text-white lg:text-7xl"
          />

          <p className="sol-fade mb-12 max-w-xl text-lg leading-relaxed text-white/55 lg:text-xl" style={{ opacity: 0 }}>
            Everything we do is built around one goal: creating customers who buy more often, stay longer and recommend your brand to others.
          </p>

          <div className="solution-grid mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2" style={{ perspective: 1000 }}>
            {benefits.map((text, i) => (
              <div
                key={i}
                className={`sol-card flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-500 hover:border-[#00D4FF]/40 hover:bg-white/[0.07] ${i === 2 ? 'sm:col-span-2' : ''}`}
                style={{ opacity: 0 }}
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#00D4FF]/10 text-[#00D4FF]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <span className="font-medium text-white/90">{text}</span>
              </div>
            ))}
          </div>

          <div className="sol-fade relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-transparent p-8" style={{ opacity: 0 }}>
            <span className="absolute -top-4 left-8 rounded-full border border-[#00D4FF]/30 bg-[#0a0f1a] px-4 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#00D4FF]">
              What we measure
            </span>
            <p className="text-xl font-bold tracking-tight text-white lg:text-2xl">
              We care about the numbers that actually grow businesses:{' '}
              <span className="text-gradient-cyan">repeat purchase rate, LTV, and churn reduction.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
