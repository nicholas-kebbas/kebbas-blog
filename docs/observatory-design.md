# A personal observatory

## Direction

The second redesign turns Nick Kebbas’s personal site into an explorable collection of objects, materials, and ideas. The structure stays legible: introduction, work, about, a small interactive experiment, and contact. The unusual parts are original sculpture, richly textured conceptual art, editorial scale changes, and a full-screen transition between destinations.

The design uses charcoal, warm ivory, and a restrained acid-lime accent. Syne supplies the display typography; Atkinson supplies body text; system serif and monospace faces provide contrast. The composition deliberately alternates dense spectacle and clear reading space.

## First-party inspiration

Reviewed October 26, 2026. These are inspiration references, not asset sources or claims of affiliation.

- [Bruno Simon](https://bruno-simon.com/): a personal portfolio can be an interactive place to explore. His own site documents a navigable world and includes quality, reset, and input controls. The principle retained here is discoverable play with recovery controls; this site does not copy his driving world, artwork, or code.
- [Lusion](https://lusion.co/): its first-party portfolio describes the combination of 3D, motion, visual storytelling, and interactive development. The principle retained is a coherent material world whose interactions belong to that world; no project imagery or brand marks were reused.
- [Dennis Snellenberg](https://dennissnellenberg.com/): a personal identity sits alongside a clear work/about/contact hierarchy and an emphasis on design, code, and interaction. The principle retained is expressive presentation with obvious routes to the work and the person; no biography, client list, or visual assets were reused.

These source reads establish the references’ published descriptions and structure. They are not a claim that this review performed a current visual/browser audit of each inspiration site.

## Original assets and implementation

- `ObservatoryCanvas.astro` renders an original procedural metallic sculpture through a small WebGL raymarcher, with a static SVG companion.
- `observatory-strata.webp` is original conceptual housing-project artwork: floating basalt terrain and abstract architecture. The visible caption identifies it as a conceptual landscape rather than a product screenshot or geographic visualization.
- `observatory-specimen.webp` is original ceramic/chrome botanical artwork in the about section.
- Full image-generation prompts, provenance, dimensions, compression settings, and inspection notes are retained in [the asset record](./art-direction-v2-assets.md).
- All identity, interests, and public profile destinations are carried forward from the preceding committed site. The redesign does not add employment history, awards, client lists, credentials, contact details, investment performance, or unverified product statistics.
- The gaming-era blog remains removed.

## Interaction map

| Area | Interaction | Underlying action |
| --- | --- | --- |
| Hero specimen | Matter / Signal / Orbit buttons; entropy slider | Change the sculpture’s shape and surface with native form controls |
| Hero specimen | Fine-pointer movement | Gently change the viewing angle |
| Navigation, project links, footer | Plain click or keyboard activation | Brief circular portal, moving line tunnel, and typographic transition, then the actual destination |
| Same-page anchors | Transition ends at section | Scroll directly to the destination and focus its heading |
| Modified click, middle click, downloads, other targets | Native browser behavior | Keep new-tab and browser link affordances |
| Housing artwork | Fine-pointer movement | Small perspective tilt; no change to the actual project link |
| About artwork | Scrolling | Bounded vertical parallax |
| Field study | Coherence / Turbulence / Orbit; New seed | Deterministic canvas pattern changes |
| Field study | Fine-pointer movement | Local particle repulsion |
| Motion control | Pause / resume | Stop automatic sculpture/field/CSS motion and bypass portal animation |
| Transition recovery | Escape, motion pause, lifecycle reset, independent timeout | Complete the intended navigation or remove the overlay without trapping the page |

## Accessibility and fallback contract

- Core content is server-rendered HTML with a main landmark, labelled navigation, one h1, section headings, a skip link, and real anchor destinations.
- Canvas and transition graphics are decorative and hidden from assistive technology. Buttons use native semantics; pattern buttons expose selected state using `aria-pressed`. The entropy slider has an explicit accessible name.
- OS reduced-motion preference disables automatic motion and bypasses animated transit. The page’s motion control is disabled while the OS preference requires stillness. Manual changes to sculpture and field settings can still produce a still frame.
- WebGL unavailable or shader compilation failure: retain the SVG artwork and keep unavailable sculpture controls hidden.
- WebGL context loss: stop rendering and restore the SVG until successful recovery.
- JavaScript unavailable: core content, images, anchor links, and SVG fallback remain. JavaScript-only controls stay hidden.
- The system cursor and natural scrolling remain available. Pointer effects do not replace link semantics or depend on hover for access.
- Keyboard/browser testing must verify this contract; a static review alone cannot establish complete accessibility.

## Performance and privacy

- No 3D engine, video, runtime network API, analytics, local storage, or remote font service is introduced by these interactions.
- The WebGL target is bounded to at most 1400 by 1000 pixels, with a lower device-pixel ratio on narrow screens. Rendering is limited to approximately 30 frames per second and stops offscreen, in hidden documents, or while motion is paused.
- The field uses 320 particles and fixed neighboring connections rather than checking every particle pair. It draws at approximately 30 frames per second while visible and active, and uses a pixel-ratio cap of 1.5.
- Both WebP artworks total 446530 bytes, have explicit dimensions, and load lazily. The original generated PNGs are not included in the public asset payload.
- Resize and lifecycle recovery need browser verification on the actual deployment. A frame-rate target is not a measured device benchmark.

## Static review snapshot

At review time:

- The external Housing Alpha and GitHub destinations returned HTTP 200; the inherited Twitter URL returned HTTP 200 after redirecting to the corresponding X URL.
- In-page destination IDs resolve in the source.
- Identity, interests, and external profile paths match the preceding committed homepage.
- The new imagery has no product figures, text, logos, or geographic claims.
- Review fixes applied: both components use loaded/system fonts; CSS animations start paused until JavaScript enables motion. The motion control stays reachable throughout the page. Seed changes have a polite screen-reader status.

The checks below are release criteria, not completed-test claims. Keep actual results in the deployment review.

## Deployment QA checklist

- [ ] Production build and any navigation tests pass.
- [ ] Desktop and narrow-mobile views have no horizontal clipping of meaningful content or unreachable controls.
- [ ] Keyboard can reach every link, mode button, slider, seed button, and motion control, with visible focus.
- [ ] The skip link reaches main content; internal link navigation focuses the intended section heading.
- [ ] Native modified clicks, browser back/forward, repeated link clicks, and external navigation work.
- [ ] Portal recovers when Escape is pressed, the user pauses motion, or navigation is cancelled.
- [ ] Reduced motion produces still artwork and immediate navigation.
- [ ] JavaScript disabled and WebGL unavailable leave usable content and links.
- [ ] Hero controls and field controls work on both mouse/keyboard and touch.
- [ ] Automatic rendering pauses in hidden tabs and offscreen; return navigation resumes correctly.
- [ ] Images and fonts load from the deployed site; no new third-party runtime fetches occur.
- [ ] Canonical, sitemap, page title, description, and social image match the production identity.
- [ ] Removed blog routes stay removed and the 404 path remains usable.
- [ ] Verify the final kebbas.com deployment and preserve desktop/mobile screenshots.


## Release verification — October 26, 2026

- Static Astro build passes on Node 24.22.1; seven durable navigation tests pass on Node 24 and the local runtime. Dependency audit reports zero vulnerabilities.
- Production build viewed at 1440px, 390px, and 320px. DOM bounds show no horizontal overflow of headings, text, navigation, links, or controls at the mobile sizes.
- Browser verified: WebGL shader compilation; Matter/Signal/Orbit; keyboard entropy adjustment; global pause; field mode/seed changes while paused; section-heading focus; Escape completion; external GitHub navigation and browser Back; overlay removal after navigation.
- Code-side lifecycle simulation verified suspension for pause, hidden/offscreen state, reduced motion, and context loss. These are not a measured phone-GPU benchmark or an OS-level assistive-technology audit.
- Static source/build check verified one h1, every internal anchor, local asset existence, and continued removal of the former blog.
- Final production receipt and screenshots are retained in the task’s local release ledger after deployment.

## Copy simplification — October 26, 2026

Owner feedback: the copy sounded artificial. Removed the personal-observatory labels, slogans, biography paragraphs, and decorative narration. The homepage now leads with Nick’s name and “Let’s work together,” followed by the project, artwork, interactive controls, and a direct X contact link. The visuals and navigation effects remain. Metadata and the share image use the same plain language.

## Single-screen revision — October 26, 2026

Owner requested no scrolling and a direct Granularity Games link instead of Play. The homepage is now one viewport with the sculpture, Nick’s name, a direct X contact invitation, and links to Granularity Games, Housing Alpha, and GitHub. Removed the lower project/art/play/contact sections and their unused field/parallax script. Original image files remain in the repository but are not requested by the homepage. Granularity Games’ destination is preserved from the former article and verified over HTTPS.
