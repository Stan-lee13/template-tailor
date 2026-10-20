import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { useBooking } from '../hooks/useBooking';
import { track } from '../lib/analytics';
import { useNavItems } from '../hooks/useSiteData';

const defaultLinks = [
  { label: 'Solution', href: '#solution' },
  { label: 'Process', href: '#process' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Results', href: '#results' },
  { label: 'FAQ', href: '#faq' },
];

type MobileMenuState = 'closed' | 'open' | 'closing';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState<MobileMenuState>('closed');
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenuRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const { open } = useBooking();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { data: dbNav } = useNavItems('header');
  const cmsLabels = new Map((dbNav || []).map((item) => [item.href, item.label]));
  const sectionLinks = defaultLinks.map((link) => ({
    ...link,
    label: cmsLabels.get(link.href) || link.label,
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  const openMobileMenu = () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    setMobileMenu('open');
  };

  const closeMobileMenu = () => {
    setMobileMenu((current) => {
      if (current !== 'open') return current;
      closeTimerRef.current = window.setTimeout(() => setMobileMenu('closed'), 220);
      return 'closing';
    });
  };

  useEffect(() => {
    if (mobileMenu === 'closed') return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const menuTrigger = menuButtonRef.current;
    document.body.style.overflow = 'hidden';
    if (mobileMenu === 'open') closeMenuRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      if (e.key !== 'Tab' || !mobileMenuRef.current) return;
      const focusable = Array.from(mobileMenuRef.current.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        .filter((element) => !element.hasAttribute('disabled') && element.getAttribute('aria-hidden') !== 'true');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      (previouslyFocused || menuTrigger)?.focus();
    };
  }, [mobileMenu]);

  const handleSectionClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMobileMenu();
    if (href.startsWith('/')) return;
    e.preventDefault();
    navigate({ pathname: '/', hash: href });
  };

  const onBook = (loc: string) => {
    closeMobileMenu();
    track('cta_click', { location: loc, label: 'Book a Growth Audit' });
    open(loc);
  };

  const menuIsVisible = mobileMenu === 'open';

  return (
    <>
      <a href="#main-content" className="rf-skip-link">Skip to main content</a>
      <nav
        ref={navRef}
        className={`fixed z-50 transition-[top,width,padding,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled
            ? `top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1100px] rounded-full backdrop-blur-2xl py-4 px-8 ${isHome ? 'bg-[#111318]/80 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : 'bg-[#F3EBDD]/92 border border-[#111318]/12 shadow-[0_20px_50px_rgba(17,19,24,0.12)]'}`
            : `top-0 left-0 right-0 w-full bg-transparent py-8 px-12 ${isHome ? '' : 'border-b border-[#111318]/10'}`
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="group flex items-center gap-3" aria-label="RetentionFirm home">
            <BrandLogo variant={isHome ? 'dark' : 'light'} size="sm" className="transition-transform duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105" />
          </Link>

          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            {sectionLinks.map((link) => {
              const className = `text-[11px] font-black uppercase tracking-[0.16em] transition-colors duration-160 relative group whitespace-nowrap ${isHome ? 'text-white/50 hover:text-[#F3EBDD]' : 'text-[#111318]/70 hover:text-[#C56A4A]'}`;
              const underline = <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#C56A4A] transition-[width] duration-180 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-full" />;
              return link.href.startsWith('/') ? (
                <Link key={link.label} to={link.href} className={className}>
                  {link.label}
                  {underline}
                </Link>
              ) : (
                <a key={link.label} href={link.href} onClick={(e) => handleSectionClick(e, link.href)} className={className}>
                  {link.label}
                  {underline}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => onBook('nav')}
              className={`hidden sm:flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-[background-color,color,transform,box-shadow] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] rounded-full ${
                scrolled
                ? `${isHome ? 'bg-[#F3EBDD] text-black hover:bg-[#E8DCC6] hover:shadow-[0_0_20px_rgba(243,235,221,0.28)]' : 'bg-[#111318] text-[#F3EBDD] hover:bg-[#C56A4A]'} px-6 py-3`
                : `${isHome ? 'bg-[#F3EBDD]/15 text-[#F3EBDD] hover:bg-[#F3EBDD] hover:text-black' : 'bg-[#111318] text-[#F3EBDD] hover:bg-[#C56A4A]'} px-8 py-4`
              }`}
            >
              Book Audit
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              className="lg:hidden flex flex-col gap-1.5 p-2 group"
              onClick={openMobileMenu}
              aria-label="Open menu"
              aria-controls={mobileMenu !== 'closed' ? 'rf-mobile-menu' : undefined}
              aria-expanded={menuIsVisible}
            >
              <span className={`block w-6 h-0.5 transition-[width,background-color] duration-160 group-hover:w-4 ${isHome ? 'bg-white' : 'bg-[#111318]'}`} />
              <span className={`block w-4 h-0.5 transition-[width,background-color] duration-160 group-hover:w-6 ${isHome ? 'bg-white' : 'bg-[#111318]'}`} />
            </button>
          </div>
        </div>
      </nav>

      {mobileMenu !== 'closed' && (
        <div
          ref={mobileMenuRef}
          id="rf-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl transition-[opacity,transform] duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
        >
          <button ref={closeMenuRef} type="button" className="absolute top-10 right-10 p-4 group" onClick={closeMobileMenu} aria-label="Close menu">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="transition-transform duration-240 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-90">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className={`flex flex-col items-center gap-8 transition-[opacity,transform] duration-220 ease-[cubic-bezier(0.23,1,0.32,1)] ${menuIsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {sectionLinks.map((link) => link.href.startsWith('/') ? (
              <Link key={link.label} to={link.href} onClick={closeMobileMenu} className="text-4xl sm:text-6xl font-black text-white hover:text-[#D8A63D] transition-colors duration-160 tracking-tighter">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} onClick={(e) => handleSectionClick(e, link.href)} className="text-4xl sm:text-6xl font-black text-white hover:text-[#D8A63D] transition-colors duration-160 tracking-tighter">
                {link.label}
              </a>
            ))}

            <button type="button" onClick={() => onBook('mobile_nav')} className="mt-12 px-12 py-6 rounded-full bg-[#F3EBDD] text-black font-black text-lg uppercase tracking-widest hover:bg-[#E8DCC6] active:scale-[0.97] transition-[background-color,transform,box-shadow] duration-160 ease-[cubic-bezier(0.23,1,0.32,1)]">
              Book Growth Audit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
