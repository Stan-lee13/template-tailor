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
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 80px' }}>
        <article className="mx-auto" style={{ maxWidth: '720px' }}>
          <Link to="/insights" className="font-inter inline-flex items-center gap-2 mb-6" style={{ fontSize: '13px', color: '#555' }}>
            <span>←</span> All insights
          </Link>
          <p className="font-inter uppercase mb-4" style={{ fontSize: '11px', color: '#00D4FF', letterSpacing: '0.08em', fontWeight: 500 }}>
            {category}
          </p>
          <h1 className="font-outfit font-medium mb-6" style={{ fontSize: 'clamp(30px, 5vw, 52px)', color: '#000000', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <div className="flex items-center gap-3 mb-12 pb-8" style={{ borderBottom: '1px solid #D6D3CC' }}>
            <div className="rounded-full flex items-center justify-center font-outfit font-medium" style={{ width: 36, height: 36, background: '#000000', color: '#FFFFFF', fontSize: '13px' }}>
              RF
            </div>
            <div>
              <p className="font-inter" style={{ fontSize: '13px', color: '#000000', fontWeight: 500 }}>{author}</p>
              <p className="font-inter" style={{ fontSize: '12px', color: '#8A8A8A' }}>{date} · {readingTime}</p>
            </div>
          </div>

          <div className="rf-prose">{children}</div>

          <div className="mt-16 p-7 sm:p-9 rounded-2xl" style={{ background: '#000000' }}>
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#00D4FF', letterSpacing: '0.08em' }}>
              Free Growth Audit
            </p>
            <h3 className="font-outfit font-medium mb-3" style={{ fontSize: 'clamp(22px, 3vw, 28px)', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Want this applied to your store?
            </h3>
            <p className="font-inter mb-5" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              We'll audit your current retention setup and show you the three highest-leverage fixes — no commitment, no pitch deck.
            </p>
            <button onClick={() => open('article_cta')} className="font-inter font-medium text-white" style={{ background: '#00D4FF', padding: '12px 26px', borderRadius: '9999px', fontSize: '14px' }}>
              Book a free audit
            </button>
          </div>
        </article>
      </main>
      <Footer />
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: #2D2D2D; font-size: 17px; line-height: 1.75; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: clamp(22px, 3vw, 28px); color: #000000; margin-top: 44px; margin-bottom: 14px; letter-spacing: -0.01em; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 500; font-size: 19px; color: #000000; margin-top: 28px; margin-bottom: 10px; }
        .rf-prose p { margin-bottom: 18px; }
        .rf-prose ul { padding-left: 22px; margin-bottom: 18px; list-style: disc; }
        .rf-prose li { margin-bottom: 8px; }
        .rf-prose blockquote { border-left: 3px solid #00D4FF; padding: 6px 0 6px 18px; margin: 26px 0; font-family: 'Outfit', sans-serif; font-size: 20px; color: #000000; line-height: 1.45; font-style: normal; font-weight: 500; }
        .rf-prose strong { color: #000000; font-weight: 600; }
        .rf-prose a { color: #00D4FF; text-decoration: underline; text-underline-offset: 3px; }
      `}</style>
    </div>
  );
}
