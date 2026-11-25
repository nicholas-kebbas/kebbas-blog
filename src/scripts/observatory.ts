// The sculpture is entirely manual. Keep the motion signal for link transitions.
const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const listeners = new AbortController();
function syncMotion() {
  root.dataset.motion = reduced.matches ? "still" : "full";
  root.dataset.motionReason = reduced.matches ? "reduced-motion" : "manual";
  window.dispatchEvent(
    new CustomEvent("observatory:motion", { detail: { paused: reduced.matches } }),
  );
}
reduced.addEventListener("change", syncMotion, { signal: listeners.signal });
window.addEventListener("pageshow", syncMotion, { signal: listeners.signal });
document.addEventListener("astro:before-swap", () => listeners.abort(), { once: true, signal: listeners.signal });
syncMotion();
