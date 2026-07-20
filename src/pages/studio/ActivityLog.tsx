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
      <div className="mb-6">
        <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.02em' }}>Activity</h1>
        <p className="font-inter text-sm" style={{ color: '#666' }}>Last 200 changes across the CMS.</p>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
        {loading ? <p className="p-6 font-inter text-sm text-gray-500">Loading…</p> :
          logs.length === 0 ? <p className="p-6 font-inter text-sm text-gray-500">No activity yet.</p> :
          <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
            {logs.map((l) => (
              <li key={l.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="font-inter text-[11px] uppercase tracking-wider px-2 py-0.5 rounded self-start" style={{ background: '#f1ece4', color: '#0A0A0A' }}>{l.action}</span>
                <span className="font-inter text-sm flex-1 truncate" style={{ color: '#333' }}>{l.entity_type}{l.entity_id ? ` · ${l.entity_id.slice(0, 8)}` : ''}</span>
                <span className="font-inter text-xs" style={{ color: '#888' }}>{l.actor_id ? emails[l.actor_id] || l.actor_id.slice(0, 8) : 'system'}</span>
                <span className="font-inter text-xs tabular-nums whitespace-nowrap" style={{ color: '#888' }}>{new Date(l.created_at).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        }
      </div>
    </StudioLayout>
  );
}
