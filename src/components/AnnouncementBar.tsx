import { useSiteSettings } from '@/hooks/useSiteData';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function AnnouncementBar() {
  const { data } = useSiteSettings();
  const [dismissed, setDismissed] = useState(false);
  const a = data?.announcement;
  if (!a?.enabled || !a.text || dismissed) return null;
  const bg = a.variant === 'promo' ? '#C56A4A' : a.variant === 'warning' ? '#F43F5E' : '#000000';
  const textColor = a.variant === 'promo' ? '#000000' : '#FFFFFF';
  const Wrapper = ({ children }: any) =>
    a.href ? <a href={a.href} className="block transition-all hover:opacity-80">{children}</a> : <div>{children}</div>;
  return (
    <div style={{ background: bg, color: textColor }} className="relative z-[60] font-black text-[10px] uppercase tracking-[0.2em] py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 px-6 text-center">
        <Wrapper>
          <span className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
            {a.text}
          </span>
        </Wrapper>
        <button onClick={() => setDismissed(true)} aria-label="Dismiss" className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity">
          <X size={14} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
