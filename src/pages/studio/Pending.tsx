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
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#FFFFFF' }}>
      <Helmet><meta name="robots" content="noindex" /><title>Pending approval</title></Helmet>
      <div className="max-w-md text-center">
        <h1 className="font-outfit font-medium text-3xl mb-3" style={{ color: '#000000', letterSpacing: '-0.01em' }}>Awaiting approval</h1>
        <p className="font-inter text-sm mb-6" style={{ color: '#555' }}>
          Your account ({user.email}) has been created but doesn't have editor access yet. An admin needs to grant access before you can use Studio.
        </p>
        <button onClick={async () => { await signOut(); navigate('/studio/login'); }}
          className="px-5 py-2.5 rounded-md font-inter text-sm" style={{ background: '#000000', color: '#FFFFFF' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
