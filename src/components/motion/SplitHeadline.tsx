import { ReactNode, useEffect, useRef, ElementType } from 'react';
import gsap from 'gsap';

type Props = {
  /** Plain text; each word is masked and staggered upward */
  text: string;
  /** Words (0-indexed) rendered in the cyan gradient */
  highlightFrom?: number;
  className?: string;
  as?: ElementType;
  children?: ReactNode;
};

/**
 * Masked word-by-word headline reveal.
 * Uses IntersectionObserver (not ScrollTrigger) so it stays reliable inside
 * lazy-loaded sections and smooth-scroll containers.
 */
export default function SplitHeadline({ text, highlightFrom, className = '', as: Tag = 'h2' }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>('.sh-word');
    if (!targets.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      gsap.set(targets, { yPercent: 0, rotate: 0, clearProps: 'transform' });
      return;
    }

    gsap.set(targets, { yPercent: 115, rotate: 4 });

    const play = () => {
      console.log('SH play', text);
      gsap.to(targets, {
        yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045, overwrite: 'auto',
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          play();
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.15 }
    );
    io.observe(el);
    console.log('SH observe', text, el.getBoundingClientRect().height);

    return () => io.disconnect();
  }, [text]);

  return (
    <div ref={root}>
      <Tag className={className}>
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="inline-block overflow-hidden align-bottom pb-[0.12em]">
            <span
              className={`sh-word inline-block will-change-transform ${
                highlightFrom !== undefined && i >= highlightFrom ? 'text-gradient-cyan' : ''
              }`}
              style={{ transform: 'translateY(115%)' }}
            >
              {w}
              {i < words.length - 1 ? '\u00A0' : ''}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
}
