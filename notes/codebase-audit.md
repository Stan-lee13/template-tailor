# Codebase Audit Findings

## Project Architecture
- **Framework**: Vite + React + TypeScript + Tailwind CSS.
- **State/Data**: Supabase for backend, TanStack Query for data fetching.
- **Animations**: GSAP (GreenSock) is the primary animation engine, already used in several sections.
- **Content Management**: A custom "Studio" editor allows editing section content stored as JSONB in Supabase.
- **CMS Contract**: Sections use a `useSectionContent` hook which pulls from a registry of schemas in `registry.ts`.

## Core Components
- **Index.tsx**: Orchestrates the homepage sections and handles global Lenis smooth scrolling.
- **registry.ts**: Defines the data structure for every section. **Crucial**: Redesigned components must still respect these field keys to avoid breaking the Studio editor.
- **Hero.tsx**: Uses GSAP for entry animations. Conceptually "keepers" per user request.
- **Services.tsx**: Implements a "circular orbit scroll" on desktop. User specifically called this out as "better" than Laya's.

## Database & Studio
- **site_sections table**: Stores `section_key`, `type`, and `content` (JSONB).
- **Studio Editor**: Located in `src/pages/studio/SiteEditor.tsx`. It uses a visual inspector to edit section fields.
- **Registry Defaults**: Fallback content is defined in the registry, ensuring the site works even without DB entries.

## Redesign Strategy
1. **Maintain Contracts**: Keep the existing `useSectionContent` calls and field keys.
2. **Visual Overhaul**: Replace the inline styles and standard Tailwind layouts with premium, high-density designs inspired by Laya.
3. **Advanced Motion**: Enhance the GSAP implementation in all sections except Hero and Services.
4. **Studio Fixes**: Identify and resolve issues in the studio sections (likely layout or preview bugs).
