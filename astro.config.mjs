// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { postContentPlugin } from './src/lib/markdown-plugins.mjs';
import { site } from './src/config/site.ts';

// https://astro.build/config
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: {
    // Put the site's CSS inside each page instead of a separate file, so pages can draw without waiting for it.
    inlineStylesheets: 'always',
  },
  integrations: [
    sitemap({
      // Keep utility pages out of the sitemap.
      filter: (page) => !page.includes('/contact/thanks/'),
    }),
  ],
  markdown: {
    // Blog posts: outside links open in a new tab; photos get several sizes (srcset). See src/lib/markdown-plugins.mjs.
    processor: satteri({ hastPlugins: [postContentPlugin()] }),
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
