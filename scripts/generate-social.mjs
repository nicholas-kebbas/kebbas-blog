// Regenerate the code-native share graphic with Astro's existing Sharp dependency.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
const rings = Array.from(
  { length: 24 },
  (_, i) =>
    `<ellipse cx="930" cy="305" rx="${70 + i * i * 0.8}" ry="${38 + i * i * 0.4}" transform="rotate(-28 930 305)" opacity="${0.14 + i * 0.018}"/>`,
).join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0a0b0d"/><g stroke="#d5f56e" stroke-width="1" fill="none">${rings}</g><path d="M50 86H1150M50 511H1150" stroke="#ffffff33"/><g fill="#efeee7" font-family="Arial,Helvetica,sans-serif"><text x="50" y="56" font-size="13" letter-spacing="3">NICK KEBBAS</text><text x="46" y="274" font-size="170" font-weight="900" letter-spacing="-11">NICK</text><text x="46" y="440" font-size="170" font-weight="900" letter-spacing="-11" fill="#0a0b0d" stroke="#efeee7" stroke-width="1">KEBBAS</text><text x="50" y="558" font-size="22">Let’s work together.</text><text x="1150" y="558" text-anchor="end" font-size="17" fill="#d5f56e">kebbas.com ↗</text></g></svg>`;
await writeFile("public/social-card.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/social-card.png");
