import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Save, Trash2 } from 'lucide-react';
import { logActivity } from '@/lib/activity';

type Page = {
  id: string;
  path: string;
  title: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  status: 'published' | 'draft' | 'archived';
  updated_at: string;
};

export default function PagesEditor() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selected, setSelected] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_pages').select('*').order('path');
    setPages((data as Page[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const createPage = async () => {
    const path = prompt('New page path (e.g. /promo)');
    if (!path) return;
    const { data, error } = await supabase.from('site_pages').insert({ path, title: path, status: 'draft' }).select().single();
    if (error) return toast.error(error.message);
    await logActivity('page.create', 'page', data.id, { path });
    toast.success('Page created');
    setPages((p) => [...p, data as Page]);
    setSelected(data as Page);
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase.from('site_pages').update({
      title: selected.title, meta_title: selected.meta_title, meta_description: selected.meta_description,
      og_image_url: selected.og_image_url, status: selected.status,
    }).eq('id', selected.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    await logActivity('page.update', 'page', selected.id);
    toast.success('Saved');
    load();
  };

  const remove = async (p: Page) => {
    if (!confirm(`Delete page ${p.path}? This only removes metadata; the actual route is defined in code.`)) return;
    const { error } = await supabase.from('site_pages').delete().eq('id', p.id);
    if (error) return toast.error(error.message);
    await logActivity('page.delete', 'page', p.id, { path: p.path });
    setSelected(null); load();
  };

  return (
    <StudioLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Route <span className="text-gradient-cyan">Intelligence</span></h1>
          <p className="text-white/40 font-medium">SEO and metadata parameters for every system route.</p>
        </div>
        <button 
          onClick={createPage} 
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#C9A227] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(201, 162, 39,0.2)]"
        >
          <Plus size={18} strokeWidth={3} /> Inject Route
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-8">
        <aside className="rounded-[2.5rem] overflow-hidden max-h-[70vh] overflow-y-auto bg-black border border-white/10 scrollbar-hide">
          {loading ? (
            <div className="p-12 flex flex-col items-center gap-4 text-white/20 font-black text-xs uppercase tracking-widest">
              <div className="w-6 h-6 rounded-full border-2 border-white/5 border-t-[#C9A227] animate-spin" />
              Syncing...
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {pages.map((p) => (
                <button 
                  key={p.id} 
                  onClick={() => setSelected(p)} 
                  className={`w-full text-left px-8 py-6 transition-all duration-500 ${selected?.id === p.id ? 'bg-white/5 border-l-4 border-l-[#C9A227]' : 'hover:bg-white/[0.02]'}`}
                >
                  <div className={`font-black text-sm tracking-tight mb-1 ${selected?.id === p.id ? 'text-white' : 'text-white/40'}`}>
                    {p.title || p.path}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-white/20">{p.path}</div>
                </button>
              ))}
            </div>
          )}
        </aside>

        {selected ? (
          <div className="rounded-[2.5rem] p-10 lg:p-12 bg-black border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center justify-between gap-6 mb-12 relative z-10">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A227] mb-2">{selected.path}</p>
                <h2 className="text-3xl font-black text-white tracking-tighter">{selected.title || 'Untitled Node'}</h2>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => remove(selected)} 
                  className="p-4 rounded-2xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                  title="Delete Route"
                >
                  <Trash2 size={18} strokeWidth={3} />
                </button>
                <button 
                  onClick={save} 
                  disabled={saving} 
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-[#C9A227] transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                >
                  <Save size={18} strokeWidth={3} /> {saving ? 'SYNCING...' : 'SAVE DATA'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">System Title</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all duration-300" 
                  value={selected.title || ''} 
                  onChange={(e) => setSelected({ ...selected, title: e.target.value })} 
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">Deployment Status</label>
                <select 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-[#C9A227]/50 transition-all cursor-pointer" 
                  value={selected.status} 
                  onChange={(e) => setSelected({ ...selected, status: e.target.value as Page['status'] })}
                >
                  <option value="published" className="bg-black">LIVE</option>
                  <option value="draft" className="bg-black">STAGING</option>
                  <option value="archived" className="bg-black">ARCHIVED</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">SEO Meta Title</label>
                <div className="relative">
                  <input 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all duration-300" 
                    value={selected.meta_title || ''} 
                    onChange={(e) => setSelected({ ...selected, meta_title: e.target.value })} 
                  />
                  <div className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black ${(selected.meta_title || '').length > 60 ? 'text-rose-500' : 'text-white/20'}`}>
                    {(selected.meta_title || '').length}/60
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">SEO Meta Description</label>
                <div className="relative">
                  <textarea 
                    rows={3} 
                    className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-medium text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all duration-300 resize-none" 
                    value={selected.meta_description || ''} 
                    onChange={(e) => setSelected({ ...selected, meta_description: e.target.value })} 
                  />
                  <div className={`absolute right-6 bottom-4 text-[10px] font-black ${(selected.meta_description || '').length > 160 ? 'text-rose-500' : 'text-white/20'}`}>
                    {(selected.meta_description || '').length}/160
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/30 ml-4">OG Intelligence Asset URL</label>
                <input 
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#C9A227]/50 transition-all duration-300" 
                  value={selected.og_image_url || ''} 
                  onChange={(e) => setSelected({ ...selected, og_image_url: e.target.value })} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] p-20 text-center bg-black border border-white/10">
            <div className="w-16 h-16 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 animate-pulse">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227]"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            </div>
            <p className="text-white/40 font-medium">Select a route node to configure intelligence parameters.</p>
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
