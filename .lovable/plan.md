# RetentionFirm Branding Overhaul & Mobile Fix

## 1. Custom Logo Component

Create `src/components/BrandLogo.tsx` — a reusable SVG/text component used in Navigation and Footer:

- "Retention" in solid black (or cream on dark backgrounds)
- The dot on the "i" in "Retention" rendered in white (or black on light backgrounds)
- "Firm" in white (or black on light backgrounds)
- The dot on the "i" in "Firm" rendered in black (or cream on dark backgrounds)
- Trailing full stop "." in black (or cream on dark backgrounds)
- White "Firm" text gets `text-shadow: 0 0 1px rgba(0,0,0,0.08)` for subtle separation on light backgrounds

Replace the plain text "RetentionFirm" in `Navigation.tsx` and `Footer.tsx` with this component.

## 2. Background Color Update

Replace **all** instances of `#EBE8E0` with a little darker version of `#EBE8E0` across the codebase:

- `src/index.css` — `--stone-white` variable and scrollbar track
- `src/pages/Index.tsx` — all SectionDivider `fromColor`/`toColor` props
- `src/sections/Pricing.tsx`, `FAQ.tsx`, `SolutionSection.tsx`, `Services.tsx`, `Results.tsx` — section backgrounds
- `src/sections/Navigation.tsx` — scrolled background rgba
- All `rgba(235,232,224,...)` references updated to match the new tone (`rgb(241,236,228)`)

## 3. Favicon System

Generate SVG-based favicons programmatically using a build-time script:

- Design: Bold geometric "RF" monogram — black text on warm cream (#f1ece4) background
- Generate: `favicon.ico`, `favicon-32x32.png`, `favicon-64x64.png`, `apple-touch-icon.png` (180x180), and an OpenGraph image (1200x630)
- Place all in `public/`
- Wire into `index.html` with proper `<link>` tags

## 4. Remove Placeholder / Lovable Assets

- Delete `public/placeholder.svg`
- Delete existing `public/favicon.ico` (will be replaced)
- Remove `lovable-tagger` from `package.json` if not needed
- Audit and clean any remaining default references

## 5. SEO / Metadata Cleanup

Update `index.html`:

- Title: "RetentionFirm — Turn One-Time Buyers Into Lifelong Revenue"
- Description, OG, Twitter tags — all referencing RetentionFirm properly
- Wire new favicon files (`favicon.ico`, `apple-touch-icon`, `favicon-32x32`, etc.)
- Add OG image reference

## 6. Mobile Responsiveness Fix

The hero text is not visible on mobile (384px viewport). Investigate and fix:

- Hero headline GSAP animation may not be triggering — ensure words become visible
- Check all sections at 384px width for overflow, clipping, or misalignment
- Ensure the social proof ticker, pricing cards, process timeline, and footer all fit correctly within narrow viewports
- Test navigation mobile menu at small sizes

## Files Affected

- **New**: `src/components/BrandLogo.tsx`
- **New**: Favicon assets in `public/` (generated via script)
- **Edit**: `index.html`, `src/index.css`, `src/pages/Index.tsx`
- **Edit**: `Navigation.tsx`, `Footer.tsx`, `Hero.tsx`, `Pricing.tsx`, `FAQ.tsx`, `SolutionSection.tsx`, `Services.tsx`, `Results.tsx`, `ProblemSection.tsx`, `DifferentiationSection.tsx`, `FinalCTA.tsx`
- **Edit**: `SectionDivider.tsx` (default color prop)
- **Delete**: `public/placeholder.svg`

Make sure that the deodorant is so good that ehen i search for Retention on Google search its part of the top 5 sites to come .