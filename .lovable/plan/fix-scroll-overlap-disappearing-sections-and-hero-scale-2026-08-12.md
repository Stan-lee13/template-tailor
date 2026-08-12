# Fix scroll overlap, disappearing sections, and hero scale

## What's wrong

Three of the four issues come from one root cause I confirmed in the code: the **What We Do (Services)** section pins itself to the viewport (`pin: true`) while living inside the Ledger's flex-column card stack in `Index.tsx`. GSAP's pin inserts a spacer element, which a flex column with `gap` measures incorrectly — so every card after Services (Projects, FAQ, Final CTA, Footer) is laid out over the top of the pinned stage instead of after it.

The disappearing-section behaviour is the second half of the same problem: the cards below Services are lazy-loaded, and their scroll triggers are created against stale page measurements. Once you scroll past them, the entrance animation never runs again, so the card stays at `opacity: 0` until a reload.

## The fix

**1. Un-pin the Services stage**
Rebuild the desktop "What We Do" motion so it no longer traps or pins the page:
- Cards animate on the arc driven by the section's own scroll progress (`start: top bottom`, `end: bottom top`, scrub) instead of a pinned timeline, so the section keeps normal document height.
- Give the stage a fixed, generous height and clip the arc so off-centre cards fade fully out before they reach a neighbour's text — this fixes the text-over-text bleed on the horizontal cards.
- Non-active cards get lower opacity and a hard `pointer-events: none` so nothing overlaps readably.

**2. Make measurements reliable**
- Call `ScrollTrigger.refresh()` after the lazy-loaded sections mount and after the hero/section images finish loading.
- Add `invalidateOnRefresh: true` to the card triggers so positions recalc on resize and late content.

**3. Make cards never stick at invisible**
- In `StackCard`, switch the entrance to a self-correcting trigger (`toggleActions` with a set-on-refresh fallback) and clamp the recede transition so a card that's already been passed is restored to a visible state when scrolled back to. No card can end up stranded at `opacity: 0`.

**4. Hero type scale**
- Reduce the headline clamp from `clamp(36px, 8.5vw, 120px)` to roughly `clamp(30px, 6vw, 76px)`, tighten the subheadline and its top margins, and trim vertical spacing so the hero fits one screen on both mobile and desktop without feeling cramped.

**5. Polish pass (the "do better" part)**
- Consistent card padding rhythm and a slightly tighter gap between stacked cards.
- Subtle stagger on the Services copy column so the left text and the arc feel connected rather than separate.
- Verify the whole page top-to-bottom at desktop and mobile widths with screenshots after the changes.

## Technical notes

Files touched: `src/sections/Services.tsx` (remove pin, rework arc math and clipping), `src/components/layout/StackCard.tsx` (trigger hardening), `src/pages/Index.tsx` (refresh on lazy mount), `src/sections/Hero.tsx` (type scale/spacing). No backend, content, or Studio changes.
