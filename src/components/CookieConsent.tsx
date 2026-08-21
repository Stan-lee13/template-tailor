import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { loadConsent, saveConsent } from '../lib/consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const c = loadConsent();
    const gpcEnabled = Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl);
    if (gpcEnabled && !c.decided) {
      saveConsent({ analytics: false, marketing: false });
      return;
    }
    if (!c.decided) {
      const t = setTimeout(() => setVisible(true), 900);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const acceptAll = () => { saveConsent({ analytics: true, marketing: true }); setVisible(false); };
  const savePrefs = () => { saveConsent({ analytics, marketing }); setVisible(false); };
  const rejectAll = () => { saveConsent({ analytics: false, marketing: false }); setVisible(false); };

  // Mobile collapsed pill
  if (!expanded) {
    return (
      <div className="fixed bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto z-[150] sm:max-w-[420px]" style={{ animation: 'rfSlideUp 600ms cubic-bezier(.2,.7,.2,1)' }}>
        <div role="dialog" aria-label="Cookie preferences" aria-live="polite" className="sm:hidden flex items-center justify-between gap-4 rounded-3xl px-6 py-4 bg-black/80 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Intelligence Access</span>
          <div className="flex items-center gap-2">
            <button type="button" onClick={acceptAll} className="px-4 py-2 rounded-xl bg-[#C56A4A] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">Accept</button>
            <button type="button" onClick={() => setExpanded(true)} aria-label="Manage cookie preferences" aria-expanded={expanded} className="text-white/60 hover:text-white transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>
        <div className="hidden sm:block">
          {renderFull()}
        </div>
        <style>{`@keyframes rfSlideUp { from { opacity: 0; transform: translateY(32px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }`}</style>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto z-[150] sm:max-w-[420px]" style={{ animation: 'rfSlideUp 600ms cubic-bezier(.2,.7,.2,1)' }}>
      {renderFull()}
      <style>{`@keyframes rfSlideUp { from { opacity: 0; transform: translateY(32px); filter: blur(10px); } to { opacity: 1; transform: translateY(0); filter: blur(0); } }`}</style>
    </div>
  );

  function renderFull() {
    return (
      <div role="dialog" aria-label="Cookie preferences" aria-live="polite" className="p-8 rounded-[2.5rem] bg-black/80 border border-white/10 backdrop-blur-xl shadow-[0_20px_100px_rgba(0,0,0,0.8)]">
        <h4 className="text-xl font-black text-white tracking-tighter mb-4">Intelligence <span className="text-[#C56A4A]">Access</span></h4>
        <p className="text-sm font-medium leading-relaxed text-white/40 mb-8">
          We use minimal cookies to optimize your retention intelligence experience. Review our{' '}
          <Link to="/cookies" className="text-[#C56A4A] hover:text-white transition-colors">protocol policy</Link>.
        </p>
        {showPrefs && (
          <div className="mb-8 space-y-6 pt-8 border-t border-white/5">
            <Toggle label="Essential" description="Required for system integrity" checked disabled />
            <Toggle label="Analytics" description="Anonymous intelligence gathering" checked={analytics} onChange={setAnalytics} />
            <Toggle label="Marketing" description="Targeted protocol updates" checked={marketing} onChange={setMarketing} />
          </div>
        )}
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button type="button" onClick={acceptAll} className="flex-1 px-8 py-4 rounded-2xl bg-[#C56A4A] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(197,106,74,0.2)]">Accept All</button>
            <button type="button" onClick={() => setShowPrefs(!showPrefs)} aria-label={showPrefs ? 'Hide cookie preferences' : 'Manage cookie preferences'} aria-expanded={showPrefs} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div className="flex items-center justify-between px-2">
            <button type="button" onClick={rejectAll} className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-rose-500 transition-colors">Reject Non-Essential</button>
            {showPrefs && (
              <button type="button" onClick={savePrefs} className="text-[10px] font-black uppercase tracking-widest text-[#C56A4A] hover:text-white transition-colors">Save Selection</button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function Toggle({ label, description, checked, disabled, onChange }: { label: string; description: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer" style={{ opacity: disabled ? 0.7 : 1 }}>
      <span className="relative inline-block flex-shrink-0 mt-0.5" style={{ width: 32, height: 18 }}>
        <input type="checkbox" aria-label={`${label} cookies`} checked={checked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="sr-only" />
        <span style={{ position: 'absolute', inset: 0, background: checked ? '#C56A4A' : 'rgba(255,255,255,0.1)', borderRadius: 9999, transition: 'background 160ms' }} />
        <span style={{ position: 'absolute', top: 2, left: checked ? 16 : 2, width: 14, height: 14, borderRadius: 9999, background: '#fff', transition: 'left 160ms' }} />
      </span>
      <span>
        <span className="block font-inter font-medium" style={{ fontSize: '12.5px', color: '#FFFFFF' }}>{label}</span>
        <span className="block font-inter" style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{description}</span>
      </span>
    </label>
  );
}
