## Root cause found

The live domain is returning a **Vercel platform 404** before React loads:

- `https://retentionfirm.com/studio` redirects to `https://www.retentionfirm.com/studio`, then returns `404 NOT_FOUND` from Vercel.
- `https://retentionfirm.com/thank-you` does the same.
- The homepage returns `200`, so the deployment exists, but deep client-side routes are not being rewritten to `index.html` on the live Vercel deployment.
- Preview works because the preview host has SPA fallback, but the live Vercel deployment currently does not.

This is not a React route problem: `/studio` and `/thank-you` are already defined in `src/App.tsx`.

## Implementation plan

1. **Harden Vercel SPA routing**
   - Replace the current catch-all rewrite with Vercel’s safer `routes` fallback format.
   - Preserve static asset handling so JS/CSS/images still resolve normally.
   - Add explicit fallbacks for `/studio`, `/studio/*`, `/thank-you`, `/blog/*`, `/insights/*`, and all other app routes to `index.html`.

2. **Add static fallback entry files for critical routes**
   - Add Vercel-safe static fallback files for the two business-critical deep links:
     - `/studio`
     - `/thank-you`
   - These will load the SPA even if Vercel route fallback is misread or cached incorrectly.
   - This creates a belt-and-braces fix so those URLs never hit Vercel’s platform 404 again.

3. **Keep booking redirect client-side**
   - Keep the current `navigate('/thank-you', { replace: true })` flow because it avoids a hard server navigation after Calendly completes.
   - Add a defensive fallback only if the route navigation fails unexpectedly.

4. **Fix non-home navigation hard redirects**
   - Replace the remaining `window.location.href = '/' + hash` in `Navigation.tsx` with React Router navigation.
   - This avoids unnecessary hard reloads on Vercel from secondary pages.

5. **Vercel optimization cleanup**
   - Keep long-term immutable caching for Vite hashed assets.
   - Keep `X-Robots-Tag: noindex, nofollow` for `/studio` routes.
   - Avoid rewriting real static files, manifest, robots, sitemap, and assets.

6. **Verification**
   - Confirm local preview still renders:
     - `/thank-you`
     - `/studio`
     - `/studio/login`
   - Confirm live-domain diagnosis remains clear: current live deployment is serving an old/broken Vercel config until redeployed.
   - Provide a short report with:
     - root cause
     - files changed
     - exact routes protected
     - redeploy requirement for Vercel to pick up `vercel.json`

## Expected result

After the next Vercel deployment, direct visits, refreshes, and booking redirects to these routes should render the React app instead of Vercel’s `404: NOT_FOUND` page:

- `/thank-you`
- `/studio`
- `/studio/login`
- `/studio/posts`
- `/blog/:slug`
- `/insights/:slug`
- any other client-side route