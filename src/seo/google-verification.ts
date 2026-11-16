/**
 * Google Search Console HTML-file verification.
 * Served by the Worker (not from public/) because Cloudflare's static-asset handling redirects
 * "/<name>.html" to "/<name>", and Google's verification check needs a direct 200.
 */
import type { APIRoute } from 'astro';

export const GOOGLE_VERIFICATION_FILE = 'google6bf495484f830c73.html';

export const GET: APIRoute = () =>
  new Response(`google-site-verification: ${GOOGLE_VERIFICATION_FILE}`, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
