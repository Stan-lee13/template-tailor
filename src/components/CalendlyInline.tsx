import { useEffect, useRef } from 'react';
import { CALENDLY_URL, SITE } from '../config/site';
import { loadCalendlyScript } from '../lib/calendly';
import { track } from '../lib/analytics';

type CalendlyInlineProps = {
  location?: string;
};

export default function CalendlyInline({ location = 'final_cta_inline' }: CalendlyInlineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CALENDLY_URL || !containerRef.current) return;
    let cancelled = false;
    const container = containerRef.current;

    loadCalendlyScript().then(() => {
      if (cancelled || !container) return;
      container.innerHTML = '';
      window.Calendly?.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: container,
        prefill: {},
        utm: {},
      });
    });

    const onMessage = (event: MessageEvent) => {
      if (typeof event.data === 'object' && event.data?.event === 'calendly.event_scheduled') {
        track('booking_scheduled', { location });
      }
    };
    window.addEventListener('message', onMessage);

    return () => {
      cancelled = true;
      window.removeEventListener('message', onMessage);
      container.innerHTML = '';
    };
  }, [location]);

  if (!CALENDLY_URL) {
    return (
      <div className="calendly-inline__fallback">
        <p>System link offline. Direct channel required.</p>
        <a href={`mailto:${SITE.email}?subject=Growth Audit Request`}>Inquire via Email <span aria-hidden="true">↗</span></a>
      </div>
    );
  }

  return <div ref={containerRef} className="calendly-inline__widget" aria-label="Book a RetentionFirm intro call" />;
}
