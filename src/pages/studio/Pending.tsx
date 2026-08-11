import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function StudioPending() {
  const { user, signOut, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate('/studio/login', { replace: true });
    else if (isStaff) navigate('/studio', { replace: true });
  }, [loading, user, isStaff, navigate]);
  if (loading || !user || isStaff) return null;
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-black selection:bg-[#C9A227] selection:text-black relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] bg-[#C9A227]/5 blur-[150px] rounded-full" />
      </div>

      <Helmet><meta name="robots" content="noindex" /><title>Access Restricted — RF Studio</title></Helmet>
      
      <div className="max-w-xl text-center relative z-10">
        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 animate-pulse">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#C9A227]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter mb-6">Access <span className="text-gradient-cyan">Restricted</span></h1>
        
        <p className="text-lg font-medium text-white/40 mb-12 leading-relaxed">
          The node <span className="text-white">({user.email})</span> is currently in standby mode. 
          Elevation to <span className="text-[#C9A227]">Editor Protocol</span> is required by a System Administrator to proceed.
        </p>
        
        <button 
          onClick={async () => { await signOut(); navigate('/studio/login'); }}
          className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all duration-500"
        >
          Disconnect Session
        </button>
      </div>
    </div>
  );
}
