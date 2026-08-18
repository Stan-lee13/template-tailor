import { ProofRail } from './SectionObject';

const items = [
  { label: 'Built for growth-stage ecommerce brands', meta: 'context', accent: 'terracotta' as const },
  { label: 'Retention systems designed for repeat-purchase businesses', meta: 'system', accent: 'ochre' as const },
  { label: 'Lifecycle-focused email and SMS architecture', meta: 'activation', accent: 'milk' as const },
  { label: 'Designed for brands serious about LTV', meta: 'measure', accent: 'terracotta' as const },
  { label: 'Klaviyo and Attentive native deployments', meta: 'stack', accent: 'ochre' as const },
  { label: 'Operator-led, not template-led', meta: 'method', accent: 'milk' as const },
];

export default function SocialProofTicker() {
  return <ProofRail items={items} label="Retention signals" />;
}
