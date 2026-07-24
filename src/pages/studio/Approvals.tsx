import { useEffect, useState } from 'react';
import StudioLayout from '@/components/studio/StudioLayout';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

type Profile = { id: string; email: string | null; display_name: string | null; created_at: string };
type RoleRow = { user_id: string; role: 'admin' | 'editor' };

export default function Approvals() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [roles, setRoles] = useState<Record<string, ('admin' | 'editor')[]>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: ps }, { data: rs }] = await Promise.all([
      supabase.from('profiles').select('id, email, display_name, created_at').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
    ]);
    setProfiles((ps as Profile[]) || []);
    const map: Record<string, ('admin' | 'editor')[]> = {};
    (rs as RoleRow[] || []).forEach((r) => { (map[r.user_id] ||= []).push(r.role); });
    setRoles(map);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const grant = async (uid: string, role: 'admin' | 'editor') => {
    if (role === 'admin' && !confirm('Grant full admin access? Admins can manage all content and other users.')) return;
    const { error } = await supabase.from('user_roles').insert({ user_id: uid, role });
    if (error) return toast.error(error.message);
    toast.success(`Granted ${role}`);
    load();
  };
  const revoke = async (uid: string, role: 'admin' | 'editor') => {
    if (!confirm(`Revoke ${role} access?`)) return;
    const { error } = await supabase.from('user_roles').delete().eq('user_id', uid).eq('role', role);
    if (error) return toast.error(error.message);
    toast.success('Revoked');
    load();
  };

  return (
    <StudioLayout>
      <div className="mb-6">
        <h1 className="font-outfit font-medium text-3xl sm:text-4xl mb-1" style={{ color: '#000000', letterSpacing: '-0.02em' }}>Approvals</h1>
        <p className="font-inter text-sm" style={{ color: '#666' }}>Grant or revoke team access.</p>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
        {loading ? (
          <div className="p-8 text-center font-inter text-sm" style={{ color: '#888' }}>Loading…</div>
        ) : (
          profiles.length === 0 ? (
            <div className="p-8 text-center font-inter text-sm" style={{ color: '#888' }}>No users yet.</div>
          ) : (
          <ul className="divide-y" style={{ borderColor: '#E2DDD3' }}>
            {profiles.map((u) => {
              const userRoles = roles[u.id] || [];
              const isEditor = userRoles.includes('editor');
              const isAdmin = userRoles.includes('admin');
              return (
                <li key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-inter text-sm font-medium truncate" style={{ color: '#000000' }}>{u.display_name || u.email}</p>
                    <p className="font-inter text-xs truncate" style={{ color: '#888' }}>{u.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 font-inter text-[10px] uppercase tracking-wider px-2 py-1 rounded" style={{ background: '#00D4FF20', color: '#00D4FF' }}>
                        Admin
                        <button onClick={() => revoke(u.id, 'admin')} title="Revoke admin" className="hover:opacity-70"><X size={10} /></button>
                      </span>
                    )}
                    {isEditor && (
                      <span className="inline-flex items-center gap-1 font-inter text-[10px] uppercase tracking-wider px-2 py-1 rounded" style={{ background: '#10B98120', color: '#10B981' }}>
                        Editor
                        <button onClick={() => revoke(u.id, 'editor')} title="Revoke editor" className="hover:opacity-70"><X size={10} /></button>
                      </span>
                    )}
                    {!userRoles.length && <span className="font-inter text-[10px] uppercase tracking-wider px-2 py-1 rounded" style={{ background: '#FFFFFF', color: '#888' }}>Pending</span>}
                    {!isEditor && !isAdmin && (
                      <button onClick={() => grant(u.id, 'editor')} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded font-inter text-xs" style={{ background: '#10B981', color: '#fff' }}>
                        <Check size={12} /> Editor
                      </button>
                    )}
                    {!isAdmin && (
                      <button onClick={() => grant(u.id, 'admin')} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded font-inter text-xs" style={{ background: '#00D4FF', color: '#000000' }}>
                        <Check size={12} /> Admin
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          )
        )}
      </div>
    </StudioLayout>
  );
}
