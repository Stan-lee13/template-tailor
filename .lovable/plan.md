# Studio production-readiness fixes

## Root causes

1. **Admin can't see pending approvals / grant editor access**
   The `profiles` table RLS only has `profiles self read` (`auth.uid() = id`). When the admin opens `/studio/approvals`, the query `select * from profiles` returns only their own row — every other signup is invisible. Granting roles via `user_roles insert` is technically allowed by RLS, but the UI can't show the users to grant to. That's why you had to do it from the backend.

2. **Open Graph image upload "not working"**
   The upload itself succeeds (storage policies are correct), but the SEO tab only shows a filename string with no preview and no remove button, so it looks broken. There's also no visible "saved" indicator until you hit Save draft — the OG path is held in local state only.

3. **Can't delete an image inside the post content editor**
   Tiptap inserts images as nodes, but on touch/mobile there's no way to select+delete. The toolbar has no "remove selected image" control, and there's no floating bubble menu on image click. Desktop users with a keyboard can press backspace; mobile users are stuck.

4. **Minor production polish gaps** noticed while auditing:
   - Approvals page revoke only handles `editor`, not `admin`.
   - SEO tab OG image has no preview/remove.
   - Featured image preview re-fetches signed URL on every state change unnecessarily (already cached, but harmless).
   - Pending page calls `navigate()` during render (React anti-pattern) — should be in effect.

## Fix plan

### 1. Database migration — let admins read all profiles
Add a SELECT policy on `public.profiles` allowing `has_role(auth.uid(), 'admin')`. Keep existing self-read policy untouched. No GRANT changes needed (already granted to authenticated).

```sql
CREATE POLICY "profiles admin read all" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
```

### 2. Approvals page (`src/pages/studio/Approvals.tsx`)
- Add empty-state copy when no users.
- Add admin revoke button alongside editor revoke.
- Show role-change loading state.
- Confirmation before granting admin (sensitive action).

### 3. Post editor OG image UX (`src/pages/studio/PostEditor.tsx`)
- Show a small image preview (signed URL) for `og_image_url`, matching featured-image pattern.
- Add a "Remove" button.
- Auto-save after upload so the user doesn't lose it on navigation.
- Same auto-save for featured image.

### 4. Tiptap image deletion (`src/components/studio/TiptapEditor.tsx`)
- Add a BubbleMenu that appears when an image node is selected, with a single "Delete image" button (works on mobile tap).
- Add a toolbar button "Delete selected image" that's enabled only when the selection is an image node.
- Document the keyboard shortcut for desktop users (alt text on the button).

### 5. Pending page tidy (`src/pages/studio/Pending.tsx`)
- Move `navigate()` calls into `useEffect` to avoid React render-phase navigation warnings.

### 6. No changes to:
- Auth flow, storage policies, post RLS, bucket config — all verified working.
- Vercel config, routing — unrelated to this request.

## Files changed
- `supabase/migrations/<new>.sql` — admin profile read policy
- `src/pages/studio/Approvals.tsx`
- `src/pages/studio/PostEditor.tsx`
- `src/components/studio/TiptapEditor.tsx`
- `src/pages/studio/Pending.tsx`

## Verification
- Sign in as admin → `/studio/approvals` lists every signed-up user, can grant editor/admin and revoke.
- Upload OG image → preview appears immediately, Remove works, persists after Save.
- Insert image into post content → tap/click it → bubble menu "Delete" removes it on both desktop and mobile.
- Non-admin staff still cannot reach `/studio/approvals` (RequireAdmin gate unchanged).
