interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * RetentionFirm. branded wordmark.
 *
 * "Retention" — primary color (black on light, cream on dark)
 *   • dot on the "i" is inverted (white on light, black on dark)
 * "Firm" — white on light backgrounds (with subtle shadow), black on dark
 *   • dot on the "i" is inverted (black on light, cream on dark)
 * Trailing full-stop "." in primary color.
 */
export default function BrandLogo({ variant = 'dark', size = 'md', className = '' }: BrandLogoProps) {
  const isDark = variant === 'dark'; // dark = sits on dark bg

  // Primary text color (main letters)
  const primary = isDark ? '#f1ece4' : '#0A0A0A';
  // Secondary text color (contrasting parts)
  const secondary = isDark ? '#0A0A0A' : '#FFFFFF';
  // Dot accents (inverted)
  const retentionDot = secondary; // dot on "i" in Retention
  const firmDot = primary; // dot on "i" in Firm

  const fontSize = size === 'sm' ? '18px' : size === 'md' ? '20px' : '26px';

  const firmShadow = !isDark ? '0 0 1px rgba(0,0,0,0.08)' : 'none';

  return (
    <span
      className={`font-outfit inline-flex items-baseline leading-none select-none ${className}`}
      style={{ fontSize, fontWeight: 600, letterSpacing: '-0.02em' }}
      aria-label="RetentionFirm"
    >
      {/* R-e-t-e-n-t */}
      <span style={{ color: primary }}>Retent</span>
      {/* i with custom dot */}
      <span className="relative inline-block" style={{ color: primary }}>
        {/* The "i" without its natural dot — we use a dotless approach via clipping */}
        <span style={{ color: primary }}>i</span>
        {/* Overlay dot */}
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: size === 'sm' ? '-0.04em' : '-0.04em',
            width: size === 'sm' ? '2.5px' : size === 'md' ? '3px' : '3.5px',
            height: size === 'sm' ? '2.5px' : size === 'md' ? '3px' : '3.5px',
            borderRadius: '50%',
            background: retentionDot,
          }}
        />
      </span>
      <span style={{ color: primary }}>on</span>

      {/* F */}
      <span style={{ color: secondary, textShadow: firmShadow }}>F</span>
      {/* i with custom dot */}
      <span className="relative inline-block" style={{ color: secondary, textShadow: firmShadow }}>
        <span>i</span>
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '-0.04em',
            width: size === 'sm' ? '2.5px' : size === 'md' ? '3px' : '3.5px',
            height: size === 'sm' ? '2.5px' : size === 'md' ? '3px' : '3.5px',
            borderRadius: '50%',
            background: firmDot,
          }}
        />
      </span>
      <span style={{ color: secondary, textShadow: firmShadow }}>rm</span>

      {/* Trailing period */}
      <span style={{ color: primary }}>.</span>
    </span>
  );
}
