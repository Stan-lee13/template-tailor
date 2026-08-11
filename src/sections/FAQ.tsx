import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useSectionContent } from '../hooks/useSectionContent';
import StackCard from '../components/layout/StackCard';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FaqItem = { q: string; a: string };
type FaqContent = { eyebrow: string; headline: string; faqs: FaqItem[] };

export default function FAQ() {
  const c = useSectionContent<FaqContent>('/', 'faq', 'faq');
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.faq-el', { opacity: 0, y: 22 }, {
        opacity: 1, y: 0, duration: 0.85, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: ref.current, start: 'top 82%' },
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.faq-el', { opacity: 1, y: 0 });
    });
    return () => mm.revert();
  }, { scope: ref, dependencies: [c.faqs?.length] });

  return (
    <div ref={ref}>
      <StackCard id="faq" index="07" label="Questions" tone="paper" width="narrow">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.7fr,1.3fr] lg:gap-16">
          <div>
            <span className="faq-el mb-5 inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.34em] text-[hsl(var(--ink))]/50" style={{ opacity: 0 }}>
              <span className="h-px w-8 bg-[hsl(var(--brass))]" />
              {c.eyebrow}
            </span>
            <h2 className="faq-el text-3xl leading-[1.05] text-[hsl(var(--ink))] lg:text-5xl" style={{ opacity: 0 }}>
              Common questions
            </h2>
          </div>

          <div className="border-t border-[hsl(var(--ink))]/12">
            {(c.faqs || []).map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="faq-el border-b border-[hsl(var(--ink))]/12" style={{ opacity: 0 }}>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className={`font-display text-lg transition-colors duration-300 lg:text-xl ${isOpen ? 'text-[hsl(var(--brass))]' : 'text-[hsl(var(--ink))]'}`}>
                      {faq.q}
                    </span>
                    <span
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        isOpen ? 'rotate-45 border-[hsl(var(--brass))] bg-[hsl(var(--brass))]' : 'border-[hsl(var(--ink))]/20'
                      }`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen ? '#0B1A2A' : '#0B1A2A'} strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr', opacity: isOpen ? 1 : 0 }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-7 pr-10 text-base leading-relaxed text-[hsl(var(--ink))]/65">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </StackCard>
    </div>
  );
}
