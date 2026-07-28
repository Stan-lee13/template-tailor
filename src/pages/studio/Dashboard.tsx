import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';

type Stats = { total: number; published: number; drafts: number; scheduled: number };
type TopPost = { id: string; title: string; slug: string; view_count: number; status: string };

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-3xl p-8 bg-black border border-white/10 hover:border-[#00D4FF]/30 transition-all duration-500 group">
      <p className="font-black text-[10px] uppercase tracking-[0.2em] text-white/30 mb-4 group-hover:text-[#00D4FF] transition-colors duration-500">{label}</p>
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
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Command <span className="text-gradient-cyan">Center</span></h1>
        <p className="text-white/40 font-medium">Your retention engine performance at a glance.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Stat label="Total Systems" value={stats.total} />
        <Stat label="Live Assets" value={stats.published} accent="#10B981" />
        <Stat label="In Development" value={stats.drafts} accent="#00D4FF" />
        <Stat label="Pipeline" value={stats.scheduled} accent="#4169E1" />
      </div>
      
      <div className="rounded-[2.5rem] p-10 bg-black border border-white/10">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-black text-white tracking-tight">Top Performing Assets</h2>
          <Link to="/studio/posts" className="text-xs font-black uppercase tracking-widest text-[#00D4FF] hover:text-white transition-colors duration-300">View All Systems →</Link>
        </div>
        {loading ? (
          <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
            <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#00D4FF] animate-spin" />
            Synchronizing...
          </div>
        ) : top.length === 0 ? (
          <p className="text-white/40 font-medium">No assets deployed yet. <Link to="/studio/posts/new" className="text-[#00D4FF] underline underline-offset-4">Deploy your first system →</Link></p>
        ) : (
          <div className="space-y-4">
            {top.map((p) => (
              <Link 
                key={p.id} 
                to={`/studio/posts/${p.id}`} 
                className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 hover:bg-white/[0.08] transition-all duration-500 group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20 group-hover:text-[#00D4FF] transition-colors duration-500">
                    {p.status === 'published' ? '●' : '○'}
                  </div>
                  <span className="text-lg font-black text-white group-hover:translate-x-2 transition-transform duration-500">{p.title || '(untitled)'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black tabular-nums text-white/20 tracking-widest">{p.view_count} IMPRESSIONS</span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </StudioLayout>
  );
}
