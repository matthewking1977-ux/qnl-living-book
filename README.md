# QNL homepage — Concept F "The Living Book" (MVP)

Tender concept. Vite + React 19 + TypeScript, Tailwind CSS 4, GSAP ScrollTrigger + Lenis, CSS 3D only.

```bash
npm install
npm run dev
```

- `npm run assets` rebuilds `public/img` from `/assets` (WebP/AVIF, responsive sizes).
- `?debug=1` shows scroll progress `s`, the active phase and FPS.
- `?lang=ar` previews the mirrored right-to-left book (Arabic copy not yet supplied).
- Spread content: `src/data/spreads.ts`. Scroll choreography: `src/components/Book/choreography.ts`.

Status: phases 1–2 of 6 complete (static book, scroll timeline).
