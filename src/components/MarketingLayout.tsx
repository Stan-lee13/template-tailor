import { ReactNode } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SEO from './SEO';
import { useBooking } from '../hooks/useBooking';

interface Props {
  title: string;
  eyebrow?: string;
  intro?: string;
  path: string;
  description?: string;
  children: ReactNode;
}

export default function MarketingLayout({ title, eyebrow, intro, children, path, description }: Props) {
  const { open } = useBooking();
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <SEO path={path} title={title} description={description} />
      <Navigation />
      <main style={{ padding: '120px clamp(20px, 5vw, 80px) 80px' }}>
        <div className="mx-auto" style={{ maxWidth: '900px' }}>
          {eyebrow && (
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#00D4FF', letterSpacing: '0.1em', fontWeight: 500 }}>
              {eyebrow}
            </p>
          )}
          <h1 className="font-outfit font-medium mb-5" style={{ fontSize: 'clamp(34px, 6vw, 64px)', color: '#000000', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          {intro && (
            <p className="font-inter mb-12" style={{ fontSize: 'clamp(16px, 2.2vw, 19px)', color: '#2D2D2D', lineHeight: 1.6, maxWidth: '640px' }}>
              {intro}
            </p>
          )}
          <div className="rf-prose">{children}</div>

          <div className="mt-16 p-7 sm:p-9 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5" style={{ background: '#000000' }}>
            <div>
              <h3 className="font-outfit font-medium" style={{ fontSize: 'clamp(20px, 3vw, 26px)', color: '#FFFFFF', lineHeight: 1.15 }}>
                See where your retention is leaking.
              </h3>
              <p className="font-inter mt-1.5" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)' }}>
                Free 30-min growth audit. No pitch.
              </p>
            </div>
            <button onClick={() => open('marketing_page')} className="font-inter font-medium text-white whitespace-nowrap" style={{ background: '#00D4FF', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              Book a free audit
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: #2D2D2D; font-size: 16px; line-height: 1.75; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: clamp(22px, 3.5vw, 28px); color: #000000; margin-top: 44px; margin-bottom: 14px; letter-spacing: -0.01em; line-height: 1.2; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: clamp(17px, 2.4vw, 19px); color: #000000; margin-top: 28px; margin-bottom: 8px; }
        .rf-prose p { margin-bottom: 16px; }
        .rf-prose ul { padding-left: 22px; margin-bottom: 16px; list-style: disc; }
        .rf-prose li { margin-bottom: 8px; }
        .rf-prose a { color: #00D4FF; text-decoration: underline; text-underline-offset: 3px; }
        .rf-prose strong { color: #000000; font-weight: 600; }
      `}</style>
    </div>
  );
}
