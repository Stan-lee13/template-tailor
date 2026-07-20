# Studio → Visual Website Management System

Goal: the owner manages every section, page, media asset, brand setting, and role from `/studio` without touching code. Public site, DB, auth, and existing pages stay intact — sections read from the DB and fall back to today's hardcoded content if a row is missing, so nothing breaks mid-migration.

Ship in 4 phases inside this plan. Each phase is independently deployable; if we stop after any phase the site still works.

---

## Phase 1 — Foundation (DB + settings + section registry)

### New tables (via migration tool, with GRANTs + RLS)

```text
site_settings            singleton row; brand, logo, favicon, colors, typography,
                         social links, SEO defaults, contact info, announcement bar
site_pages               id, path, title, meta_title, meta_description, og_image,
                         status(draft|published|archived), noindex, updated_at
site_sections            id, page_id (nullable = global e.g. nav/footer),
                         section_key (e.g. "hero","services"), type,
                         position, enabled, content jsonb, updated_at
section_templates        reusable saved sections (id, name, type, content jsonb,
                         thumbnail_url, owner_id)
media_assets             id, path, url, folder, filename, mime, width, height,
                         size_bytes, alt, uploaded_by, created_at
media_folders            id, parent_id, name
site_revisions           id, entity_type(page|section|settings), entity_id,
                         snapshot jsonb, author_id, created_at, label
activity_log             id, actor_id, action, entity_type, entity_id, meta, ts
nav_items                id, parent_id, label, href, position, location(header|footer_col1..4)
```

RLS: staff read/write, public reads only `enabled=true` sections of `published` pages and `site_settings`. Extend `app_role` enum with `owner`, `content_manager`, `viewer`. `has_role`/`is_staff` updated accordingly.

### Section registry (code)

`src/studio/sections/registry.ts` defines every section type once:

```text
{ key, label, component, schema (zod), defaults, previewThumb }
```

Existing components (Hero, ProblemSection, Services, Process, FAQ, FinalCTA, Footer, Navigation, etc.) are refactored to accept a `content` prop matching their schema, with the current hardcoded values kept as `defaults`. A `useSectionContent(key)` hook returns DB row → falls back to defaults. **No visual change to the live site in this phase.**

### Seed

One-time seed inserts a row per existing section using today's copy so the DB mirrors current state; page rows created for `/`, `/about`, `/contact`, `/blog`, `/thank-you`, all solution/legal pages.

---

## Phase 2 — Visual editor (`/studio/site`)

Layout: left sidebar (page tree + section list, drag to reorder), center canvas, right inspector.

- **Canvas**: `<iframe src="/?studio_preview=SESSION_TOKEN">`. Iframe app reads a short-lived token, subscribes to a `BroadcastChannel`, receives live content patches, and re-renders sections without reload. Viewport buttons: Desktop / Tablet / Mobile (resize iframe width).
- **Click-to-edit**: iframe wraps each section in a `data-section-id` div; clicking posts `{sectionId}` to parent → parent opens Inspector for that section.
- **Inspector**: auto-generated form from the section's zod schema (text, rich text via existing Tiptap, image via Media Library picker, color, number, boolean, list of cards/FAQs/testimonials with drag-reorder using `@dnd-kit/sortable`).
- **Section actions**: duplicate, delete, hide/show (`enabled`), move up/down, save as template.
- **Autosave**: 800 ms debounce → `site_sections.content` upsert → BroadcastChannel patch → iframe repaints. Every save also writes a `site_revisions` row.
- **Undo/redo**: in-memory command stack (Cmd+Z / Cmd+Shift+Z). Version history panel lists `site_revisions` with "Restore" button.
- **Global editors**: Nav bar, Footer, Announcement bar edited the same way (page_id = null).

---

## Phase 3 — Page builder, media library, templates

