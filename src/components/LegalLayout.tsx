import { ReactNode } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

interface Props {
  title: string;
  updated: string;
  children: ReactNode;
}

export default function LegalLayout({ title, updated, children }: Props) {
  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 80px' }}>
        <article className="mx-auto" style={{ maxWidth: '720px' }}>
          <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>
            Legal
          </p>
          <h1 className="font-outfit font-medium mb-2" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#000000', lineHeight: 1, letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p className="font-inter mb-10" style={{ fontSize: '13px', color: '#555' }}>
            Last updated: {updated}
          </p>
          <div className="rf-prose">{children}</div>
        </article>
      </main>
      <Footer />
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: #2D2D2D; font-size: 15px; line-height: 1.75; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 22px; color: #000000; margin-top: 36px; margin-bottom: 12px; letter-spacing: -0.01em; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 17px; color: #000000; margin-top: 24px; margin-bottom: 8px; }
        .rf-prose p { margin-bottom: 14px; }
        .rf-prose ul { padding-left: 22px; margin-bottom: 14px; list-style: disc; }
        .rf-prose li { margin-bottom: 6px; }
        .rf-prose a { color: #00D4FF; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </div>
  );
}
