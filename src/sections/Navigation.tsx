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
  const compact = scrolled || !isHome;
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
    e.preventDefault();
    setMobileOpen(false);
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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: compact ? 'rgba(241,236,228,0.92)' : 'transparent',
          backdropFilter: compact ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: compact ? 'blur(12px)' : 'none',
          borderBottom: compact ? '1px solid #D6D3CC' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between h-14 sm:h-16" style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <Link to="/" className="inline-flex items-center" aria-label="RetentionFirm home">
            <BrandLogo variant={compact ? 'light' : 'dark'} size="sm" />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {sectionLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleSectionClick(e, link.href)}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: compact ? '#555555' : 'rgba(241,236,228,0.7)', letterSpacing: '-0.01em' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = compact ? '#0A0A0A' : '#f1ece4')}
                onMouseLeave={(e) => (e.currentTarget.style.color = compact ? '#555555' : 'rgba(241,236,228,0.7)')}
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/blog"
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: compact ? '#555555' : 'rgba(241,236,228,0.7)', letterSpacing: '-0.01em' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = compact ? '#0A0A0A' : '#f1ece4')}
              onMouseLeave={(e) => (e.currentTarget.style.color = compact ? '#555555' : 'rgba(241,236,228,0.7)')}
            >
              Blog
            </Link>

          </div>

          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => onBook('nav')}
              className="text-sm font-medium text-white transition-all duration-200 hover:scale-105"
              style={{ background: '#F97316', padding: '10px 24px', borderRadius: '9999px' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EA580C')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F97316')}
            >
              Book a Growth Audit
            </button>
          </div>

          <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <span className="block w-5 h-0.5" style={{ background: compact ? '#0A0A0A' : '#f1ece4' }} />
            <span className="block w-5 h-0.5" style={{ background: compact ? '#0A0A0A' : '#f1ece4' }} />
            <span className="block w-5 h-0.5" style={{ background: compact ? '#0A0A0A' : '#f1ece4' }} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 sm:gap-8"
          style={{ background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)' }}
        >
          <button className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f1ece4" strokeWidth="2">
              <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
          {sectionLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleSectionClick(e, link.href)} className="font-outfit text-2xl sm:text-3xl font-medium" style={{ color: '#f1ece4' }}>
              {link.label}
            </a>
          ))}
          <Link to="/blog" onClick={() => setMobileOpen(false)} className="font-outfit text-2xl sm:text-3xl font-medium" style={{ color: '#f1ece4' }}>
            Blog
          </Link>

          <button onClick={() => onBook('mobile_nav')} className="mt-4 text-base font-medium text-white" style={{ background: '#F97316', padding: '14px 32px', borderRadius: '9999px' }}>
            Book a Growth Audit
          </button>
        </div>
      )}
    </>
  );
}
