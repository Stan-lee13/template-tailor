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
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#000000', letterSpacing: '-0.02em' }}>Pages</h1>
          <p className="font-inter text-sm" style={{ color: '#666' }}>SEO metadata for every route on the site.</p>
        </div>
        <button onClick={createPage} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter text-sm font-medium" style={{ background: '#00D4FF', color: '#000000' }}>
          <Plus size={16} /> New page
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-4">
        <aside className="rounded-xl overflow-hidden max-h-[70vh] overflow-y-auto" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
          {loading ? <p className="p-4 font-inter text-sm text-gray-500">Loading…</p> :
            <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
              {pages.map((p) => (
                <li key={p.id}>
                  <button onClick={() => setSelected(p)} className={`w-full text-left px-3 py-2.5 font-inter text-sm ${selected?.id === p.id ? 'bg-orange-50' : 'hover:bg-black/[0.02]'}`}>
                    <div className="font-medium truncate">{p.title || p.path}</div>
                    <div className="text-xs" style={{ color: '#888' }}>{p.path}</div>
                  </button>
                </li>
              ))}
            </ul>
          }
        </aside>

        {selected ? (
          <div className="rounded-xl p-5 sm:p-6 space-y-4" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-inter text-xs uppercase tracking-wider" style={{ color: '#888' }}>{selected.path}</p>
                <h2 className="font-outfit text-xl font-medium">{selected.title || 'Untitled'}</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={() => remove(selected)} className="p-2 rounded hover:bg-red-50"><Trash2 size={16} color="#dc2626" /></button>
                <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-3 py-2 rounded-md font-inter text-sm font-medium disabled:opacity-50" style={{ background: '#00D4FF', color: '#000000' }}><Save size={14} />{saving ? '…' : 'Save'}</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Title</label>
                <input className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={selected.title || ''} onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
              </div>
              <div>
                <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Status</label>
                <select className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={selected.status} onChange={(e) => setSelected({ ...selected, status: e.target.value as Page['status'] })}>
                  <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Meta title</label>
                <input className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={selected.meta_title || ''} onChange={(e) => setSelected({ ...selected, meta_title: e.target.value })} />
                <p className="font-inter text-xs mt-1" style={{ color: selected.meta_title && selected.meta_title.length > 60 ? '#dc2626' : '#888' }}>{(selected.meta_title || '').length}/60</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Meta description</label>
                <textarea rows={2} className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={selected.meta_description || ''} onChange={(e) => setSelected({ ...selected, meta_description: e.target.value })} />
                <p className="font-inter text-xs mt-1" style={{ color: (selected.meta_description || '').length > 160 ? '#dc2626' : '#888' }}>{(selected.meta_description || '').length}/160</p>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Open Graph image URL</label>
                <input className="w-full px-3 py-2 rounded-md border font-inter text-sm" style={{ borderColor: '#E2DDD3' }} value={selected.og_image_url || ''} onChange={(e) => setSelected({ ...selected, og_image_url: e.target.value })} />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-8 text-center" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
            <p className="font-inter text-sm" style={{ color: '#666' }}>Select a page from the list to edit its SEO.</p>
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
