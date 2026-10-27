// @ts-check

import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kebbas.com",
  output: "static",
  // Preserve HTML-aware spacing across inline elements after the Astro 7 upgrade.
  compressHTML: true,
  integrations: [sitemap()],
});
