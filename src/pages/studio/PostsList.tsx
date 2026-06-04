import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

type Row = { id: string; title: string; slug: string; status: string; updated_at: string; published_at: string | null; view_count: number };

const statusColors: Record<string, string> = {
  draft: '#F97316',
  scheduled: '#4169E1',
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
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Posts</h1>
          <p className="font-inter text-sm" style={{ color: '#666' }}>{rows.length} total</p>
        </div>
        <Link to="/studio/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md font-inter text-sm font-medium self-start"
          style={{ background: '#F97316', color: '#0A0A0A' }}>
          <Plus size={16} /> New post
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or slug…"
          className="flex-1 px-3 py-2 rounded-md font-inter text-sm border focus:outline-none focus:border-black"
          style={{ borderColor: '#E2DDD3', background: '#fff' }} />
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
          className="px-3 py-2 rounded-md font-inter text-sm border"
          style={{ borderColor: '#E2DDD3', background: '#fff' }}>
          <option value="all">All statuses</option>
          <option value="draft">Drafts</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
        {loading ? (
          <div className="p-8 text-center font-inter text-sm" style={{ color: '#888' }}>Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-inter text-sm mb-3" style={{ color: '#666' }}>No posts yet.</p>
            <Link to="/studio/posts/new" className="font-inter text-sm" style={{ color: '#F97316' }}>Create your first post →</Link>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
            {filtered.map((r) => (
              <li key={r.id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 hover:bg-black/[0.02]">
                <div className="flex-1 min-w-0">
                  <Link to={`/studio/posts/${r.id}`} className="font-outfit font-medium text-base sm:text-lg block truncate" style={{ color: '#0A0A0A' }}>
                    {r.title || '(untitled)'}
                  </Link>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="font-inter text-[11px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: `${statusColors[r.status]}20`, color: statusColors[r.status] }}>{r.status}</span>
                    <span className="font-inter text-xs truncate" style={{ color: '#888' }}>/{r.slug}</span>
                    <span className="font-inter text-xs" style={{ color: '#888' }}>{r.view_count} views</span>
                  </div>
                </div>
                <button onClick={() => remove(r.id)} className="p-2 rounded hover:bg-red-50" title="Delete">
                  <Trash2 size={16} color="#dc2626" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StudioLayout>
  );
}
