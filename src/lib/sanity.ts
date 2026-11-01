import { createClient } from '@sanity/client';

function getClient() {
  return createClient({
    projectId: import.meta.env.SANITY_PROJECT_ID,
    dataset: import.meta.env.SANITY_DATASET || 'production',
    useCdn: true,
    apiVersion: '2024-01-01',
  });
}

const PROPERTIES_QUERY = `*[_type == "property"] | order(featured desc, listedOn desc) {
  "id": slug.current,
  title,
  type,
  status,
  location,
  price,
  size,
  offer,
  featured,
  summary,
  description,
  "highlights": coalesce(highlights, []),
  "images": images[]{
    "src": asset->url,
    alt,
    "placeholder": false
  },
  mapUrl,
  "listedOn": listedOn,
  "sample": false
}`;

export async function fetchPropertiesFromSanity() {
  return getClient().fetch(PROPERTIES_QUERY);
}
