import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
  name: 'siddhivinayak-developers',
  title: 'Siddhivinayak Developers',

  // Fill these in after running: npx sanity init
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
