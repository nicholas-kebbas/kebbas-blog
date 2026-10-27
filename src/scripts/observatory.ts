// Shared motion preference is session-only. No storage, telemetry, or network requests.
const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
const toggle = document.querySelector<HTMLButtonElement>(
  "[data-motion-toggle]",
);
let userPaused = false;
const isPaused = () => userPaused || reduced.matches;
function syncMotion() {
  const paused = isPaused();
  root.dataset.motion = paused ? "still" : "full";
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(paused));
    toggle.setAttribute(
      "aria-label",
      reduced.matches
        ? "Motion disabled by your device preference"
        : paused
          ? "Resume motion"
          : "Pause motion",
    );
    toggle.disabled = reduced.matches;
    const label = toggle.querySelector("[data-motion-label]");
    if (label) label.textContent = paused ? "Motion off" : "Motion on";
  }
  window.dispatchEvent(
    new CustomEvent("observatory:motion", { detail: { paused } }),
  );
}
if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener("click", () => {
    userPaused = !userPaused;
    syncMotion();
  });
}
reduced.addEventListener("change", syncMotion);
syncMotion();

// Pointer accent only; retain the system cursor and native link behavior.
const cursor = document.querySelector<HTMLElement>(".cursor-orbit");
let pointerX = 0,
  pointerY = 0,
  uiFrame = 0;
function updateCursor() {
  uiFrame = 0;
  if (isPaused() || !cursor || document.hidden) return;
  cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
  cursor.style.opacity = "1";
}
window.addEventListener(
  "pointermove",
  (event) => {
    if (!finePointer.matches || isPaused() || document.hidden) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor?.toggleAttribute(
      "data-active",
      event.target instanceof Element &&
        !!event.target.closest("a,button,input"),
    );
    if (!uiFrame) uiFrame = requestAnimationFrame(updateCursor);
  },
  { passive: true },
);
document.addEventListener("pointerleave", () => {
  if (cursor) cursor.style.opacity = "0";
});
function stopCursor() {
  cancelAnimationFrame(uiFrame);
  uiFrame = 0;
  if (cursor) cursor.style.opacity = "0";
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopCursor();
});
window.addEventListener("pagehide", stopCursor);
window.addEventListener("observatory:motion", () => {
  if (isPaused()) stopCursor();
});
