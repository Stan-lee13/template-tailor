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
    <div style={{ background: '#f1ece4', minHeight: '100vh' }}>
      <SEO title="Blog" description="Strategic essays on retention, lifecycle marketing, and customer lifetime value from RetentionFirm." path="/blog" />
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 80px' }}>
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>
          <header className="mb-12 sm:mb-16">
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>Blog</p>
            <h1 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#0A0A0A', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Insights from the field.
            </h1>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#2D2D2D', maxWidth: '560px', lineHeight: 1.6 }}>
              Strategic notes on retention, lifecycle, and the operational details that actually move LTV.
            </p>
          </header>

          {loading ? (
            <p className="font-inter text-sm" style={{ color: '#888' }}>Loading…</p>
          ) : posts.length === 0 ? (
            <p className="font-inter" style={{ color: '#666' }}>No posts published yet.</p>
          ) : (
            <>
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="block group rounded-2xl overflow-hidden mb-6 transition-all duration-300"
                  style={{ background: '#0A0A0A', padding: 'clamp(28px, 5vw, 56px)' }}>
                  <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#F97316', letterSpacing: '0.08em', fontWeight: 500 }}>Featured</p>
                  <h2 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#f1ece4', lineHeight: 1.1, letterSpacing: '-0.02em' }}>{featured.title}</h2>
                  {featured.excerpt && <p className="font-inter mb-5" style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(241,236,228,0.7)', lineHeight: 1.6, maxWidth: '640px' }}>{featured.excerpt}</p>}
                  <p className="font-inter" style={{ fontSize: '13px', color: '#8A8A8A' }}>{fmt(featured.published_at)}</p>
                </Link>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {rest.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="block rounded-xl overflow-hidden transition-all duration-300"
                    style={{ background: '#FFFFFF', border: '1px solid #E2DDD3' }}>
                    {p.featured_image_url && (
                      <div className="aspect-video overflow-hidden" style={{ background: '#f1ece4' }}>
                        <SignedImage path={p.featured_image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6 sm:p-8">
                      <h3 className="font-outfit font-medium mb-3" style={{ fontSize: 'clamp(19px, 2.4vw, 23px)', color: '#0A0A0A', lineHeight: 1.2, letterSpacing: '-0.01em' }}>{p.title}</h3>
                      {p.excerpt && <p className="font-inter mb-5" style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.55 }}>{p.excerpt}</p>}
                      <p className="font-inter" style={{ fontSize: '12.5px', color: '#8A8A8A' }}>{fmt(p.published_at)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
