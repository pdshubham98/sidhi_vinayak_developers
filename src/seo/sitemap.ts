/**
 * /sitemap.xml, rendered on each request so listings added in /admin appear without a rebuild.
 * Cloudflare only (injected in astro.config.mjs). URLs use the exact form each page is served at:
 * static pages end in "/" (Cloudflare redirects the bare form), listing pages do not.
 */
import type { APIRoute } from 'astro';
import { getProperties } from '../lib/properties';

const STATIC_PAGES = [
  '/', '/construction/', '/sell/', '/about/', '/contact/', '/requirement/', '/faq/', '/privacy/',
  '/plots-in-neelbad-bhopal/', '/farm-house-plots-bilkisganj/', '/buying-a-plot-in-bhopal/',
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const day = (d?: Date) => (d && !isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : undefined);

export const GET: APIRoute = async ({ site, url }) => {
  const origin = (site ?? new URL(url.origin)).toString().replace(/\/$/, '');
  const properties = await getProperties();

  const entries: { loc: string; lastmod?: string }[] = [
    ...STATIC_PAGES.map((p) => ({ loc: origin + p })),
    { loc: `${origin}/properties` },
    ...properties.map((p) => ({
      loc: `${origin}/properties/${encodeURIComponent(p.id)}`,
      lastmod: day(p.data.updatedAt ?? p.data.listedOn),
    })),
  ];

  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map((e) => `  <url><loc>${esc(e.loc)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`)
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
