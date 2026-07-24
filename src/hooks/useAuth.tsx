import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Navigate, useLocation } from 'react-router-dom';

type Role = 'admin' | 'editor' | 'owner' | 'content_manager' | 'viewer';

interface AuthCtx {
  user: User | null;
  session: Session | null;
  roles: Role[];
  loading: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  canEdit: boolean;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (uid: string | undefined) => {
    if (!uid) { setRoles([]); return; }
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', uid);
    setRoles((data || []).map((r: { role: Role }) => r.role));
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setTimeout(() => fetchRoles(s?.user?.id), 0);
    });
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      fetchRoles(s?.user?.id).finally(() => setLoading(false));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthCtx = {
    user, session, roles, loading,
    isStaff: roles.some((r) => ['admin', 'editor', 'owner', 'content_manager'].includes(r)),
    isAdmin: roles.includes('admin') || roles.includes('owner'),
    isOwner: roles.includes('owner'),
    canEdit: roles.some((r) => ['admin', 'editor', 'owner', 'content_manager'].includes(r)),
    signOut: async () => { await supabase.auth.signOut(); },
    refreshRoles: () => fetchRoles(user?.id),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}

export function RequireStaff({ children }: { children: ReactNode }) {
  const { loading, user, isStaff } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFFFF' }}><p className="font-inter text-sm" style={{ color: '#555' }}>Loading…</p></div>;
  if (!user) return <Navigate to="/studio/login" state={{ from: location }} replace />;
  if (!isStaff) return <Navigate to="/studio/pending" replace />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { loading, user, isAdmin } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/studio/login" replace />;
  if (!isAdmin) return <Navigate to="/studio" replace />;
  return <>{children}</>;
}
