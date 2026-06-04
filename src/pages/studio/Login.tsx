import { FormEvent, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function StudioLogin() {
  const { user, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (user && isStaff) return <Navigate to={(location.state as any)?.from?.pathname || '/studio'} replace />;
  if (user && !isStaff) return <Navigate to="/studio/pending" replace />;

  const handle = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/studio` },
        });
        if (error) throw error;
        toast.success('Account created. Signing you in…');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate('/studio', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f1ece4' }}>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Studio Login</title>
      </Helmet>
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10" style={{ background: '#fff', border: '1px solid #E2DDD3' }}>
        <Link to="/" className="font-outfit text-2xl font-semibold inline-block mb-1" style={{ color: '#0A0A0A' }}>
          Retention<span style={{ color: '#F97316' }}>.</span>
        </Link>
        <h1 className="font-outfit font-medium text-2xl mt-2 mb-1" style={{ color: '#0A0A0A', letterSpacing: '-0.01em' }}>
          {mode === 'signin' ? 'Sign in to Studio' : 'Create an account'}
        </h1>
        <p className="font-inter text-sm mb-6" style={{ color: '#666' }}>
          {mode === 'signin' ? 'Team members only.' : 'New accounts require admin approval before access.'}
        </p>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md font-inter text-sm border focus:outline-none focus:border-black"
              style={{ borderColor: '#E2DDD3', background: '#fafafa' }} />
          </div>
          <div>
            <label className="block font-inter text-xs uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>Password</label>
            <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-md font-inter text-sm border focus:outline-none focus:border-black"
              style={{ borderColor: '#E2DDD3', background: '#fafafa' }} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-md font-inter font-medium text-sm transition-opacity disabled:opacity-50"
            style={{ background: '#0A0A0A', color: '#f1ece4' }}>
            {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>
        <button onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="mt-5 font-inter text-xs w-full" style={{ color: '#666' }}>
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
