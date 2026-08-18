import { ArrowUp, ArrowUpRight } from 'lucide-react';
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
    <div className="rf-footer__column">
      <h4 className="rf-footer__column-title">{title}</h4>
      <div className="rf-footer__links">
        {links.map((link) => <Link key={link.label} to={link.to} className="rf-footer__link">{link.label}</Link>)}
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
    <footer className="rf-footer">
      <div className="rf-footer__inner">
        <div className="rf-footer__signal">
          <span>RETENTION FIRM / CLOSING LOOP</span>
          <span>THE SYSTEM CONTINUES ↘</span>
        </div>

        <div className="rf-footer__hero">
          <div className="rf-footer__brand">
            <BrandLogo variant="dark" size="md" />
            <p>{tagline}. {brandName} is a high-performance retention marketing partner for growth-stage e-commerce brands.</p>
            <div className="rf-footer__contact-row">
              <a href={`mailto:${email}`} className="rf-footer__email">{email}</a>
              <div className="rf-footer__socials">
                {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="rf-footer__social" aria-label="LinkedIn">in</a>}
                {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="rf-footer__social" aria-label="Twitter">x</a>}
              </div>
            </div>
          </div>
          <div className="rf-footer__action">
            <span>Build a stronger return loop.</span>
            <button type="button" onClick={() => open('footer')} className="rf-footer__cta">Book a Growth Audit <ArrowUpRight aria-hidden="true" size={18} /></button>
          </div>
        </div>

        <div className="rf-footer__nav">
          {(['footer_resources','footer_solutions','footer_company','footer_legal'] as const).map((key) => <Col key={key} title={titles[key]} links={getCol(key)} />)}
        </div>

        <div className="rf-footer__base">
          <div className="rf-footer__legal-line">
            <span>© {new Date().getFullYear()} {brandName}. All rights reserved.</span>
            <span className="rf-footer__base-divider" aria-hidden="true" />
            <span>Award-winning Retention Systems</span>
          </div>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rf-footer__top">
            <span>Back to Top</span><span className="rf-footer__top-icon"><ArrowUp aria-hidden="true" size={16} /></span>
          </button>
        </div>
      </div>
    </footer>
  );
}
