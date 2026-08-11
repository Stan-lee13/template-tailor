import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { SITE } from '../config/site';
import { useBooking } from '../hooks/useBooking';
import { useAllNavItems, useSiteSettings } from '../hooks/useSiteData';

const fallbackCols: Record<string, { label: string; to: string }[]> = {
  footer_resources: [
    { label: 'Blog', to: '/blog' },
    { label: 'Case Studies', to: '/case-studies' },
    { label: 'Integrations', to: '/integrations' },
    { label: 'Pricing', to: '/#pricing' },
  ],
  footer_solutions: [
    { label: 'Ecommerce Brands', to: '/solutions/ecommerce-brands' },
    { label: 'Retail', to: '/solutions/retail' },
    { label: 'Publishers', to: '/solutions/publishers' },
    { label: 'Partners', to: '/partners' },
  ],
  footer_company: [
    { label: 'About Us', to: '/about' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
    { label: 'Compliance', to: '/compliance' },
  ],
  footer_legal: [
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Cookies', to: '/cookies' },
    { label: 'CCPA Opt-Out', to: '/legal/ccpa-opt-out' },
    { label: 'Your Privacy Choices', to: '/legal/privacy-choices' },
    { label: 'Database Opt-Out', to: '/legal/database-opt-out' },
  ],
};

const titles: Record<string, string> = {
  footer_resources: 'Resources',
  footer_solutions: 'Solutions',
  footer_company: 'Company',
  footer_legal: 'Legal',
};

function Col({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#C9A227', letterSpacing: '0.08em' }}>{title}</h4>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link key={link.label} to={link.to} className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#C9A227')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { open } = useBooking();
  const { data: allNav } = useAllNavItems();
  const { data: settings } = useSiteSettings();

  const getCol = (key: string) => {
    const dbLinks = (allNav || []).filter((n) => n.location === key && n.enabled);
    if (dbLinks.length > 0) return dbLinks.map((n) => ({ label: n.label, to: n.href }));
    return fallbackCols[key];
  };

  const social = settings?.social || {};
  const email = settings?.contact?.email || SITE.email;
  const tagline = settings?.brand?.tagline || SITE.tagline;
  const brandName = settings?.brand?.name || SITE.name;

  return (
    <footer className="bg-[#0B1A2A] py-24 lg:py-32 px-6 lg:px-20 border-t border-white/5">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          <div className="lg:col-span-4">
            <div className="mb-8"><BrandLogo variant="dark" size="md" /></div>
            <p className="text-lg text-white/40 mb-10 leading-relaxed max-w-sm">
              {tagline}. {brandName} is a high-performance retention marketing partner for growth-stage e-commerce brands.
            </p>
            <div className="flex items-center gap-6 mb-10">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C9A227] transition-colors duration-300" aria-label="LinkedIn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-[#C9A227] transition-colors duration-300" aria-label="Twitter">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
            </div>
            <a href={`mailto:${email}`} className="text-white font-bold text-xl hover:text-[#C9A227] transition-colors duration-300">
              {email}
            </a>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-12 lg:gap-8">
            {(['footer_resources','footer_solutions','footer_company','footer_legal'] as const).map((key) => (
              <div key={key}><Col title={titles[key]} links={getCol(key)} /></div>
            ))}
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <p className="text-white/20 text-sm font-medium">
              © {new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <p className="hidden sm:block text-white/20 text-sm font-medium">
              Award-winning Retention Systems
            </p>
          </div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-3 text-white font-black text-sm uppercase tracking-widest"
          >
            Back to Top
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-black transition-all duration-500">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
