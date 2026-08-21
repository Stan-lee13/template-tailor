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
    <div className="bg-black min-h-screen selection:bg-[#C56A4A] selection:text-black">
      <Navigation />
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/5 blur-[120px] rounded-full" />
        </div>

        <article className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56A4A] mb-6">
            Legal Protocol
          </p>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-4 leading-[0.9]">
            {title}
          </h1>
          <p className="text-xs font-black uppercase tracking-widest text-white/20 mb-16">
            Revision Date: {updated}
          </p>
          <div className="rf-prose">{children}</div>
        </article>
      </main>
      <Footer />
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.4); font-size: 16px; line-height: 1.8; font-weight: 500; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 28px; color: #FFFFFF; margin-top: 64px; margin-bottom: 24px; letter-spacing: -0.04em; text-transform: uppercase; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 20px; color: #FFFFFF; margin-top: 48px; margin-bottom: 16px; letter-spacing: -0.02em; }
        .rf-prose p { margin-bottom: 24px; }
        .rf-prose ul { padding-left: 24px; margin-bottom: 24px; list-style: none; }
        .rf-prose li { margin-bottom: 12px; position: relative; }
        .rf-prose li::before { content: ''; position: absolute; left: -24px; top: 10px; width: 8px; height: 2px; background: #C56A4A; }
        .rf-prose a { color: #C56A4A; text-decoration: none; border-bottom: 1px solid rgba(197,106,74,0.3); transition: all 0.3s ease; }
        .rf-prose a:hover { color: #FFFFFF; border-bottom-color: #FFFFFF; }
        .rf-prose strong { color: #FFFFFF; font-weight: 700; }
      `}</style>
    </div>
  );
}
