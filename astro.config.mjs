import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import devtoolBreakpoints from 'astro-devtool-breakpoints';

// Astro Configuration
export default defineConfig({
  markdown: {
    drafts: true,
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
      skipInline: false
    }
  },
  site: 'https://goodshepherdcollective.org',
  integrations: [tailwind(), sitemap(), mdx(), devtoolBreakpoints()],
  output: 'static', // For static site generation
  vite: {
    assetsInclude: ['**/*.geojson'], // Add this line to handle .geojson files
  },
});