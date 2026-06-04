## Goal

Ship a production-ready, hidden CMS for RetentionFirm: team members log in, draft/publish posts with full SEO controls, and the published content powers both `/insights` (replacing static MDX) and a new `/blog` route.

## Access model

- Hidden route: `/studio` (no nav links, no sitemap entry, `noindex` meta).
- Anyone can register, but registration alone grants nothing — users land on a "pending approval" screen.
- Roles stored in a separate `user_roles` table (enum: `admin`, `editor`) with a `has_role()` security-definer function. **Roles never live on profiles.**
- First-ever signup is auto-promoted to `admin` via DB trigger (so the owner is always allowed without manual SQL).
- Admins see an "Approvals" panel inside `/studio` to grant `editor` role to new signups.
- All portal routes wrapped in a `RequireRole` guard that checks the active session + role.

## Backend (Lovable Cloud)

Enable Lovable Cloud, then create:

**Tables (public schema, with GRANTs + RLS):**
- `profiles` — id (=auth.users.id), display_name, avatar_url. Self-read/update.
- `user_roles` — id, user_id, role (enum). Read: own rows + admins. Write: admins only.
- `posts` — id, slug (unique), title, excerpt, content_json (Tiptap doc), content_html (rendered), featured_image_url, status (`draft|scheduled|published`), published_at, scheduled_for, author_id, view_count, created_at, updated_at, **SEO**: meta_title, meta_description, focus_keyword, og_image_url, canonical_url, schema_jsonld (jsonb).
- `post_revisions` — snapshots on every save (lightweight versioning).

**Policies:**
- `posts` SELECT: anon/authenticated can read where `status='published' AND published_at <= now()`. Editors/admins read all.
- `posts` INSERT/UPDATE/DELETE: editors+admins only. `author_id` must equal `auth.uid()` on insert.
- `post_revisions`: editors+admins only.

**Storage bucket:** `post-media` (public) for featured images + inline editor uploads. RLS: authenticated editors/admins write; public read.

**Edge functions:**
- `publish-scheduled` — cron-style function (invoked by a `pg_cron` job every minute) that flips `scheduled→published` when `scheduled_for <= now()`.
- `increment-view` — called from public post pages; rate-limited by IP+slug per session via a `post_views` table (or simple bump if user wants minimum complexity).

## Portal UI (`/studio/*`)

Layout: collapsible sidebar (Dashboard, Posts, New Post, Media, Approvals [admin], Sign out). Matches RetentionFirm aesthetic — cream `#f1ece4` canvas, Outfit headings, orange CTAs, generous whitespace, subtle motion. Fully mobile-responsive (sidebar becomes a sheet).

**Routes:**
- `/studio/login` — email+password (Lovable Cloud Auth, email confirm OFF for speed; HIBP on).
- `/studio/pending` — shown when signed in but no role.
- `/studio` — dashboard: total posts, published, drafts, scheduled, top 5 most-viewed (sorted by `view_count`), recent activity.
- `/studio/posts` — searchable/filterable table (status, author, date), bulk actions.
- `/studio/posts/new` and `/studio/posts/:id` — editor.
- `/studio/approvals` — admin-only, list pending users, "Grant editor" / "Revoke" actions.

**Editor (`PostEditor.tsx`):**
- **Tiptap** rich text: H1/H2/H3, bold/italic/underline, bullet+ordered lists, blockquote, code, internal links (autocomplete from existing slugs), external links, image embed (upload→storage→insert), horizontal rule, undo/redo. Slash command menu.
- Right rail tabs: **Content** | **SEO** | **Settings**.
  - SEO tab: meta title (60-char counter), meta description (160-char counter), focus keyword, OG image upload, canonical URL, schema JSON-LD editor (Monaco-lite textarea with validation, defaults to Article schema generated from post fields).
  - Settings tab: slug (auto-from-title, editable, uniqueness check), featured image, author, publish date / schedule picker.
- Sticky header: Save draft, Preview (opens `/blog/:slug?preview=token`), **Publish** button opens the SEO checklist modal.
- Autosave every 20s → writes `post_revisions` row.

**Pre-publish SEO checklist modal:**
Blocks publish until all pass (or admin force-overrides):
- ✅ Meta description present (50–160 chars)
- ✅ Focus keyword appears in title, slug, and first paragraph
- ✅ Exactly one H1; H2s present; no skipped levels
- ✅ Featured image set with non-empty alt
- ✅ Slug is kebab-case, ≤60 chars, no stopwords-only

Each row shows pass/fail with a "Fix" link that scrolls to the relevant field.

## Public rendering

- `/insights` and `/insights/:slug` — rewire existing pages to fetch from `posts` (published only). Keep current `ArticleLayout` look. Remove the hardcoded `src/content/insights.tsx` data source.
- `/blog` and `/blog/:slug` — new routes, same data, alternate layout/list style so both surfaces coexist as the user requested.
- Both call `increment-view` on mount (debounced, once per session via sessionStorage key).
- Per-post `<SEO>` component pulls meta_title/description/og_image/canonical/schema_jsonld from the record. Falls back to sensible defaults.
- Add posts to `sitemap.xml` via a generated route or build-time script (runtime: serve `/sitemap.xml` from an edge function that queries published posts).

## Security

- `noindex, nofollow` on all `/studio/*` routes.
- All mutations server-validated via RLS; client uses Zod schemas (title/slug/meta lengths, URL format, image MIME).
- Image uploads: type + size limits (≤5MB, jpg/png/webp).
- Rate-limit `increment-view` per IP via the function.

## Files

**New:**
- `src/pages/studio/Login.tsx`, `Pending.tsx`, `Dashboard.tsx`, `PostsList.tsx`, `PostEditor.tsx`, `Approvals.tsx`, `Layout.tsx`
- `src/pages/blog/BlogIndex.tsx`, `BlogPost.tsx`
- `src/components/studio/RequireRole.tsx`, `SeoChecklist.tsx`, `MediaUploader.tsx`, `SlugInput.tsx`, `SchemaJsonLdEditor.tsx`, `TiptapEditor.tsx` (+ extensions)
- `src/hooks/useAuth.tsx`, `useRole.tsx`, `usePostAutosave.tsx`
- `src/lib/seo-checklist.ts`, `src/lib/slug.ts`, `src/lib/schema-defaults.ts`
- `supabase/functions/publish-scheduled/index.ts`, `supabase/functions/increment-view/index.ts`, `supabase/functions/sitemap/index.ts`
- Migrations for tables, enum, trigger, cron, storage bucket, RLS, grants.

**Edited:**
- `src/App.tsx` — add `/studio/*`, `/blog`, `/blog/:slug` routes; wrap with `AuthProvider`.
- `src/pages/Insights.tsx`, `src/pages/Article.tsx` — switch data source to Supabase.
- `public/sitemap.xml` — delete (replaced by edge function) or leave static + add posts dynamically.
- `public/robots.txt` — disallow `/studio/`.

**Deleted:**
- `src/content/insights.tsx` (after migration).

## Dependencies to add

`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `@tiptap/extension-placeholder`, `@tanstack/react-table`, `date-fns` (already present), `zod` (already present).

## Out of scope

- Multi-language posts, comments, tag/category system (can be added later).
- Email notifications on approval (can be added if requested).
- Full WYSIWYG preview of OG card.
