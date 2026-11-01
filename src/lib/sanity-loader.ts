import type { Loader } from 'astro/loaders';
import { fetchPropertiesFromSanity } from './sanity';

export function sanityPropertiesLoader(): Loader {
  return {
    name: 'sanity-properties',
    load: async ({ store, logger, parseData }) => {
      logger.info('Fetching properties from Sanity...');
      const items = await fetchPropertiesFromSanity();
      store.clear();
      for (const item of items) {
        const data = await parseData({ id: item.id, data: item });
        store.set({ id: item.id, data });
      }
      logger.info(`Loaded ${items.length} propert${items.length === 1 ? 'y' : 'ies'} from Sanity.`);
    },
  };
}
