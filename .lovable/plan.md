
# RetentionFirm Production-Readiness Upgrade

This plan upgrades the existing site without redesigning it. Current visual system, typography, motion, section flow, and brand colors stay intact. We add the operational infrastructure of a real retention agency: routes, legal pages, insights/blog, Calendly, cookie consent, analytics, SEO, and graceful perf fallbacks.

---

## 1. Brand & Asset Audit (Lovable removal)

- Search the entire codebase for `lovable`, `gpt-engineer`, `placeholder`, default OG strings, default manifest entries.
- Confirm `index.html`, `public/`, `README.md`, `package.json` name, and any meta references are RetentionFirm-only.
- Re-export favicon set from the existing `BrandLogo` rules (Retention black + white dot, Firm white + black dot, trailing period) on a soft warm off-white background tinted slightly orange — generated via a small Node/canvas script:
  - `favicon.ico` (multi-size)
  - `favicon-32x32.png`, `favicon-64x64.png`, `favicon-192.png`, `favicon-512.png`
  - `apple-touch-icon.png` (180)
  - `android-chrome-192.png`, `android-chrome-512.png`
  - `og-image.jpg` (1200x630) — wordmark + tagline on warm off-white
  - `site.webmanifest` with name "RetentionFirm", short_name "RetentionFirm", theme/background colors matching brand.

## 2. Routing & Page Architecture

Add real routes in `src/App.tsx` (above the catch-all):

```text
/                       Index (existing)
/insights               Insights index (article cards grid)
/insights/:slug         Article detail
/privacy                Privacy Policy
/terms                  Terms of Service
/cookies                Cookie Policy
/thank-you              Post-booking confirmation
```

Reuse existing `Navigation` and `Footer`. Add a shared `LegalLayout` and `ArticleLayout` that match the cinematic typography rhythm (Outfit headings, Inter body, cream background, ample spacing).

## 3. Insights / Journal System

- `src/content/insights.ts` — typed array of 5 articles with: `slug`, `title`, `excerpt`, `category`, `tags`, `publishedAt` (varied real dates over the last 6 months), `readingTime`, `author` ("Editorial Team — RetentionFirm"), `body` (MDX-style structured sections as TS arrays of `{ type: 'h2'|'p'|'ul'|'quote', content }`).
- 5 articles authored as real strategic writing (not AI-template): the topics listed in the brief.
- `Insights.tsx` page: editorial grid — large featured card + 4 secondary cards, hover lift, subtle border, category chip, date + reading time, no stock illustrations.
- `Article.tsx` page: hero (category, title, author, date, reading time), structured body with proper rhythm, in-article pull quotes, end-of-article CTA card linking to Calendly.
- Navigation gets an "Insights" link; Footer gains an "Insights" column.

## 4. Legal Pages

Real, agency-appropriate v1 templates (not Lorem) for `Privacy`, `Terms`, `Cookies`, customized for RetentionFirm.com. Same `LegalLayout` (max-w prose, anchored section headings, "Last updated" date). Footer links wired to `/privacy`, `/terms`, `/cookies`.

## 5. Calendly + Lead Flow

- `src/components/BookingModal.tsx` — premium modal (Radix Dialog already in project) with smooth scale/fade. Embeds Calendly inline widget via `https://assets.calendly.com/assets/external/widget.js` (script lazy-loaded on first open). Uses a placeholder URL `https://calendly.com/retentionfirm/growth-audit` exposed as a constant in `src/config/site.ts` so the user can swap it.
- `useBooking()` hook with global open/close (Zustand-free, just a tiny event emitter or React context).
- All "Book a Growth Audit", "Get Started", final CTA, and pricing tier buttons call `openBooking()`.
- Calendly `event_scheduled` postMessage listener routes to `/thank-you` for analytics + polished confirmation state.

## 6. Cookie Consent

- `src/components/CookieConsent.tsx` — bottom-left glass card (backdrop-blur, soft border, cream tone, Outfit heading). Slide+fade entry after 800ms. Two buttons: "Accept all" / "Preferences". Preferences expands inline toggles for `analytics` and `marketing` (functional always on).
- Choice persisted in `localStorage` under `rf_consent_v1`.
- Consent state exposed via `useConsent()` hook; analytics initializes only when `analytics` granted.

