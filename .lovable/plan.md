# Make the site feel alive: creative sections, alternating rhythm, 3D motion

The site currently reads as a stack of similar dark boxes: nearly every section is centered or image-left/text-right, every reveal is the same fade-up, and the section imagery is generic abstract art that doesn't say "retention" or "ecommerce revenue". This pass fixes rhythm, imagery, and motion character — without touching the CMS wiring or the horizontal/orbit Services scroll the owner already likes.

## 0. Fix the merged build first

The merge from Manus left the project not compiling. Six type errors must be cleared before any visual work:

- `StudioLayout.tsx` — nav item type is missing the optional `end` flag.
- `SiteEditor.tsx` — missing `Layout` and `X` icon imports.
- `VisualEditor.tsx` — missing `Sparkles` icon import.
- `ProblemSection.tsx` — a 3D wrapper component is being passed `style` but doesn't accept it; the wrapper needs to forward `style`.

## 1. Alternating layout rhythm

Rebuild the two-column sections so they zig-zag down the page instead of repeating one arrangement:

```text
Solution         [ IMAGE ]   [ text ]
Results          full-bleed editorial band (asymmetric bento, offset headline)
Differentiation  [ text  ]   [ IMAGE ]
Process          pinned vertical timeline, image rail on the left
Projects         horizontal scroll (kept as-is)
Services         orbit scroll (kept as-is)
```

Also break the "everything is a centered eyebrow + centered h2" habit: headlines get off-axis placement, oversized index numerals, and hairline rules that run into the section edge. Section padding varies (some tight, some very generous) so the page breathes unevenly on purpose.

## 2. New section imagery

Replace the four generic visuals (`solution`, `results`, `differentiation`, plus a new one for Process) with a cohesive art-directed set in the site's navy/cyan palette — real-feeling scenes rather than abstract gradients: a lifecycle dashboard on a studio desk, a repeat-purchase cohort wall, a warm ecommerce packing/fulfilment moment, and a strategy session frame. Same grain, same color grade, same lens feel across all four so they read as one shoot. Each stays overridable from Studio (the `image` field is untouched).

Images get treated, not just placed: masked corners, a thin duotone edge, subtle scroll-linked scale/parallax inside their frame.

## 3. 3D and signature motion

Add real depth instead of more fades:

- **Perspective card tilt** — pointer-reactive 3D tilt (rotateX/rotateY on a `perspective` wrapper) on Results cards, Differentiation panels, and Projects tiles. Springy, GPU-only transforms.
- **3D image reveal** — section images enter with a `rotateY` swing plus clip-path wipe rather than a fade.
- **Scroll-linked depth** — headline, image, and cards inside each section move at different scrub speeds so sections feel layered, not flat.
- **Character-level headline reveal** — headlines split into words/characters with a masked upward stagger (one shared helper, used sparingly on section h2s only).
- **Numeric count-up** on results/metric values as they enter.
- **Marquee/rule transitions between sections** — a moving hairline + label strip replaces the current static divider, so one section hands off to the next.
- **Magnetic buttons** on the primary CTAs.

Motion is deliberately *unequal*: some sections get one strong move, others get three, so the page doesn't feel metronomic.

## 4. Guardrails

- Hero, Services orbit scroll, and the Projects horizontal rail keep their current behavior.
- All motion respects `prefers-reduced-motion` and drops the tilt/scrub work on touch devices (mobile keeps a clean staggered reveal) so the mobile scroll pipeline stays native and smooth.
- No changes to Studio, the section registry schemas, or any database content — only presentation layers in `src/sections/*` plus new shared motion helpers.

## Technical notes

- New `src/lib/motion/` helpers: `useTilt3d`, `useSplitReveal`, `useParallaxLayer`, `useCountUp`, `useMagnetic` — all built on `useGSAP` with `gsap.matchMedia` for device/reduced-motion gating, scoped to each section ref so cleanup is automatic.
- Reveals switch from `opacity/y` fades to `clip-path` + `rotateY` on `will-change: transform` wrappers; no layout-affecting properties animate.
- Existing `useSectionContent` data flow, props, and field names stay identical — this is a presentation-only rewrite of the affected section components.
- New images generated into `src/assets/`, replacing `solution-visual.png`, `results-visual.png`, `differentiation-visual.png` and adding a process visual; served as WebP.
