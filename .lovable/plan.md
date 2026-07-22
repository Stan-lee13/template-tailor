# Plan — Studio Hardening, Section Imagery, and Services/Projects Cinematic Rework

Three tracks. Ships as one release but scoped so each track is independently testable.

---

## Track A — Studio completeness & bug pass

Goal: everything in `/studio` is production-ready. No broken buttons, no missing sections, roles/settings actually apply.

### A1. Section registry expansion (missing editors)
Extend `src/studio/sections/registry.ts` so every homepage block is DB-driven and editable:
- `solution` — eyebrow, headline, body, bullet list, image
- `services` — eyebrow, headline, intro, list of {number, title, items[], accent color, optional icon image}
- `results` — eyebrow, headline, list of {metric, label, description, optional image}
- `differentiation` — eyebrow, headline, body, comparison list, image
- `process` — eyebrow, headline, list of {step, title, description, optional image}
- `faq` — eyebrow, headline, list of {question, answer (richtext)}
- `navigation` (global) — inline logo text/dot colors, CTA label
- `announcement` (global) — enabled, message, link, background/text colors

Refactor the matching section components (`Services.tsx`, `Results.tsx`, `Process.tsx`, `FAQ.tsx`, `DifferentiationSection.tsx`, `SolutionSection.tsx`) to read via `useSectionContent` with the current hardcoded values kept as `defaults` so nothing breaks.

### A2. Page builder fixes
- "Add section" modal: seed a real `site_sections` row with `withDefaults(type)`, correct next `position`, invalidate the sections query, refresh preview.
- Reorder DnD: persist `position` for all affected rows in one batched update (`upsert`), not just the moved item.
- Delete/duplicate: verify cascade, activity log, revision write.
- Live preview iframe: append `?studio=1&t=<key>` cache-buster on `previewKey`; add device-frame dimensions (desktop 100%, tablet 834, mobile 390).

### A3. Media library + picker
- Fix upload path (`user_id/filename`) and RLS-compatible signed URL generation via a `useSignedUrl` helper.
- Fix delete: also remove storage object, not just row.
- Rich-text inserted images: use the existing delete-node command; add a hover toolbar so users can remove any inserted image.
- OG image upload in PostEditor SEO tab: use the same `MediaPickerDialog` + preview + clear button; save `og_image_url` explicitly on change.

### A4. Version history / revisions
- Restore action: writes the snapshot back to `site_sections.content`, logs activity, invalidates queries, refreshes preview.
- Show diff badge (fields changed) in the history drawer.

### A5. Roles, approvals, settings
- `Approvals.tsx` (owner/admin only): list pending profiles, assign role from `{owner, admin, editor, content_manager, viewer}`, revoke, transfer ownership (guarded confirm).
- `SiteSettings.tsx`: verify each field actually applies — theme colors written to CSS vars on `<html>`, announcement bar visibility, SEO defaults consumed by `SEO.tsx`. Add a "Preview changes" toast confirming save.
- Fix the current RLS gap so admins can list all profiles (migration if needed).

### A6. AI assistant end-to-end
- Verify streaming works via the existing `studio-assistant` edge function.
- Wire the three actions: `insert_html` (into Tiptap at cursor), `set_meta` (title/description/keywords), `suggest_slug`.
- Add a compact chat panel to `SiteEditor` too (not just `PostEditor`) so admins can ask "rewrite this hero headline in 6 words".

---

## Track B — Cinematic imagery (4 sections)

Generate 4 premium, brand-matched images (navy `#04213F`, steel blue `#11538C`, cream `#EFEFF4`, cinematic lighting, no stock-photo cliché). Save under `src/assets/sections/`. Each image is also uploaded to `site-media` so admins can swap via the section inspector's `image` field.

1. **Solution** — abstract data-flow visual: warm dashboard glow reflecting on dark glass, subtle grid lines.
2. **Results** — moody boardroom / analytics wall at dusk, navy tones with warm accent light.
3. **Process** — four-step tactile visual set (single composite): navy pipeline / gears / journey lines.
4. **Differentiation + About hero** (shared visual language): editorial portrait-style workspace shot, cream + navy.

Each image gets: `loading="lazy"`, responsive `srcset`, `object-fit: cover`, gradient overlay for text legibility, and a Studio-editable slot via the expanded registry (A1).

---

## Track C — Services & Projects architecture review + cinematic rebuild

### C1. Architecture audit (findings)

**Current state**
- `Services.tsx`: hardcoded `services` array, single GSAP `ScrollTrigger` fade + sticky left column. Renders as vertical card stack — no depth, no signature motion.
- No dedicated Projects/Case Studies section on the homepage. `/case-studies` page exists but isn't a homepage rail.
- Data is component-local; no TanStack Query cache, no DB source.
- GSAP is registered per-file, animations initialized in `useEffect` with `gsap.context()` (good), but no `useGSAP` hook, no shared timeline registry, no reduced-motion branching in these two sections.

