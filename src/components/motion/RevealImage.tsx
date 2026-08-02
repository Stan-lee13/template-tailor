import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** Reveal swings from this side */
  from?: 'left' | 'right';
  /** Aspect ratio utility class applied to the frame */
  ratio?: string;
  /** Small floating caption chip */
  caption?: string;
  index?: string;
};

/**
 * Editorial image frame: 3D rotateY swing + clip-path wipe on enter,
 * plus a slow scroll-linked drift of the image inside its frame.
 */
export default function RevealImage({
  src, alt, className = '', from = 'left', ratio = 'aspect-[4/5]', caption, index,
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const dir = from === 'left' ? -1 : 1;

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        '.ri-frame',
        { opacity: 0, rotateY: 12 * dir, y: 60, clipPath: 'inset(0% 0% 100% 0%)' },
        {
          opacity: 1, rotateY: 0, y: 0, clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4, ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 82%' },
        }
      );

      gsap.fromTo(
        '.ri-img',
        { yPercent: -6, scale: 1.14 },
        {
          yPercent: 6, scale: 1.02, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1 },
        }
      );

      gsap.fromTo(
        '.ri-chip',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: 'power3.out',
          scrollTrigger: { trigger: root.current, start: 'top 82%' } }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.ri-frame', { opacity: 1, clipPath: 'none' });
      gsap.set('.ri-chip', { opacity: 1 });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} className={`relative ${className}`} style={{ perspective: 1400 }}>
      <div
        className={`ri-frame relative overflow-hidden rounded-[2rem] border border-white/10 will-change-transform ${ratio}`}
        style={{ opacity: 0, transformStyle: 'preserve-3d' }}
      >
        <img src={src} alt={alt} loading="lazy" className="ri-img absolute inset-0 h-full w-full object-cover will-change-transform" />
        {/* duotone edge + depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 mix-blend-overlay bg-gradient-to-br from-[#00D4FF]/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
      </div>

      {index && (
        <span className="ri-chip pointer-events-none absolute -top-6 -left-2 text-[5rem] lg:text-[8rem] leading-none font-black text-white/[0.06] select-none">
          {index}
        </span>
      )}

      {caption && (
        <div className="ri-chip absolute -bottom-5 left-6 right-6 lg:left-8 lg:right-auto" style={{ opacity: 0 }}>
          <span className="inline-block rounded-full border border-white/10 bg-[#0d1626]/90 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/60 backdrop-blur">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
}
