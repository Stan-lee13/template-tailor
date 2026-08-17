import { ReactNode } from 'react';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import { Link } from 'react-router-dom';
import { useBooking } from '../hooks/useBooking';

interface Props {
  category: string;
  title: string;
  publishedAt: string;
  readingTime: string;
  author: string;
  children: ReactNode;
}

export default function ArticleLayout({ category, title, publishedAt, readingTime, author, children }: Props) {
  const { open } = useBooking();
  const date = new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-black min-h-screen selection:bg-[#00D4FF] selection:text-black">
      <Navigation />
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00D4FF]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00D4FF]/5 blur-[120px] rounded-full" />
        </div>

        <article className="relative z-10 mx-auto max-w-3xl">
          <Link to="/insights" className="inline-flex items-center gap-3 mb-12 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Intel
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00D4FF] mb-6">
            {category}
          </p>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-10 leading-[0.9]">
            {title}
          </h1>
          <div className="flex items-center gap-6 mb-20 pb-12 border-b border-white/5">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-[#00D4FF]">
              RF
            </div>
            <div>
              <p className="text-sm font-black text-white uppercase tracking-widest">{author}</p>
              <p className="text-xs font-medium text-white/20 uppercase tracking-widest mt-1">{date} · {readingTime}</p>
            </div>
          </div>

          <div className="rf-prose">{children}</div>

          <div className="mt-24 p-10 lg:p-16 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00D4FF] mb-6">
              Deployment Protocol
            </p>
            <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-6 leading-none">
              Want this applied to your store?
            </h3>
            <p className="text-lg font-medium text-white/40 leading-relaxed mb-10 max-w-xl">
              We'll audit your current retention setup and show you the three highest-leverage fixes — no commitment, no pitch deck.
            </p>
            <button 
              onClick={() => open('article_cta')} 
              className="px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest bg-[#00D4FF] text-black hover:bg-white transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.2)]"
            >
              Secure Growth Audit
            </button>
          </div>
        </article>
      </main>
      <Footer />
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.4); font-size: 18px; line-height: 1.8; font-weight: 500; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 32px; color: #FFFFFF; margin-top: 80px; margin-bottom: 24px; letter-spacing: -0.04em; text-transform: uppercase; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 24px; color: #FFFFFF; margin-top: 56px; margin-bottom: 16px; letter-spacing: -0.02em; }
        .rf-prose p { margin-bottom: 32px; }
        .rf-prose ul { padding-left: 24px; margin-bottom: 32px; list-style: none; }
        .rf-prose li { margin-bottom: 16px; position: relative; }
        .rf-prose li::before { content: ''; position: absolute; left: -24px; top: 12px; width: 8px; height: 2px; background: #00D4FF; }
        .rf-prose blockquote { border-left: 4px solid #00D4FF; padding: 12px 0 12px 32px; margin: 64px 0; font-family: 'Outfit', sans-serif; font-size: 28px; color: #FFFFFF; line-height: 1.4; font-style: normal; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; }
        .rf-prose strong { color: #FFFFFF; font-weight: 700; }
        .rf-prose a { color: #00D4FF; text-decoration: none; border-bottom: 1px solid rgba(0,212,255,0.3); transition: all 0.3s ease; }
        .rf-prose a:hover { color: #FFFFFF; border-bottom-color: #FFFFFF; }
      `}</style>
    </div>
  );
}
