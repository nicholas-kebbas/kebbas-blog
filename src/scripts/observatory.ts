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

// Decorative scroll and pointer effects never alter scrolling or the system cursor.
const cursor = document.querySelector<HTMLElement>(".cursor-orbit");
const specimen = document.querySelector<HTMLElement>(".specimen-scene");
const tilt = document.querySelector<HTMLElement>("[data-tilt]");
let pointerX = 0,
  pointerY = 0,
  pointerPresent = false,
  uiFrame = 0;
function updateUI() {
  uiFrame = 0;
  if (isPaused()) return;
  if (cursor && finePointer.matches && pointerPresent) {
    cursor.style.transform = `translate3d(${pointerX}px,${pointerY}px,0)`;
    cursor.style.opacity = "1";
  }
  if (specimen) {
    const bounds = specimen.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight) {
      const offset = Math.max(
        -24,
        Math.min(
          24,
          (innerHeight / 2 - bounds.top - bounds.height / 2) * 0.035,
        ),
      );
      specimen.style.setProperty("--specimen-shift", `${offset}px`);
    }
  }
}
function requestUI() {
  if (!uiFrame && !document.hidden && !isPaused())
    uiFrame = requestAnimationFrame(updateUI);
}
window.addEventListener(
  "pointermove",
  (event) => {
    if (!finePointer.matches || isPaused()) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    pointerPresent = true;
    const target = event.target;
    cursor?.toggleAttribute(
      "data-active",
      target instanceof Element && !!target.closest("a, button, input"),
    );
    requestUI();
  },
  { passive: true },
);
document.addEventListener("pointerleave", () => {
  pointerPresent = false;
  if (cursor) cursor.style.opacity = "0";
});
window.addEventListener("scroll", requestUI, { passive: true });
window.addEventListener("resize", requestUI, { passive: true });
tilt?.addEventListener("pointermove", (event) => {
  if (!finePointer.matches || isPaused()) return;
  const bounds = tilt.getBoundingClientRect();
  tilt.style.setProperty(
    "--tilt-x",
    `${((event.clientY - bounds.top - bounds.height / 2) / bounds.height) * -3}deg`,
  );
  tilt.style.setProperty(
    "--tilt-y",
    `${((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 3}deg`,
  );
});
tilt?.addEventListener("pointerleave", () => {
  tilt.style.setProperty("--tilt-x", "0deg");
  tilt.style.setProperty("--tilt-y", "0deg");
});
window.addEventListener("observatory:motion", () => {
  if (isPaused() && uiFrame) {
    cancelAnimationFrame(uiFrame);
    uiFrame = 0;
  } else requestUI();
});

