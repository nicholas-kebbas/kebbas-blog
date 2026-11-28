// Native scrolling drives the scene and typography. No wheel interception or autoplay.
import { imageLayersAt, LAST_SCENE_INDEX, nearbyImageScenes, SCENES } from "../lib/scenes";
import { isPlainPortalActivation } from "../lib/portal-navigation";

const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new AbortController();
const stage = document.querySelector<HTMLElement>("[data-sculpture-stage]");
const stops = [...document.querySelectorAll<HTMLAnchorElement>("[data-scene-stop]")];
const sceneNumbers = [...document.querySelectorAll<HTMLElement>("[data-scene-number]")];
const sceneName = document.querySelector<HTMLElement>(".scene-status [data-scene-name]");
const cue = document.querySelector<HTMLElement>("[data-scroll-cue]");
const picker = document.querySelector<HTMLDetailsElement>("[data-scene-picker]");
const pickerSummary = picker?.querySelector<HTMLElement>("summary");
const paintings = new Map([...document.querySelectorAll<HTMLElement>("[data-city-backdrop]")]
  .map((element) => [Number(element.dataset.cityBackdrop), element] as const));
const requestedImages = new Set<number>();
const readyImages = new Set<number>();
let lastVisibleImage: number | null = null;
let frame = 0;
let currentScene = -1;
let active = true;

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

function updateScroll() {
  frame = 0;
  if (!active || document.hidden) return;
  const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  const progress = clamp(window.scrollY / range);
  const scenePosition = progress * LAST_SCENE_INDEX;
  // Reduced motion uses distinct still scenes, with no shrinking or morphing.
  const visualProgress = reduced.matches ? Math.round(scenePosition) / LAST_SCENE_INDEX : progress;
  const visualPosition = visualProgress * LAST_SCENE_INDEX;
  loadNearbyPaintings(visualPosition);
  const imageLayers = imageLayersAt(visualPosition, readyImages, lastVisibleImage);
  for (const [index, painting] of paintings) {
    const opacity = imageLayers.get(index) || 0;
    painting.hidden = opacity === 0;
    if (opacity > 0) painting.style.setProperty("--city-opacity", String(opacity));
  }
  for (const [index, opacity] of imageLayers) {
    if (opacity >= .5) lastVisibleImage = index;
  }
  root.style.setProperty("--city-overlay-opacity", String(Math.max(0, ...imageLayers.values())));
  // Keep the opening transition within the first scene as the gallery grows.
  const sculptureOpacity = reduced.matches
    ? (visualProgress === 0 ? 1 : 0)
    : 1 - ease((scenePosition - .1) / .62);
  root.dataset.scrollProgress = String(visualProgress);
  root.style.setProperty("--name-recede", String(reduced.matches ? 0 : ease(scenePosition / .72)));
  root.style.setProperty("--sculpture-opacity", String(sculptureOpacity));
  root.style.setProperty("--veil-opacity", String(.45 + .5 * (1 - sculptureOpacity)));
  root.style.setProperty("--gallery-progress", String(progress));
  if (stage) {
    stage.inert = sculptureOpacity === 0;
    stage.hidden = sculptureOpacity === 0;
  }
  const scene = Math.round(scenePosition);
  if (scene !== currentScene) {
    currentScene = scene;
    stops.forEach((stop, index) => {
      if (index === scene) stop.setAttribute("aria-current", "location");
      else stop.removeAttribute("aria-current");
    });
    sceneNumbers.forEach((number) => { number.textContent = String(scene + 1).padStart(2, "0"); });
    if (sceneName) sceneName.textContent = SCENES[scene]?.name || SCENES[0].name;
    if (cue) cue.innerHTML = scene === LAST_SCENE_INDEX ? 'Scroll to return <span aria-hidden="true">↑</span>' : 'Scroll to explore <span aria-hidden="true">↓</span>';
  }
  window.dispatchEvent(new CustomEvent("observatory:scroll", { detail: { progress: visualProgress } }));
}
function requestUpdate() {
  if (!frame && active && !document.hidden) frame = requestAnimationFrame(updateScroll);
}

