import { ReactNode, useRef, ElementType } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  /** Plain text; each word is masked and staggered upward */
  text: string;
  /** Words (0-indexed) rendered in the cyan gradient */
  highlightFrom?: number;
  className?: string;
  as?: ElementType;
  children?: ReactNode;
};

export default function SplitHeadline({ text, highlightFrom, className = '', as: Tag = 'h2' }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const words = text.split(' ');

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.sh-word',
        { yPercent: 115, rotate: 4 },
        {
          yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045,
          scrollTrigger: { trigger: root.current, start: 'top 85%' },
        }
      );
    });
    mm.add('(prefers-reduced-motion: reduce)', () => { gsap.set('.sh-word', { yPercent: 0 }); });
    return () => mm.revert();
  }, { scope: root });

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
