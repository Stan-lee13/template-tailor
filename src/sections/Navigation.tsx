import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import { useNavItems } from '../hooks/useSiteData';

const defaultLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Results', href: '#results' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const { open } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { data: dbNav } = useNavItems('header');
  const sectionLinks = (dbNav && dbNav.length > 0)
    ? dbNav.map((n) => ({ label: n.label, href: n.href }))
    : defaultLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMobileOpen(false);
    if (href.startsWith('/')) { return; }
    e.preventDefault();
    if (!isHome) {
      navigate('/', { state: { scrollTo: href } });
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const onBook = (loc: string) => {
    setMobileOpen(false);
    track('cta_click', { location: loc, label: 'Book a Growth Audit' });
    open(loc);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled
            ? 'top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1100px] rounded-full bg-[#080c14]/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] py-4 px-8'
            : 'top-0 left-0 right-0 w-full bg-transparent py-8 px-12'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3" aria-label="RetentionFirm home">
            <BrandLogo variant="dark" size="sm" className="transition-transform duration-500 group-hover:scale-110" />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {sectionLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#F3EBDD] transition-all duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link
              to="/blog"
              className="text-xs font-black uppercase tracking-[0.2em] text-white/50 hover:text-[#F3EBDD] transition-all duration-300 relative group"
            >
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#00D4FF] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onBook('nav')}
              className={`hidden sm:flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all duration-500 rounded-full ${
                scrolled 
                ? 'bg-[#F3EBDD] text-black px-6 py-3 hover:bg-[#E8DCC6] hover:shadow-[0_0_20px_rgba(243,235,221,0.28)]'
                : 'bg-[#F3EBDD]/15 text-[#F3EBDD] px-8 py-4 hover:bg-[#F3EBDD] hover:text-black'
              }`}
            >
              Book Audit
            </button>
            
            <button className="lg:hidden flex flex-col gap-1.5 p-2 group" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <span className="block w-6 h-0.5 bg-white transition-all duration-300 group-hover:w-4" />
              <span className="block w-4 h-0.5 bg-white transition-all duration-300 group-hover:w-6" />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl"
        >
          <button className="absolute top-10 right-10 p-4 group" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="transition-transform duration-500 group-hover:rotate-90">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          
          <div className="flex flex-col items-center gap-8">
            {sectionLinks.map((link) => (
              <a key={link.label} href={link.href} onClick={(e) => handleSectionClick(e, link.href)} className="text-4xl sm:text-6xl font-black text-white hover:text-[#00D4FF] transition-all duration-500 tracking-tighter">
                {link.label}
              </a>
            ))}
            <Link to="/blog" onClick={() => setMobileOpen(false)} className="text-4xl sm:text-6xl font-black text-white hover:text-[#00D4FF] transition-all duration-500 tracking-tighter">
              Blog
            </Link>

            <button onClick={() => onBook('mobile_nav')} className="mt-12 px-12 py-6 rounded-full bg-[#F3EBDD] text-black font-black text-lg uppercase tracking-widest hover:bg-[#E8DCC6] transition-all duration-500">
              Book Growth Audit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
