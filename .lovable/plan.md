# Plan: Studio polish, AI assistant, blog fix, deploy audit

## 1. Fix "published post not showing on site"

Root cause: two parallel blog surfaces exist.

- Nav + Footer link `/insights` → `Insights.tsx` (queries `posts` table) → article at `/insights/:slug` via `Article.tsx`.
- Studio "View live" button + `BlogIndex.tsx` link `/blog/:slug` via `BlogPost.tsx`.

Both pull from the same `posts` table, so the post exists — but the two URL trees confuse everyone.

**Fix:** Pick `/blog` as the canonical public surface (it's the industry-standard slug and matches the studio's own links).

- Update `Navigation.tsx` and `Footer.tsx` "Insights" links → `/blog`.
- Update `App.tsx`: `/insights` and `/insights/:slug` become permanent redirects (`<Navigate replace>`) to `/blog` and `/blog/:slug`. Keeps old URLs working for SEO.
- Delete `src/pages/Insights.tsx` and `src/pages/Article.tsx` (superseded by `BlogIndex` / `BlogPost`).
- Update `sitemap.xml` and any internal links to `/blog`.
- Update the article JSON-LD in `BlogPost.tsx` to use `/blog/:slug` URLs.

Live site note: after these changes, redeploy on Vercel — the current live 404/missing-post symptoms are partly because the last deploy is stale.

## 2. Admin AI assistant in `/studio`

New floating assistant available only inside the studio, powered by Lovable AI Gateway (Google Gemini 2.5 Flash — good balance of latency/quality for writing help).

- Edge function `supabase/functions/studio-assistant/index.ts` — streams chat via AI SDK + `@ai-sdk/openai-compatible` against `https://ai.gateway.lovable.dev/v1` with `LOVABLE_API_KEY`. Verifies the caller is staff via `is_staff(auth.uid())` before responding; rejects otherwise. Handles 429/402 with clean JSON errors.
- Client component `src/components/studio/AIAssistant.tsx` — floating button + slide-in panel, `useChat` transport, markdown rendering (`react-markdown`), full history sent every call. System prompt tuned for retention-marketing editorial help: outline drafts, sharpen headlines, meta description suggestions from a focus keyword, tone rewrites, SEO gap checks. Includes quick-action chips ("Draft outline", "Suggest meta title", "Rewrite for punch").
- context injection: when opened from the PostEditor, sends current title/excerpt/focus keyword as context so replies are post-aware.
- Mounted in `StudioLayout.tsx` so it's available on every studio page.

## 3. Studio production-ready polish

Small correctness/UX fixes surfaced by walking the studio code:

- **DB grants**: add a migration granting `SELECT` on `posts` to `anon`, and standard `authenticated`/`service_role` grants on `posts`, `post_revisions`, `profiles`, `user_roles`. RLS policies already exist; grants are missing per Supabase's non-default policy. This future-proofs anon reads.
- **Scheduled publishing**: currently only fires when someone loads `/blog` or `/insights`. Add a pg_cron job that calls `publish_due_posts()` every minute so posts publish on time even without traffic.
- **Approvals**: show current role next to each user; disable "Grant admin" for self; add a confirm dialog on "Revoke".
- **PostEditor**: add a "Duplicate post" action, warn on unsaved changes when navigating away, and show a small "Last saved &nbsp;s ago" indicator.
- **BlogIndex**: add reading-time estimate + tag filter placeholder removed; fix the "featured image" fallback for posts with none.

## 4. Dependency & config audit

- Run `bun outdated` and upgrade only patch/minor for: `ai`, `@ai-sdk/*`, `@tiptap/*`, `@supabase/supabase-js`, `react-router-dom`. Skip majors this pass.
- Verify `vercel.json` rewrite still targets the correct SPA fallback (`/(.*)` → `/index.html` with asset bypass). Report status; no change unless broken.
- Confirm `supabase/config.toml` exposes the new `studio-assistant` function (`verify_jwt = true`).
- README section documenting the studio (login → approvals → create post → AI assistant → publish).

## Technical details

Files created:

- `supabase/functions/studio-assistant/index.ts`
- `supabase/functions/_shared/ai-gateway.ts` (if not already present)
- `src/components/studio/AIAssistant.tsx`
- `supabase/migrations/<ts>_grants_and_cron.sql`

Files edited:

- `src/App.tsx` (redirects, remove Insights/Article routes)
- `src/sections/Navigation.tsx`, `src/sections/Footer.tsx` (Insights → Blog)
- `src/components/studio/StudioLayout.tsx` (mount assistant)
- `src/pages/studio/PostEditor.tsx` (unsaved-changes guard, duplicate, last-saved indicator, pass context to assistant)
- `src/pages/studio/Approvals.tsx` (role badge, self-guard, confirm)
- `src/pages/blog/BlogIndex.tsx`, `src/pages/blog/BlogPost.tsx` (JSON-LD, reading time)
- `public/sitemap.xml`, `README.md`

Files removed:

- `src/pages/Insights.tsx`, `src/pages/Article.tsx`

Migration outline:

```sql
GRANT SELECT ON public.posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT ALL ON public.posts TO service_role;
-- same pattern for post_revisions (no anon), profiles (no anon), user_roles (no anon)

SELECT cron.schedule('publish-due-posts', '* * * * *',
  $$ SELECT public.publish_due_posts(); $$);
```

## Open question

Do you want the AI assistant to also be able to **insert generated content directly into the current post's editor** (e.g. "insert this outline"), or keep it read-only chat where you copy/paste? Insert-to-editor is ~30 min extra work and worth it if you'll use it daily. Yes I want it to be able to insert generated content directly if given the permission and also help the user if they have any issues while making the content like in meta title and the rest so that everything can match and be ticked before posting or publishing live.