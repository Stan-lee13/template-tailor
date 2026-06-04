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

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#f1ece4' }}><p className="font-inter text-sm" style={{ color: '#666' }}>Loading…</p></div>;
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
    <div style={{ background: '#f1ece4', minHeight: '100vh' }}>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || ''}
        path={post.canonical_url || `/blog/${post.slug}`}
        type="article"
        image={ogUrl || '/og-image.jpg'}
        publishedAt={post.published_at}
        jsonLd={ld}
      />
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 80px' }}>
        <article className="mx-auto" style={{ maxWidth: '780px' }}>
          <p className="font-inter mb-3" style={{ fontSize: '12px', color: '#888', letterSpacing: '0.04em' }}>{fmt(post.published_at)}</p>
          <h1 className="font-outfit font-medium mb-5" style={{ fontSize: 'clamp(32px, 5vw, 56px)', color: '#0A0A0A', lineHeight: 1.05, letterSpacing: '-0.02em' }}>{post.title}</h1>
          {post.excerpt && <p className="font-inter mb-8" style={{ fontSize: 'clamp(17px, 2vw, 20px)', color: '#444', lineHeight: 1.5 }}>{post.excerpt}</p>}
          {post.featured_image_url && (
            <div className="rounded-2xl overflow-hidden mb-10" style={{ background: '#0A0A0A' }}>
              <SignedImage path={post.featured_image_url} alt={post.featured_image_alt || ''} className="w-full h-auto" />
            </div>
          )}
          <div
            className="prose prose-neutral prose-lg max-w-none font-inter prose-headings:font-outfit prose-headings:font-medium prose-a:text-[#F97316] prose-a:no-underline hover:prose-a:underline"
            style={{ color: '#1f1f1f' }}
            dangerouslySetInnerHTML={{ __html: post.content_html }}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
