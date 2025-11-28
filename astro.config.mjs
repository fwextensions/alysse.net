import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages configuration
  // The workflow will override these with dynamic values during deployment
  site: 'https://fwextensions.github.io',
  base: '/alysse.net',

  vite: {
    plugins: [tailwindcss()],
  },
});
