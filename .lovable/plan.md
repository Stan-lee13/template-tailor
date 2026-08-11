# RetentionFirm — full homepage rebuild

The current site is a stack of dark boxes with disconnected animations. This rebuild replaces it with one coherent system: a warm navy-and-brass world, a signature layout no one else is using, and motion that carries meaning instead of decorating.

## The idea: "The Ledger"

Retention is about what a brand keeps. So the page is built as a **ledger that fills up as you scroll** — a persistent left-edge spine (thin brass rule, section index, and a running counter) that stays with you the entire page. Every section docks onto that spine. Nothing floats free, nothing feels random, and section transitions are literal: the spine draws forward and hands you to the next block.

## Layout system (not a template)

Not bento, not zigzag. A **dual-track offset stack**:

```text
 spine        content
  |
  01  ┌──────────────────────────┐
  |   │  vertical rounded card   │   <- 28px radius, warm surface
  |   └──────────────────────────┘
  |        ┌──────────────────────────┐
  02       │  next card, offset right │   <- shifted, different width
  |        └──────────────────────────┘
  |   ┌───────────────┐ ┌────────────┐
  03  │ tall card     │ │ short card │   <- unequal vertical rhythm
  |   └───────────────┘ └────────────┘
```

Rules that make it read as one design:
- Every block is a **vertically stacked rounded rectangle card** (28px radius desktop, 22px mobile), never a bare full-bleed band.
- Cards alternate width and horizontal offset (100% / 88% / 76%) so the page has a pulse instead of a grid.
- Cards **stack and overlap on scroll** — the outgoing card scales down slightly and dims while the incoming card slides over it with a soft brass edge-light. That is the section transition the site is missing today.
- Consistent inner padding scale so desktop and mobile are the *same* design at different densities — mobile is not a separate afterthought layout, it is the same card stack at single-column width with the spine collapsed to a slim progress rail.

## Palette and type

Locked from your picks:
- `#0B1A2A` deep navy (page), `#14293F` raised card surface, `#C9A227` brass accent, `#F0EDE6` warm off-white text/light cards.
- Critically: **not everything is dark**. Roughly one in three cards is a warm off-white card with navy text — that alternation is what stops the "too dark, nothing speaks" problem. Brass is used sparingly: rules, numerals, one CTA, metric values.
- Syne for headlines (tight tracking, large sizes), Plus Jakarta Sans for body.
- Warm grain overlay + soft inner glow on cards so surfaces feel like material, not flat divs.

## Section-by-section

| # | Section | Treatment |
|---|---------|-----------|
| 01 | Hero | Keep the current background image (the one thing that works). Add ledger spine intro, Syne headline with a masked line-by-line rise, brass underline draw, magnetic primary CTA. |
| 02 | Proof ticker | Slim brass-ruled strip, continuous logo/metric marquee that reacts to scroll velocity. |
| 03 | Problem | Light off-white card. Numbered "leak" list where each row's bar drains left-to-right as it enters. |
| 04 | Who we work with | Compact chip cluster card, staggered pop-in. |
| 05 | Solution | Navy card, image left inside a masked rounded frame with parallax; text right. |
| 06 | Results | The centerpiece: full-width light card, oversized brass count-up numerals, three tilt-reactive metric cards. |
| 07 | Differentiation | Text left / image right, mirrored from Solution. |
| 08 | Process | Sticky brass timeline drawn by scroll, steps docking onto the spine one by one. |
| 09 | Services | Keep the orbit scroll (it works) but re-skinned into the card system. |
| 10 | Projects | Horizontal rail rebuilt with a progress-bar carousel — drag/scrub, brass progress indicator, active slide scales up. |
| 11 | FAQ | Light card, brass hairline accordion, smooth height transition. |
| 12 | Final CTA | Dark card with a slow brass gradient sweep and a magnetic button. |

## Motion rules (this is what fixes "disconnected")

One vocabulary, applied everywhere:
1. **Enter**: mask-reveal upward, 0.9s, one shared easing curve. No fades, no scale pops, no per-section improvisation.
2. **Transition**: card stack-over with dim-and-recede on the outgoing card.
3. **Emphasis**: brass line draws (headline underlines, timeline, dividers) — the only "decorative" motion allowed.
4. **Pointer**: subtle tilt/magnetism on interactive cards and CTAs, desktop only.
5. Everything else gets deleted. The scattered floats, glows and pulses go.

Mobile keeps 1, 2 and 3 (transform/opacity only), drops 4, and honours reduced-motion.

## What I'm taking from your references

Logic, not code: the scroll-synced progress carousel from the Swiper example (for Projects), the masked line/character reveal from the text-animations pack (for headlines only), and the scroll-driven scene handoff from the WebGL sync demo — recreated with GSAP ScrollTrigger and CSS transforms rather than a WebGL canvas, so it stays fast on mobile.

## Imagery

You said only the hero image is good. I'll regenerate the four section visuals (Solution, Results, Differentiation, Process) as one art-directed set: real scenes in navy/brass grade, matching grain and lens, warm human moments rather than abstract gradients. All stay overridable from Studio.

## Technical notes

- New tokens in `index.css` / `tailwind.config.ts`: card surfaces, radii, brass accent, elevation shadows, grain. No hardcoded colors in components.
- New `src/components/layout/LedgerSpine.tsx` and `StackCard.tsx` — every section renders inside `StackCard`, which owns radius, offset, surface tone and the stack-over ScrollTrigger.
- Motion consolidated into `src/lib/motion/` with `gsap.matchMedia` gating; the ad-hoc per-section GSAP code is removed.
- Studio/CMS wiring, `useSectionContent`, field names and the section registry are untouched — presentation layer only.
- Fonts loaded via `index.html` (Syne, Plus Jakarta Sans), replacing Outfit/Inter.
