interface DividerProps {
  variant: 'wave' | 'angle' | 'curve' | 'diagonal' | 'asymmetric';
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({ variant, fromColor = '#000000', toColor = '#000000', flip = false, className = '' }: DividerProps) {
  const transform = flip ? 'scaleY(-1)' : undefined;

  switch (variant) {
    case 'wave':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-2px', marginBottom: '-2px', transform }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(40px, 6vw, 100px)' }}>
            <path d={`M0,60 Q180,120 360,80 T720,90 T1080,70 T1440,85 L1440,120 L0,120 Z`} fill={toColor} />
          </svg>
        </div>
      );

    case 'angle':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-2px', marginBottom: '-2px', transform }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(30px, 5vw, 70px)' }}>
            <polygon points="0,80 1440,20 1440,80" fill={toColor} />
          </svg>
        </div>
      );

    case 'curve':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-2px', marginBottom: '-2px', transform }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(40px, 6vw, 90px)' }}>
            <path d={`M0,40 Q360,100 720,50 Q1080,0 1440,60 L1440,100 L0,100 Z`} fill={toColor} />
          </svg>
        </div>
      );

    case 'diagonal':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-2px', marginBottom: '-2px', transform }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(40px, 6vw, 90px)' }}>
            <polygon points="0,100 1440,30 1440,100" fill={toColor} />
          </svg>
        </div>
      );

    case 'asymmetric':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-2px', marginBottom: '-2px', transform }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(40px, 6vw, 100px)' }}>
            <path d={`M0,80 Q200,40 500,70 Q800,100 1100,50 Q1300,30 1440,60 L1440,120 L0,120 Z`} fill={toColor} />
          </svg>
        </div>
      );

    default:
      return null;
  }
}
