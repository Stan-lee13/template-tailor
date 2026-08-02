import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import RevealImage from '../components/motion/RevealImage';
import SplitHeadline from '../components/motion/SplitHeadline';
import diffVisual from '../assets/sections/differentiation-visual.jpg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Item = { text: string };
type DiffContent = {
  eyebrow: string; headline: string; body: string; image?: string | null;
  dont_focus: Item[]; do_focus: Item[]; closer: string;
};

/** Layout rhythm: TEXT LEFT — IMAGE RIGHT (mirror of the Solution section) */
export default function DifferentiationSection() {
  const c = useSectionContent<DiffContent>('/', 'differentiation', 'differentiation');
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.diff-fade', { opacity: 0, y: 36 }, {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.07,
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
      });
      gsap.fromTo('.diff-panel', { opacity: 0, y: 60, rotateY: (i) => (i === 0 ? -12 : 12) }, {
        opacity: 1, y: 0, rotateY: 0, duration: 1.2, stagger: 0.14, ease: 'expo.out',
        scrollTrigger: { trigger: '.diff-panels', start: 'top 82%' },
      });
      gsap.to('.diff-copy', {
        yPercent: -4, ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.diff-fade, .diff-panel', { opacity: 1, y: 0, rotateY: 0 });
    });
    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="differentiation" className="relative overflow-hidden bg-[#0a0f1a] py-24 lg:py-36 px-6 lg:px-20">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4FF]/5 blur-[150px]" />

      <div className="relative mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr,0.9fr] lg:gap-28">
        <div className="diff-copy order-2 lg:order-1">
          <span className="diff-fade mb-7 inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.32em] text-[#00D4FF]" style={{ opacity: 0 }}>
            <span className="h-px w-10 bg-[#00D4FF]/50" />
            {c.eyebrow}
          </span>

          <SplitHeadline
            text="Why Brands Choose RetentionFirm"
            highlightFrom={2}
            className="mb-8 text-4xl font-bold leading-[0.95] tracking-tighter text-white lg:text-7xl"
          />

          <p className="diff-fade mb-12 max-w-xl text-lg leading-relaxed text-white/55 lg:text-xl" style={{ opacity: 0 }}>
            Not because we send emails. Because we think beyond them. We see customer retention as a business strategy — not a marketing channel.
          </p>

          <div className="diff-panels mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2" style={{ perspective: 1200 }}>
            <div className="diff-panel group rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition-colors duration-500 hover:border-red-500/30" style={{ opacity: 0 }}>
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.25em] text-white/35">We don't focus on</h4>
              <div className="space-y-4">
                {(c.dont_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 transition-transform duration-500 group-hover:translate-x-1">
                    <span className="font-bold text-red-500/40">✕</span>
                    <span className="text-white/40 line-through decoration-red-500/20">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="diff-panel group rounded-[2rem] border border-[#00D4FF]/20 bg-[#00D4FF]/[0.06] p-8 transition-colors duration-500 hover:border-[#00D4FF]/50" style={{ opacity: 0 }}>
              <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.25em] text-[#00D4FF]">We focus on</h4>
              <div className="space-y-4">
                {(c.do_focus || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-4 transition-transform duration-500 group-hover:translate-x-2">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00D4FF] text-black">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="font-bold text-white">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="diff-fade flex items-center gap-5" style={{ opacity: 0 }}>
            <div className="h-px w-16 flex-shrink-0 bg-[#00D4FF]/40" />
            <p className="text-lg font-bold tracking-tight text-[#00D4FF] lg:text-xl">
              Creating customers who stay. Not just customers who click.
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:-mt-16">
          <RevealImage
            src={diffVisual}
            alt="A hand-finished ecommerce order with a thank-you note"
            from="right"
            ratio="aspect-[4/5]"
            caption="The moment loyalty starts"
            index="03"
          />
        </div>
      </div>
    </section>
  );
}
