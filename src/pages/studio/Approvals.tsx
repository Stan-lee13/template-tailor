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
      <div className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-4">Node <span className="text-gradient-warm">Permissions</span></h1>
        <p className="text-white/40 font-medium">Grant or revoke cluster access protocols for team entities.</p>
      </div>

      <div className="rounded-[2.5rem] overflow-hidden bg-black border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {loading ? (
          <div className="p-12 flex flex-col items-center gap-4 text-white/20 font-black text-xs uppercase tracking-widest">
            <div className="w-6 h-6 rounded-full border-2 border-white/5 border-t-[#C56A4A] animate-spin" />
            Syncing profiles...
          </div>
        ) : profiles.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-white/20 font-black text-xs uppercase tracking-widest">No entities detected in the cluster.</p>
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {profiles.map((u) => {
              const userRoles = roles[u.id] || [];
              const isEditor = userRoles.includes('editor');
              const isAdmin = userRoles.includes('admin');
              return (
                <li key={u.id} className="flex flex-col sm:flex-row sm:items-center gap-6 px-8 py-6 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white uppercase tracking-widest mb-1 group-hover:text-[#C56A4A] transition-colors">{u.display_name || 'IDENT_UNKNOWN'}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{u.email}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {isAdmin && (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-[#C56A4A]/10 text-[#C56A4A] border border-[#C56A4A]/20">
                        Admin Protocol
                        <button onClick={() => revoke(u.id, 'admin')} title="Revoke Admin" className="hover:text-rose-500 transition-colors"><X size={12} strokeWidth={3} /></button>
                      </span>
                    )}
                    {isEditor && (
                      <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        Editor Access
                        <button onClick={() => revoke(u.id, 'editor')} title="Revoke Editor" className="hover:text-rose-500 transition-colors"><X size={12} strokeWidth={3} /></button>
                      </span>
                    )}
                    {!userRoles.length && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl bg-white/5 text-white/20 border border-white/5">
                        Standby Status
                      </span>
                    )}

                    <div className="flex gap-2 ml-4">
                      {!isEditor && !isAdmin && (
                        <button
                          onClick={() => grant(u.id, 'editor')}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition-all duration-300"
                        >
                          Elevate to Editor
                        </button>
                      )}
                      {!isAdmin && (
                        <button
                          onClick={() => grant(u.id, 'admin')}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest hover:bg-[#C56A4A] hover:text-black hover:border-[#C56A4A] transition-all duration-300"
                        >
                          Elevate to Admin
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </StudioLayout>
  );
}
