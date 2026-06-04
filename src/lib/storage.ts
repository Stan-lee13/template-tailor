import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'post-media';

export async function uploadPostMedia(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('File must be ≤ 5MB');
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
    throw new Error('Only JPG, PNG, WebP, or GIF allowed');
  }
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: '31536000', upsert: false });
  if (error) throw error;
  return path; // store path; resolve to signed URL on render
}

// Cache signed URLs in-memory to avoid re-signing on every render.
const urlCache = new Map<string, { url: string; expires: number }>();

export async function getMediaUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http')) return pathOrUrl;
  const cached = urlCache.get(pathOrUrl);
  if (cached && cached.expires > Date.now()) return cached.url;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(pathOrUrl, 60 * 60 * 24 * 7); // 7d
  if (error || !data) return null;
  urlCache.set(pathOrUrl, { url: data.signedUrl, expires: Date.now() + 1000 * 60 * 60 * 24 * 6 });
  return data.signedUrl;
}

export function useMediaUrl(path: string | null | undefined): string | null {
  // simple sync-ish wrapper: callers should use SignedImage component instead.
  return path && path.startsWith('http') ? path : null;
}
