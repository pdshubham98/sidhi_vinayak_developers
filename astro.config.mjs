// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Set DEPLOY_TARGET=github in CI to build for GitHub Pages.
// Unset (or any other value) builds for Cloudflare Workers.
const githubPages = process.env.DEPLOY_TARGET === 'github';

export default defineConfig({
  // GitHub Pages serves the site at /sidhi_vinayak_developers/
  // Cloudflare Workers serves at the root.
  base: githubPages ? '/sidhi_vinayak_developers' : undefined,

  session: false,

  // No adapter = static output (for GitHub Pages).
  // Cloudflare adapter = server output with edge functions (for the full deployment).
  adapter: githubPages ? undefined : cloudflare({ imageService: 'passthrough' }),
});
