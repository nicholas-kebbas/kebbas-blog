// Shared by the page, scroll controller, and procedural backdrop.
export const SCENES = [
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
  { id: "dunes", name: "Dunes" },
  { id: "orbit", name: "Orbit" },
  { id: "bloom", name: "Bloom" },
  { id: "vortex", name: "Vortex" },
  { id: "zenith", name: "Zenith" },
] as const;

export const LAST_SCENE_INDEX = SCENES.length - 1;
