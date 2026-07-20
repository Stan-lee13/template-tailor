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
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Media library</h1>
          <p className="font-inter text-sm" style={{ color: '#666' }}>{assets.length} files</p>
        </div>
        <div>
          <input ref={inputRef} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
          <button onClick={() => inputRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter text-sm font-medium disabled:opacity-50" style={{ background: '#F97316', color: '#0A0A0A' }}>
            <Upload size={16} /> {uploading ? 'Uploading…' : 'Upload files'}
          </button>
        </div>
      </div>

      {loading ? <p className="font-inter text-sm">Loading…</p> :
        assets.length === 0 ? (
          <div className="rounded-xl p-10 text-center" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
            <p className="font-inter text-sm" style={{ color: '#666' }}>No files yet. Upload your first image to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {assets.map((a) => {
              const url = urls[a.id];
              const isImg = a.mime?.startsWith('image/');
              return (
                <div key={a.id} className="rounded-xl overflow-hidden group" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    {isImg && url ? <img src={url} alt={a.filename} className="w-full h-full object-cover" /> :
                      <span className="font-inter text-xs" style={{ color: '#888' }}>{a.mime || 'file'}</span>}
                  </div>
                  <div className="p-2.5">
                    <p className="font-inter text-xs truncate" style={{ color: '#0A0A0A' }} title={a.filename}>{a.filename}</p>
                    <p className="font-inter text-[10px]" style={{ color: '#888' }}>{a.size_bytes ? `${Math.round(a.size_bytes / 1024)} KB` : ''}</p>
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => url && copy(a.id, url)} className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded text-[11px] font-inter" style={{ background: '#f1ece4', color: '#0A0A0A' }}>
                        {copiedId === a.id ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy URL</>}
                      </button>
                      <button onClick={() => remove(a)} className="p-1 rounded hover:bg-red-50"><Trash2 size={12} color="#dc2626" /></button>
                    </div>
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
