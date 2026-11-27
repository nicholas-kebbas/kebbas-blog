# Alexandria background — November 27, 2026

One of the fifteen scroll zones uses an original generated illustration inspired by Alexandria in **Final Fantasy IX**. It is fan-inspired artwork, not an official game screenshot or a claim of endorsement. Final Fantasy IX and its setting belong to their respective owners.

## Source and delivery

- Generated with the built-in `image_gen` tool, without reference images or external API credentials.
- Original PNG: 1672 × 941 pixels, retained in the local generated-images directory (`01a0a238-d0f0-7781-ab88-6fd9056c798b/exec-19433fe5-8583-443e-9158-6bd12d268c72.png`).
- Desktop asset: `public/images/alexandria-ffix.webp`, 1672 × 941.
- Smaller asset: `public/images/alexandria-ffix-mobile.webp`, 960 pixels wide.
- Delivery conversion: existing Sharp dependency, WebP quality 86, effort 6; downscaling only for the smaller variant. No cropping, recoloring, or content editing.
- Used as decorative artwork with an empty alt attribute; the scene navigation supplies its name. All meaningful site content remains HTML.
- The backdrop fades only with the existing scroll progress. Reduced motion uses the existing still-scene selection.

## Generation prompt

```text
Use case: stylized-concept. Asset type: full-bleed website background, landscape 16:9, high resolution. Create an original illustration of ALEXANDRIA FROM FINAL FANTASY IX, clearly recognizable as that game world: its magnificent medieval castle with the iconic enormous vertical sword rising through and high above the central tower, dense charming terracotta and slate-roofed town, carved stone bridges, old defensive walls, steep green cliffs and deep valleys filled with blue-white Mist. A small elegant wooden fantasy airship with sails floats far away. Evoke the intricate pre-rendered painted environments of the original Final Fantasy IX with rich hand-painted textures, storybook proportions and immersive depth, not a modern photorealistic city. Mood: magical blue-hour twilight, indigo and teal sky with very subtle northern lights, amber windows and lanterns, violet cloud shadows, soft silvery mist. Composition tailored for a personal website: keep the leftmost 38 percent dark, quiet, mostly mist and shadowed foreground foliage for text overlaid separately; concentrate the readable sword-topped castle at 68 percent across and 40 percent down, town cascading down the right half, strong silhouette that also survives a portrait crop centered around 65 percent across. Use full-bleed artwork only. NO text, no lettering, no logos, no watermark, no UI, no characters, no title card, no borders. This is fan-inspired original environment artwork, not an official game screenshot. Make it beautiful, detailed, luminous yet restrained enough behind white website typography.
```
