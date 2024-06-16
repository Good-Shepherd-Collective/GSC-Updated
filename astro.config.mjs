import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import devtoolBreakpoints from 'astro-devtool-breakpoints';

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
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
  output: 'hybrid' // Change the output to server
  ,
  adapter: vercel()
});