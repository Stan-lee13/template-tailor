declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill: Record<string, unknown>;
        utm: Record<string, string>;
      }) => void;
    };
  }
}

let scriptLoaded = false;

export function loadCalendlyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (scriptLoaded || window.Calendly) {
      scriptLoaded = true;
      resolve();
      return;
    }

    const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
    const existingStylesheet = document.querySelector('link[href="https://assets.calendly.com/assets/external/widget.css"]');

    const script = existingScript instanceof HTMLScriptElement ? existingScript : document.createElement('script');
    script.setAttribute('src', 'https://assets.calendly.com/assets/external/widget.js');
    script.setAttribute('async', 'true');
    script.addEventListener('load', () => {
      scriptLoaded = true;
      resolve();
    }, { once: true });
    if (!existingScript) document.head.appendChild(script);

    if (!existingStylesheet) {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);
    }

    if (window.Calendly) {
      scriptLoaded = true;
      resolve();
    }
  });
}
