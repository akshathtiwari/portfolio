// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Canonical origin — used for sitemap, canonical links, and absolute OG URLs.
  // Update this one line if you point a custom domain at the site.
  site: 'https://akshathtiwari.co.in',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [mdx(), sitemap(), react()]
});