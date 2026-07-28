import { useEffect, useState, useRef } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Trash2, Copy, Check } from 'lucide-react';
import { getMediaUrl } from '@/lib/storage';
import { logActivity } from '@/lib/activity';

type Asset = { id: string; filename: string; storage_path: string; mime: string | null; size_bytes: number | null; created_at: string };

export default function MediaLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_assets').select('id, filename, storage_path, mime, size_bytes, created_at').order('created_at', { ascending: false });
    const list = (data || []) as Asset[];
    setAssets(list);
    const map: Record<string, string> = {};
    await Promise.all(list.map(async (a) => { const u = await getMediaUrl(a.storage_path); if (u) map[a.id] = u; }));
    setUrls(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not signed in');
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop() || 'bin';
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('post-media').upload(path, file, { contentType: file.type });
        if (upErr) throw upErr;
        const { error: dbErr } = await supabase.from('media_assets').insert({
          filename: file.name, storage_path: path, storage_bucket: 'post-media', mime: file.type, size_bytes: file.size, uploaded_by: user.id,
        });
        if (dbErr) throw dbErr;
      }
      await logActivity('media.upload', 'media', undefined, { count: files.length });
      toast.success('Uploaded');
      load();
    } catch (e: any) { toast.error(e.message); } finally { setUploading(false); }
  };

  const remove = async (a: Asset) => {
    if (!confirm(`Delete ${a.filename}? References across the site will break.`)) return;
    await supabase.storage.from('post-media').remove([a.storage_path]);
    await supabase.from('media_assets').delete().eq('id', a.id);
    await logActivity('media.delete', 'media', a.id, { filename: a.filename });
    toast.success('Deleted');
    load();
  };

  const copy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  return (
    <StudioLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Media <span className="text-gradient-cyan">Assets</span></h1>
          <p className="text-white/40 font-medium">{assets.length} visual components in the cluster.</p>
        </div>
        <div>
          <input ref={inputRef} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
          <button 
            onClick={() => inputRef.current?.click()} 
            disabled={uploading} 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(0,212,255,0.2)] disabled:opacity-50"
          >
            <Upload size={18} strokeWidth={3} /> {uploading ? 'SYNCING...' : 'UPLOAD ASSETS'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
          <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#00D4FF] animate-spin" />
          Synchronizing Library...
        </div>
      ) : assets.length === 0 ? (
          <div className="rounded-[2.5rem] p-20 text-center bg-black border border-white/10">
            <p className="text-white/40 font-medium mb-8">Library empty. Initiate upload to populate.</p>
            <button 
              onClick={() => inputRef.current?.click()}
              className="text-xs font-black uppercase tracking-widest text-[#00D4FF] hover:text-white transition-colors duration-300"
            >
              Inject First Asset →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {assets.map((a) => {
              const url = urls[a.id];
              const isImg = a.mime?.startsWith('image/');
              return (
                <div key={a.id} className="group relative rounded-3xl overflow-hidden bg-black border border-white/10 hover:border-[#00D4FF]/30 transition-all duration-500">
                  <div className="aspect-square bg-white/5 flex items-center justify-center overflow-hidden">
                    {isImg && url ? (
                      <img src={url} alt={a.filename} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20">{a.mime?.split('/')[1] || 'bin'}</span>
                      </div>
                    )}
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                      <button 
                        onClick={() => url && copy(a.id, url)} 
                        className="p-3 rounded-xl bg-[#00D4FF] text-black hover:bg-white transition-all"
                        title="Copy Source URL"
                      >
                        {copiedId === a.id ? <Check size={16} strokeWidth={3} /> : <Copy size={16} strokeWidth={3} />}
                      </button>
                      <button 
                        onClick={() => remove(a)} 
                        className="p-3 rounded-xl bg-rose-500 text-white hover:bg-rose-400 transition-all"
                        title="Delete Asset"
                      >
                        <Trash2 size={16} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/5">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate mb-1" title={a.filename}>{a.filename}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">{a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : 'SYSTEM'}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </StudioLayout>
  );
}
