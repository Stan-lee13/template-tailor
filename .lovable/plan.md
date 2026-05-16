
# Cinematic Rework: From "Animated MVP" to "Premium Production-Grade Site"

Goal: stop animating everything, rebuild scroll feel, swap the heavy WebGL particle background for a cinematic photographic hero, introduce a cooler navy/silver/graphite palette layer alongside the existing cream/orange brand, and make mobile feel premium — not laggy.

Brand identity (orange `#F97316`, cream `#f1ece4`, near-black `#0A0A0A`, Outfit/Inter, "Retention" black / "Firm" white wordmark) stays locked. Orange remains the primary CTA color — only the *atmospheric* color story shifts toward navy + silver.

---

## 1. Hero rebuild — photographic + cinematic intro

**Background**
- Save the uploaded skyline-office image as `src/assets/hero-bg.jpg` and re-export at 2 sizes via a small build step: `hero-bg-desktop.webp` (1920×1080, focal point right, landscape composition kept) and `hero-bg-mobile.webp` (1080×1920, cropped to keep the laptop + skyline visible vertically). Different art-direction crops, same scene — exactly as requested.
- Use a `<picture>` element so the browser picks the right asset (no JS, no layout shift). `object-fit: cover; object-position: right center` desktop / `center` mobile.
- Layer a cinematic darken gradient on top: `linear-gradient(180deg, rgba(4,33,63,0.55) 0%, rgba(0,0,0,0.65) 60%, #0A0A0A 100%)` so text contrast is locked and the bottom blends into the next dark section.
- Delete the `BreathingMatrix` WebGL canvas from the hero (keep the file in repo — unused — in case you want it elsewhere later). This alone removes the biggest mobile perf hit.

**Headline entrance (the requested "left/right meet then word-rotate" sequence)**
- Split the headline into two halves. Left half ("Turn Your Existing Customers Into Your") slides in from `x: -60, opacity: 0` → `0`. Right half ("Most Profitable Growth Engine") slides in from `x: +60, opacity: 0` → `0`. Both ease `power3.out`, 0.9s, with a 0.2s overlap so they "meet" at center.
- Eyebrow fades up first (0.2s). Headline halves animate next. Subheadline fades up. **Only then** does `WordRotate` start cycling — gate it on a `started` state flipped after the entrance timeline completes.
- CTAs fade up last.
- Respect `prefers-reduced-motion`: skip slide, just fade.

**Typography & contrast**
- Headline: `clamp(34px, 7vw, 88px)`, white `#f1ece4` with subtle text-shadow `0 2px 24px rgba(0,0,0,0.4)` for readability over photo.
- Orange highlight word stays orange but slightly desaturated for cinematic feel.
- Subheadline contrast tightened to `rgba(241,236,228,0.92)`.

---

## 2. Atmosphere palette shift (silver / navy / graphite)

Add new design tokens to `src/index.css` — do **not** remove existing ones:
```
--navy-deep: #04213F;
--navy-steel: #11538C;
--sky-blue: #2C91E1;
--off-white: #EFEFF4;
--silver: #C5C9D1;
--graphite: #1A1D24;
```

Apply them as atmosphere only:
- Dark sections (`ProblemSection`, `DifferentiationSection`, `Process`, `FinalCTA`): swap pure `#0A0A0A` for a subtle navy-tinted black `linear-gradient(180deg, #0A0A0A 0%, #0C1622 50%, #0A0A0A 100%)`. Sky-blue/silver hairlines instead of red/blue dots for decorative accents.
- Cream sections stay cream — but replace the warm yellow/orange decorative glows with cool silver/sky radial gradients at very low opacity (8–12%).
- Replace the orange ● eyebrow dot on dark sections with sky-blue `#2C91E1`. Cream sections keep orange.
- Orange `#F97316` stays **exclusively for CTAs and one accent word per section** — it now reads as the "action color," not the atmosphere.

---

## 3. Motion overhaul — less, but intentional

**Remove**
- The `CustomCursor` component (mix-blend cursor on every link). It's noisy, hurts perf on lower-end machines, and looks AI-template. Restore native cursor.
- The decorative floating dots/lines in `Hero` (`top-[20%] left-[8%]` etc.) — visual noise.
- Per-word stagger fade on the headline (replaced by the new left/right entrance above).
- `ScrollTrigger` fade-up on every single paragraph. Audit: keep at most **one** entrance animation per section (typically the headline). Body copy and cards appear without motion or with a single shared fade.
- Sparkles in `FinalCTA` (skip on mobile entirely, keep extremely subtle on desktop only).

**Refine**
- Standardize all GSAP entrances to: `duration: 0.8, ease: 'power3.out', y: 24`. One tween per section. No staggered card-by-card reveals except where it tells a story (e.g., Process steps — kept).
- Set `ScrollTrigger.config({ ignoreMobileResize: true })` and use `markers: false`.
- Wrap every entrance in `gsap.matchMedia()` with `(prefers-reduced-motion: no-preference)` so reduced-motion users get instant content.

**Scroll system rebuild**
- Reconfigure `Lenis` with cinematic feel:
  ```ts
  new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,         // CRITICAL: native scrolling on mobile, no JS interception
    touchMultiplier: 1.5,
    wheelMultiplier: 0.9,
  })
  ```
