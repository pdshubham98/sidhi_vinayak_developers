import type { APIRoute } from 'astro';
import { site } from '../config/site';

export const GET: APIRoute = ({ site: siteUrl }) => {
  const baseUrl = siteUrl ? String(siteUrl).replace(/\/$/, '') : '';
  const body = site.indexable
    ? `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
