# Push Aug 1 Preview State to GitHub / Live

## Current state (verified)
- The project HEAD is already at commit `c90802e` — a Lovable-generated revert commit that restores the Aug 1 preview (`0d5af634`).
- Working tree is clean, so the codebase is already in the desired Aug 1 state.
- Git sync is connected, which normally pushes Lovable commits to GitHub automatically.
- **Blocker:** the build currently has 6 TypeScript errors that must be fixed before the site can be safely deployed/pushed.

## Goal
Fix the build errors, then make the Aug 1 preview state the active commit on GitHub and ensure the live/published site reflects it.

## Plan

### 1. Fix TypeScript build errors
- `src/components/studio/StudioLayout.tsx`: add an explicit `NavItem` type with optional `end` so mixed nav arrays type-check.
- `src/pages/studio/SiteEditor.tsx`: add missing `Layout` and `X` imports from `lucide-react`.
- `src/pages/studio/VisualEditor.tsx`: add missing `Sparkles` import from `lucide-react`.
- `src/components/ui/three-d-card.tsx`: add an optional `style` prop to `ThreeDCardItem` so `ProblemSection.tsx` can pass inline styles.

### 2. Verify the build passes
- Run the TypeScript check / build to confirm zero errors.

### 3. Confirm the restored state matches the Aug 1 preview
- Verify the homepage renders the dark cinematic palette and no console errors.

### 4. Push/sync to GitHub
- Since Git sync is already connected, the fixed commit will sync to GitHub automatically.
- If GitHub is behind, use Lovable's Git sync controls to force/push the current state rather than raw `git push`.

### 5. Validate the live site
- Open the published/preview URL in an incognito window to bypass browser cache.
- Confirm the visual matches the Aug 1 dark cinematic palette.

### 6. Clear deployment cache if stale
- If the live URL still shows the pre-revert version, purge Vercel edge/cache or redeploy from the latest commit.

### 7. Confirm with user
- Report the GitHub commit SHA and the live URL state after validation.

## Out of scope
- No new Studio features or redesign work in this plan.
