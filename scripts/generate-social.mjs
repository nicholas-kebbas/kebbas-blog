// Optional regeneration of the checked-in social image. Uses Astro's Sharp dependency.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const rings = Array.from(
  { length: 42 },
  (_, i) =>
    `<ellipse cx="900" cy="310" rx="${160 + 75 * Math.cos((i / 42) * Math.PI * 2)}" ry="${170 + 45 * Math.sin((i / 42) * Math.PI * 2)}" transform="rotate(-28 900 310)"/>`,
).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#11110f"/><g stroke="#ff6840" stroke-width="1" fill="none" opacity=".6">${rings}</g><path d="M50 86H1150" stroke="#393931"/><g fill="#ecebe4" font-family="Arial,Helvetica,sans-serif"><text x="50" y="56" font-size="15" letter-spacing="2">SOFTWARE / AI / BITCOIN</text><text x="46" y="275" font-size="158" font-weight="900" letter-spacing="-10">NICK</text><text x="46" y="437" font-size="158" font-weight="900" letter-spacing="-10">KEBBAS<tspan fill="#ff6840">.</tspan></text><text x="50" y="553" font-size="25">Curiosity, compiled.</text><text x="1150" y="553" text-anchor="end" font-size="18" fill="#a3a39a">kebbas.com</text></g></svg>`;
await writeFile("public/social-card.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/social-card.png");
