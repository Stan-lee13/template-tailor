import { useEffect, useState, ImgHTMLAttributes } from 'react';
import { getMediaUrl } from '@/lib/storage';

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  path: string | null | undefined;
  fallback?: string;
}

export default function SignedImage({ path, fallback, ...rest }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!path) { setSrc(fallback || null); return; }
    if (path.startsWith('http')) { setSrc(path); return; }
    getMediaUrl(path).then((u) => { if (!cancelled) setSrc(u || fallback || null); });
    return () => { cancelled = true; };
  }, [path, fallback]);
  if (!src) return null;
  return <img src={src} {...rest} />;
}
