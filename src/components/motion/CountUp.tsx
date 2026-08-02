import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CountUp({
  to, prefix = '', suffix = '', decimals = 0, className = '',
}: { to: number; prefix?: string; suffix?: string; decimals?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const node = el.current;
    if (!node) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const set = (v: number) => { node.textContent = `${prefix}${v.toFixed(decimals)}${suffix}`; };
    if (reduced) { set(to); return; }
    const obj = { v: 0 };
    set(0);
    gsap.to(obj, {
      v: to, duration: 1.8, ease: 'power3.out',
      onUpdate: () => set(obj.v),
      scrollTrigger: { trigger: node, start: 'top 88%' },
    });
  }, { dependencies: [to] });

  return <span ref={el} className={className}>{prefix}{to}{suffix}</span>;
}
