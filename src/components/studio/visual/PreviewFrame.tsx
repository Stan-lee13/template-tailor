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
    <div className="w-full h-full flex items-start justify-center overflow-auto p-4" style={{ background: '#111', backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a1a 0%, #0A0A0A 100%)' }}>
      <div className="rounded-lg overflow-hidden shadow-2xl transition-all duration-300" style={{ width, maxWidth: '100%', background: '#fff' }}>
        <iframe
          ref={ref}
          key={reloadKey}
          src={src}
          title="Live preview"
          style={{ width: '100%', height: maxHeight, minHeight: '640px', border: 'none', display: 'block' }}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
    </div>
  );
}
