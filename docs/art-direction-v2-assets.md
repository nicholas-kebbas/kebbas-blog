# Observatory v2 artwork

Created October 26, 2026 for the experimental kebbas.com redesign.

## Provenance and tool record

- Mode: built-in `image_gen.imagegen` / `tools.image_gen__imagegen` (no external API, paid fallback, or downloaded reference art).
- Two new-image generation calls, one per asset; no reference images, no edits, no generated text.
- Both calls used `transparent_background: false`.
- The imagery is conceptual decoration, not a depiction of a shipped application or factual housing data.
- Original output files remain in the built-in generation directory; optimized project assets are saved in `public/images/`.
- Postprocessing: Sharp format conversion and WebP quality 86 / effort 6 only, with a maximum-width guard of 1600 and no enlargement. No cropping, compositing, recoloring, retouching, or image-content alteration.

## Assets

| Asset | Dimensions | Bytes | Intended use |
| --- | --- | ---: | --- |
| `/images/observatory-strata.webp` | 1586 × 992 | 221742 | Housing Alpha decorative project art: floating basalt architecture on ivory |
| `/images/observatory-specimen.webp` | 1586 × 992 | 224788 | About-section conceptual art: ceramic and chrome branching specimen on black |

Combined transfer size: 446530 bytes (approximately 436 KiB), before HTTP overhead.

### Inspection

Both generated PNGs and final WebPs were visually inspected. The final compositions retain fine mineral and metallic detail, clean silhouettes, ivory/black background contrast, and restrained lime highlights. Neither includes text, logos, interface elements, faces, or numbers. The basalt scene has abstract architecture and no real-world geographic claim. The specimen is asymmetrical and branching rather than a ring or torus. At normal card scale, compression artifacts are not visibly distracting.

These are decorative images beside real HTML project labels. Use `alt=""` when the surrounding text already supplies the card's name and purpose. If shown independently, suggested descriptions are:

- Strata: “Floating layers of dark basalt with miniature abstract architecture and luminous mineral seams.”
- Specimen: “An intricate branching sculpture of ivory ceramic, chrome, and fine silver filaments against black.”

## Full generation prompts

### Strata

```text
Use case: stylized-concept
Asset type: original wide 16:10 decorative conceptual artwork for an experimental personal observatory website, a project card for housing research; this is art, not a product screenshot.
Primary request: an impossible architectural island of black basalt, violently precise floating geological strata suspended above each other, with intricate tiny abstract architectural forms on its top surface and hairline luminous chartreuse filaments tracing through mineral seams.
Scene/backdrop: warm ivory seamless infinite space with very faint pearlescent fog, edges blending gently into warm ivory.
Style/medium: extraordinary museum-grade surreal 3D rendered sculpture, tangible photographic macro textures, restrained brutalist architectural imagination.
Composition/framing: landscape 16:10, entire island in frame, monumental central diagonal mass with carefully balanced negative space, three-quarter low aerial view, layers visibly separated and slightly offset; lots of genuine intricate detail at different scales.
Lighting/mood: very soft luminous gallery light, inky recesses, pearlescent reflected light, cinematic but calm and strange.
Materials/textures: porous charcoal basalt, fine carved stepped terraces, brushed pale metal details, glints of clear glass, delicate acid-chartreuse filaments; sharp material contrasts.
Constraints: no people, no faces, no real landmarks, no text, no logos, no numbers, no interface, no watermark. Avoid neon gradients, generic sci-fi city, torus or ring shapes, wireframe mesh, stock illustration, cartoon, glossy plastic.
```

Built-in original:
`<local-generated-images>/01a17b8d-4186-7171-9d8b-4b09728b2cb6/exec-0f20eb1b-33df-4daa-a69d-65df6ba7bf57.png`

Final project asset:
`public/images/observatory-strata.webp`

### Specimen

```text
Use case: stylized-concept
Asset type: original wide 16:10 decorative artwork for an experimental personal observatory website, source-code project card; art rather than a product interface.
Primary request: an impossible neural-mechanical botanical specimen suspended in a near-black void: branching ivory ceramic ribbons and mirror-polished chrome stems become a radically intricate silver nervous system. It feels half wild orchid, half experimental precision instrument, sculpturally original and strange.
Scene/backdrop: pure deep charcoal-black void, no horizon or ground plane.
Style/medium: extraordinary high-end surreal 3D photographic sculpture, macro fidelity and physically convincing materials, contemporary museum object.
Composition/framing: landscape 16:10, full hovering asymmetrical specimen centered, organic growth extends from lower left toward upper right, a few dramatic curled ribbon leaves divide into countless hair-fine etched silver filaments and tiny lamellar structures. Clear silhouette, dense intricate interior, dimensional negative space between branching structures.
Lighting/mood: dramatic museum spotlights, cool silver edge light, soft ivory ceramic highlight, tiny restrained acid-lime luminous nodes deep in the branches, black recesses.
Materials/textures: delicately etched silver, smooth matte ivory porcelain, chrome mirror surfaces, very fine brushed ridges and crisp microstructure.
Constraints: no faces, no people, no text, no logos, no numbers, no UI, no watermark. Not a ring or torus. Avoid neon gradients, colorful smoke, generic tech network graphics, wireframe mesh, stock illustration, cartoon, obvious flower photograph.
```

Built-in original:
`<local-generated-images>/01a17b8d-4186-7171-9d8b-4b09728b2cb6/exec-49092be7-3fc3-408a-b71f-5fbcf40879b8.png`

Final project asset:
`public/images/observatory-specimen.webp`

