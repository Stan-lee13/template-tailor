# RetentionFirm

Marketing site for RetentionFirm — a retention marketing agency for growth-stage ecommerce brands.

## Tech

- Vite + React + TypeScript
- Tailwind CSS
- GSAP + Lenis for motion
- React Router for routing
- React Helmet Async for per-route SEO

## Scripts

```bash
bun install
bun run dev
bun run build
```

## Configuration

Edit `src/config/site.ts` to update:
- Brand details (name, domain, email, social)
- `CALENDLY_URL` for the booking widget
- `GA_ID` for Google Analytics 4 (empty disables analytics)
