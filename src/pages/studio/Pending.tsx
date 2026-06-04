import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function StudioPending() {
  const { user, signOut, isStaff } = useAuth();
  const navigate = useNavigate();
  if (!user) { navigate('/studio/login'); return null; }
  if (isStaff) { navigate('/studio'); return null; }
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f1ece4' }}>
      <Helmet><meta name="robots" content="noindex" /><title>Pending approval</title></Helmet>
      <div className="max-w-md text-center">
        <h1 className="font-outfit font-medium text-3xl mb-3" style={{ color: '#0A0A0A', letterSpacing: '-0.01em' }}>Awaiting approval</h1>
        <p className="font-inter text-sm mb-6" style={{ color: '#555' }}>
          Your account ({user.email}) has been created but doesn't have editor access yet. An admin needs to grant access before you can use Studio.
        </p>
        <button onClick={async () => { await signOut(); navigate('/studio/login'); }}
          className="px-5 py-2.5 rounded-md font-inter text-sm" style={{ background: '#0A0A0A', color: '#f1ece4' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