## 7. Analytics & Event Tracking

- GA4 via `gtag` loader, gated by consent. Measurement ID lives in `src/config/site.ts` (`GA_ID`) — empty string disables.
- `track(event, props)` helper in `src/lib/analytics.ts`. Wired events:
  - `cta_click` (location, label)
  - `booking_open`, `booking_scheduled`
  - `scroll_depth` (25/50/75/100)
  - `insights_article_view`
  - `outbound_click`
- Lightweight scroll-depth observer in `Index.tsx`.

## 8. SEO

- `src/components/SEO.tsx` — small head manager (uses `react-helmet-async`, add dependency) for per-route title, description, canonical, OG, Twitter, JSON-LD.
- Home: existing `ProfessionalService` schema expanded with `Organization` + `WebSite` + `sameAs`.
- Article pages: `Article` schema with `headline`, `datePublished`, `author`, `image`.
- `public/sitemap.xml` generated statically listing `/`, `/insights`, each article, legal pages.
- `public/robots.txt` already good — add `Sitemap:` line.
- Use both "RetentionFirm" and "Retention Firm" naturally in copy + meta.

## 9. Social Proof Honesty Pass

`SocialProofTicker.tsx` and any section copy: replace unverifiable claims with the approved positioning lines (growth-stage ecommerce, lifecycle systems, LTV-serious brands, repeat-purchase businesses). No metrics invented.

## 10. Performance & Graceful Degradation

- Detect `prefers-reduced-motion`, low device memory (`navigator.deviceMemory <= 4`), and `matchMedia('(pointer: coarse)')`. Expose via `useDeviceCapabilities()`.
- `Hero` 3D / WebGL background: skip mounting on low-capability devices, render a static gradient + grain fallback that visually matches.
- Lenis smooth scroll: disable on reduced-motion.
- Lazy-load Calendly script, GA, and any below-the-fold heavy components.

## 11. Section Blending Polish

Soften `SectionDivider` cuts where currently same-color (e.g. cream→cream) by adding a subtle 80–120px gradient overlay band instead of a hard SVG. Keep colored transitions (cream↔black) as cinematic dividers but add a thin atmospheric glow at the seam. No structural changes to section components themselves.

## 12. CTA Persistence

After 40% scroll on `/`, show a slim sticky bottom-right pill "Book a free audit →" (dismissable, dismissal stored in `sessionStorage`). Matches brand orange, subtle entrance.

---

## Technical notes

- New deps: `react-helmet-async` (SEO). Calendly loaded via CDN (no npm dep). No other new runtime deps.
- New files (high level):
  - `src/config/site.ts`
  - `src/lib/analytics.ts`, `src/lib/consent.ts`, `src/hooks/useDeviceCapabilities.ts`, `src/hooks/useBooking.tsx`
  - `src/components/SEO.tsx`, `src/components/CookieConsent.tsx`, `src/components/BookingModal.tsx`, `src/components/StickyCTA.tsx`, `src/components/LegalLayout.tsx`, `src/components/ArticleLayout.tsx`
  - `src/content/insights.ts`, `src/content/legal/{privacy,terms,cookies}.ts`
  - `src/pages/Insights.tsx`, `src/pages/Article.tsx`, `src/pages/Privacy.tsx`, `src/pages/Terms.tsx`, `src/pages/Cookies.tsx`, `src/pages/ThankYou.tsx`
  - `public/sitemap.xml`, regenerated favicon set, `site.webmanifest`
- Edits: `index.html` (manifest link, preconnects for GA + Calendly), `src/App.tsx` (routes + HelmetProvider + BookingProvider + CookieConsent), `src/sections/Navigation.tsx` (Insights link), `src/sections/Footer.tsx` (real links + Insights column), all CTA buttons across sections to call `openBooking()`, `SocialProofTicker.tsx` copy.

## Out of scope (intentionally)

- No rebuild of Hero, Pricing, FAQ, or Process layouts.
- No new color palette, no font swap.
- No backend/Lovable Cloud (forms route to Calendly; no DB needed).
- No fabricated testimonials, logos, or metrics.

---

Approve to implement, or tell me which sections to drop/reorder (e.g. skip sticky CTA, skip GA, shorter article set).