- `syncTouch: false` is the single most important mobile fix. JS-driven scroll on touch is what causes the "cracking/jittery" feel.
- Add `will-change: transform` only on actively animating elements, remove after animation completes (prevents permanent compositor layers).
- Add a low-priority `requestIdleCallback` for analytics scroll-depth tracking instead of running it on every scroll event.

**Sticky CTA & cookie consent**
- Hide `StickyCTA` below 640px (mobile already has full-width hero CTA — sticky pill is redundant noise).
- Cookie consent: already collapsed to pill on mobile, verify it stays out of the way.

---

## 4. Mobile performance pass

- Global `html, body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }` to kill native bounce conflict with Lenis.
- Audit every section: remove `backdrop-filter: blur(...)` on mobile (use solid color fallback via media query). Backdrop blur is the #1 mobile-perf killer.
- Replace stacked box-shadows on cards with a single soft shadow.
- Drop `SectionDivider` SVG complexity on mobile — render simple 1px gradient line instead (still cinematic, far cheaper).
- Lazy-load all below-the-fold sections via `React.lazy` + `<Suspense>` boundary at `Results` onward. The hero + problem render instantly; the rest streams in.
- Image: serve the mobile hero crop at exactly device-pixel-ratio width (max 1080) — don't ship the desktop 1920 to phones.

---

## 5. Section-by-section visual cleanup (light touch only)

- `SocialProofTicker`: slow the marquee from current speed to 60s per loop, fade edges harder.
- `Services`: remove hover scale on cards, keep border-color hover only.
- `Results`: counter-up animations stay (they're earned), but trigger once with `ScrollTrigger.once: true`.
- `Pricing`: keep `LiquidButton` on featured tier, remove any pulsing/glow effects.
- `FinalCTA`: solid cinematic navy-black gradient, no sparkles on mobile, single-line headline entrance.
- `Footer`: already restructured — verify mobile collapses to single column cleanly.

---

## 6. What stays exactly the same

- All copy, all routes, all SEO metadata, all new pages built in the previous pass.
- Pricing structure, FAQ content, brand voice.
- Booking modal, Calendly integration, analytics hooks, cookie consent logic.
- `LiquidButton`, `ShimmerButton`, `WordRotate` components (kept, used more sparingly).
- Outfit/Inter typography, brand wordmark, favicon.

---

## Technical section

**Files created**
- `src/assets/hero-bg-desktop.webp`, `hero-bg-mobile.webp` (from uploaded image)
- `src/components/HeroBackground.tsx` (responsive `<picture>` + gradient overlay)

**Files edited**
- `src/sections/Hero.tsx` — remove `BreathingMatrix`, add `HeroBackground`, rewrite entrance timeline (left/right slide → meet → WordRotate starts), remove floating decorative dots
- `src/pages/Index.tsx` — remove `CustomCursor` component & its global cursor CSS injection, rewrite Lenis init with `syncTouch: false` + cinematic easing, replace scroll-depth listener with throttled / idle version, lazy-load below-the-fold sections
- `src/index.css` — add navy/silver tokens, `overscroll-behavior`, tap-highlight reset, mobile media query that disables `backdrop-filter`
- `src/sections/ProblemSection.tsx`, `SolutionSection.tsx`, `Services.tsx`, `Results.tsx`, `DifferentiationSection.tsx`, `Process.tsx`, `Pricing.tsx`, `FAQ.tsx`, `FinalCTA.tsx` — audit animations down to one entrance per section, swap pure-black dark backgrounds for subtle navy-tinted gradient, replace decorative red/blue dots with sky-blue/silver
- `src/components/SectionDivider.tsx` — simplified mobile variant
- `src/components/StickyCTA.tsx` — hide below 640px
- `src/components/SocialProofTicker.tsx` — slower marquee, harder edge fades
- `src/sections/Navigation.tsx` — keep, minor: remove hover scale on CTA pill (replaced by subtle bg darken only)

**Files deleted / unused**
- `src/components/BreathingMatrix.tsx` — kept in repo but unused (zero bundle impact thanks to tree-shaking once unimported)

**Dependencies**
- None added. Removing WebGL background means `three` / `@react-three/fiber` become dead weight — leave installed for now (no-op), or remove in a follow-up.

**Out of scope (kept stable)**
- No backend changes, no new pages, no copy rewrites, no font swaps, no logo changes.
- Not touching any of the recently built Footer columns, new routes, legal/marketing pages.

---

## Build order

1. Hero rebuild (image background + new entrance timeline) — single biggest visual + perf win
2. Lenis reconfigure + remove `CustomCursor` — fixes the "laggy scroll" complaint
3. Mobile perf pass (backdrop-filter audit, lazy load, divider simplification)
4. Atmosphere palette shift across dark sections
5. Animation reduction pass section-by-section
6. Final pass: screenshot at 384px and 1440px, verify no regressions

Expected outcome: ~60% less JS executing during scroll, native-feeling touch on mobile, a single cinematic hero photograph instead of a 32×32 WebGL particle grid, and motion that reads as *directed* rather than *applied to everything*.
