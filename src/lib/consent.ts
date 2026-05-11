export type ConsentState = {
  analytics: boolean;
  marketing: boolean;
  decided: boolean;
};

const KEY = 'rf_consent_v1';

export function loadConsent(): ConsentState {
  if (typeof window === 'undefined') return { analytics: false, marketing: false, decided: false };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { analytics: false, marketing: false, decided: false };
    const parsed = JSON.parse(raw);
    return { analytics: !!parsed.analytics, marketing: !!parsed.marketing, decided: true };
  } catch {
    return { analytics: false, marketing: false, decided: false };
  }
}

export function saveConsent(state: Omit<ConsentState, 'decided'>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('rf:consent', { detail: state }));
  } catch {}
}
