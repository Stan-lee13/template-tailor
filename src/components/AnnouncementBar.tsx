import { useSiteSettings } from '@/hooks/useSiteData';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBar() {
  const { data } = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);
  const a = data?.announcement;
  if (!a?.enabled || !a.text || dismissed) return null;
  const bg = a.variant === 'promo' ? '#F97316' : a.variant === 'warning' ? '#dc2626' : '#0A0A0A';
  const Wrapper = ({ children }: any) =>
    a.href ? <a href={a.href} className="block">{children}</a> : <div>{children}</div>;
  return (
    <div style={{ background: bg, color: '#f1ece4' }} className="relative z-[60] font-inter text-xs sm:text-sm">
      <div className="max-w-[1200px] mx-auto flex items-center justify-center gap-3 px-4 py-2 text-center">
        <Wrapper>
          <span>{a.text}</span>
        </Wrapper>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
