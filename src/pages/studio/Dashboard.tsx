
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';

type Stats = { total: number; published: number; drafts: number; scheduled: number };
type TopPost = { id: string; title: string; slug: string; view_count: number; status: string };

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-3xl p-8 bg-black border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-500 group">
      <p className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 group-hover:text-[#C56A4A] transition-colors duration-500">{label}</p>
      <p className="text-5xl font-black tracking-tighter" style={{ color: accent || '#FFFFFF' }}>{value}</p>
    </div>
  );
}

export default function StudioDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, drafts: 0, scheduled: 0 });
  const [top, setTop] = useState<TopPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: posts } = await supabase.from('posts').select('id, title, slug, view_count, status');
        if (posts) {
          const s = {
            total: posts.length,
            published: posts.filter(p => p.status === 'published').length,
            drafts: posts.filter(p => p.status === 'draft').length,
            scheduled: posts.filter(p => p.status === 'scheduled').length,
          };
          setStats(s);
          setTop(posts.sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5));
        }
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <StudioLayout>
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Command <span className="text-gradient-warm">Center</span></h1>
        <p className="text-white/40 font-medium">Your retention engine performance at a glance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Stat label="Total Systems" value={stats.total} />
        <Stat label="Live Assets" value={stats.published} accent="#10B981" />
        <Stat label="In Development" value={stats.drafts} accent="#C56A4A" />
        <Stat label="Pipeline" value={stats.scheduled} accent="#D8A63D" />
      </div>

      <div className="rounded-[2.5rem] p-10 bg-black border border-white/10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-white tracking-tight">Top Performing Assets</h2>
          <Link to="/studio/posts" className="text-xs font-black uppercase tracking-widest text-[#C56A4A] hover:text-white transition-colors duration-300">View All Systems →</Link>
        </div>
        {loading ? (
          <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
            Synchronizing...
          </div>
        ) : (
          <div className="space-y-4">
            {top.length > 0 ? top.map((p) => (
              <Link
                key={p.id}
                to={`/studio/posts/${p.id}`}
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08] transition-all duration-500 group"
              >
                <div className="flex items-center gap-6">
                  <div className={`w-2 h-2 rounded-full ${p.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <span className="text-lg font-black text-white group-hover:translate-x-2 transition-transform duration-500">{p.title}</span>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-1">{p.view_count || 0} Impressions</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-[#C56A4A] group-hover:text-black transition-all duration-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </Link>
            )) : (
              <p className="text-white/20 font-medium">No assets found yet.</p>
            )}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
