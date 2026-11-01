import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';
import { sanityPropertiesLoader } from './lib/sanity-loader';

/**
 * Property listings.
 * - Local dev (no .env): reads src/content/properties.json
 * - Production (SANITY_PROJECT_ID set in .env): fetches from Sanity CMS
 */
const useSanity = !!import.meta.env.SANITY_PROJECT_ID;

const propertySchema = z.object({
  title: z.string(),
  type: z.enum(['farm-house-plot', 'plot', 'house', 'flat', 'commercial']),
  status: z.enum(['available', 'booked', 'sold', 'upcoming']),
  location: z.string(),
  /** Price in rupees. Leave out to show "Price on request". */
  price: z.number().positive().optional(),
  /** Free text, e.g. "1,000 to 5,000 sq ft". */
  size: z.string().optional(),
  offer: z.string().optional(),
  featured: z.boolean().default(false),
  summary: z.string(),
  description: z.string().optional(),
  highlights: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        /** True for illustrations used until real photos are available. */
        placeholder: z.boolean().default(false),
      }),
    )
    .min(1),
  mapUrl: z.url().optional(),
  /** Sample listings for previewing the layout. Delete them before going live. */
  sample: z.boolean().default(false),
  /** Newer dates show first. */
  listedOn: z.coerce.date(),
});

const properties = defineCollection({
  loader: useSanity
    ? sanityPropertiesLoader()
    : file('src/content/properties.json'),
  schema: propertySchema,
});

export const collections = { properties };
