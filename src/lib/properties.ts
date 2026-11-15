/**
 * Property data access.
 * - Cloudflare: listings live in the PROPERTIES_KV namespace (edited from /admin).
 *   If the KV key has never been written, the bundled src/content/properties.json is used as the seed.
 * - GitHub Pages (static build): `cloudflare:workers` is aliased to an empty stub, so only the JSON is read.
 */
import { getCollection } from 'astro:content';
import { env } from 'cloudflare:workers';
import {
  isOneOf,
  ownershipTypes,
  propertyStatuses,
  propertyTypes,
  type Property,
  type PropertyData,
} from './property-meta';

export * from './property-meta';

const LISTINGS_KEY = 'properties';
const IMAGE_PREFIX = 'img:';
export const MEDIA_PATH = '/media/';

interface KV {
  get(key: string): Promise<string | null>;
  getWithMetadata<M>(key: string, opts: { type: 'arrayBuffer'; cacheTtl?: number }): Promise<{ value: ArrayBuffer | null; metadata: M | null }>;
  put(key: string, value: string | ArrayBuffer, opts?: { metadata?: unknown }): Promise<void>;
  delete(key: string): Promise<void>;
}

function kv(): KV | null {
  return (env?.PROPERTIES_KV as KV | undefined) ?? null;
}

function requireKV(): KV {
  const store = kv();
  if (!store) throw new Error('PROPERTIES_KV binding is not available');
  return store;
}

function toDate(v: unknown, fallback?: Date): Date | undefined {
  if (v instanceof Date) return isNaN(v.getTime()) ? fallback : v;
  if (typeof v === 'string' || typeof v === 'number') {
    const d = new Date(v);
    if (!isNaN(d.getTime())) return d;
  }
  return fallback;
}

const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined);

/** Coerces a stored record into a well-formed Property, so one bad field cannot break a page. */
function normalize(raw: Record<string, unknown>): Property {
  const id = String(raw.id ?? '');
  const price = Number(raw.price);
  const data: PropertyData = {
    title: String(raw.title ?? id),
    type: isOneOf(propertyTypes, raw.type) ? raw.type : 'plot',
    status: isOneOf(propertyStatuses, raw.status) ? raw.status : 'available',
    location: String(raw.location ?? ''),
    ownershipType: isOneOf(ownershipTypes, raw.ownershipType) ? raw.ownershipType : 'own',
    published: raw.published !== false,
    featured: raw.featured === true,
    summary: String(raw.summary ?? ''),
    description: str(raw.description),
    highlights: Array.isArray(raw.highlights) ? raw.highlights.map(String).filter(Boolean) : undefined,
    price: Number.isFinite(price) && price > 0 ? price : undefined,
    size: str(raw.size),
    offer: str(raw.offer),
    mapUrl: str(raw.mapUrl),
    sample: raw.sample === true || undefined,
    images: Array.isArray(raw.images)
      ? (raw.images as Record<string, unknown>[])
          .filter((i) => typeof i?.src === 'string')
          .map((i) => ({ src: String(i.src), alt: String(i.alt ?? raw.title ?? ''), placeholder: i.placeholder === true || undefined }))
      : [],
    listedOn: toDate(raw.listedOn, new Date())!,
    updatedAt: toDate(raw.updatedAt),
  };
  return { id, data };
}

async function readAll(): Promise<Property[]> {
  const raw = await kv()?.get(LISTINGS_KEY);
  if (raw != null) {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map((r) => normalize(r as Record<string, unknown>)) : [];
  }
  const seed = await getCollection('properties');
  return seed.map((e) => normalize({ ...e.data, id: e.id }));
}

const byFeaturedThenNewest = (a: Property, b: Property) =>
  Number(b.data.featured) - Number(a.data.featured) || b.data.listedOn.getTime() - a.data.listedOn.getTime();

/** Published listings, featured first, then newest. */
export async function getProperties(): Promise<Property[]> {
  return (await readAll()).filter((p) => p.data.published).sort(byFeaturedThenNewest);
}

/** Every listing including hidden ones, in stored order (admin). */
export async function getAllProperties(): Promise<Property[]> {
  return readAll();
}

const isoDay = (d?: Date) => d?.toISOString().split('T')[0];

export async function saveProperties(properties: Property[]): Promise<void> {
  const records = properties.map((p) => ({
    ...p.data,
    id: p.id,
    listedOn: isoDay(p.data.listedOn),
    updatedAt: isoDay(p.data.updatedAt),
  }));
  await requireKV().put(LISTINGS_KEY, JSON.stringify(records, null, 2));
}

/* ─── Uploaded photos ─────────────────────────────────────────────────────── */

export const isUploadedImage = (src: string) => src.startsWith(MEDIA_PATH);

/** Stores an uploaded photo and returns the public URL it is served from. */
export async function saveImage(bytes: ArrayBuffer, contentType: string): Promise<string> {
  const id = crypto.randomUUID();
  await requireKV().put(IMAGE_PREFIX + id, bytes, { metadata: { type: contentType } });
  return MEDIA_PATH + id;
}

export async function deleteImage(src: string): Promise<void> {
  if (isUploadedImage(src)) await requireKV().delete(IMAGE_PREFIX + src.slice(MEDIA_PATH.length));
}

export async function readImage(id: string): Promise<{ bytes: ArrayBuffer; type: string } | null> {
  const store = kv();
  if (!store) return null;
  const { value, metadata } = await store.getWithMetadata<{ type?: string }>(IMAGE_PREFIX + id, { type: 'arrayBuffer', cacheTtl: 86400 });
  return value ? { bytes: value, type: metadata?.type ?? 'image/jpeg' } : null;
}
