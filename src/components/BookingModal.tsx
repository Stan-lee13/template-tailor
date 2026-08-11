import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';
import { CALENDLY_URL, SITE } from '../config/site';
import { track } from '../lib/analytics';

let scriptLoaded = false;
function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded || (window as any).Calendly) {
      scriptLoaded = true;
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = () => { scriptLoaded = true; resolve(); };
    document.head.appendChild(s);

    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
  });
}

export default function BookingModal() {
  const { isOpen, close } = useBooking();
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';

    if (CALENDLY_URL && containerRef.current) {
      loadCalendlyScript().then(() => {
        if (!containerRef.current) return;
        containerRef.current.innerHTML = '';
        (window as any).Calendly?.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: containerRef.current,
          prefill: {},
          utm: {},
        });
      });
    }

    const onMessage = (e: MessageEvent) => {
      if (typeof e.data === 'object' && e.data?.event === 'calendly.event_scheduled') {
        track('booking_scheduled', {});
        setTimeout(() => {
          close();
          try {
            navigate('/thank-you', { replace: true });
          } catch {
            window.location.assign('/thank-you');
          }
        }, 600);
      }
    };
    window.addEventListener('message', onMessage);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('message', onMessage);
      window.removeEventListener('keydown', onKey);
    };
  }, [isOpen, close, navigate]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-2xl"
      style={{ animation: 'rfFade 400ms ease-out' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="relative w-full max-w-4xl rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,1)]"
        style={{ maxHeight: '92vh', animation: 'rfScale 500ms cubic-bezier(.2,.7,.2,1)' }}
      >
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.02]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C9A227] mb-2">
              Growth Audit Protocol
            </p>
            <h3 className="text-xl lg:text-2xl font-black text-white tracking-tighter">
              Initiate Strategy Call
            </h3>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="bg-black" style={{ height: 'min(720px, 70vh)' }}>
          {CALENDLY_URL ? (
            <div ref={containerRef} className="h-full w-full" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <p className="text-white/40 font-medium mb-8">System link offline. Direct channel required.</p>
              <a 
                href={`mailto:${SITE.email}?subject=Growth Audit Request`} 
                className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#C9A227] text-black hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(201, 162, 39,0.2)]"
              >
                Inquire via Email
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes rfFade { from { opacity: 0; backdrop-filter: blur(0px); } to { opacity: 1; backdrop-filter: blur(24px); } }
        @keyframes rfScale { from { opacity: 0; transform: translateY(40px) scale(.95); filter: blur(10px); } to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } }
      `}</style>
    </div>
  );
}
