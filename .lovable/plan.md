# Upgrade Plan: Mobile Fix + Premium Components + SEO Expansion

Three workstreams: (1) fix mobile sizing across the entire site, (2) integrate the requested premium animated components in tasteful, strategic locations, (3) expand the footer + create new pages for SEO. Aesthetic, color system, fonts, and structure stay locked.

---

## 1. Mobile Responsiveness Fix (Priority 1)

**Symptom:** Site doesn't fit the screen at 384px viewport — vertical overflow, oversized headlines, fixed inline pixel paddings.

**Root causes (audited):**

- Several sections use `padding: '... 80px'` or large `clamp()` minimums that overflow narrow phones.
- Hero and section headings use raw `px` font sizes without sufficient `clamp()` floor.
- `index.html` viewport meta is fine, but a few sections set `min-width` or wide `max-width` without `overflow-x: hidden` guard.
- Sticky CTA + Cookie consent + Custom cursor stacking on mobile.

**Fixes:**

- Add `html, body { overflow-x: hidden; max-width: 100vw; }` to `src/index.css`.
- Audit every section file (`Hero`, `ProblemSection`, `SolutionSection`, `Services`, `Results`, `Differentiation`, `Process`, `Pricing`, `FAQ`, `FinalCTA`, `Footer`, `SocialProofTicker`, `SectionDivider`) and:
  - Replace fixed `padding: '... 80px'` with `clamp(16px, 5vw, 80px)`.
  - Wrap raw `fontSize: 'XXpx'` headings in `clamp(28px, 7vw, XXpx)` patterns.
  - Convert fixed-width grids/cards to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
  - Ensure all `max-w-[1200px]` parents have `w-full px-4`.
- StickyCTA: hide below 480px or move to bottom-center compact pill.
- CookieConsent: ensure it stacks above StickyCTA on mobile, full-width with safe-area padding.
- Disable CustomCursor entirely on `pointer: coarse` (already done — verify).

---

## 2. Premium Component Integration

### A. Sparkles (`SparklesCore`)

**Install:** `framer-motion @tsparticles/slim @tsparticles/react @tsparticles/engine`
**File:** `src/components/ui/sparkles.tsx` (verbatim from spec)
**Where used:**

- **FinalCTA section** — subtle white sparkles over the dark `#0A0A0A` background behind the closing headline. Density ~80, speed 1, particleColor `#F97316` at low opacity, masked with radial gradient so edges fade.
- **Hero brand mark** — tiny sparkle layer (density 40) behind the "RetentionFirm." wordmark only on desktop, gated by `useDeviceCapabilities` (skip on low-power / reduced motion).

### B. LiquidButton (`liquid-glass-button.tsx`)

**Install:** `@radix-ui/react-slot class-variance-authority` (already present — verify).
**File:** `src/components/ui/liquid-glass-button.tsx` (verbatim, exports `Button`, `LiquidButton`, `MetalButton`).
**Where used:**

- **Hero secondary CTA** — replace the current "See how it works" ghost link with a `LiquidButton` (cream/glass aesthetic on the dark hero).
- **Pricing "Most Popular" tier CTA** — swap to `LiquidButton` to visually elevate the recommended plan.
- Keep the orange `#F97316` pill as the primary booking CTA everywhere else (do not replace — brand consistency).

### C. Magic UI components (the `npx shadcn add @magicui/...` list)

These are not installable via shadcn registry in this sandbox the same way; we'll install the underlying packages and add the components manually. Scope-limited to **two** integrations (avoid feature-creep that breaks the editorial feel):

- `**WordRotate**` — used in Hero subheadline to rotate through outcome words: "retention · LTV · repeat revenue · lifecycle". Single line, fades, respects reduced-motion.
- `**ShimmerButton**` — used as the StickyCTA pill (replaces the current static pill) for a subtle premium shimmer.

The remaining requested Magic UI components (`video-text`, `text-3d-flip`, `spinning-text`, `shine-border`, `text-animate`) are **intentionally skipped** — they would push the site into the "AI-template" aesthetic the user explicitly wants to avoid. Noted in plan, can be added later if requested.

