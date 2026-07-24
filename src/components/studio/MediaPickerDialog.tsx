import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

type Asset = { id: string; storage_bucket: string; storage_path: string; filename: string; mime: string | null; alt: string | null };

async function toUrl(a: Asset): Promise<string | null> {
  const { data } = await supabase.storage.from(a.storage_bucket).createSignedUrl(a.storage_path, 60 * 60 * 24 * 7);
  return data?.signedUrl ?? null;
}

export default function MediaPickerDialog({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (url: string) => void }) {
  const [assets, setAssets] = useState<(Asset & { url?: string | null })[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(60);
    const rows = (data as Asset[]) || [];
    const withUrls = await Promise.all(rows.map(async (a) => ({ ...a, url: await toUrl(a) })));
    setAssets(withUrls);
    setLoading(false);
  };

  useEffect(() => { if (open) load(); }, [open]);

  const upload = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'bin';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('site-media').upload(path, file, { cacheControl: '31536000', upsert: false });
      if (upErr) throw upErr;
      const { data: { user } } = await supabase.auth.getUser();
      const { error: insErr } = await supabase.from('media_assets').insert({
        storage_bucket: 'site-media', storage_path: path, filename: file.name, mime: file.type,
        size_bytes: file.size, uploaded_by: user?.id,
      });
      if (insErr) throw insErr;
      toast.success('Uploaded');
      await load();
    } catch (e: any) { toast.error(e.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col" style={{ background: '#fff' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#E2DDD3' }}>
          <h3 className="font-outfit font-medium text-lg">Pick media</h3>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-inter text-sm cursor-pointer" style={{ background: '#000000', color: '#fff' }}>
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? <p className="font-inter text-sm text-gray-500">Loading…</p> :
            assets.length === 0 ? <p className="font-inter text-sm text-gray-500">No media yet — upload something.</p> :
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {assets.map((a) => (
                <button key={a.id} onClick={() => a.url && (onPick(a.url), onClose())} className="group relative aspect-square rounded-lg overflow-hidden border hover:ring-2 hover:ring-orange-500" style={{ borderColor: '#E2DDD3', background: '#f5f5f5' }}>
                  {a.url && a.mime?.startsWith('image/') ? (
                    <img src={a.url} alt={a.alt || a.filename} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xs text-gray-500 p-2 text-center break-all">{a.filename}</div>
                  )}
                </button>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
