// Section registry — declares every editable section type.
// Each entry: schema for the inspector form, defaults matching the current live site,
// and an optional preview thumbnail.

export type FieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'url' | 'color' | 'boolean' | 'list';

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  itemFields?: Field[]; // for type: 'list'
};

export type SectionDef = {
  key: string;                // section_key stored in DB
  type: string;               // section type (matches registry key)
  label: string;              // human-friendly name
  description: string;
  scope: 'page' | 'global';   // page-bound vs global (nav/footer/announcement)
  fields: Field[];
  defaults: Record<string, unknown>;
};

export const SECTIONS: Record<string, SectionDef> = {
  hero: {
    key: 'hero', type: 'hero', label: 'Hero', scope: 'page',
    description: 'Top-of-page headline block with eyebrow, title, subtitle and CTAs.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'title_left', label: 'Title (first line)', type: 'text' },
      { key: 'title_right', label: 'Title (highlighted)', type: 'text' },
      { key: 'title_right_suffix', label: 'Title (after highlight)', type: 'text' },
      { key: 'subtitle_prefix', label: 'Subtitle (before rotating word)', type: 'text' },
      { key: 'rotating_words', label: 'Rotating words', type: 'list', itemFields: [{ key: 'word', label: 'Word', type: 'text' }] },
      { key: 'subtitle_suffix', label: 'Subtitle (after rotating word)', type: 'text' },
      { key: 'primary_cta_label', label: 'Primary CTA label', type: 'text' },
      { key: 'secondary_cta_label', label: 'Secondary CTA label', type: 'text' },
      { key: 'secondary_cta_target', label: 'Secondary CTA target', type: 'text', help: 'Anchor id like #process or absolute path' },
      { key: 'background_image', label: 'Background image', type: 'image' },
    ],
    defaults: {
      eyebrow: 'Retention Marketing Agency',
      title_left: 'Turn Your Existing Customers Into Your ',
      title_right: 'Most Profitable',
      title_right_suffix: ' Growth Engine',
      subtitle_prefix: 'We help ecommerce brands grow',
      rotating_words: [{ word: 'retention' }, { word: 'LTV' }, { word: 'repeat revenue' }, { word: 'lifecycle' }],
      subtitle_suffix: '— without increasing ad spend.',
      primary_cta_label: 'Book a Growth Audit',
      secondary_cta_label: 'See How It Works',
      secondary_cta_target: '#process',
      background_image: null,
    },
  },

  problem: {
    key: 'problem', type: 'problem', label: 'Problem Section', scope: 'page',
    description: 'Pain-points block: eyebrow, headline, intro, list of pain points.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline_1', label: 'Headline line 1', type: 'text' },
      { key: 'headline_2', label: 'Headline line 2 (highlighted)', type: 'text' },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
      { key: 'pain_points', label: 'Pain points', type: 'list', itemFields: [{ key: 'text', label: 'Pain point', type: 'text' }] },
      { key: 'closer', label: 'Closing line', type: 'text' },
    ],
    defaults: {
      eyebrow: 'The Problem',
      headline_1: "You're Not Losing Money on Ads…",
      headline_2: "You're Losing It After the First Purchase",
      intro: "Most brands spend thousands acquiring customers… but fail to bring them back, increase their value, or build real loyalty. So what happens?",
      pain_points: [
        { text: 'Customers buy once and disappear' },
        { text: 'CAC keeps rising' },
        { text: 'Profit margins shrink' },
        { text: 'Growth becomes unpredictable' },
      ],
      closer: "→ You're paying for customers… but not keeping them.",
    },
  },

  solution: {
    key: 'solution', type: 'solution', label: 'Solution Section', scope: 'page',
    description: 'Solution narrative with supporting cinematic image and benefit cards.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'body', label: 'Body paragraph', type: 'textarea' },
      { key: 'image', label: 'Supporting image', type: 'image' },
      { key: 'benefits', label: 'Benefit cards', type: 'list', itemFields: [
        { key: 'text', label: 'Text', type: 'text' },
        { key: 'color', label: 'Accent color', type: 'color' },
      ]},
      { key: 'closer_prefix', label: 'Closer (prefix)', type: 'text' },
      { key: 'closer_highlight', label: 'Closer (highlighted)', type: 'text' },
    ],
    defaults: {
      eyebrow: 'The Solution',
      headline: 'We Build Your Retention Revenue Engine',
      body: "At RetentionFirm, we don't \"run email campaigns.\" We engineer a complete system that drives predictable revenue growth.",
      image: '/assets/sections/solution.jpg',
      benefits: [
        { text: 'Converts first-time buyers into repeat customers', color: '#10B981' },
        { text: 'Increases average order value (AOV)', color: '#F59E0B' },
        { text: 'Maximizes customer lifetime value (LTV)', color: '#4169E1' },
        { text: "Builds loyalty that competitors can't steal", color: '#F97316' },
      ],
      closer_prefix: '→ Your customers stop being one-time transactions… and start becoming',
      closer_highlight: 'long-term revenue assets.',
    },
  },

  services: {
    key: 'services', type: 'services', label: 'Services Section', scope: 'page',
    description: 'Signature circular-scroll services carousel. Each service is a card in the ring.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'intro', label: 'Intro paragraph', type: 'textarea' },
      { key: 'services', label: 'Services', type: 'list', itemFields: [
        { key: 'number', label: 'Number label (01, 02…)', type: 'text' },
        { key: 'title', label: 'Service title', type: 'text' },
        { key: 'items', label: 'Deliverables (comma-separated)', type: 'text' },
        { key: 'accent', label: 'Accent color', type: 'color' },
      ]},
    ],
    defaults: {
      eyebrow: 'What We Do',
      headline: 'Everything You Need to Turn Customers Into Revenue',
      intro: 'From infrastructure to loyalty — every service is engineered to maximize lifetime value and reduce churn.',
      services: [
        { number: '01', title: 'Retention Infrastructure Setup', items: 'Email + SMS system, CRM & segmentation, Tracking & analytics', accent: '#F97316' },
        { number: '02', title: 'Lifecycle Marketing Systems', items: 'Welcome flows, Post-purchase flows, Abandonment recovery, Re-engagement', accent: '#2C91E1' },
        { number: '03', title: 'Revenue Optimization', items: 'Upsells & cross-sells, Offer strategy, AOV boosters, Subscription models', accent: '#10B981' },
        { number: '04', title: 'Personalization & Segmentation', items: 'Behavior targeting, Customer segmentation, Dynamic messaging', accent: '#F59E0B' },
        { number: '05', title: 'Loyalty & Retention Strategy', items: 'Loyalty programs, Referral systems, Retention loops', accent: '#06B6D4' },
      ],
    },
  },

  results: {
    key: 'results', type: 'results', label: 'Results Section', scope: 'page',
    description: 'Outcomes block with editorial image backdrop.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'image', label: 'Backdrop image', type: 'image' },
      { key: 'outcomes', label: 'Outcomes', type: 'list', itemFields: [
        { key: 'text', label: 'Outcome', type: 'text' },
        { key: 'icon', label: 'Icon (single char)', type: 'text' },
        { key: 'color', label: 'Accent color', type: 'color' },
      ]},
      { key: 'closer', label: 'Closing line', type: 'text' },
    ],
    defaults: {
      eyebrow: 'Results',
      headline: 'What This Means For Your Brand',
      image: '/assets/sections/results.jpg',
      outcomes: [
        { text: 'More repeat purchases', icon: '↑', color: '#10B981' },
        { text: 'Higher customer lifetime value', icon: '◆', color: '#F59E0B' },
        { text: 'Increased profitability', icon: '●', color: '#F97316' },
        { text: 'Less dependence on ads', icon: '→', color: '#2C91E1' },
        { text: 'Predictable, scalable growth', icon: '★', color: '#D4A853' },
      ],
      closer: '→ You grow faster… with less risk.',
    },
  },

  differentiation: {
    key: 'differentiation', type: 'differentiation', label: 'Differentiation', scope: 'page',
    description: 'Why-us block with side-by-side comparison and editorial image.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'body', label: 'Body paragraph', type: 'textarea' },
      { key: 'image', label: 'Editorial image', type: 'image' },
      { key: 'dont_focus', label: 'Do NOT focus on', type: 'list', itemFields: [{ key: 'text', label: 'Item', type: 'text' }] },
      { key: 'do_focus', label: 'DO focus on', type: 'list', itemFields: [{ key: 'text', label: 'Item', type: 'text' }] },
      { key: 'closer', label: 'Closing line', type: 'text' },
    ],
    defaults: {
      eyebrow: 'Why Us',
      headline: "We're Not Another \"Email Marketing Agency\"",
      body: 'Most agencies send emails. We build revenue systems.',
      image: '/assets/sections/differentiation.jpg',
      dont_focus: [{ text: 'Open rates' }, { text: 'Click rates' }],
      do_focus: [{ text: 'Revenue per customer' }, { text: 'Lifetime value' }, { text: 'Retention-driven growth' }],
      closer: "→ If it doesn't make you more money, we don't do it.",
    },
  },

  process: {
    key: 'process', type: 'process', label: 'Process Section', scope: 'page',
    description: 'Step-by-step process with atmospheric image and per-step deliverables.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'image', label: 'Background image', type: 'image' },
      { key: 'steps', label: 'Steps', type: 'list', itemFields: [
        { key: 'number', label: 'Step number', type: 'text' },
        { key: 'title', label: 'Step title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'deliverables', label: 'Deliverables (comma-separated)', type: 'text' },
        { key: 'accent', label: 'Accent color', type: 'color' },
      ]},
    ],
    defaults: {
      eyebrow: 'Our Process',
      headline: 'How We Work',
      image: '/assets/sections/process.jpg',
      steps: [
        { number: '01', title: 'Growth Audit', description: 'We dig into your data to find exactly where revenue is slipping through the cracks.', deliverables: 'Revenue leak analysis, Customer journey mapping, Competitor benchmarking, 30-day action plan', accent: '#F97316' },
        { number: '02', title: 'System Build', description: 'We architect and deploy your complete retention engine — flows, segments, and automations.', deliverables: 'Email & SMS buildout, Segmentation architecture, Tech stack integration, QA & launch', accent: '#2C91E1' },
        { number: '03', title: 'Optimization', description: 'We test, iterate, and scale what works — turning retention into your most profitable channel.', deliverables: 'A/B testing cadence, Performance reporting, Strategy refinement, Revenue scaling', accent: '#10B981' },
      ],
    },
  },

  faq: {
    key: 'faq', type: 'faq', label: 'FAQ Section', scope: 'page',
    description: 'Frequently asked questions accordion.',
    fields: [
      { key: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'faqs', label: 'Questions', type: 'list', itemFields: [
        { key: 'q', label: 'Question', type: 'text' },
        { key: 'a', label: 'Answer', type: 'textarea' },
      ]},
    ],
    defaults: {
      eyebrow: 'FAQ',
      headline: 'Common Questions',
      faqs: [
        { q: 'How long does it take to see results from retention marketing?', a: 'Most clients see measurable improvements in repeat purchase rate and customer engagement within 30-60 days. Full LTV impact typically becomes clear within 90 days.' },
        { q: 'Do you work with brands in any industry?', a: 'We specialize in DTC e-commerce and SaaS with at least $1M in annual revenue. Our strategies are tailored to subscription, repeat-purchase, and high-frequency business models.' },
        { q: 'What platforms do you integrate with?', a: 'Shopify, WooCommerce, Klaviyo, Attentive, Postscript, Recharge, and custom stacks. We choose tools based on your specific needs.' },
        { q: 'How do you measure success?', a: 'Repeat purchase rate, customer lifetime value, churn rate, cohort retention, and revenue from retention channels. Every engagement starts with clear KPI benchmarks.' },
        { q: 'Can you work with our existing marketing team?', a: 'Absolutely. We function as a retention-focused extension of in-house teams, collaborating closely with your marketing, product, and data teams.' },
      ],
    },
  },

  final_cta: {
    key: 'final_cta', type: 'final_cta', label: 'Final CTA', scope: 'page',
    description: 'Bottom-of-page conversion block.',
    fields: [
      { key: 'headline_1', label: 'Headline line 1', type: 'text' },
      { key: 'headline_2', label: 'Headline line 2 (highlighted)', type: 'text' },
      { key: 'body', label: 'Body copy', type: 'textarea' },
      { key: 'kicker', label: 'Kicker line', type: 'text' },
      { key: 'cta_label', label: 'CTA label', type: 'text' },
    ],
    defaults: {
      headline_1: 'You Already Paid for Your Customers…',
      headline_2: "Now It's Time to Profit From Them",
      body: "Every day you don't fix your retention… you're losing revenue you've already earned.",
      kicker: "→ Let's turn that around.",
      cta_label: 'Book a Growth Audit',
    },
  },

  rich_html: {
    key: 'rich_html', type: 'rich_html', label: 'Rich Text Block', scope: 'page',
    description: 'Free-form rich text / HTML block for custom copy anywhere on a page.',
    fields: [
      { key: 'title', label: 'Optional title', type: 'text' },
      { key: 'body_html', label: 'Body', type: 'richtext' },
      { key: 'background', label: 'Background color', type: 'color' },
      { key: 'text_color', label: 'Text color', type: 'color' },
    ],
    defaults: {
      title: '',
      body_html: '<p>New rich text block. Click edit to customise.</p>',
      background: '#f1ece4',
      text_color: '#0A0A0A',
    },
  },
};

export const SECTION_LIST = Object.values(SECTIONS);

export function getSection(type: string): SectionDef | undefined {
  return SECTIONS[type];
}

export function withDefaults(type: string, content: Record<string, unknown> | null | undefined): Record<string, unknown> {
  const def = getSection(type);
  if (!def) return content ?? {};
  return { ...def.defaults, ...(content ?? {}) };
}
