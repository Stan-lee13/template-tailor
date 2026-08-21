import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../../sections/Navigation';
import Footer from '../../sections/Footer';
import SEO from '../../components/SEO';
import SignedImage from '../../components/SignedImage';
import NotFound from '../NotFound';
import { supabase } from '@/integrations/supabase/client';
import { SITE } from '../../config/site';

type Post = {
  id: string; slug: string; title: string; excerpt: string | null; content_html: string;
  featured_image_url: string | null; featured_image_alt: string | null;
  published_at: string;
  meta_title: string | null; meta_description: string | null;
  og_image_url: string | null; canonical_url: string | null;
  schema_jsonld: any;
};

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug = '' } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [ogUrl, setOgUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
      setPost((data as Post) || null);
      setLoading(false);
      if (data) {
        const key = `viewed:${slug}`;
        if (!sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          supabase.rpc('increment_post_view', { _slug: slug });
        }
        if (data.og_image_url) {
          const { data: signed } = await supabase.storage.from('post-media').createSignedUrl(data.og_image_url, 60 * 60 * 24 * 7);
          setOgUrl(signed?.signedUrl || null);
        }
      }
    })();
  }, [slug]);

  if (loading) return (
    <div className="rf-secondary-shell min-h-screen flex items-center justify-center" aria-busy="true">
      <div role="status" aria-live="polite" className="flex items-center gap-4 rounded-[2rem] border border-[#111318]/10 bg-[#111318]/[0.03] px-6 py-5 text-[#111318]/70 font-black text-xs uppercase tracking-widest">
        <span className="w-4 h-4 rounded-full border-2 border-[#111318]/10 border-t-[#C56A4A] animate-spin" aria-hidden="true" />
        Loading…
      </div>
    </div>
  );
  if (!post) return <NotFound />;

  const ld = post.schema_jsonld || {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: post.title, description: post.meta_description || post.excerpt || '',
    datePublished: post.published_at,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  };

  return (
    <div className="rf-secondary-shell rf-secondary-shell--article min-h-screen selection:bg-[#C56A4A] selection:text-black">
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        path={post.canonical_url || `/blog/${post.slug}`}
        type="article"
        image={ogUrl || '/og-image.jpg'}
        publishedAt={post.published_at}
        author={SITE.name}
        jsonLd={ld}
      />
      <Navigation />
      <main className="relative pt-40 pb-32 px-6 overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-50">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C56A4A]/5 blur-[120px] rounded-full" />
        </div>

        <article className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C56A4A] mb-6">{fmt(post.published_at)}</p>
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">{post.title}</h1>
          {post.excerpt && <p className="text-lg lg:text-xl font-medium text-white/40 mb-12 leading-relaxed">{post.excerpt}</p>}

          {post.featured_image_url && (
            <div className="rounded-[2.5rem] overflow-hidden mb-16 border border-white/10 bg-white/[0.03]">
              <SignedImage path={post.featured_image_url} alt={post.featured_image_alt || ''} className="w-full h-auto" />
            </div>
          )}

          <div
            className="prose prose-invert prose-lg max-w-none font-inter prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-white prose-p:text-white/40 prose-p:leading-relaxed prose-a:text-[#C56A4A] prose-a:no-underline hover:prose-a:border-b hover:prose-a:border-[#C56A4A] prose-strong:text-white prose-blockquote:border-[#C56A4A] prose-blockquote:text-white prose-blockquote:font-black prose-blockquote:uppercase prose-blockquote:tracking-tight"
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
