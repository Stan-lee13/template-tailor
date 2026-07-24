interface DividerProps {
  variant: 'wave' | 'angle' | 'curve' | 'diagonal' | 'asymmetric';
  fromColor?: string;
  toColor?: string;
  flip?: boolean;
  className?: string;
}

export default function SectionDivider({ variant, fromColor = '#FFFFFF', toColor = '#000000', flip = false, className = '' }: DividerProps) {
  const transform = flip ? 'scaleY(-1)' : undefined;

  switch (variant) {
    case 'wave':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px', transform }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(60px, 8vw, 120px)' }}>
            <path d={`M0,0 L0,60 Q180,120 360,80 T720,90 T1080,70 T1440,85 L1440,0 Z`} fill={fromColor} />
            <path d={`M0,60 Q180,120 360,80 T720,90 T1080,70 T1440,85 L1440,120 L0,120 Z`} fill={toColor} />
          </svg>
        </div>
      );

    case 'angle':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px', transform }}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(40px, 6vw, 80px)' }}>
            <polygon points="0,0 1440,0 1440,20 0,80" fill={fromColor} />
            <polygon points="0,80 1440,20 1440,80" fill={toColor} />
          </svg>
          {/* Cyan accent line */}
          <div className="absolute top-1/2 left-[15%] w-[120px] h-[2px] -translate-y-1/2" style={{ background: 'linear-gradient(90deg, transparent, #00D4FF, transparent)', opacity: 0.4, transform: `rotate(-3deg) ${flip ? 'scaleY(-1)' : ''}` }} />
        </div>
      );

    case 'curve':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px', transform }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(50px, 7vw, 100px)' }}>
            <path d={`M0,0 L0,40 Q360,100 720,50 Q1080,0 1440,60 L1440,0 Z`} fill={fromColor} />
            <path d={`M0,40 Q360,100 720,50 Q1080,0 1440,60 L1440,100 L0,100 Z`} fill={toColor} />
          </svg>
        </div>
      );

    case 'diagonal':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px', transform }}>
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(50px, 7vw, 100px)' }}>
            <polygon points="0,0 1440,0 1440,30 0,100" fill={fromColor} />
            <polygon points="0,100 1440,30 1440,100" fill={toColor} />
          </svg>
          {/* Cyan floating dot */}
          <div className="absolute top-1/3 right-[10%] w-3 h-3 rounded-full" style={{ background: 'rgba(0,212,255,0.3)', filter: 'blur(6px)' }} />
        </div>
      );

    case 'asymmetric':
      return (
        <div className={`relative w-full overflow-hidden ${className}`} style={{ marginTop: '-1px', marginBottom: '-1px', transform }}>
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: 'clamp(60px, 8vw, 120px)' }}>
            <path d={`M0,0 L0,80 Q200,40 500,70 Q800,100 1100,50 Q1300,30 1440,60 L1440,0 Z`} fill={fromColor} />
            <path d={`M0,80 Q200,40 500,70 Q800,100 1100,50 Q1300,30 1440,60 L1440,120 L0,120 Z`} fill={toColor} />
          </svg>
          {/* Cyan accent line */}
          <div className="absolute bottom-[30%] left-[8%] w-[80px] h-[2px]" style={{ background: 'linear-gradient(90deg, #00D4FF, transparent)', opacity: 0.3, transform: 'rotate(-2deg)' }} />
        </div>
      );

    default:
      return null;
  }
}
