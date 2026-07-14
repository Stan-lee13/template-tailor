import { ReactNode, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LayoutDashboard, FileText, PlusCircle, UserCheck, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { StudioAIProvider } from '@/hooks/useStudioAI';
import AIAssistant from './AIAssistant';


const nav = [
  { to: '/studio', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/studio/posts', label: 'Posts', icon: FileText },
  { to: '/studio/posts/new', label: 'New post', icon: PlusCircle },
];

export default function StudioLayout({ children }: { children: ReactNode }) {
  const { isAdmin, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = isAdmin ? [...nav, { to: '/studio/approvals', label: 'Approvals', icon: UserCheck, end: false }] : nav;

  return (
    <StudioAIProvider>
    <div className="min-h-screen flex" style={{ background: '#f1ece4' }}>

      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Studio — RetentionFirm</title>
      </Helmet>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 h-14 border-b" style={{ background: '#0A0A0A', borderColor: '#222' }}>
        <Link to="/studio" className="font-outfit font-semibold" style={{ color: '#f1ece4' }}>Studio</Link>
        <button onClick={() => setOpen(true)} aria-label="Menu"><Menu size={22} color="#f1ece4" /></button>
      </header>

      {/* Sidebar */}
      <aside className={`${open ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:block lg:w-64 lg:shrink-0`}>
        <div className={`${open ? 'flex' : 'hidden lg:flex'} flex-col h-screen w-64 sticky top-0`} style={{ background: '#0A0A0A', color: '#f1ece4' }}>
          <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: '#1a1a1a' }}>
            <Link to="/studio" className="font-outfit text-lg font-semibold" onClick={() => setOpen(false)}>
              Retention<span style={{ color: '#F97316' }}>.</span>Studio
            </Link>
            <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close"><X size={20} /></button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={(i as any).end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-inter transition-colors ${isActive ? '' : 'hover:bg-white/5'}`}
                style={({ isActive }: any) => isActive ? { background: '#F97316', color: '#0A0A0A', fontWeight: 600 } : { color: 'rgba(241,236,228,0.75)' }}
              >
                <i.icon size={16} />
                {i.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-3 py-4 border-t" style={{ borderColor: '#1a1a1a' }}>
            <div className="px-3 mb-3">
              <p className="text-xs font-inter truncate" style={{ color: 'rgba(241,236,228,0.5)' }}>{user?.email}</p>
              <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: isAdmin ? '#F97316' : '#10B981' }}>{isAdmin ? 'Admin' : 'Editor'}</p>
            </div>
            <button
              onClick={async () => { await signOut(); navigate('/studio/login'); }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-inter w-full hover:bg-white/5 transition-colors"
              style={{ color: 'rgba(241,236,228,0.75)' }}
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 lg:pt-0">
        <div className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
      <AIAssistant />
    </div>
    </StudioAIProvider>
  );
}
