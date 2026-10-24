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
      {/* Cinematic darken + warm retention palette overlay for text contrast and bottom blend */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(197,106,74,0.12) 0%, rgba(17,19,24,0.4) 55%, rgba(5,5,5,0.84) 88%, #050505 100%)',
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
