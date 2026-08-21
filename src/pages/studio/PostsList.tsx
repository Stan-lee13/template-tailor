import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Row = { id: string; title: string; slug: string; status: string; updated_at: string; published_at: string | null; view_count: number };

const statusColors: Record<string, string> = {
  draft: '#C56A4A',
  scheduled: '#D8A63D',
  published: '#10B981',
};

export default function PostsList() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let query = supabase.from('posts').select('id, title, slug, status, updated_at, published_at, view_count').order('updated_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data, error } = await query;
    if (error) toast.error(error.message);
    setRows((data as Row[]) || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [filter]);

  const filtered = rows.filter((r) => !q || r.title.toLowerCase().includes(q.toLowerCase()) || r.slug.includes(q.toLowerCase()));

  const remove = async (id: string) => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  return (
    <StudioLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Content <span className="text-gradient-warm">Assets</span></h1>
          <p className="text-white/40 font-medium">{rows.length} systems deployed in the engine.</p>
        </div>
        <Link to="/studio/posts/new"
          className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#C56A4A] text-black hover:bg-white transition-all duration-500 shadow-[0_0_20px_rgba(197,106,74,0.2)]"
        >
          <Plus size={18} strokeWidth={3} /> New Asset
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search assets by title or slug..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#C56A4A]/50 transition-all duration-300"
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C56A4A] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-[#C56A4A]/50 transition-all cursor-pointer"
        >
          <option value="all" className="bg-black">All Assets</option>
          <option value="draft" className="bg-black">Drafts</option>
          <option value="scheduled" className="bg-black">Pipeline</option>
          <option value="published" className="bg-black">Live</option>
        </select>
      </div>

      <div className="rounded-[2.5rem] overflow-hidden bg-black border border-white/10">
        {loading ? (
          <div className="p-20 flex flex-col items-center gap-4 text-white/20 font-black text-xs uppercase tracking-widest">
            <div className="w-8 h-8 rounded-full border-4 border-white/5 border-t-[#C56A4A] animate-spin" />
            Syncing Assets...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-white/40 font-medium mb-6">No assets matching your query.</p>
            <Link to="/studio/posts/new" className="text-xs font-black uppercase tracking-widest text-[#C56A4A] hover:text-white transition-colors duration-300">Deploy New Asset →</Link>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map((r) => (
              <div key={r.id} className="group flex items-center gap-6 px-8 py-8 hover:bg-white/[0.02] transition-all duration-500">
                <div className="flex-1 min-w-0">
                  <Link to={`/studio/posts/${r.id}`} className="text-xl font-black text-white tracking-tight block truncate group-hover:translate-x-2 transition-transform duration-500">
                    {r.title || '(untitled)'}
                  </Link>
                  <div className="flex flex-wrap items-center gap-6 mt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border" style={{ borderColor: `${statusColors[r.status]}30`, color: statusColors[r.status], background: `${statusColors[r.status]}10` }}>
                      {r.status}
                    </span>
                    <span className="text-xs font-black text-white/20 tracking-widest truncate max-w-[200px]">/{r.slug}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-xs font-black text-white/20 tracking-widest uppercase">{r.view_count} Impressions</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to={`/studio/posts/${r.id}`}
                    className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </Link>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-4 rounded-2xl bg-rose-500/5 text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