function loadPainting(index: number) {
  if (requestedImages.has(index)) return;
  const painting = paintings.get(index);
  const image = painting?.querySelector<HTMLImageElement>("img[data-src]");
  if (!image) return;
  requestedImages.add(index);
  image.addEventListener("load", () => {
    // Decode before compositing so a fast anchor jump never covers the backdrop with an empty image.
    const ready = () => {
      if (listeners.signal.aborted || !image.naturalWidth) return;
      readyImages.add(index);
      painting!.dataset.ready = "";
      requestUpdate();
    };
    image.decode().then(ready, ready);
  }, { once: true, signal: listeners.signal });
  painting!.querySelectorAll<HTMLSourceElement>("source[data-srcset]").forEach((source) => {
    source.srcset = source.dataset.srcset!;
  });
  image.src = image.dataset.src!;
}
function loadNearbyPaintings(position: number) {
  nearbyImageScenes(position).forEach(loadPainting);
}
function preloadAnchor(hash: string) {
  let id: string;
  try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
  const target = SCENES.findIndex((scene) => scene.id === (id === "dunes" ? "alexandria" : id));
  if (target >= 0) loadNearbyPaintings(target);
}
function closePicker(restoreFocus = false) {
  if (!picker?.open) return;
  picker.open = false;
  if (restoreFocus) pickerSummary?.focus({ preventScroll: true });
}
picker?.addEventListener("click", (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-scene-stop]");
  if (!link || !isPlainPortalActivation({
    button: event.button,
    defaultPrevented: event.defaultPrevented,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    target: link.target,
    download: link.hasAttribute("download"),
  })) return;
  preloadAnchor(link.hash);
  closePicker(true);
  // Keep the native link default: URL fragments, history, and browser navigation still work.
}, { signal: listeners.signal });
document.addEventListener("click", (event) => {
  const link = (event.target as Element).closest<HTMLAnchorElement>("a[href^='#']");
  if (!link || !isPlainPortalActivation({
    button: event.button,
    defaultPrevented: event.defaultPrevented,
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    target: link.target,
    download: link.hasAttribute("download"),
  })) return;
  // Only user-activated anchors opt into smooth scrolling; initial deep links stay instant.
  root.dataset.scrollNavigation = "";
}, { signal: listeners.signal });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && picker?.open) {
    event.preventDefault();
    closePicker(true);
  }
}, { signal: listeners.signal });
document.addEventListener("pointerdown", (event) => {
  if (picker?.open && !picker.contains(event.target as Node)) closePicker();
}, { signal: listeners.signal });
window.addEventListener("hashchange", () => {
  preloadAnchor(location.hash);
  requestUpdate();
}, { signal: listeners.signal });
// A deep link can load its exact destination before native fragment scrolling has settled.
preloadAnchor(location.hash);

function syncMotion() {
  root.dataset.motion = reduced.matches ? "still" : "full";
  root.dataset.motionReason = reduced.matches ? "reduced-motion" : "manual";
  window.dispatchEvent(
    new CustomEvent("observatory:motion", { detail: { paused: reduced.matches } }),
  );
  requestUpdate();
}
reduced.addEventListener("change", syncMotion, { signal: listeners.signal });
window.addEventListener("scroll", requestUpdate, { passive: true, signal: listeners.signal });
window.addEventListener("resize", requestUpdate, { signal: listeners.signal });
window.addEventListener("pageshow", () => { active = true; syncMotion(); }, { signal: listeners.signal });
window.addEventListener("pagehide", () => { active = false; cancelAnimationFrame(frame); frame = 0; }, { signal: listeners.signal });
document.addEventListener("visibilitychange", () => {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
  else requestUpdate();
}, { signal: listeners.signal });
document.addEventListener("astro:before-swap", () => {
  active = false;
  cancelAnimationFrame(frame);
  listeners.abort();
}, { once: true, signal: listeners.signal });
root.dataset.scrollReady = "";
syncMotion();
