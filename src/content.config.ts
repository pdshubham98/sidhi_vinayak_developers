import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Property listings. For local development they live in src/content/properties.json.
 * At go-live this loader is swapped for the CMS, so family members edit listings
 * in an admin panel instead of this file. The schema stays the same.
 */
const properties = defineCollection({
  loader: file('src/content/properties.json'),
  schema: z.object({
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
  }),
});

export const collections = { properties };
