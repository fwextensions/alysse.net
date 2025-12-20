import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// Check if building for GitHub Pages (set by workflow)
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration - only apply base path in production
  // so Keystatic dev routes work properly
  site: isGitHubPages ? 'https://fwextensions.github.io' : undefined,

  base: isGitHubPages ? '/alysse.net' : undefined,

  // hybrid mode: static pages by default, SSR only for Keystatic admin routes
  output: 'static',
//  output: isGitHubPages ? 'static' : 'hybrid',
  adapter: isGitHubPages ? undefined : cloudflare({ imageService: "passthrough" }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: isGitHubPages
    ? [react(), markdoc()]
    : [react(), markdoc(), keystatic()],
});
