export interface Scene {
  id: string;
  name: string;
  image?: string;
}

// Shared by the page, scroll controller, and procedural backdrop.
export const SCENES: readonly Scene[] = [
  { id: "top", name: "Chrome" },
  { id: "aurora", name: "Aurora" },
  { id: "tidal", name: "Tidal" },
  { id: "corona", name: "Corona" },
  { id: "afterglow", name: "Afterglow" },
  { id: "prism", name: "Prism" },
  { id: "nebula", name: "Nebula" },
  { id: "eclipse", name: "Eclipse" },
  { id: "flux", name: "Flux" },
  { id: "glacial", name: "Glacial" },
  { id: "alexandria", name: "Alexandria", image: "alexandria" },
  { id: "orbit", name: "Orbit" },
  { id: "bloom", name: "Bloom" },
  { id: "vortex", name: "Vortex" },
  { id: "zenith", name: "Zenith" },
  { id: "dali", name: "Dali", image: "dali" },
  { id: "lindblum", name: "Lindblum", image: "lindblum" },
  { id: "burmecia", name: "Burmecia", image: "burmecia" },
  { id: "treno", name: "Treno", image: "treno" },
  { id: "cleyra", name: "Cleyra", image: "cleyra" },
  { id: "conde-petie", name: "Conde Petie", image: "conde-petie" },
  { id: "black-mage-village", name: "Black Mage Village", image: "black-mage-village" },
  { id: "madain-sari", name: "Madain Sari", image: "madain-sari" },
  { id: "esto-gaza", name: "Esto Gaza", image: "esto-gaza" },
  { id: "daguerreo", name: "Daguerreo", image: "daguerreo" },
  { id: "bran-bal", name: "Bran Bal", image: "bran-bal" },
];

export const LAST_SCENE_INDEX = SCENES.length - 1;
export const LAST_PROCEDURAL_SCENE_INDEX = SCENES.findIndex((scene) => scene.id === "zenith");
export const IMAGE_SCENES = SCENES.flatMap((scene, index) => scene.image ? [{ ...scene, image: scene.image, index }] : []);
const imageRunStart = SCENES.findIndex((scene, index) => scene.image && SCENES.slice(index).every((item) => item.image));

const ease = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export function nearbyImageScenes(position: number): number[] {
  return IMAGE_SCENES.filter((scene) => Math.abs(scene.index - position) <= 1.2).map((scene) => scene.index);
}

/** Keep the outgoing painting opaque underneath its incoming neighbor. */
export function imageLayersAt(position: number, ready: ReadonlySet<number>, fallback: number | null = null): Map<number, number> {
  const layers = new Map<number, number>();
  if (position >= imageRunStart) {
    const lower = Math.min(LAST_SCENE_INDEX, Math.floor(position));
    const upper = Math.min(LAST_SCENE_INDEX, lower + 1);
    if (ready.has(lower)) {
      layers.set(lower, 1);
      const incoming = ease((position - lower - .1) / .8);
      if (upper !== lower && incoming > 0 && ready.has(upper)) layers.set(upper, incoming);
    } else if (ready.has(upper)) {
      layers.set(upper, 1);
    } else if (fallback !== null && ready.has(fallback)) {
      layers.set(fallback, 1);
    }
    return layers;
  }
  for (const scene of IMAGE_SCENES) {
    if (!ready.has(scene.index)) continue;
    const opacity = ease((position - (scene.index - .9)) / .8)
      * (1 - ease((position - (scene.index + .1)) / .8));
    if (opacity > 0) layers.set(scene.index, opacity);
  }
  return layers;
}
