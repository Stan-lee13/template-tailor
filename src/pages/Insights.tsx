import { Link } from 'react-router-dom';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';
import SEO from '../components/SEO';
import { articles } from '../content/insights';
import { SITE } from '../config/site';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function Insights() {
  const sorted = [...articles].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const [featured, ...rest] = sorted;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE.name} Insights`,
    url: `${SITE.url}/insights`,
    blogPost: sorted.map((a) => ({
      '@type': 'BlogPosting',
      headline: a.title,
      datePublished: a.publishedAt,
      author: { '@type': 'Organization', name: SITE.name },
      url: `${SITE.url}/insights/${a.slug}`,
    })),
  };

  return (
    <div style={{ background: '#f1ece4', minHeight: '100vh' }}>
      <SEO
        title="Insights"
        description="Strategic essays on retention, lifecycle marketing, and customer lifetime value from the RetentionFirm editorial team."
        path="/insights"
        jsonLd={ld}
      />
      <Navigation />
      <main style={{ padding: '140px clamp(20px, 5vw, 80px) 80px' }}>
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>
          <header className="mb-12 sm:mb-16">
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#8A8A8A', letterSpacing: '0.08em' }}>
              Journal
            </p>
            <h1 className="font-outfit font-medium mb-4" style={{ fontSize: 'clamp(36px, 6vw, 64px)', color: '#0A0A0A', lineHeight: 1, letterSpacing: '-0.02em' }}>
              Insights from the field.
            </h1>
            <p className="font-inter" style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#2D2D2D', maxWidth: '560px', lineHeight: 1.6 }}>
              Strategic notes on retention, lifecycle, and the operational details that actually move LTV.
            </p>
          </header>

          {/* Featured */}
          <Link
            to={`/insights/${featured.slug}`}
            className="block group rounded-2xl overflow-hidden mb-6 transition-all duration-300"
            style={{ background: '#0A0A0A', padding: 'clamp(28px, 5vw, 56px)' }}
          >
            <p className="font-inter uppercase mb-3" style={{ fontSize: '11px', color: '#F97316', letterSpacing: '0.08em', fontWeight: 500 }}>
              {featured.category} · Featured
            </p>
            <h2 className="font-outfit font-medium mb-4 transition-colors" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#f1ece4', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              {featured.title}
            </h2>
            <p className="font-inter mb-5" style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(241,236,228,0.7)', lineHeight: 1.6, maxWidth: '640px' }}>
              {featured.excerpt}
            </p>
            <p className="font-inter" style={{ fontSize: '13px', color: '#8A8A8A' }}>
              {formatDate(featured.publishedAt)} · {featured.readingTime}
            </p>
          </Link>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {rest.map((a) => (
              <Link
                key={a.slug}
                to={`/insights/${a.slug}`}
                className="block rounded-xl p-6 sm:p-8 transition-all duration-300"
                style={{ background: '#FFFFFF', border: '1px solid #E2DDD3' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0A0A0A'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2DDD3'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <p className="font-inter uppercase mb-3" style={{ fontSize: '10.5px', color: '#F97316', letterSpacing: '0.08em', fontWeight: 500 }}>
                  {a.category}
                </p>
                <h3 className="font-outfit font-medium mb-3" style={{ fontSize: 'clamp(19px, 2.4vw, 23px)', color: '#0A0A0A', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {a.title}
                </h3>
                <p className="font-inter mb-5" style={{ fontSize: '14.5px', color: '#555', lineHeight: 1.55 }}>
                  {a.excerpt}
                </p>
                <p className="font-inter" style={{ fontSize: '12.5px', color: '#8A8A8A' }}>
                  {formatDate(a.publishedAt)} · {a.readingTime}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