**Pros / Cons of adding TanStack + `@gsap/react`**

| Concern | Keep as-is | Move to TanStack Query + `@gsap/react` |
|---|---|---|
| Data source | Hardcoded arrays; edits require redeploy | DB-backed via `site_sections`; editable in Studio; cached & deduped |
| Re-renders | Fine (static) | Query cache prevents refetches; `select()` for shape |
| Animation cleanup | Manual `ctx.revert()` | `useGSAP({ scope })` auto-cleans on unmount / dep change |
| Reduced motion | Ad-hoc | Centralized `gsap.matchMedia()` per section |
| SSR risk | None (SPA) | None |
| Bundle | Baseline | +~6 KB (`@gsap/react`), TanStack already installed |

**Recommendation:** yes to both. Data via TanStack Query hitting the expanded `services` / `projects` section rows (Track A1). Animations via `@gsap/react`'s `useGSAP` for lifecycle safety + `gsap.matchMedia` for reduced-motion + breakpoint branching.

### C2. Services — circular / horizontal cinematic scroll

Not a plain card slider. Cards orbit a virtual center: as the user scrolls, the active card enters along a circular arc from the right while the previous card exits along an arc to the left, creating an in/out rotation that reads as a carousel arranged around a hidden ring.

Implementation:
- Pin the section with `ScrollTrigger` (`pin: true`, `scrub: 1`, length ≈ `cards.length * 100vh`).
- Compute each card's transform per progress `p`:
  - `angle = (i - activeIndex(p)) * 22deg`
  - `x = sin(angle) * radius`, `y = (1 - cos(angle)) * radius * 0.35`, `rotate = angle`, `opacity = cos(angle)`
  - Radius ~ `min(vw*0.6, 640px)` desktop, disabled on mobile (fallback = stacked cards with staggered fade).
- Use `gsap.quickSetter` inside a single `onUpdate` for GPU-friendly writes (`transform`, `opacity` only).
- Background subtle rotating radial gradient tied to same progress.
- Keyboard/aria: arrow keys jump to prev/next card by animating scroll to that trigger step; each card is a `<article>` with `aria-current`.
- Reduced motion: `matchMedia('(prefers-reduced-motion: reduce)')` branch renders static grid.

### C3. Projects — staggered reveal rail

New homepage `ProjectsRail` section between Results and Differentiation:
- Fetches up to 6 projects from a new `projects` table (or reuses `posts` with `type = 'case_study'` — decide during A1 by checking existing schema; if no dedicated table, add `type` filter to `posts` and expose in Studio).
- Grid: asymmetric 12-col (2 tall, 4 wide, 3 medium… bento-style).
- Reveal timeline: `ScrollTrigger.batch` with `stagger: { each: 0.08, from: 'random' }`, `y: 40 → 0`, `opacity: 0 → 1`, `clip-path` iris reveal on hero image, `ease: 'power3.out'`.
- Hover: image scale 1.04, title underline sweep, meta fade in — all GSAP quickTo for 60fps.
- Reduced motion: opacity-only fade.

### C4. Phased implementation order

1. **Phase 1 (foundation)** — Track A1 registry expansion + refactors (Services, Solution, Results, Process, FAQ, Differentiation → DB-driven). Ship behind existing fallbacks so nothing breaks.
2. **Phase 2 (Studio bugs)** — A2–A6 in one pass; verify by clicking through Studio end to end.
3. **Phase 3 (imagery)** — Generate 4 images, upload to `site-media`, seed default `image` field values on the expanded sections.
4. **Phase 4 (cinematic Services)** — Install `@gsap/react`, rewrite `Services.tsx` with the circular scroll timeline + mobile fallback + a11y.
5. **Phase 5 (Projects rail)** — Add `ProjectsRail.tsx`, wire to `posts` (case-study type) via TanStack Query, batch-stagger reveal, mount on `Index.tsx` between Results and Differentiation.
6. **Phase 6 (verification)** — Playwright: load `/`, screenshot desktop + mobile, scroll through Services (verify no scroll trap), open `/studio`, exercise the Add Section → edit → save → restore → delete loop, confirm live site updates.

### Technical notes
- Add `@gsap/react` (peer of installed `gsap`) — small, no other deps.
- Keep TanStack Query patterns already in the codebase; no state-management library added.
- All new animations run inside `useGSAP({ scope: ref, dependencies: [data] })` for automatic cleanup on data changes.
- No changes to the Lenis config from the mobile-scroll fix; the pinned Services section uses `ScrollTrigger.normalizeScroll(true)` only on desktop.

---

## Out of scope (explicit)
- No Framer/Webflow-style true inline click-to-edit overlay this pass — the form inspector plus live iframe is the shipping UX.
- No new payment/pricing work.
- No auth provider changes.
