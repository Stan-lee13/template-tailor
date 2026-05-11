import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArticleLayout from '../components/ArticleLayout';
import SEO from '../components/SEO';
import NotFound from './NotFound';
import { getArticle } from '../content/insights';
import { SITE } from '../config/site';
import { track } from '../lib/analytics';

export default function Article() {
  const { slug = '' } = useParams();
  const article = getArticle(slug);

  useEffect(() => {
    if (article) track('insights_article_view', { slug: article.slug });
  }, [article]);

  if (!article) return <NotFound />;

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: `${SITE.url}/favicon-512.png` } },
    image: `${SITE.url}/og-image.jpg`,
    mainEntityOfPage: `${SITE.url}/insights/${article.slug}`,
  };

  return (
    <>
      <SEO
        title={article.title}
        description={article.excerpt}
        path={`/insights/${article.slug}`}
        type="article"
        publishedAt={article.publishedAt}
        author={article.author}
        jsonLd={ld}
      />
      <ArticleLayout
        category={article.category}
        title={article.title}
        publishedAt={article.publishedAt}
        readingTime={article.readingTime}
        author={article.author}
      >
        {article.body}
      </ArticleLayout>
    </>
  );
}
