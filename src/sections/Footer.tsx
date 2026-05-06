const serviceLinks = ['Email Marketing', 'SMS Marketing', 'Loyalty Programs', 'Churn Reduction', 'Analytics'];
const companyLinks = ['About Us', 'Case Studies', 'Pricing', 'Careers', 'Contact'];
const resourceLinks = ['Blog', 'Retention Calculator', 'Guides & Templates', 'Newsletter'];

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', padding: '64px clamp(24px, 5vw, 80px) 32px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-outfit font-medium mb-4" style={{ fontSize: '20px', color: '#EBE8E0' }}>RetentionFirm</h3>
            <p className="font-inter mb-4" style={{ fontSize: '14px', lineHeight: 1.6, color: '#8A8A8A', maxWidth: '280px' }}>
              Turn One-Time Buyers Into Lifelong Revenue
            </p>
            <div className="h-[2px] w-10 rounded-full mb-6" style={{ background: 'linear-gradient(90deg, #F97316, #4169E1)' }} />
            <div className="flex items-center gap-4">
              <a href="#" className="transition-colors duration-300" style={{ color: '#8A8A8A' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')} aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="transition-colors duration-300" style={{ color: '#8A8A8A' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = '#8A8A8A')} aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>Services</h4>
            <div className="flex flex-col gap-3">
              {serviceLinks.map((link) => (
                <a key={link} href="#" className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(235,232,224,0.6)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(235,232,224,0.6)')}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>Company</h4>
            <div className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <a key={link} href="#" className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(235,232,224,0.6)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(235,232,224,0.6)')}>
                  {link}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-inter font-medium uppercase mb-5" style={{ fontSize: '12px', color: '#8A8A8A', letterSpacing: '0.04em' }}>Resources</h4>
            <div className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <a key={link} href="#" className="font-inter text-sm transition-colors duration-300" style={{ color: 'rgba(235,232,224,0.6)' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(235,232,224,0.6)')}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-inter text-sm" style={{ color: '#555555' }}>
            © {new Date().getFullYear()} RetentionFirm. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-inter text-sm transition-colors duration-300" style={{ color: '#555555' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}>Privacy</a>
            <a href="#" className="font-inter text-sm transition-colors duration-300" style={{ color: '#555555' }} onMouseEnter={(e) => (e.currentTarget.style.color = '#EBE8E0')} onMouseLeave={(e) => (e.currentTarget.style.color = '#555555')}>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
