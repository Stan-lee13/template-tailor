import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import SplitHeadline from '../components/motion/SplitHeadline';
import StackCard from '../components/layout/StackCard';
import diffVisual from '../assets/sections/differentiation-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Item = { text: string };
type DiffContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  dont_focus: Item[]; do_focus: Item[]; closer: string;
};

/** 05 — TEXT LEFT / IMAGE RIGHT, mirror of Solution. */
export default function DifferentiationSection() {
  const c = useSectionContent<DiffContent>('/', 'differentiation', 'differentiation');
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.diff-el', { opacity: 0, y: 26 }, {
        opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      });
      gsap.fromTo('.diff-frame', { clipPath: 'inset(100% 0% 0% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
      gsap.fromTo('.diff-img', { yPercent: -8, scale: 1.12 }, {
        yPercent: 8, scale: 1.04, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.diff-el', { opacity: 1, y: 0 });
      gsap.set('.diff-frame', { clipPath: 'none' });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <div ref={ref}>
      <StackCard id="differentiation" index="05" label="The difference" tone="raised" width="wide" align="right">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.1fr,0.9fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <span className="diff-el eyebrow mb-6" style={{ opacity: 0 }}>
              <span className="h-px w-10 bg-primary" />
              {c.eyebrow}
            </span>

            <SplitHeadline
              text="Why brands choose RetentionFirm."
              className="mb-7 text-3xl leading-[1.03] text-foreground lg:text-6xl"
            />

            <p className="diff-el mb-10 max-w-xl text-lg leading-relaxed text-foreground/60" style={{ opacity: 0 }}>
              {c.body}
            </p>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="diff-el rounded-[20px] border border-border p-7" style={{ opacity: 0 }}>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-foreground/35">We don't focus on</h4>
                <ul className="space-y-3">
                  {(c.dont_focus || []).map((item, i) => (
                    <li key={i} className="text-foreground/35 line-through decoration-foreground/20">{item.text}</li>
                  ))}
                </ul>
              </div>
              <div className="diff-el rounded-[20px] border border-primary/40 bg-primary/[0.07] p-7" style={{ opacity: 0 }}>
                <h4 className="mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-primary">We focus on</h4>
                <ul className="space-y-3">
                  {(c.do_focus || []).map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground/90">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {c.closer && (
              <p className="diff-el mt-10 border-l-2 border-primary pl-6 text-xl leading-snug text-foreground lg:text-2xl" style={{ opacity: 0 }}>
                {c.closer}
              </p>
            )}
          </div>

          <div className="diff-frame relative order-1 overflow-hidden rounded-[22px] border border-border lg:order-2 lg:rounded-[28px]">
            <div className="relative aspect-[4/5]">
              <img
                src={diffVisual}
                alt="A handwritten thank-you card being packed with an order"
                loading="lazy"
                width={1280}
                height={1600}
                className="diff-img absolute inset-0 h-full w-full object-cover will-change-transform"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink-raised))] via-transparent to-transparent" />
            </div>
            <span className="absolute bottom-6 left-6 rounded-full border border-primary/40 bg-[hsl(var(--ink))]/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.26em] text-primary">
              The second purchase
            </span>
          </div>
        </div>
      </StackCard>
    </div>
  );
}
