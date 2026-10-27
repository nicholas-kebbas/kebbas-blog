# Nick Kebbas — kebbas.com

An experimental personal site built with static Astro. A personal observatory: a live WebGL sculpture, original surreal artwork, full-screen chapter transitions, and an interactive particle field. No account, analytics, database, paid API, or runtime server is required.

## Develop

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Use Node 24 (matching the existing Vercel project). All site content lives in `src/pages/index.astro`. Global styles are in `src/styles/global.css`; the WebGL sculpture is in `src/components/ObservatoryCanvas.astro`, navigation in `src/components/DimensionTransitions.astro`, and shared motion / field controls in `src/scripts/observatory.ts`.

See [design notes](docs/observatory-design.md) for the interaction map and inspiration, and [artwork provenance](docs/art-direction-v2-assets.md) for original image prompts.

## Accessibility and performance

- Static HTML content works without JavaScript; the artwork has an inline SVG fallback.
- Artwork stops offscreen and in background tabs, caps pixel ratio and frame rate, and supports a pause button and the operating system's reduced-motion setting.
- Keyboard navigation, visible focus, skip link, touch-sized controls, and a persistent global motion toggle.
- Native modified clicks and browser history remain intact. Transitions have a bounded recovery and support Escape.
- No JavaScript means static artwork and native links. No WebGL means the inline SVG sculpture remains visible.
- Fonts are self-hosted. Syne is licensed under the included SIL Open Font License.

## Publishing

Production domain: **kebbas.com**, existing Vercel project `kebbas-blog` (`prj_kQtfNYsdZ7dOZdD9JBuMWblSiRjM`).

The original source was `gg-ai-ops/kebbas-blog`. The redesign is maintained in `nicholas-kebbas/kebbas-blog` because the currently connected GitHub account cannot push to the original repository. The Vercel project's existing Git connection is unchanged; pushing this fork alone does not establish automatic production deployment. Deploy a reviewed source commit to the existing project through the authorized Vercel connection. Do not create another hosting project or move the domain.

The former gaming article and RSS feed were retired. `/blog` redirects to the homepage; the removed article and RSS URLs return the site's 404 page. Git history retains the old content.
