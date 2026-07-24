interface BrandLogoProps {
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * RetentionFirm. branded wordmark.
 *
 * On LIGHT backgrounds (variant='light'):
 *   "Retention" black, dot on "i" white
 *   "Firm" white (with subtle shadow), dot on "i" black
 *   Trailing "." black
 *
 * On DARK backgrounds (variant='dark'):
 *   "Retention" cream, dot on "i" dark/near-black
 *   "Firm" orange-ish accent for contrast, dot on "i" cream
 *   Trailing "." cream
 */
export default function BrandLogo({ variant = 'dark', size = 'md', className = '' }: BrandLogoProps) {
  const isDark = variant === 'dark';

  const retentionColor = isDark ? '#FFFFFF' : '#000000';
  const retentionDot = isDark ? '#000000' : '#FFFFFF';
  const firmColor = isDark ? '#FFFFFF' : '#FFFFFF';
  const firmDot = isDark ? '#FFFFFF' : '#000000';
  const periodColor = isDark ? '#FFFFFF' : '#000000';

  const firmShadow = !isDark
    ? '0 0 2px rgba(0,0,0,0.12), 0 0 4px rgba(0,0,0,0.06)'
    : 'none';

  const fontSize = size === 'sm' ? '18px' : size === 'md' ? '20px' : '26px';
  const dotSize = size === 'sm' ? '2.5px' : size === 'md' ? '3px' : '3.5px';

  return (
    <span
      className={`font-outfit inline-flex items-baseline leading-none select-none ${className}`}
      style={{ fontSize, fontWeight: 600, letterSpacing: '-0.02em' }}
      aria-label="RetentionFirm"
    >
      <span style={{ color: retentionColor }}>Retent</span>
      {/* i with custom dot */}
      <span className="relative inline-block" style={{ color: retentionColor }}>
        <span>i</span>
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '-0.04em',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: retentionDot,
          }}
        />
      </span>
      <span style={{ color: retentionColor }}>on</span>
      <span style={{ color: firmColor, textShadow: firmShadow }}>F</span>
      <span className="relative inline-block" style={{ color: firmColor, textShadow: firmShadow }}>
        <span>i</span>
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: '-0.04em',
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: firmDot,
          }}
        />
      </span>
      <span style={{ color: firmColor, textShadow: firmShadow }}>rm</span>
      <span style={{ color: periodColor }}>.</span>
    </span>
  );
}