// A deterministic field instrument: changing pattern/seed redraws even in still mode.
const field = document.querySelector<HTMLElement>("[data-field]");
const canvas = field?.querySelector("canvas");
const context = canvas?.getContext("2d", { alpha: false });
if (field && canvas && context) {
  const surface = field,
    drawing = canvas,
    ctx = context;
  let width = 1,
    height = 1,
    tick = 0,
    seed = 1,
    frame = 0,
    lastFrame = 0,
    visible = false;
  let pattern = "coherence";
  const pointer = { x: -10, y: -10 };
  const count = 320;
  const particles = Array.from({ length: count }, (_, index) => ({
    phase: index * 2.399963,
    radius: Math.sqrt((index + 0.5) / count),
  }));
  const live = () => visible && !document.hidden && !isPaused();
  function draw() {
    ctx.fillStyle = "#161a18";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#d5f56e0b";
    ctx.lineWidth = 1;
    const step = 38;
    for (let x = 0; x < width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    const scale = Math.min(width * 0.44, height * 0.46),
      centerY = height * (width < 500 ? 0.4 : 0.47);
    const points = particles.map((particle, index) => {
      const a = particle.phase + tick * 0.15 + seed * 0.38;
      const radius = scale * particle.radius;
      let x: number, y: number;
      if (pattern === "turbulence") {
        x =
          Math.cos(a + Math.sin(particle.radius * 10 + tick + seed) * 0.7) *
          radius;
        y =
          Math.sin(a * 1.3 + Math.cos(particle.radius * 6 + tick * 0.7) * 0.5) *
          radius *
          0.7;
      } else if (pattern === "orbit") {
        x = Math.cos(a + particle.radius * 4) * radius;
        y =
          Math.sin(a + particle.radius * 4) * radius * 0.43 +
          Math.sin(tick + particle.radius * 12) * 24;
        const angle = -0.32;
        [x, y] = [
          x * Math.cos(angle) - y * Math.sin(angle),
          x * Math.sin(angle) + y * Math.cos(angle),
        ];
      } else {
        const wave = Math.sin(a * 3 + tick * 0.5 + particle.radius * 7) * 16;
        x = Math.cos(a) * (radius + wave);
        y = Math.sin(a) * (radius + wave) * 0.7;
      }
      x += width / 2;
      y += centerY;
      if (!isPaused()) {
        const dx = x - pointer.x,
          dy = y - pointer.y,
          distance = Math.hypot(dx, dy);
        if (distance < 100 && distance > 0.1) {
          const force = (100 - distance) * 0.4;
          x += (dx / distance) * force;
          y += (dy / distance) * force;
        }
      }
      return { x, y, index };
    });
    // Neighbouring phyllotaxis strands form a mesh without an O(n²) pair search.
    for (const point of points) {
      for (const gap of [13, 21]) {
        const next = points[point.index + gap];
        if (!next) continue;
        const distance = Math.hypot(point.x - next.x, point.y - next.y);
        if (distance > scale * 0.38) continue;
        ctx.strokeStyle = `rgba(201,225,166,${Math.max(0.03, 0.24 - (distance / scale) * 0.5)})`;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
      ctx.fillStyle = point.index % 11 === 0 ? "#ebf5d5" : "#acc782";
      ctx.beginPath();
      ctx.arc(
        point.x,
        point.y,
        point.index % 11 === 0 ? 2.3 : 1,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  function animate(now: number) {
    frame = 0;
    if (!live()) return;
    if (now - lastFrame >= 32) {
      tick += Math.min((now - lastFrame) / 1000, 0.04);
      lastFrame = now;
      draw();
    }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    if (!live() && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    }
    if (live() && !frame) {
      lastFrame = performance.now();
      frame = requestAnimationFrame(animate);
    }
  }
  function resize() {
    const bounds = surface.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    drawing.width = Math.round(width * dpr);
    drawing.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  surface
    .querySelectorAll<HTMLButtonElement>("[data-field-mode]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        pattern = button.dataset.fieldMode || "coherence";
        surface
          .querySelectorAll("[data-field-mode]")
          .forEach((item) =>
            item.setAttribute("aria-pressed", String(item === button)),
          );
        const name = surface.querySelector("[data-field-name]");
        if (name) name.textContent = pattern;
        draw();
      }),
    );
  surface
    .querySelector("[data-field-regenerate]")
    ?.addEventListener("click", () => {
      seed += 1;
      const output = surface.querySelector("[data-field-seed]");
      if (output) output.textContent = String(seed).padStart(3, "0");
      const status = surface.querySelector("[data-field-status]");
      if (status) status.textContent = `Field seed ${seed}.`;
      draw();
    });
  surface.addEventListener("pointermove", (event) => {
    if (!finePointer.matches || isPaused()) return;
    const b = surface.getBoundingClientRect();
    pointer.x = event.clientX - b.left;
    pointer.y = event.clientY - b.top;
  });
  surface.addEventListener("pointerleave", () => {
    pointer.x = -1000;
    pointer.y = -1000;
  });
  new ResizeObserver(resize).observe(surface);
  new IntersectionObserver(
    (entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      sync();
    },
    { threshold: 0.03 },
  ).observe(surface);
  document.addEventListener("visibilitychange", sync);
  window.addEventListener("observatory:motion", () => {
    draw();
    sync();
  });
  window.addEventListener("pagehide", () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  });
  window.addEventListener("pageshow", sync);
  const controls = surface.querySelector<HTMLElement>(".field-controls");
  if (controls) controls.hidden = false;
  resize();
  surface.setAttribute("data-ready", "");
  sync();
}
