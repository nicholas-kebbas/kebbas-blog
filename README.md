# Nick Kebbas — kebbas.com

An experimental personal site built with static Astro. Oversized Syne typography, a responsive generative canvas sculpture, selected work, and simple social links. No account, analytics, database, paid API, or runtime server is required.

## Develop

```sh
npm ci
npm run dev
npm run build
npm run preview
```

Use Node 24 (matching the existing Vercel project). All site content lives in `src/pages/index.astro`. Global styles are in `src/styles/global.css`; the interactive artwork is isolated in `src/components/SignalSculpture.astro`.

## Accessibility and performance

- Static HTML content works without JavaScript; the artwork has an inline SVG fallback.
- Artwork stops offscreen and in background tabs, caps pixel ratio and frame rate, and supports a pause button and the operating system's reduced-motion setting.
- Keyboard navigation, visible focus, skip link, and touch-sized controls.
- Fonts are self-hosted. Syne is licensed under the included SIL Open Font License.

## Publishing

Production domain: **kebbas.com**, existing Vercel project `kebbas-blog` (`prj_kQtfNYsdZ7dOZdD9JBuMWblSiRjM`).

The original source was `gg-ai-ops/kebbas-blog`. The redesign is maintained in `nicholas-kebbas/kebbas-blog` because the currently connected GitHub account cannot push to the original repository. The Vercel project's existing Git connection is unchanged; pushing this fork alone does not establish automatic production deployment. Deploy a reviewed source commit to the existing project through the authorized Vercel connection. Do not create another hosting project or move the domain.

The former gaming article and RSS feed were retired. `/blog` redirects to the homepage; the removed article and RSS URLs return the site's 404 page. Git history retains the old content.
