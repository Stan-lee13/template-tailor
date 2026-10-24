import { useEffect, useRef } from 'react';

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!barRef.current) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      // scaleX is GPU-composited — no layout, no width transition needed
      barRef.current.style.transform = `scaleX(${progress})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] pointer-events-none" style={{ background: 'transparent' }}>
      <div ref={barRef} className="h-full w-full" style={{ transform: 'scaleX(0)', transformOrigin: '0 50%', background: 'linear-gradient(90deg, #C56A4A, #9A4F38)' }} />
    </div>
  );
}
