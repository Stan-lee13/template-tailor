import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import StackCard from '../components/layout/StackCard';
import solutionVisual from '../assets/sections/solution-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Benefit = { text: string; color: string };
type SolutionContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  benefits: Benefit[]; closer_prefix: string; closer_highlight: string;
};

/** 03 — IMAGE LEFT / TEXT RIGHT. */
export default function SolutionSection() {
  const c = useSectionContent<SolutionContent>('/', 'solution', 'solution');
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.sol-el', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });
      gsap.fromTo('.sol-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
      gsap.fromTo('.sol-img', { yPercent: -8, scale: 1.12 }, {
        yPercent: 8, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.sol-el', { opacity: 1, y: 0 });
      gsap.set('.sol-frame', { clipPath: 'none' });
    });
    return () => mm.revert();
  }, { scope: ref });

  const benefits = c.benefits?.length
    ? c.benefits.map((b) => b.text)
    : ['Retention systems, not random marketing', 'Built around your customer journey', 'Focused on business metrics'];

  return (
    <div ref={ref}>
      <StackCard id="solution" index="03" label="The system" tone="ink" width="full">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr,1fr] lg:gap-20">
          <div className="sol-frame relative overflow-hidden rounded-[22px] border border-border lg:rounded-[28px]">
            <div className="relative aspect-[4/5]">
              <img
                src={solutionVisual}
                alt="Retention strategist mapping a customer lifecycle"
                loading="lazy"
                width={1280}
                height={1600}
                className="sol-img absolute inset-0 h-full w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink))] via-transparent to-transparent" />
            </div>
            <span className="absolute bottom-6 left-6 rounded-full border border-primary/40 bg-[hsl(var(--ink))]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-primary">
              Lifecycle intelligence
            </span>
          </div>

          <div>
            <span className="sol-el eyebrow mb-6" style={{ opacity: 0 }}>
              <span className="h-px w-10 bg-primary" />
              {c.eyebrow}
            </span>

            <SplitHeadline
              text="Customer loyalty is our business."
              className="mb-7 text-3xl leading-[1.03] text-foreground lg:text-6xl"
            />

            <p className="sol-el mb-10 max-w-xl text-lg leading-relaxed text-foreground/60" style={{ opacity: 0 }}>
              {c.body}
            </p>

            <div className="mb-10 space-y-px overflow-hidden rounded-[20px] border border-border">
              {benefits.map((text, i) => (
                <div
                  key={i}
                  className="sol-el flex items-center gap-5 bg-[hsl(var(--ink-raised))] px-6 py-6 transition-colors duration-300 hover:bg-[hsl(var(--ink-raised))]/70"
                  style={{ opacity: 0 }}
                >
                  <span className="font-display text-xs text-primary">0{i + 1}</span>
                  <span className="text-base font-medium text-foreground/90 lg:text-lg">{text}</span>
                </div>
              ))}
            </div>

            <p className="sol-el border-l-2 border-primary pl-6 text-xl leading-snug text-foreground lg:text-2xl" style={{ opacity: 0 }}>
              {c.closer_prefix}
              <span className="text-brass">{c.closer_highlight}</span>
            </p>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
