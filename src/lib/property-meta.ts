/** Property vocabulary shared by the content schema, the data layer, the admin panel and the UI. */

export const propertyTypes = ['plot', 'farm-house-plot', 'house', 'flat', 'commercial', 'agricultural'] as const;
export const propertyStatuses = ['available', 'upcoming', 'booked', 'sold'] as const;
export const ownershipTypes = ['own', 'assisted'] as const;

export type PropertyType = (typeof propertyTypes)[number];
export type PropertyStatus = (typeof propertyStatuses)[number];
export type OwnershipType = (typeof ownershipTypes)[number];

export interface PropertyImage {
  src: string;
  alt: string;
  placeholder?: boolean;
}

export interface PropertyData {
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  location: string;
  ownershipType: OwnershipType;
  published: boolean;
  featured: boolean;
  summary: string;
  description?: string;
  highlights?: string[];
  price?: number;
  size?: string;
  offer?: string;
  mapUrl?: string;
  sample?: boolean;
  images: PropertyImage[];
  listedOn: Date;
  updatedAt?: Date;
}

export interface Property {
  id: string;
  data: PropertyData;
}

export const typeLabels: Record<PropertyType, string> = {
  plot: 'Plot',
  'farm-house-plot': 'Farm house plot',
  house: 'House',
  flat: 'Flat',
  commercial: 'Commercial',
  agricultural: 'Agricultural land',
};

export const statusLabels: Record<PropertyStatus, string> = {
  available: 'Available',
  upcoming: 'Coming soon',
  booked: 'Booked',
  sold: 'Sold',
};

export const statusBadgeClass: Record<PropertyStatus, string> = {
  available: 'badge-available',
  upcoming: 'badge-upcoming',
  booked: 'badge-booked',
  sold: 'badge-sold',
};

export const ownershipLabels: Record<OwnershipType, string> = {
  own: 'Our project',
  assisted: 'Assisted listing',
};

export const isOneOf = <T extends string>(list: readonly T[], v: unknown): v is T =>
  typeof v === 'string' && (list as readonly string[]).includes(v);

/** Formats rupees the way buyers in India read prices: Lakh and Crore. */
export function formatPrice(price?: number): string {
  if (!price) return 'Price on request';
  const trim = (n: number) => n.toFixed(2).replace(/\.?0+$/, '');
  if (price >= 1e7) return `₹${trim(price / 1e7)} Cr`;
  if (price >= 1e5) return `₹${trim(price / 1e5)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
}
