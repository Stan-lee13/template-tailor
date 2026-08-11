import { ReactNode, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Tone = 'ink' | 'raised' | 'paper';
type Width = 'full' | 'wide' | 'narrow';
type Align = 'left' | 'right';

const WIDTH: Record<Width, string> = {
  full: 'w-full',
  wide: 'w-full lg:w-[92%]',
  narrow: 'w-full lg:w-[82%]',
};

const TONE: Record<Tone, string> = {
  ink: 'bg-[hsl(var(--ink))] text-foreground border border-border/70',
  raised: 'bg-[hsl(var(--ink-raised))] text-foreground border border-border',
  paper: 'bg-[hsl(var(--paper))] text-[hsl(var(--ink))] border border-[hsl(var(--paper-deep))]',
};

export type StackCardProps = {
  id?: string;
  index?: string;
  label?: string;
  tone?: Tone;
  width?: Width;
  align?: Align;
  className?: string;
  children: ReactNode;
};

/**
 * The Ledger card shell. Every homepage block renders inside one of these:
 * rounded rectangle, one of three surface tones, alternating width/offset,
 * and the shared "stack-over" scroll transition (outgoing card recedes and dims).
 */
export default function StackCard({
  id,
  index,
  label,
  tone = 'ink',
  width = 'full',
  align = 'left',
  className = '',
  children,
}: StackCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Enter: mask-rise
      gsap.fromTo(
        ref.current,
        { yPercent: 4, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 92%' },
        },
      );
      // Transition: recede as the next card slides over
      gsap.to(ref.current, {
        scale: 0.965,
        opacity: 0.55,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'bottom 78%',
          end: 'bottom 24%',
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, { scope: ref });

  return (
    <section
      id={id}
      ref={ref}
      className={`ledger-grain relative isolate mx-auto overflow-hidden rounded-[22px] px-6 py-16 sm:px-8 lg:rounded-[28px] lg:px-14 lg:py-24 ${WIDTH[width]} ${TONE[tone]} ${
        align === 'right' ? 'lg:ml-auto lg:mr-0' : ''
      } ${className}`}
      style={{ boxShadow: 'var(--shadow-card)', willChange: 'transform' }}
    >
      {(index || label) && (
        <div className="relative z-10 mb-10 flex items-center gap-4">
          {index && (
            <span className="font-display text-sm font-bold tracking-[0.2em] text-primary">{index}</span>
          )}
          <span className="h-px flex-1 max-w-[120px] brass-rule opacity-70" />
          {label && (
            <span className="text-[10px] font-bold uppercase tracking-[0.32em] opacity-55">{label}</span>
          )}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