- **Pages screen** (`/studio/pages`): list all `site_pages`. Actions: new, duplicate, rename, change path, set SEO, publish/unpublish/archive, delete. New page opens Visual Editor with an empty canvas.
- **Add section**: "+" button between sections opens a picker showing all registry types + saved templates + user-created templates with thumbnails. Insert at position N.
- **Media library** (`/studio/media`, also embedded as picker):
  - Uses existing `post-media` bucket + new `site-media` bucket.
  - Grid + list view, folders, search, drag-to-upload, replace-in-place (keeps same URL), crop (react-image-crop), client-side compress (browser-image-compression), alt text, delete, bulk select. Video and doc upload supported.
- **Templates**: "Save as template" from any section; templates library at `/studio/templates`.

---

## Phase 4 — Publishing, RBAC, analytics, settings, ownership

- **Publishing workflow**: every page has Draft / Preview / Published states + `scheduled_publish_at`. Existing `publish_due_posts` cron extended to pages. Preview mode uses the same iframe token but forces draft content.
- **Change log**: `/studio/activity` — reads `activity_log` (writes added throughout Phases 2–3).
- **RBAC** (`/studio/team`): manage users + roles (Owner, Admin, Editor, Content Manager, Viewer). Permission matrix enforced in RLS + UI. Existing Approvals screen folded in.
- **Analytics** (`/studio/analytics`): Vercel Web Analytics + existing `posts.view_count` + form submissions table. Cards: visitors, page views, top pages, recent form submissions, recent edits.
- **Settings** (`/studio/settings`): tabs for Brand (logo, favicon, colors, typography), Company (name, address, email, phone), Social, SEO defaults + OG, Domains (read-only info + docs), Forms, Announcement bar, Email.
- **Ownership migration prep**:
  - Confirm zero email-based admin checks (already true — role lives in `user_roles`).
  - Add `/studio/team/owner-transfer`: promote another verified user to `owner`, then demote current owner in one guarded action.
  - Write `docs/OWNERSHIP_TRANSFER.md` covering Lovable Cloud account handover, Vercel project transfer, custom domain re-verification, and secret rotation checklist (no code side effects, purely operational).

---

## Technical details

- **Stack additions**: `@dnd-kit/core` + `@dnd-kit/sortable` (drag/drop), `react-image-crop`, `browser-image-compression`, `zod` (already), `zustand` (editor state + undo stack), `@tanstack/react-query` (already if present, else added) for DB caching.
- **Section rendering contract**: every section component becomes `Section({ content }: { content: SchemaType })`. Pages compose sections by mapping over `site_sections` rows for their `page_id`, ordered by `position`, filtered by `enabled`. Missing rows fall back to `defaults` so the current site keeps rendering during migration.
- **Iframe live preview**: parent → iframe via `postMessage` + `BroadcastChannel('studio-preview-<token>')`. Iframe overrides the `useSectionContent` hook to read from an in-memory store hydrated by messages. Token stored in `sessionStorage`, expires on tab close, never sent to public visitors.
- **Autosave conflict handling**: last-write-wins with `updated_at` optimistic check; on conflict, show a toast + reload from DB.
- **RLS**: all `site_*` tables — public SELECT gated on `enabled`/`status='published'`; write gated on `is_staff(auth.uid())`; owner-only actions gated on `has_role(auth.uid(),'owner')`.
- **Fallback safety**: feature-flag `VITE_STUDIO_CMS=on`. If off, sections use hardcoded defaults (today's behavior). Flag turns on after Phase 1 migration + seed verified.
- **Preserved**: `/studio/posts` blog CMS, AI Assistant, existing auth, Tiptap editor, all public pages, cron jobs, edge function.

---

## Deliverables checklist

```text
[ ] Phase 1 migration + seed + section-registry refactor (no visual change)
[ ] Phase 2 /studio/site iframe editor + inspector + autosave + undo/versions
[ ] Phase 3 /studio/pages, media library, templates, add-section picker
[ ] Phase 4 publishing states, RBAC, analytics, settings, owner transfer + docs
```

Estimated size: large. Recommend approving in sequence — I'll finish Phase 1 and also try to finish phase 2 at the same time end-to-end before starting Phase 3, so you can verify the live site is unchanged before we layer the editor on top. Goal try to finish phase 1 and phase 2 and the same time 