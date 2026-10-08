// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Static pages are prerendered at build time; only the form pages run on demand.
export default defineConfig({
  // Set to the real domain at go-live (used for canonical URLs and the sitemap).
  // e.g. site: 'https://www.siddhivinayakdevelopers.com',
  // site: 'https://www.example.com',

  // Go-live SEO step: add @astrojs/sitemap to generate /sitemap-index.xml
  // Run: npm install @astrojs/sitemap
  // Then: import sitemap from '@astrojs/sitemap'; and add sitemap() to integrations: [sitemap()]

  session: false, // Not needed: form results are returned directly, no server-side session state.
  adapter: cloudflare({
    imageService: 'passthrough', // Images are served as-is; listing photos will come from the CMS image CDN.
  }),
});
