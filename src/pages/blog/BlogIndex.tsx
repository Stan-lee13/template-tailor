import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../sections/Navigation';
import Footer from '../../sections/Footer';
import SEO from '../../components/SEO';
import SignedImage from '../../components/SignedImage';
import { supabase } from '@/integrations/supabase/client';

type Post = {
  id: string; slug: string; title: string; excerpt: string | null;
  featured_image_url: string | null; published_at: string;
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Trigger any due scheduled posts
      supabase.rpc('publish_due_posts').then(() => {});
      const { data } = await supabase.from('posts')
        .select('id, slug, title, excerpt, featured_image_url, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      setPosts((data as Post[]) || []);
      setLoading(false);
    })();
  }, []);

  const [featured, ...rest] = posts;

  return (
    <div className="rf-secondary-shell rf-secondary-shell--blog min-h-screen selection:bg-[#C56A4A] selection:text-black">
      <SEO title="Intelligence Hub" description="Strategic essays on retention, lifecycle marketing, and customer lifetime value from RetentionFirm." path="/blog" />
      <Navigation />
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <header className="mb-20 lg:mb-32">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56A4A] mb-6">Intelligence Hub</p>
            <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
              Notes from the <span className="text-gradient-warm">Retention</span> Field.
            </h1>
            <p className="text-lg lg:text-xl font-medium text-white/40 max-w-2xl leading-relaxed">
              Strategic architecture on lifecycle, LTV optimization, and the operational precision that defines award-winning retention.
            </p>
          </header>

          {loading ? (
            <div className="flex items-center gap-3 text-white/20 font-black text-xs uppercase tracking-widest">
              <div className="w-4 h-4 rounded-full border-2 border-white/10 border-t-[#C56A4A] animate-spin" />
              Decrypting Insights...
            </div>
          ) : posts.length === 0 ? (
            <p className="text-white/20 font-black text-xs uppercase tracking-widest">System offline. No intelligence assets deployed.</p>
          ) : (
            <div className="space-y-8">
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="group relative block rounded-[2.5rem] overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-700">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#C56A4A]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-[#C56A4A]/10 transition-colors duration-700" />

                  <div className="relative z-10 p-10 lg:p-20">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56A4A] mb-8">Priority Intelligence</p>
                    <h2 className="text-3xl lg:text-6xl font-black text-white tracking-tighter mb-8 leading-[0.9] max-w-4xl group-hover:text-gradient-warm transition-all duration-700">{featured.title}</h2>
                    {featured.excerpt && <p className="text-lg lg:text-xl font-medium text-white/40 mb-10 max-w-2xl leading-relaxed">{featured.excerpt}</p>}
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                      <span>{fmt(featured.published_at)}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[#C56A4A]">Read Protocol →</span>
                    </div>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rest.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="group relative rounded-[2.5rem] overflow-hidden bg-white/[0.03] border border-white/10 hover:border-[#C56A4A]/30 transition-all duration-700 flex flex-col">
                    {p.featured_image_url && (
                      <div className="aspect-[16/10] overflow-hidden border-b border-white/5">
                        <SignedImage path={p.featured_image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      </div>
                    )}
                    <div className="p-10 lg:p-12 flex-1 flex flex-col">
                      <h3 className="text-2xl lg:text-3xl font-black text-white tracking-tighter mb-6 leading-none group-hover:text-[#C56A4A] transition-colors duration-500">{p.title}</h3>
                      {p.excerpt && <p className="text-sm font-medium text-white/40 mb-10 leading-relaxed flex-1">{p.excerpt}</p>}
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>{fmt(p.published_at)}</span>
                        <span className="text-[#C56A4A] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">Read Protocol →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
