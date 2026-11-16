// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import cloudflare from '@astrojs/cloudflare';

// Set DEPLOY_TARGET=github in CI to build for GitHub Pages.
// Unset (or any other value) builds for Cloudflare Workers.
const githubPages = process.env.DEPLOY_TARGET === 'github';

// Pages that read listings, so admin edits show up without a rebuild on Cloudflare.
const LISTING_PAGES = new Set([
  'src/pages/index.astro',
  'src/pages/properties/index.astro',
  'src/pages/properties/[slug].astro',
]);

/** @type {import('astro').AstroIntegration} */
const deployTarget = {
  name: 'deploy-target',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      if (githubPages) return;
      injectRoute({ pattern: '/admin', entrypoint: './src/admin/AdminPage.astro', prerender: false });
      injectRoute({ pattern: '/media/[id]', entrypoint: './src/admin/media.ts', prerender: false });
      // Live sitemap (includes listings added in /admin) and Search Console verification file.
      injectRoute({ pattern: '/sitemap.xml', entrypoint: './src/seo/sitemap.ts', prerender: false });
      injectRoute({ pattern: '/google6bf495484f830c73.html', entrypoint: './src/seo/google-verification.ts', prerender: false });
    },
    'astro:route:setup': ({ route }) => {
      if (LISTING_PAGES.has(route.component)) route.prerender = githubPages;
    },
  },
};

export default defineConfig({
  site: githubPages ? undefined : 'https://sidhivinayakdevelopers.com',

  // GitHub Pages serves the site at /sidhi_vinayak_developers/
  // Cloudflare Workers serves at the root.
  base: githubPages ? '/sidhi_vinayak_developers/' : undefined,

  session: false,

  // No adapter = static output (for GitHub Pages).
  // Cloudflare adapter = server output with edge functions (for the full deployment).
  adapter: githubPages ? undefined : cloudflare({ imageService: 'passthrough' }),

  integrations: [deployTarget],

  vite: githubPages
    ? { resolve: { alias: { 'cloudflare:workers': fileURLToPath(new URL('./src/lib/cloudflare-workers-stub.ts', import.meta.url)) } } }
    : {},
});
