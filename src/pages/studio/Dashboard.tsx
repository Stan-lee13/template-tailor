import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';

type Stats = { total: number; published: number; drafts: number; scheduled: number };
type TopPost = { id: string; title: string; slug: string; view_count: number; status: string };

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
      <p className="font-inter text-xs uppercase tracking-wider mb-2" style={{ color: '#888' }}>{label}</p>
      <p className="font-outfit text-3xl sm:text-4xl font-medium" style={{ color: accent || '#0A0A0A', letterSpacing: '-0.02em' }}>{value}</p>
    </div>
  );
}

export default function StudioDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0, scheduled: 0 });
  const [top, setTop] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [all, pub, drafts, sched, topRes] = await Promise.all([
        supabase.from('posts').select('id', { count: 'exact', head: true }),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'scheduled'),
        supabase.from('posts').select('id, title, slug, view_count, status').order('view_count', { ascending: false }).limit(5),
      ]);
      setStats({
        total: all.count || 0,
        published: pub.count || 0,
        drafts: drafts.count || 0,
        scheduled: sched.count || 0,
      });
      setTop((topRes.data as TopPost[]) || []);
      setLoading(false);
    })();
  }, []);

  return (
    <StudioLayout>
      <div className="mb-8">
        <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Dashboard</h1>
        <p className="font-inter text-sm" style={{ color: '#666' }}>Overview of your content.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
        <Stat label="Total posts" value={stats.total} />
        <Stat label="Published" value={stats.published} accent="#10B981" />
        <Stat label="Drafts" value={stats.drafts} accent="#F97316" />
        <Stat label="Scheduled" value={stats.scheduled} accent="#4169E1" />
      </div>
      <div className="rounded-xl p-5 sm:p-6" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-outfit text-lg font-medium" style={{ color: '#0A0A0A' }}>Most viewed</h2>
          <Link to="/studio/posts" className="font-inter text-xs" style={{ color: '#F97316' }}>All posts →</Link>
        </div>
        {loading ? (
          <p className="font-inter text-sm" style={{ color: '#888' }}>Loading…</p>
        ) : top.length === 0 ? (
          <p className="font-inter text-sm" style={{ color: '#888' }}>No posts yet. <Link to="/studio/posts/new" style={{ color: '#F97316' }}>Create your first one →</Link></p>
        ) : (
          <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
            {top.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between gap-4">
                <Link to={`/studio/posts/${p.id}`} className="font-inter text-sm truncate hover:underline" style={{ color: '#0A0A0A' }}>{p.title || '(untitled)'}</Link>
                <span className="font-inter text-xs tabular-nums whitespace-nowrap" style={{ color: '#888' }}>{p.view_count} views</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StudioLayout>
  );
}
