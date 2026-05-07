import { useEffect, useRef, useState } from 'react';
import BrandLogo from '../components/BrandLogo';

const navLinks = [
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(235,232,224,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #D6D3CC' : '1px solid transparent',
        }}
      >
        <div className="flex items-center justify-between h-14 sm:h-16" style={{ padding: '0 clamp(16px, 5vw, 80px)' }}>
          <a href="#" className="inline-flex items-center">
            <BrandLogo variant={scrolled ? 'light' : 'dark'} size="sm" />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: scrolled ? '#555555' : 'rgba(235,232,224,0.7)', letterSpacing: '-0.01em' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = scrolled ? '#0A0A0A' : '#EBE8E0')}
                onMouseLeave={(e) => (e.currentTarget.style.color = scrolled ? '#555555' : 'rgba(235,232,224,0.7)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <a
              href="#cta"
              onClick={(e) => handleNavClick(e, '#cta')}
              className="text-sm font-medium text-white transition-all duration-200 hover:scale-105"
              style={{
                background: '#F97316',
                padding: '10px 24px',
                borderRadius: '9999px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#EA580C')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#F97316')}
            >
              Book a Growth Audit
            </a>
          </div>

          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className="block w-5 h-0.5" style={{ background: scrolled ? '#0A0A0A' : '#EBE8E0' }} />
            <span className="block w-5 h-0.5" style={{ background: scrolled ? '#0A0A0A' : '#EBE8E0' }} />
            <span className="block w-5 h-0.5" style={{ background: scrolled ? '#0A0A0A' : '#EBE8E0' }} />
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 sm:gap-8"
          style={{ background: 'rgba(10,10,10,0.98)', backdropFilter: 'blur(20px)' }}
        >
          <button className="absolute top-5 right-5 sm:top-6 sm:right-6 p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EBE8E0" strokeWidth="2">
              <line x1="4" y1="4" x2="20" y2="20" /><line x1="20" y1="4" x2="4" y2="20" />
            </svg>
          </button>
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={(e) => handleNavClick(e, link.href)} className="font-outfit text-2xl sm:text-3xl font-medium" style={{ color: '#EBE8E0' }}>
              {link.label}
            </a>
          ))}
          <a href="#cta" onClick={(e) => handleNavClick(e, '#cta')} className="mt-4 text-base font-medium text-white" style={{ background: '#F97316', padding: '14px 32px', borderRadius: '9999px' }}>
            Book a Growth Audit
          </a>
        </div>
      )}
    </>
  );
}
