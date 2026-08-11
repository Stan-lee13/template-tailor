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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose}>
      <div className="w-full max-w-6xl max-h-[90vh] flex flex-col bg-black border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-10 py-8 border-b border-white/10 bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white">Asset Cluster</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mt-1">Select protocol for injection</p>
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#C9A227] text-black text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all hover:bg-white shadow-[0_0_20px_rgba(201, 162, 39,0.2)]">
              <Upload size={16} strokeWidth={3} /> {uploading ? 'Syncing...' : 'Upload Asset'}
              <input type="file" accept="image/*,video/*" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            <button 
              onClick={onClose} 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          {loading ? (
            <div className="flex items-center justify-center py-24 text-[10px] font-black uppercase tracking-widest text-[#C9A227] animate-pulse">Syncing Signal...</div>
          ) : assets.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/10">Zero assets detected in cluster.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {assets.map((a) => (
                <button 
                  key={a.id} 
                  onClick={() => a.url && (onPick(a.url), onClose())} 
                  className="group relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02] hover:border-[#C9A227]/30 transition-all duration-500"
                >
                  {a.url && a.mime?.startsWith('image/') ? (
                    <img src={a.url} alt={a.alt || a.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  ) : (
                    <div className="flex items-center justify-center h-full p-6 text-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/20 break-all">{a.filename}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C9A227]">Inject Asset</span>
                  </div>
                </button>
              ))}
            </div>
          )
          }
        </div>
      </div>
    </div>
  );
}
