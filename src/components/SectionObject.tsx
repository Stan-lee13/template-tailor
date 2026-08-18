import type { ReactNode } from 'react';

interface SectionObjectProps {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  tone?: 'dark' | 'light';
  className?: string;
}

export function SectionObject({
  eyebrow,
  title,
  description,
  children,
  tone = 'dark',
  className = '',
}: SectionObjectProps) {
  return (
    <section className={`rf-object-shell rf-object-shell--${tone} ${className}`}>
      {(eyebrow || title || description) && (
        <header className="rf-object-header">
          {eyebrow && <span className="rf-object-eyebrow">{eyebrow}</span>}
          {title && <h2 className="rf-object-title">{title}</h2>}
          {description && <p className="rf-object-description">{description}</p>}
        </header>
      )}
      <div className="rf-object-body">{children}</div>
    </section>
  );
}

interface ProofRailItem {
  label: ReactNode;
  meta?: ReactNode;
  accent?: 'terracotta' | 'ochre' | 'milk';
}

interface ProofRailProps {
  items: ProofRailItem[];
  className?: string;
  label?: ReactNode;
}

export function ProofRail({ items, className = '', label = 'Signals in the system' }: ProofRailProps) {
  const loop = [...items, ...items];

  return (
    <div className={`rf-proof-rail ${className}`} aria-label={typeof label === 'string' ? label : undefined}>
      <div className="rf-proof-rail__label">{label}</div>
      <div className="rf-proof-rail__viewport">
        <div className="rf-proof-rail__track">
          {loop.map((item, index) => (
            <div key={`${String(item.label)}-${index}`} className={`rf-proof-item rf-proof-item--${item.accent || 'milk'}`}>
              <span className="rf-proof-item__marker" aria-hidden="true" />
              <span className="rf-proof-item__label">{item.label}</span>
              {item.meta && <span className="rf-proof-item__meta">{item.meta}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
