import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import devtoolBreakpoints from 'astro-devtool-breakpoints';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

// Load environment variables from .env file
dotenv.config();

// Set the build date
process.env.BUILD_DATE = execSync('date +"%m.%d.%Y"').toString().trim();

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
    define: {
      'process.env.BUILD_DATE': JSON.stringify(process.env.BUILD_DATE),
    },
  },
});
