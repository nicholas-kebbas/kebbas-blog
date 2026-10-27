// The opening animation settles within five seconds. No visible controls or storage.
const root = document.documentElement;
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(pointer: fine)");
let introComplete = false;
let userPaused = false;
const isPaused = () => userPaused || reduced.matches || introComplete;
function syncMotion() {
  const paused = isPaused();
  root.dataset.motionReason = reduced.matches
    ? "reduced-motion"
    : userPaused
      ? "paused"
      : introComplete
        ? "intro-complete"
        : "opening";
  root.dataset.motion = paused ? "still" : "full";
  window.dispatchEvent(
    new CustomEvent("observatory:motion", { detail: { paused } }),
  );
}
const introTimer = window.setTimeout(() => {
  introComplete = true;
  syncMotion();
}, 4500);
reduced.addEventListener("change", syncMotion);
// Escape also stops the opening scene; link transitions keep their existing Escape behavior.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    userPaused = true;
    syncMotion();
  }
});
window.addEventListener("pagehide", () => {
  window.clearTimeout(introTimer);
  introComplete = true;
  syncMotion();
});
window.addEventListener("pageshow", syncMotion);
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
