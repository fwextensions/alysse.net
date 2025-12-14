import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

const isProd = import.meta.env.PROD;

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration - only apply base path in production
  // so Keystatic dev routes work properly
  site: 'https://fwextensions.github.io',

  base: isProd ? '/alysse.net' : undefined,

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), markdoc(), keystatic()],
});
