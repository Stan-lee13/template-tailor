import { useEffect, useMemo, useRef } from 'react';

type Device = 'desktop' | 'tablet' | 'mobile';

export default function PreviewFrame({
  path,
  device,
  reloadKey,
}: {
  path: string;
  device: Device;
  reloadKey: number;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  const width = device === 'desktop' ? '100%' : device === 'tablet' ? '820px' : '390px';
  const maxHeight = 'calc(100vh - 180px)';

  // Send a "refresh" ping to iframe if it supports it, else rely on key change.
  useEffect(() => {
    try {
      ref.current?.contentWindow?.postMessage({ type: 'studio:refresh' }, '*');
    } catch {}
  }, [reloadKey]);

  const src = useMemo(() => {
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}studio_preview=1&k=${reloadKey}`;
  }, [path, reloadKey]);

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div 
        className="rounded-[2rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-700 bg-white" 
        style={{ width, maxWidth: '100%', height: '80vh' }}
      >
        <iframe
          ref={ref}
          key={reloadKey}
          src={src}
          title="Live preview"
          className="w-full h-full border-none block"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
