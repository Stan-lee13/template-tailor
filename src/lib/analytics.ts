import { GA_ID } from '../config/site';
import { loadConsent } from './consent';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

let initialized = false;

export function initAnalytics() {
  if (initialized || !GA_ID) return;
  const consent = loadConsent();
  if (!consent.analytics) return;

  initialized = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });
}

export function track(event: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;
  if (window.gtag) window.gtag('event', event, params);
  // Always console-log in dev for debugging
  if (import.meta.env.DEV) console.debug('[track]', event, params);
}

if (typeof window !== 'undefined') {
  window.addEventListener('rf:consent', () => initAnalytics());
}
