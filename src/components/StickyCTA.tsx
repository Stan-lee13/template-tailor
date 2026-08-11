import { useEffect, useState } from 'react';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import ShimmerButton from './ui/shimmer-button';

const KEY = 'rf_sticky_dismissed';

export default function StickyCTA() {
  const { open } = useBooking();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    const onScroll = () => {
      const pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct > 0.4 && pct < 0.92) setShow(true);
      else setShow(false);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed z-[140] right-8 bottom-8 hidden sm:block" style={{ animation: 'rfSlideUp 600ms cubic-bezier(.2,.7,.2,1)' }}>
      <div className="flex items-center gap-4 rounded-3xl bg-black/80 border border-white/10 backdrop-blur-xl p-2 pl-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 hidden lg:inline">Ready to plug your retention leaks?</span>
        <button
          onClick={() => { track('cta_click', { location: 'sticky' }); open('sticky'); }}
          className="px-6 py-3 rounded-2xl bg-[#C9A227] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(201, 162, 39,0.2)]"
        >
          Secure Audit
        </button>
        <button 
          aria-label="Dismiss" 
          onClick={() => { sessionStorage.setItem(KEY, '1'); setShow(false); }} 
          className="p-2 text-white/20 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <style>{`@keyframes rfSlideUp { from { opacity: 0; transform: translateY(32px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }`}</style>
    </div>
  );
}
