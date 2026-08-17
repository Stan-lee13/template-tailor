## Goal

Add a brand-new `/studio/visual` page — a modern three-pane visual editor — as an **additional** module. The existing Studio (`/studio/site`, Pages, Posts, Media, Navigation, Settings, Approvals, Activity, Templates) stays 100% intact and untouched in behavior.

## What already exists (reused, not duplicated)

- `site_pages`, `site_sections`, `section_templates`, `site_settings`, `nav_items`, `media_assets`, `site_revisions` tables + RLS
- `src/studio/sections/registry.ts` — schemas + defaults for hero, problem, solution, services, results, differentiation, process, faq, final_cta, rich_html
- `src/hooks/useSectionContent.ts` — read path used by the live site
- `src/components/studio/SectionInspector.tsx` — schema-driven form (text / textarea / richtext / image / color / list)
- `src/components/studio/MediaPickerDialog.tsx`
- `src/hooks/useAuth.tsx` — `RequireStaff`, `isAdmin`, `canEdit`
- `src/lib/activity.ts` — `logActivity`, `saveRevision`

The Visual Editor is a **new UI shell over these same modules and tables**. No new backend logic.

## New route & nav

- Add `/studio/visual` in `src/App.tsx` (guarded by `RequireStaff` + `StudioAIProvider`)
- Add "✨ Visual Editor" entry in `src/components/studio/StudioLayout.tsx` nav (top of list, above "Site editor"). Existing "Site editor" stays.

## Layout (`src/pages/studio/VisualEditor.tsx`)

```text
┌───────────┬──────────────────────────────┬───────────┐
│ Left      │  Center: live iframe preview │ Right:    │
│ tabs:     │  device frame (D/T/M)        │ Inspector │
│  Pages    │  overlay: click-to-select    │ (schema   │
│  Sections │  hover outlines              │  driven)  │
│  Compo-   │  floating toolbar per        │           │
│  nents    │  section: ↑ ↓ dup hide del   │ Undo/Redo │
│  Media    │  "+ Add section" between     │ Save/Pub  │
└───────────┴──────────────────────────────┴───────────┘
```

- Top bar: page selector, device toggle (Desktop/Tablet/Mobile), Undo/Redo, Autosave indicator, Save Draft, Publish.
- Left sidebar tabs (single component, tab state):
  - **Pages** — list `site_pages`, click to load; "+ New page" (reuses same insert as `PagesEditor`).
  - **Sections** — sections on the current page, drag-to-reorder (`@dnd-kit`, already installed).
  - **Components** — registry-backed palette (hero/about/services/cta/pricing/faq/testimonials/team/contact/gallery/newsletter/stats) + `section_templates`. Drag or click to insert.
  - **Media** — thumbnail grid from `media_assets` (reuses `MediaPickerDialog` internals) with upload.

## Center preview — click-to-edit bridge

- Iframe renders the actual site route for the selected page (`/`, `/about`, etc.) with a `?studio=1` query flag.
- A tiny shim in `src/hooks/useSectionContent.ts` (opt-in, additive): when `window.__STUDIO_MODE__` is true, wrap returned sections with `data-section-id` on their root DOM node via a new `<SectionFrame>` helper (small addition — does not alter existing render output visually).
- `postMessage` protocol between iframe and parent:
  - `section:select { id }` on click
  - `section:hover { id }` on hover
  - `content:patch { id, content }` from parent → iframe re-fetches via React Query invalidation
- Overlay in parent draws outlines/toolbar over the iframe using coordinates reported by the shim (`getBoundingClientRect`).

If the iframe bridge proves flaky for a section, fall back gracefully to the existing form-only inspector (never blocks editing).

## Right panel — Inspector

- Reuses `SectionInspector` verbatim for the selected section.
- Inline text edits from the iframe (contentEditable on `data-editable="field"` spans) patch the same `content` JSON, so the two edit paths converge on one source of truth.

## Section tools

Floating toolbar per selected section: Edit (focus inspector), Duplicate, Hide (toggle `enabled`), Delete, Move Up, Move Down, Save as Template — all call the same mutations the existing `SiteEditor` uses (extracted into `src/studio/lib/sectionMutations.ts` so both editors share them; existing `SiteEditor` continues to work).

## Save / history

- **Autosave**: debounced 800ms `update site_sections.content`, writes a `site_revisions` row + `activity_log` entry (reuse `saveRevision`, `logActivity`).
- **Undo/Redo**: in-memory stack of `{sectionId, prevContent, nextContent}` scoped to the session; capped at 50 entries. Optimistic UI via React Query `setQueryData`.
- **Save Draft** vs **Publish**: add a boolean `draft_content jsonb` column to `site_sections` (migration). Autosave writes to `draft_content`; Publish copies `draft_content → content`. Live site (`useSectionContent`) keeps reading `content` — zero risk to production render. When `draft_content` is null, behavior is identical to today.

## Permissions

- Route guarded by `RequireStaff`.
- `canEdit` roles (admin/owner/editor/content_manager) → full editing.
- Viewer role → read-only preview (toolbar hidden, inspector disabled).
- Only admin/owner sees "Publish"; editors see "Save Draft" + "Request publish" (writes activity log entry — no new approval table needed for v1).

## Technical section

Files added:
- `src/pages/studio/VisualEditor.tsx`
- `src/components/studio/visual/LeftPanel.tsx` (Pages/Sections/Components/Media tabs)
- `src/components/studio/visual/PreviewFrame.tsx` (iframe + overlay + postMessage host)
- `src/components/studio/visual/SectionToolbar.tsx`
- `src/components/studio/visual/HistoryStack.ts` (undo/redo hook)
- `src/studio/lib/sectionMutations.ts` (shared with existing SiteEditor via light refactor — no behavior change)
- `src/studio/preview/bridge.ts` (iframe-side shim; imported only when `?studio=1`)

Files touched (additive only):
- `src/App.tsx` — one new route
- `src/components/studio/StudioLayout.tsx` — one new nav entry
- `src/hooks/useSectionContent.ts` — optional `data-section-id` wrapping when studio mode is on
- Existing section components (`Hero.tsx`, `Services.tsx`, etc.) — wrap outer element with `<SectionFrame sectionKey=…>` that is a no-op transparent div outside studio mode

Migration:
```sql
ALTER TABLE public.site_sections ADD COLUMN draft_content jsonb;
```
(No new tables → no new GRANT/RLS work.)

Dependencies: none new. `@dnd-kit`, `@tanstack/react-query`, `@gsap/react` already installed.

## Out of scope (v1)

- Full free-form drag-anywhere canvas (Framer-style absolute positioning). We keep the section-stack model — matches existing schema and ships fast.
- Multi-user real-time cursors.
- A/B testing.

## Phased delivery (single PR, staged commits)

1. Migration + `sectionMutations.ts` extraction + `SectionFrame` no-op wrapper on existing sections.
2. `VisualEditor` shell, route, nav entry, left Pages/Sections tabs, right inspector (form-only). Fully usable already.
3. Iframe preview + postMessage bridge + click-to-select overlay + section toolbar.
4. Components palette + Media tab + inline contentEditable text.
5. Undo/redo + Draft vs Publish flow + viewer/editor permission gating.

Existing Studio remains the source of truth for anything not yet wired into Visual Editor — nothing is removed.
