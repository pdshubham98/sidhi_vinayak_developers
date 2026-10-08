import { getCollection, type CollectionEntry } from 'astro:content';

export type Property = CollectionEntry<'properties'>;
export type PropertyType = Property['data']['type'];
export type PropertyStatus = Property['data']['status'];

export const typeLabels: Record<PropertyType, string> = {
  'farm-house-plot': 'Farm house plot',
  plot: 'Plot',
  house: 'House',
  flat: 'Flat',
  commercial: 'Commercial',
};

export const statusLabels: Record<PropertyStatus, string> = {
  available: 'Available',
  booked: 'Booked',
  sold: 'Sold',
  upcoming: 'Coming soon',
};

/** All listings: featured first, then newest. */
export async function getProperties(): Promise<Property[]> {
  const all = await getCollection('properties');
  return all.sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.listedOn.getTime() - a.data.listedOn.getTime(),
  );
}

/** Formats rupees the way buyers in India read prices: Lakh and Crore. */
export function formatPrice(price?: number): string {
  if (!price) return 'Price on request';
  const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, '');
  if (price >= 1e7) return `₹${trim(price / 1e7)} Cr`;
  if (price >= 1e5) return `₹${trim(price / 1e5)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
}
