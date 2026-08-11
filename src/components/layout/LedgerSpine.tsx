import { useEffect, useRef, useState } from 'react';

const STOPS = [
  { id: 'problem', n: '01', label: 'The leak' },
  { id: 'solution', n: '02', label: 'The system' },
  { id: 'results', n: '03', label: 'The numbers' },
  { id: 'differentiation', n: '04', label: 'The difference' },
  { id: 'process', n: '05', label: 'The work' },
  { id: 'services', n: '06', label: 'The services' },
  { id: 'faq', n: '07', label: 'Questions' },
];

/**
 * Persistent left-edge ledger: a brass rule that fills as the page is read,
 * with the current section index. Collapses to a slim progress rail on mobile.
 */
export default function LedgerSpine() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(STOPS[0]);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      raf.current = null;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      let current = STOPS[0];
      for (const s of STOPS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (raf.current === null) raf.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Desktop spine */}
      <div className="pointer-events-none fixed left-0 top-0 z-30 hidden h-screen w-[72px] flex-col items-center justify-center gap-6 lg:flex">
        <span className="font-display text-xs font-bold tracking-[0.3em] text-primary">{active.n}</span>
        <div className="relative h-[38vh] w-px bg-foreground/12">
          <div
            className="absolute left-0 top-0 w-px bg-primary transition-[height] duration-150 ease-out"
            style={{ height: `${progress * 100}%` }}
          />
        </div>
        <span
          className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.32em] text-foreground/45"
          style={{ writingMode: 'vertical-rl' }}
        >
          {active.label}
        </span>
      </div>

      {/* Mobile rail */}
      <div className="pointer-events-none fixed left-0 top-0 z-30 h-[3px] w-full bg-transparent lg:hidden">
        <div className="h-full bg-primary" style={{ width: `${progress * 100}%` }} />
      </div>
    </>
  );
}
