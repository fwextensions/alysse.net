import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Check if building for GitHub Pages (set by workflow)
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration - only apply base path in production
  // so Keystatic dev routes work properly
  site: 'https://fwextensions.github.io',

  base: isGitHubPages ? '/alysse.net' : undefined,

  vite: {
    plugins: [tailwindcss()],
  },

  // Keystatic only in dev mode (requires server-side rendering)
  integrations: isGitHubPages
    ? [react(), markdoc()]
    : [react(), markdoc(), keystatic()],
});
