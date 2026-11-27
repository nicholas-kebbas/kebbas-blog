// Native scrolling drives the scene and typography. No wheel interception or autoplay.
import { LAST_SCENE_INDEX, SCENES } from "../lib/scenes";

const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new AbortController();
const stage = document.querySelector<HTMLElement>("[data-sculpture-stage]");
const stops = [...document.querySelectorAll<HTMLAnchorElement>("[data-scene-stop]")];
const sceneNumber = document.querySelector<HTMLElement>("[data-scene-number]");
const sceneName = document.querySelector<HTMLElement>(".scene-status [data-scene-name]");
const cue = document.querySelector<HTMLElement>("[data-scroll-cue]");
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
  // Keep the opening transition within the first scene as the gallery grows.
  const sculptureOpacity = reduced.matches
    ? (visualProgress === 0 ? 1 : 0)
    : 1 - ease((scenePosition - .1) / .62);
  root.dataset.scrollProgress = String(visualProgress);
  root.style.setProperty("--name-recede", String(reduced.matches ? 0 : ease(scenePosition / .72)));
  root.style.setProperty("--sculpture-opacity", String(sculptureOpacity));
  root.style.setProperty("--veil-opacity", String(.45 + .5 * (1 - sculptureOpacity)));
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
    if (sceneNumber) sceneNumber.textContent = String(scene + 1).padStart(2, "0");
    if (sceneName) sceneName.textContent = SCENES[scene]?.name || SCENES[0].name;
    if (cue) cue.innerHTML = scene === LAST_SCENE_INDEX ? 'Scroll to return <span aria-hidden="true">↑</span>' : 'Scroll to explore <span aria-hidden="true">↓</span>';
  }
  window.dispatchEvent(new CustomEvent("observatory:scroll", { detail: { progress: visualProgress } }));
}
function requestUpdate() {
  if (!frame && active && !document.hidden) frame = requestAnimationFrame(updateScroll);
}
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
