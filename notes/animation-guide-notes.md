# Animation Guide Notes

Source: `Arablaq_Media__Complete_Animation_Recreation_Guide.pdf`

## Key findings from reviewed pages

1. The reference motion system is built around **GSAP** with **ScrollTrigger**, **Flip**, and **SplitText/SplitType**, plus **Lenis** for smooth scrolling.
2. The guide emphasizes a **page-load lock** pattern where scroll is temporarily disabled until the intro sequence finishes. This is useful as a benchmark for polish, but should be applied carefully so it does not hurt usability.
3. The intro uses a **three-digit counter preloader** with vertically animated number columns, creating a slot-machine style motion effect.
4. The hero reveal uses a **full-height overlay scaling from bottom to top** as a curtain transition, timed around 3 seconds.
5. The image grid reveal uses **GSAP Flip** to animate between initial stacked positions and final layout positions, with elements scaling in first and then transitioning spatially.
6. Overall direction: layered animation sequencing, strong choreography, premium pacing, and coordinated transforms rather than simple fades.

## Implementation implications for retentionfirm.com redesign

- Preserve the user's request to keep the **existing hero section** conceptually intact.
- Use the guide as a **quality bar for motion density and sequencing**, not as a literal copy.
- Prefer a motion stack based on **GSAP + ScrollTrigger + SplitType/Flip-style transitions** where appropriate.
- Apply advanced motion mainly to the sections after the hero, while preserving the existing stronger services section motion if it is already superior.
- Focus on premium reveal choreography, staggered cards, perspective transforms, and section-to-section flow.
