import type { APIRoute } from 'astro';
import { readImage } from '../lib/properties';

/** Serves photos uploaded from /admin. IDs are random UUIDs and never reused, so responses are immutable. */
export const GET: APIRoute = async ({ params }) => {
  const id = params.id ?? '';
  if (!/^[0-9a-f-]{36}$/.test(id)) return new Response('Not found', { status: 404 });
  const img = await readImage(id);
  if (!img) return new Response('Not found', { status: 404 });
  return new Response(img.bytes, {
    headers: {
      'Content-Type': img.type,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
