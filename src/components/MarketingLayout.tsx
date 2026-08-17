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
    <div className="bg-black min-h-screen selection:bg-[#00D4FF] selection:text-black">
      <SEO path={path} title={title} description={description} />
      <Navigation />
      
      {/* Background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00D4FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#0082FF]/5 rounded-full blur-[120px]" />
      </div>

      <main className="relative pt-32 pb-24 px-6 lg:px-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-20">
            {eyebrow && (
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-8">
                {eyebrow}
              </span>
            )}
            <h1 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
              {title}
            </h1>
            {intro && (
              <p className="text-xl lg:text-2xl text-white/40 leading-relaxed max-w-2xl font-medium">
                {intro}
              </p>
            )}
          </div>

          <div className="rf-prose">{children}</div>

          {/* Premium CTA Card */}
          <div className="mt-32 p-10 lg:p-16 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF]/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-[#00D4FF]/20 transition-colors duration-700" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-md">
                <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 tracking-tight leading-none">
                  Stop the <span className="text-gradient-cyan">Leaking Revenue.</span>
                </h3>
                <p className="text-lg text-white/40 font-medium">
                  Free 30-min growth audit. Direct with an operator. No pitch, just strategy.
                </p>
              </div>
              <button 
                onClick={() => open('marketing_page')} 
                className="px-10 py-5 rounded-full bg-[#00D4FF] text-black font-black text-sm uppercase tracking-widest hover:bg-white hover:scale-105 transition-all duration-500 shadow-[0_0_30px_rgba(0,212,255,0.3)] whitespace-nowrap"
              >
                Book Your Audit
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      <style>{`
        .rf-prose { font-family: 'Inter', sans-serif; color: rgba(255,255,255,0.5); font-size: 18px; line-height: 1.8; font-weight: 400; }
        .rf-prose h2 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: clamp(28px, 4vw, 42px); color: #FFFFFF; margin-top: 80px; margin-bottom: 24px; letter-spacing: -0.04em; line-height: 1.1; }
        .rf-prose h3 { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: clamp(20px, 3vw, 28px); color: #FFFFFF; margin-top: 48px; margin-bottom: 16px; letter-spacing: -0.02em; }
        .rf-prose p { margin-bottom: 24px; }
        .rf-prose ul { padding-left: 24px; margin-bottom: 24px; list-style: none; }
        .rf-prose li { margin-bottom: 12px; position: relative; padding-left: 28px; }
        .rf-prose li::before { content: "→"; position: absolute; left: 0; color: #00D4FF; font-weight: 900; }
        .rf-prose a { color: #00D4FF; font-weight: 700; border-bottom: 2px solid rgba(0,212,255,0.2); transition: all 0.3s; }
        .rf-prose a:hover { border-bottom-color: #00D4FF; }
        .rf-prose strong { color: #FFFFFF; font-weight: 900; }
        .rf-prose blockquote { border-left: 4px solid #00D4FF; padding-left: 32px; font-style: italic; font-size: 24px; color: #FFFFFF; margin: 60px 0; }
      `}</style>
    </div>
  );
}
