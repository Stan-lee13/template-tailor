import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { SITE } from '../config/site';
import { useBooking } from '../hooks/useBooking';

const resources = [
  { label: 'Insights', to: '/insights' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'Integrations', to: '/integrations' },
  { label: 'Pricing', to: '/#pricing' },
];

const solutions = [
  { label: 'Ecommerce Brands', to: '/solutions/ecommerce-brands' },
  { label: 'Retail', to: '/solutions/retail' },
  { label: 'Publishers', to: '/solutions/publishers' },
  { label: 'Partners', to: '/partners' },
];

const company = [
  { label: 'About Us', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Contact', to: '/contact' },
  { label: 'Compliance', to: '/compliance' },
];

const legal = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Cookies', to: '/cookies' },
  { label: 'CCPA Opt-Out', to: '/legal/ccpa-opt-out' },
  { label: 'Your Privacy Choices', to: '/legal/privacy-choices' },
  { label: 'Database Opt-Out', to: '/legal/database-opt-out' },
];

function Col({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>{title}</h4>
      <div className="flex flex-col gap-3">
        {links.map((link) => (
          <Link key={link.label} to={link.to} className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(241,236,228,0.6)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#f1ece4')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(241,236,228,0.6)')}>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { open } = useBooking();
  return (
    <footer style={{ background: '#0A0A0A', padding: '64px clamp(20px, 5vw, 80px) 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <div className="mb-4"><BrandLogo variant="dark" size="md" /></div>
            <p className="font-inter mb-2" style={{ fontSize: '14px', lineHeight: 1.6, color: '#8A8A8A', maxWidth: '320px' }}>
              {SITE.tagline}. {SITE.nameSpaced} is a retention marketing partner for growth-stage ecommerce brands.
            </p>
            <div className="h-[2px] w-10 rounded-full mt-5 mb-5" style={{ background: 'linear-gradient(90deg, #F97316, #4169E1)' }} />
            <button onClick={() => open('footer')} className="font-inter font-medium text-white" style={{ background: '#F97316', padding: '10px 22px', borderRadius: '9999px', fontSize: '13.5px' }}>
              Book a free audit
            </button>
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: '#8A8A8A' }} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: '#8A8A8A' }} aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href={`mailto:${SITE.email}`} className="font-inter text-sm" style={{ color: '#8A8A8A' }}>{SITE.email}</a>
            </div>
          </div>

          <div className="md:col-span-2"><Col title="Resources" links={resources} /></div>
          <div className="md:col-span-2"><Col title="Solutions" links={solutions} /></div>
          <div className="md:col-span-2"><Col title="Company" links={company} /></div>
          <div className="md:col-span-2"><Col title="Legal" links={legal} /></div>
        </div>

        <div className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-inter text-sm" style={{ color: '#555555' }}>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-inter text-xs" style={{ color: '#555555' }}>
            Retention systems for repeat-purchase brands.
          </p>
        </div>
      </div>
    </footer>
  );
}
