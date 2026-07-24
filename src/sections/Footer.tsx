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
      <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#00D4FF', letterSpacing: '0.08em' }}>{title}</h4>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link key={link.label} to={link.to} className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(255,255,255,0.5)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#00D4FF')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
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
    <footer style={{ background: '#000000', padding: '64px clamp(20px, 5vw, 80px) 32px', borderTop: '1px solid rgba(0,212,255,0.08)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <div className="mb-4"><BrandLogo variant="dark" size="md" /></div>
            <p className="font-inter mb-2" style={{ fontSize: '14px', lineHeight: 1.6, color: 'rgba(255,255,255,0.4)', maxWidth: '320px' }}>
              {tagline}. {brandName} is a retention marketing partner for growth-stage ecommerce brands.
            </p>
            <div className="h-[2px] w-10 rounded-full mt-5 mb-5" style={{ background: 'linear-gradient(90deg, #00D4FF, #0099cc)' }} />
            <button onClick={() => open('footer')} className="font-inter font-medium text-white" style={{ background: 'linear-gradient(135deg, #00D4FF, #0099cc)', padding: '10px 22px', borderRadius: '9999px', fontSize: '13.5px', color: '#000000', fontWeight: 700 }}>
              Book a free audit
            </button>
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              {social.linkedin && (
                <a href={social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.4)' }} aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
              )}
              <a href={`mailto:${email}`} className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{email}</a>
            </div>
          </div>

          {(['footer_resources','footer_solutions','footer_company','footer_legal'] as const).map((key) => (
            <div key={key} className="md:col-span-2"><Col title={titles[key]} links={getCol(key)} /></div>
          ))}
        </div>

        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
          <p className="font-inter text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="font-inter text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Retention systems for repeat-purchase brands.
          </p>
        </div>
      </div>
    </footer>
  );
}
