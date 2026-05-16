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
    <div className="fixed z-[140] right-6 bottom-6 hidden sm:block" style={{ animation: 'rfSlideUp 420ms cubic-bezier(.2,.7,.2,1)' }}>
      <div className="flex items-center gap-1 sm:gap-2 rounded-full" style={{ background: '#0A0A0A', padding: '5px 5px 5px 14px', boxShadow: '0 12px 30px -8px rgba(249,115,22,0.35)' }}>
        <span className="font-inter text-[12px] hidden md:inline" style={{ color: 'rgba(241,236,228,0.85)' }}>Ready to plug your retention leaks?</span>
        <ShimmerButton
          onClick={() => { track('cta_click', { location: 'sticky' }); open('sticky'); }}
          background="#F97316"
          className="font-inter font-medium"
          style={{ padding: '7px 14px', fontSize: '12.5px' }}
        >
          Book audit →
        </ShimmerButton>
        <button aria-label="Dismiss" onClick={() => { sessionStorage.setItem(KEY, '1'); setShow(false); }} className="rounded-full p-1.5" style={{ color: 'rgba(241,236,228,0.5)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        </button>
      </div>
      <style>{`@keyframes rfSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
}
