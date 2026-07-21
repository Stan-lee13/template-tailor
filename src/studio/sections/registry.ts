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
    key: 'hero',
    type: 'hero',
    label: 'Hero',
    description: 'Top-of-page headline block with eyebrow, title, subtitle and CTAs.',
    scope: 'page',
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
    key: 'problem',
    type: 'problem',
    label: 'Problem Section',
    description: 'Pain-points block: eyebrow, two-line headline, intro paragraph, and a list of pain points.',
    scope: 'page',
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

  final_cta: {
    key: 'final_cta',
    type: 'final_cta',
    label: 'Final CTA',
    description: 'Bottom-of-page conversion block with two-line headline, supporting copy, and CTA button.',
    scope: 'page',
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
    key: 'rich_html',
    type: 'rich_html',
    label: 'Rich Text Block',
    description: 'Free-form rich text / HTML block for custom copy anywhere on a page.',
    scope: 'page',
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
