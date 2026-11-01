/**
 * Prepend Astro's BASE_URL to any absolute-path internal link.
 * BASE_URL = '/'                       on Cloudflare Workers
 * BASE_URL = '/sidhi_vinayak_developers/' on GitHub Pages
 *
 * Usage: href={url('/properties')}
 */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL; // always ends with /
  return base + path.replace(/^\//, '');
}
