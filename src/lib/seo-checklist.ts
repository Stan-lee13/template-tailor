export type CheckResult = { id: string; label: string; pass: boolean; hint?: string };

export interface ChecklistInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  contentHtml: string;
}

export function runSeoChecklist(p: ChecklistInput): CheckResult[] {
  const md = (p.metaDescription || '').trim();
  const kw = (p.focusKeyword || '').trim().toLowerCase();
  const title = p.title.toLowerCase();
  const slug = p.slug.toLowerCase();
  const html = p.contentHtml || '';

  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  const h2Count = (html.match(/<h2[\s>]/gi) || []).length;
  const firstPara = (html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '').toLowerCase();

  const results: CheckResult[] = [
    {
      id: 'meta',
      label: 'Meta description (50–160 chars)',
      pass: md.length >= 50 && md.length <= 160,
      hint: md ? `${md.length} chars` : 'Empty',
    },
    {
      id: 'kw',
      label: 'Focus keyword in title, slug & first paragraph',
      pass: !!kw && title.includes(kw) && slug.includes(kw.replace(/\s+/g, '-')) && firstPara.includes(kw),
    },
    {
      id: 'headings',
      label: 'Valid heading structure (no H1 in body, ≥1 H2)',
      pass: h1Count === 0 && h2Count >= 1,
      hint: `${h1Count} H1 / ${h2Count} H2`,
    },
    {
      id: 'image',
      label: 'Featured image with alt text',
      pass: !!p.featuredImageUrl && !!(p.featuredImageAlt || '').trim(),
    },
    {
      id: 'slug',
      label: 'URL slug optimized (≤60 chars, kebab-case)',
      pass: !!slug && slug.length <= 60 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug),
    },
  ];
  return results;
}
