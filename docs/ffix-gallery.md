# FFIX cities and settlements gallery — November 27, 2026

The scroll gallery has 26 scenes: the 15 existing zones, including Alexandria, followed by eleven new FFIX-inspired paintings. The name, contact link, manual sculpture controls, and existing fragments remain in place. `#dunes` remains an alias for Alexandria.

## Places

Alexandria, Dali, Lindblum, Burmecia, Treno, Cleyra, Conde Petie, Black Mage Village, Madain Sari, Esto Gaza, Daguerreo, and Bran Bal cover the main cities, towns, and settlements. This selection does not claim every inhabited dungeon or optional location. References used to distinguish the places are recorded in the artwork manifest.

The illustrations are original fan-inspired environment paintings generated with the built-in `image_gen` tool, not official game screenshots. Final Fantasy IX and its setting belong to their respective owners. No external image-generation API credentials were used.

## Assets and prompts

- Existing Alexandria: [original prompt and provenance](alexandria-artwork.md).
- Eleven new paintings: [exact prompts, source references, file paths, dimensions, and byte sizes](ffix-cities-artwork.json).
- Delivery files: `public/images/{location}-ffix.webp` and `public/images/{location}-ffix-mobile.webp`.
- Original generated PNGs remain in the local generated-images directory. Sharp converts them to WebP and proportionally downscales the smaller variant; it does not edit their contents.

## Delivery and interaction

The native Scenes disclosure contains named anchor links for all 26 zones. Scrolling controls the dissolves, and reduced motion selects still scenes. Decorative images have empty alt attributes; location names and all meaningful site content remain HTML.

Image sources are assigned near the active scene or requested fragment, with decoding completed before display. Adjacent paintings dissolve over an opaque outgoing image. The procedural renderer holds its final pose once the gallery reaches the appended city scenes. No continuous background animation or new dependency is introduced.