---

## 3. Footer Expansion + New SEO Pages

### Footer columns (rewritten)

```
Resources          Solutions              Company         Legal
- Insights         - Ecommerce Brands     - About Us      - Privacy Policy
- Case Studies     - Retail               - Careers       - Terms of Service
- Integrations     - Publishers           - Contact       - Cookies
- Pricing          - Partners             - Compliance    - CCPA Opt-Out
                                                          - Your Privacy Choices
                                                          - Database Opt-Out
```

### New routes + pages (using existing `LegalLayout` + a new `MarketingLayout`)

Real, written content (not lorem) — ~400-700 words each, SEO-optimized with `<SEO>` component, JSON-LD where relevant:

**Marketing pages** (new `MarketingLayout.tsx`, cream bg, editorial):

- `/solutions/ecommerce-brands`
- `/solutions/retail`
- `/solutions/publishers`
- `/case-studies` (index — "Case studies coming soon" honest placeholder + 1 anonymized scenario)
- `/integrations` (Klaviyo, Postscript, Attentive, Shopify, Recharge — logo grid with descriptions)
- `/about`
- `/careers` (honest "We're not actively hiring — submit interest" form stub)
- `/contact` (booking modal trigger + email + form stub)
- `/partners`
- `/compliance` (GDPR, CCPA, SOC-2 posture statement)

**Legal pages** (new, using `LegalLayout`):

- `/legal/ccpa-opt-out`
- `/legal/privacy-choices`
- `/legal/database-opt-out`

All routes added to `App.tsx`, `sitemap.xml`, and footer.

---

## Technical Section

**Files created:**

- `src/components/ui/sparkles.tsx`
- `src/components/ui/liquid-glass-button.tsx`
- `src/components/ui/word-rotate.tsx` (manual port)
- `src/components/ui/shimmer-button.tsx` (manual port)
- `src/components/MarketingLayout.tsx`
- `src/pages/solutions/EcommerceBrands.tsx`, `Retail.tsx`, `Publishers.tsx`
- `src/pages/CaseStudies.tsx`, `Integrations.tsx`, `About.tsx`, `Careers.tsx`, `Contact.tsx`, `Partners.tsx`, `Compliance.tsx`
- `src/pages/legal/CcpaOptOut.tsx`, `PrivacyChoices.tsx`, `DatabaseOptOut.tsx`

**Files edited:**

- `src/index.css` — global overflow-x guard, mobile clamp utilities
- `src/App.tsx` — register new routes
- `src/sections/Hero.tsx` — WordRotate, optional sparkles, LiquidButton secondary CTA
- `src/sections/Pricing.tsx` — LiquidButton on featured tier
- `src/sections/FinalCTA.tsx` — sparkle layer
- `src/sections/Footer.tsx` — 4-column expansion with all links
- `src/components/StickyCTA.tsx` — ShimmerButton, mobile-safe positioning
- All section files — mobile padding/font clamp audit
- `public/sitemap.xml` — new URLs
- `public/robots.txt` — sitemap reference (verify)

**Dependencies to install:**

- `framer-motion` (likely already present)
- `@tsparticles/slim @tsparticles/react @tsparticles/engine`
- Confirm `@radix-ui/react-slot` and `class-variance-authority` (used by shadcn — present)

**Out of scope (kept stable):**

- No new colors, no new fonts, no layout overhaul.
- No backend / form handling — Contact/Careers form stubs link to email or open booking modal.
- Skipping `video-text`, `text-3d-flip`, `spinning-text`, `shine-border`, `text-animate` Magic UI components to preserve the editorial aesthetic. Easy to add later.

---

## Build order

1. Mobile responsiveness pass (highest user-visible impact)
2. Footer expansion + new SEO pages (content + routes)
3. Sparkles + LiquidButton + WordRotate + ShimmerButton integrations
4. Sitemap update + verification build