import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadConsent, saveConsent } from '../lib/consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = loadConsent();
    if (!c.decided) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => { saveConsent({ analytics: true, marketing: true }); setVisible(false); };
  const savePrefs = () => { saveConsent({ analytics, marketing }); setVisible(false); };
  const rejectAll = () => { saveConsent({ analytics: false, marketing: false }); setVisible(false); };

  return (
    <div
      className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto z-[150] sm:max-w-[380px]"
      style={{
        background: 'rgba(241,236,228,0.92)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(10,10,10,0.08)',
        borderRadius: '16px',
        padding: '18px',
        boxShadow: '0 20px 50px -12px rgba(0,0,0,0.18)',
        animation: 'rfSlideUp 420ms cubic-bezier(.2,.7,.2,1)',
      }}
    >
      <h4 className="font-outfit font-medium mb-1.5" style={{ fontSize: '15px', color: '#0A0A0A' }}>
        We use cookies
      </h4>
      <p className="font-inter mb-3" style={{ fontSize: '13px', lineHeight: 1.55, color: '#2D2D2D' }}>
        We use a small number of cookies to understand how the site is used and improve it. See our{' '}
        <Link to="/cookies" className="underline underline-offset-2" style={{ color: '#0A0A0A' }}>cookie policy</Link>.
      </p>

      {showPrefs && (
        <div className="mb-3 mt-2 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(10,10,10,0.08)', paddingTop: '12px' }}>
          <Toggle label="Essential" description="Required for the site to function" checked disabled />
          <Toggle label="Analytics" description="Anonymous usage statistics" checked={analytics} onChange={setAnalytics} />
          <Toggle label="Marketing" description="Personalized content and ads" checked={marketing} onChange={setMarketing} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={acceptAll}
          className="font-inter font-medium text-white flex-1 sm:flex-none"
          style={{ background: '#0A0A0A', padding: '9px 18px', borderRadius: '9999px', fontSize: '13px' }}
        >
          Accept all
        </button>
        {showPrefs ? (
          <button onClick={savePrefs} className="font-inter font-medium" style={{ background: 'transparent', padding: '9px 14px', borderRadius: '9999px', fontSize: '13px', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.18)' }}>
            Save preferences
          </button>
        ) : (
          <button onClick={() => setShowPrefs(true)} className="font-inter font-medium" style={{ background: 'transparent', padding: '9px 14px', borderRadius: '9999px', fontSize: '13px', color: '#0A0A0A', border: '1px solid rgba(10,10,10,0.18)' }}>
            Preferences
          </button>
        )}
        <button onClick={rejectAll} className="font-inter text-xs underline underline-offset-2" style={{ color: '#555' }}>
          Reject
        </button>
      </div>

      <style>{`@keyframes rfSlideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }`}</style>
    </div>
  );
}

function Toggle({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer" style={{ opacity: disabled ? 0.7 : 1 }}>
      <span className="relative inline-block flex-shrink-0 mt-0.5" style={{ width: 32, height: 18 }}>
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <span style={{ position: 'absolute', inset: 0, background: checked ? '#0A0A0A' : 'rgba(10,10,10,0.18)', borderRadius: 9999, transition: 'background 160ms' }} />
        <span style={{ position: 'absolute', top: 2, left: checked ? 16 : 2, width: 14, height: 14, borderRadius: 9999, background: '#fff', transition: 'left 160ms' }} />
      </span>
      <span>
        <span className="block font-inter font-medium" style={{ fontSize: '12.5px', color: '#0A0A0A' }}>{label}</span>
        <span className="block font-inter" style={{ fontSize: '11.5px', color: '#555', lineHeight: 1.4 }}>{description}</span>
      </span>
    </label>
  );
}
