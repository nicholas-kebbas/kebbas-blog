# Nick Kebbas — kebbas.com

An experimental personal site built with static Astro. Native scrolling moves through a chrome sculpture and four procedural light scenes while Nick’s name, contact link, and projects remain visible. No account, analytics, database, paid API, or runtime server is required.

## Develop

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Use Node 24 (matching the existing Vercel project). Site content lives in `src/pages/index.astro`. Global styles are in `src/styles/global.css`; the sculpture is in `src/components/ObservatoryCanvas.astro`, the procedural backgrounds in `src/components/AuroraBackdrop.astro`, navigation in `src/components/DimensionTransitions.astro`, and scroll / motion behavior in `src/scripts/observatory.ts`.

See [design notes](docs/observatory-design.md) for the interaction map and inspiration, and [artwork provenance](docs/art-direction-v2-assets.md) for original image prompts.

## Accessibility and performance

- Static HTML content works without JavaScript; the artwork has an inline SVG fallback.
- The opening sculpture stays still until dragged. Arrow keys rotate the focused sculpture; Home resets its pose. On touchscreens, horizontal dragging rotates it and vertical swiping scrolls the page. It stops exactly where released, with no automatic rotation or inertia.
- Native scrolling reveals Aurora, Tidal, Corona, and Afterglow. The scene markers are ordinary links. There is no wheel interception, scroll snapping, or autonomous background animation; rendering runs only on input, resize, or lifecycle recovery.
- The name shrinks as scrolling begins; contact and project links stay available. Reduced motion retains full-size typography and switches between still scenes instead of morphing them.
- Keyboard navigation, visible focus, and a skip link. No visible animation controls or configuration panel.
- A fixed viewport keeps the composition visible through the scrollable page. Compact layouts retain the project links and the work-together invitation.
- Native modified clicks and browser history remain intact. Transitions have a bounded recovery and support Escape.
- “Let’s work together” opens the visitor’s email app addressed to nickkebbas@gmail.com.
- No JavaScript means a single static scene and native links. No WebGL means the inline SVG sculpture and CSS light-field fallback remain available.
- Fonts are self-hosted. Syne is licensed under the included SIL Open Font License.

## Publishing

Production domain: **kebbas.com**, existing Vercel project `kebbas-blog` (`prj_kQtfNYsdZ7dOZdD9JBuMWblSiRjM`).

The original source was `gg-ai-ops/kebbas-blog`. The redesign is maintained in `nicholas-kebbas/kebbas-blog` because the currently connected GitHub account cannot push to the original repository. The Vercel project's existing Git connection is unchanged; pushing this fork alone does not establish automatic production deployment. Deploy a reviewed source commit to the existing project through the authorized Vercel connection. Do not create another hosting project or move the domain.

The former gaming article and RSS feed were retired. `/blog` redirects to the homepage; the removed article and RSS URLs return the site's 404 page. Git history retains the old content.
