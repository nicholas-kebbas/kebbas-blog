# Nick Kebbas — kebbas.com

An experimental personal site built with static Astro. A single-screen personal site with a vivid WebGL sculpture, animated link transitions, direct project links, and a work-together invitation. No account, analytics, database, paid API, or runtime server is required.

## Develop

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Use Node 24 (matching the existing Vercel project). All site content lives in `src/pages/index.astro`. Global styles are in `src/styles/global.css`; the WebGL sculpture is in `src/components/ObservatoryCanvas.astro`, navigation in `src/components/DimensionTransitions.astro`, and shared motion / cursor behavior in `src/scripts/observatory.ts`.

See [design notes](docs/observatory-design.md) for the interaction map and inspiration, and [artwork provenance](docs/art-direction-v2-assets.md) for original image prompts.

## Accessibility and performance

- Static HTML content works without JavaScript; the artwork has an inline SVG fallback.
- Artwork settles after a 4.5-second opening, stops in background tabs, and respects the operating system's reduced-motion setting. Escape stops the opening immediately. Rendering uses bounded high-density canvases, with a sharper still frame once motion ends.
- Keyboard navigation, visible focus, and a skip link. No visible animation controls or configuration panel.
- The homepage fits the viewport without scrolling. Compact layouts retain the project links and the work-together invitation.
- Native modified clicks and browser history remain intact. Transitions have a bounded recovery and support Escape.
- No JavaScript means static artwork and native links. No WebGL means the inline SVG sculpture remains visible.
- Fonts are self-hosted. Syne is licensed under the included SIL Open Font License.

## Publishing

Production domain: **kebbas.com**, existing Vercel project `kebbas-blog` (`prj_kQtfNYsdZ7dOZdD9JBuMWblSiRjM`).

The original source was `gg-ai-ops/kebbas-blog`. The redesign is maintained in `nicholas-kebbas/kebbas-blog` because the currently connected GitHub account cannot push to the original repository. The Vercel project's existing Git connection is unchanged; pushing this fork alone does not establish automatic production deployment. Deploy a reviewed source commit to the existing project through the authorized Vercel connection. Do not create another hosting project or move the domain.

The former gaming article and RSS feed were retired. `/blog` redirects to the homepage; the removed article and RSS URLs return the site's 404 page. Git history retains the old content.
