
## What's changing

### 1. Process section ("How We Work") — break the grid symmetry

The current 3-column equal grid with centered text and numbered badges is the most common AI-generated layout. Changes:

- Switch from a 3-column card grid to a **vertical timeline layout** with a connecting line on the left and steps stacked vertically (left-aligned, staggered widths)
- Each step gets a **small accent bar** on the left instead of the centered numbered badge
- Step numbers become subtle, left-aligned, inline with the title instead of inside a badge
- Descriptions become more detailed — add a short bullet list of deliverables per step (e.g., "Growth Audit" includes "Revenue leak analysis", "Customer journey mapping", "30-day action plan")
- Vary the visual weight of each card — the middle step is wider, the third is slightly indented
- Remove the generic "connecting line" gradient

### 2. Pricing section — reduce the template feel

- Switch from the standard 3-column equal card layout to an **asymmetric layout**: the featured "Growth" plan takes up ~50% width on the left as a large card, the other two plans stack vertically on the right as smaller cards
- Remove the "Most Popular" floating pill badge — instead, use a subtle full-width accent border on the featured card
- Change pricing card hover animations from the generic lift-and-shadow to a subtle **border-color shift** only
- Remove the rounded-full pill buttons — use **squared-off (rounded-lg)** CTA buttons with a more editorial feel
- Add a short **"Not sure which plan?"** line with a link to the CTA section below the cards

### 3. Footer — remove dead links, simplify

- Remove the "Company" column entirely (About Us, Case Studies, Careers, Contact — none exist)
- Remove the "Resources" column (Blog, Retention Calculator, Guides, Newsletter — none exist)
- Keep only: logo + tagline, Services list (as anchor links to #services), social icons, and the bottom copyright/legal row
- This makes the footer honest and clean rather than faking pages that don't exist

### 4. Strategic micro-improvements (non-breaking)

- **Social proof ticker**: Add a subtle horizontal marquee below the hero with trust signals like "Trusted by 50+ DTC brands", "avg. 3.2x LTV increase", "$12M+ in retained revenue" — creates movement and credibility without being flashy
- **Scroll progress indicator**: A thin orange progress bar fixed at the very top of the viewport that fills as you scroll — adds a premium interactive feel
- **FAQ section**: Open the first question by default so the section doesn't look empty on first view

### Technical details

Files modified:
- `src/sections/Process.tsx` — full rewrite to vertical timeline layout
- `src/sections/Pricing.tsx` — restructure to asymmetric featured layout
- `src/sections/Footer.tsx` — strip dead link columns
- `src/sections/FAQ.tsx` — default first item open
- `src/pages/Index.tsx` — add scroll progress bar and social proof marquee component
- New: `src/components/SocialProofTicker.tsx` — marquee component
- New: `src/components/ScrollProgress.tsx` — thin top bar

No new dependencies required. All changes use existing GSAP + Tailwind stack.
