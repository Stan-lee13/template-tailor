import desktopBg from '../assets/hero-bg-desktop.webp';
import mobileBg from '../assets/hero-bg-mobile.webp';

/**
 * Cinematic hero background — responsive photographic asset with art-direction crops.
 * Desktop: 16:9 skyline landscape. Mobile: 9:16 portrait crop of laptop + skyline.
 * Picks the right asset at the browser level (no JS, no layout shift).
 */
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileBg} />
        <img
          src={desktopBg}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      </picture>
      {/* Cinematic darken + navy tint overlay for text contrast and bottom blend */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(201, 162, 39,0.08) 0%, rgba(11,26,42,0.4) 55%, rgba(11,26,42,0.8) 88%, #0B1A2A 100%)',
        }}
      />
      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  );
}
