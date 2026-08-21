
import { ReactNode, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import * as Lucide from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type NavItem = { to: string; label: string; iconName: string; end?: boolean };

const nav: NavItem[] = [
  { to: '/studio', label: 'Dashboard', iconName: 'Layout', end: true },
  { to: '/studio/visual', label: 'Visual Editor', iconName: 'Sparkles' },
  { to: '/studio/site', label: 'Site editor', iconName: 'Layout' },
  { to: '/studio/pages', label: 'Pages', iconName: 'FileCode' },
  { to: '/studio/templates', label: 'Templates', iconName: 'Bookmark' },
  { to: '/studio/media', label: 'Media', iconName: 'Image' },
  { to: '/studio/posts', label: 'Posts', iconName: 'FileText' },
  { to: '/studio/posts/new', label: 'New post', iconName: 'PlusCircle' },
];

const adminNav: NavItem[] = [
  { to: '/studio/navigation', label: 'Navigation', iconName: 'Menu' },
  { to: '/studio/settings', label: 'Settings', iconName: 'Settings' },
  { to: '/studio/approvals', label: 'Team', iconName: 'UserCheck' },
  { to: '/studio/activity', label: 'Activity', iconName: 'Activity' },
];

export default function StudioLayout({ children }: { children: ReactNode }) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isAdmin = auth?.isAdmin || false;
  const user = auth?.user;
  const signOut = auth?.signOut;

  const items = isAdmin ? [...nav, ...adminNav] : nav;

  const renderIcon = (name: string, isActive: boolean) => {
    const IconComponent = (Lucide as any)[name];
    if (!IconComponent) return <div className="w-[18px] h-[18px] bg-white/10 rounded-sm" />;
    return <IconComponent size={18} strokeWidth={isActive ? 3 : 2} />;
  };

  return (
    <div className="min-h-screen flex bg-black selection:bg-[#C56A4A] selection:text-black text-white">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 h-16 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <Link to="/studio" className="text-lg font-black tracking-tighter text-white">
          RF<span className="text-[#C56A4A]">.</span>STUDIO
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Menu" className="p-2 rounded-full bg-white/5">
          {renderIcon('Menu', false)}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${open ? 'fixed inset-0 z-50' : 'hidden'} lg:relative lg:block lg:w-72 lg:shrink-0`}>
        <div className={`${open ? 'flex' : 'hidden lg:flex'} flex-col h-screen w-72 sticky top-0 bg-black border-r border-white/5`}>
          <div className="flex items-center justify-between px-8 py-8">
            <Link to="/studio" className="text-xl font-black tracking-tighter text-white" onClick={() => setOpen(false)}>
              RETENTION<span className="text-[#C56A4A]">.</span>STUDIO
            </Link>
            <button className="lg:hidden p-2 rounded-full bg-white/5" onClick={() => setOpen(false)} aria-label="Close">
              {renderIcon('X', false)}
            </button>
          </div>

          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            <div className="px-4 mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Navigation</span>
            </div>
            {items.map((i) => (
              <NavLink
                key={i.to}
                to={i.to}
                end={i.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black tracking-tight transition-all duration-300 ${isActive ? 'bg-[#C56A4A] text-black shadow-[0_0_20px_rgba(197,106,74,0.2)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              >
                {({ isActive }) => (
                  <>
                    {renderIcon(i.iconName, isActive)}
                    {i.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 bg-white/[0.02]">
            <div className="px-2 mb-6">
              <p className="text-xs font-black text-white/60 truncate">{user?.email || 'Not signed in'}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-[#C56A4A]' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{isAdmin ? 'Admin Access' : 'Editor Access'}</span>
              </div>
            </div>
            <button
              onClick={async () => { if (signOut) { await signOut(); navigate('/studio/login'); } }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-black tracking-tight text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 w-full"
            >
              {renderIcon('LogOut', false)} Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-16 lg:pt-0 overflow-y-auto">
        <div className="px-6 lg:px-12 py-10 lg:py-16 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
