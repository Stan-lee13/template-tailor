
# RetentionFirm Website Build

Port the uploaded template into this project and apply all four refinement passes you described.

---

## 1. Port the Template

- Install required dependencies: `gsap`, `lenis`, `@react-three/fiber`, `@react-three/drei`, `three`, `lucide-react`
- Copy all sections (Navigation, Hero, TrustedBy, Services, Process, Results, CaseStudies, Pricing, FAQ, FinalCTA, Footer) and the BreathingMatrix component into the project
- Copy case study images to `/public/images/`
- Update `index.css` with the template's design system (stone-white, near-black, accent colors, font utilities, custom scrollbar, Lenis styles)
- Update `tailwind.config.ts` to match the template's extended config
- Wire everything together in `Index.tsx` with Lenis smooth scroll, GSAP ScrollTrigger, and the custom cursor
- Load Outfit + Inter fonts via `index.html`

## 2. Replace All Copy with Your Provided Content

Every section will use the exact website copy you provided:

- **Hero**: "Turn Your Existing Customers Into Your Most Profitable Growth Engine" headline, subheadline about repeat purchases/LTV, "Book a Growth Audit" + "See How It Works" CTAs
- **Problem Section** (new): "You're Not Losing Money on Ads... You're Losing It After the First Purchase" with the pain-point bullet list
- **Solution Section** (new): "We Build Your Retention Revenue Engine" with the system benefits
- **Services**: "Everything You Need to Turn Customers Into Revenue" with all 5 service categories (Retention Infrastructure, Lifecycle Marketing, Revenue Optimization, Personalization & Segmentation, Loyalty & Retention Strategy)
- **Results**: "What This Means For Your Brand" with outcome bullets
- **Differentiation Section** (new): "We're Not Another Email Marketing Agency" with the revenue-focused positioning
- **Process**: "How We Work" with 3 steps (Growth Audit, System Build, Optimization)
- **Pricing**: Three tiers -- Foundation ($3K-$4K), Growth ($5K-$7K), Scale ($8K-$10K+) with all included features
- **FinalCTA**: "You Already Paid for Your Customers... Now It's Time to Profit From Them"
- **Footer**: "RetentionFirm -- Turn One-Time Buyers Into Lifelong Revenue"

## 3. Enhanced Color System

Add blue, yellow, and green as micro-accent colors throughout -- never overpowering:

- **Blue (#1E40AF / #4169E1)**: Service card icon accents on hover, process step number highlights, subtle glow on the differentiation section
- **Yellow (#F59E0B / #D4A853)**: Pricing tier badges, stat counter underlines, "Most Popular" badge alternative, decorative star elements
- **Green (#10B981)**: Result/outcome checkmarks, success metric indicators, hover states on positive-sentiment elements, subtle gradient touches on the results section
- **Implementation**: Gradient borders that shift orange-to-blue, multi-color icon system on services, colored underlines on section eyebrows, subtle colored glows behind key stats

## 4. Custom Section Transitions

Replace flat horizontal cuts with fluid, editorial transitions:

- **Hero to Problem**: Angled SVG divider with a subtle curve, dark-to-light gradient bleed
- **Problem to Solution**: Overlapping card that bridges both sections, creating visual continuity
- **Solution to Services**: Soft wave SVG separator with layered opacity
- **Services to Results**: Diagonal clip-path transition with a blurred gradient overlay
- **Results to Differentiation**: Asymmetrical curved divider with a masked shape
- **Between dark/light sections**: Layered gradient fades instead of hard color switches
- **Decorative elements**: Rotated geometric shapes positioned at section boundaries, subtle parallax on divider elements

## 5. Reduce AI-Generated Feel

Introduce intentional imperfection and editorial variation:

- **Asymmetrical layouts**: Service cards with staggered sizing (alternating wider/narrower), process steps with offset vertical alignment
- **Staggered spacing**: Vary section padding (some sections tighter, some more generous), non-uniform card gaps
- **Layered backgrounds**: Subtle noise texture overlay on light sections, gradient mesh patterns on dark sections
- **Depth variation**: Some cards with deeper shadows and slight rotation (1-2deg), overlapping elements between sections
- **Typography variation**: Mix headline sizes within sections, occasional italic or lighter-weight accent text
- **Decorative elements**: Small rotated squares/circles as floating accents, thin diagonal lines as visual rhythm breakers
- **Non-uniform card sizing**: Pricing cards with the featured tier visually larger and offset, service cards with varying heights

## What Stays the Same

- Orange/black/white foundation palette
- Bold contrast and premium aesthetic
- Clean Outfit + Inter typography system
- Strong visual hierarchy
- GSAP scroll-triggered animations
- Three.js particle background on hero
- Lenis smooth scrolling
- Custom cursor on desktop
- Mobile-responsive design

---

## Technical Notes

- New dependencies: `gsap`, `lenis`, `three`, `@react-three/fiber`, `@react-three/drei`
- New sections to create: ProblemSection, SolutionSection, DifferentiationSection
- New component: SectionDivider (reusable SVG/CSS transition shapes)
- All sections will be created under `src/sections/`
- BreathingMatrix goes under `src/components/`
- Fonts loaded via Google Fonts CDN in `index.html`
