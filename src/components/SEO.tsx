import { Helmet } from 'react-helmet-async';
import { SITE } from '../config/site';

interface SEOProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  jsonLd?: object | object[];
  publishedAt?: string;
  author?: string;
}

export default function SEO({
  title,
  description = SITE.description,
  path = '/',
  image = '/og-image.jpg',
  type = 'website',
  jsonLd,
  publishedAt,
  author,
}: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = `${SITE.url}${path}`;
  const fullImage = image.startsWith('http') ? image : `${SITE.url}${image}`;

  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content={SITE.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {author && <meta name="author" content={author} />}

      {ldArray.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
}
