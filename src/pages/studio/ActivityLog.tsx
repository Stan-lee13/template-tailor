import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';

type Log = { id: string; action: string; entity_type: string | null; entity_id: string | null; actor_id: string | null; meta: any; created_at: string };

export default function ActivityLog() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(200);
      const list = (data as Log[]) || [];
      setLogs(list);
      const ids = [...new Set(list.map((l) => l.actor_id).filter(Boolean))] as string[];
      if (ids.length) {
        const { data: profs } = await supabase.from('profiles').select('id, email').in('id', ids);
        const map: Record<string, string> = {};
        (profs || []).forEach((p: any) => { map[p.id] = p.email; });
        setEmails(map);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <StudioLayout>
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">System <span className="text-gradient-cyan">Logs</span></h1>
        <p className="text-white/40 font-medium">Last 200 operations executed within the CMS cluster.</p>
      </div>
      <div className="rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-4 text-white/20 font-black text-xs uppercase tracking-widest">
            <div className="w-6 h-6 rounded-full border-2 border-white/5 border-t-[#C9A227] animate-spin" />
            Syncing logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-white/20 font-black text-xs uppercase tracking-widest">Zero activity detected in current cycle.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {logs.map((l) => (
              <li key={l.id} className="px-8 py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 hover:bg-white/[0.02] transition-colors group">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-white/5 text-[#C9A227] border border-white/5 group-hover:border-[#C9A227]/30 transition-all">{l.action}</span>
                <span className="text-sm font-black text-white/60 flex-1 truncate tracking-tight">
                  {l.entity_type} <span className="text-white/20 mx-2">/</span> {l.entity_id ? l.entity_id.slice(0, 12) : 'SYSTEM_NODE'}
                </span>
                <div className="flex items-center gap-8">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/20">{l.actor_id ? emails[l.actor_id] || l.actor_id.slice(0, 8) : 'CORE_ENGINE'}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/10 tabular-nums">{new Date(l.created_at).toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </StudioLayout>
  );
}
