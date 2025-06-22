import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen } from '@shopify/mini-oxygen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Pre-bundle these CommonJS deps during development for Vite
  server: {
    allowedHosts: ['ea6a-176-100-6-109.ngrok-free.app']
  },
  optimizeDeps: {
    include: ['@sanity/client', 'rxjs'],
  },

  // Ensure these deps are optimized and bundled correctly for SSR
  ssr: {
    optimizeDeps: {
      include: ['@sanity/client', 'rxjs'],
    },
    noExternal: ['@sanity/client', 'rxjs'],
  },

  plugins: [
    tailwindcss(),
    hydrogen(),
    oxygen(),
    reactRouter(),
    tsconfigPaths(),
  ],

  build: {
    // Disallow inlining assets as base64 for strict CSP
    assetsInlineLimit: 0,
  },
});
