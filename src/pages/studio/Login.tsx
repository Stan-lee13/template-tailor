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
    <div className="min-h-screen flex items-center justify-center px-6 bg-black selection:bg-[#00D4FF] selection:text-black">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Studio Login — RetentionFirm</title>
      </Helmet>
      
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4FF]/10 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <Link to="/" className="text-3xl font-black tracking-tighter text-white inline-block mb-4">
            RETENTION<span className="text-[#00D4FF]">.</span>STUDIO
          </Link>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">
            {mode === 'signin' ? 'Welcome Back' : 'Join the Engine'}
          </h1>
          <p className="text-white/40 font-medium">
            {mode === 'signin' ? 'Access your command center.' : 'Apply for operator access.'}
          </p>
        </div>

        <div className="p-10 lg:p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          <form onSubmit={handle} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Email Address</label>
              <input 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300"
                placeholder="operator@retentionfirm.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-4">Password</label>
              <input 
                type="password" 
                required 
                minLength={8} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm focus:outline-none focus:border-[#00D4FF]/50 transition-all duration-300"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-[#00D4FF] text-black font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-[1.02] transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.2)] disabled:opacity-50"
            >
              {loading ? 'SYNCHRONIZING...' : mode === 'signin' ? 'ENTER STUDIO' : 'APPLY FOR ACCESS'}
            </button>
          </form>
          
          <button 
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="mt-8 text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-[#00D4FF] transition-colors duration-300 w-full text-center"
          >
            {mode === 'signin' ? 'Need operator credentials? Apply' : 'Existing operator? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
