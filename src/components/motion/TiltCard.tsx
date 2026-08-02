import { ReactNode, useRef, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Max rotation in degrees */
  max?: number;
  /** Lift on hover in px along Z */
  lift?: number;
};

/**
 * Pointer-reactive 3D tilt. GPU transforms only.
 * Disabled automatically on touch devices and for reduced-motion users.
 */
export default function TiltCard({ children, className = '', style, max = 8, lift = 24 }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);

  const enabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onMove = (e: React.PointerEvent) => {
    if (!enabled() || !wrap.current || !inner.current) return;
    const rect = wrap.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      if (!inner.current) return;
      inner.current.style.transform = `rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(${lift}px)`;
    });
  };

  const reset = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    if (inner.current) inner.current.style.transform = 'rotateY(0deg) rotateX(0deg) translateZ(0px)';
  };

  return (
    <div
      ref={wrap}
      className={className}
      style={{ perspective: 1100, ...style }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      <div
        ref={inner}
        className="h-full w-full transition-transform duration-500 ease-out will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
}
