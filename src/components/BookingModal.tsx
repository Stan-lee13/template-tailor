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
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(10,10,10,0.72)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', animation: 'rfFade 220ms ease-out' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="relative w-full max-w-[920px] rounded-2xl overflow-hidden"
        style={{ background: '#f1ece4', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.5)', maxHeight: '92vh', animation: 'rfScale 260ms cubic-bezier(.2,.7,.2,1)' }}
      >
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b" style={{ borderColor: '#E2DDD3' }}>
          <div>
            <p className="font-inter text-[11px] uppercase tracking-wider" style={{ color: '#8A8A8A', letterSpacing: '0.06em' }}>
              Free 30-min Growth Audit
            </p>
            <h3 className="font-outfit font-medium" style={{ fontSize: '18px', color: '#0A0A0A' }}>
              Book a call with {SITE.name}
            </h3>
          </div>
          <button
            onClick={close}
            aria-label="Close"
            className="rounded-full p-2 transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
          </button>
        </div>

        <div style={{ height: 'min(720px, 78vh)', background: '#fff' }}>
          {CALENDLY_URL ? (
            <div ref={containerRef} style={{ height: '100%', minWidth: '320px' }} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <p className="font-inter text-sm mb-3" style={{ color: '#555' }}>Booking link not configured yet.</p>
              <a href={`mailto:${SITE.email}?subject=Growth Audit Request`} className="font-inter font-medium text-white" style={{ background: '#F97316', padding: '12px 28px', borderRadius: '9999px' }}>
                Email us instead
              </a>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes rfFade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes rfScale { from { opacity: 0; transform: translateY(12px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}
