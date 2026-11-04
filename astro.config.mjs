// @ts-check
import { defineConfig } from 'astro/config';

// One-page static site. `site` is set at deploy time (Gate E) for canonical/OG URLs.
export default defineConfig({
  output: 'static',
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  image: {
    // Originals in src/assets/originals are never modified; sharp only writes optimized copies into dist/.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  devToolbar: { enabled: false },
});
