import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { oxygen }   from '@shopify/mini-oxygen/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),  // wires up Hydrogen’s SSR/react-router integrations
    oxygen(),    // tells Vite where your server entry is (no index.html needed)
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: { include: [] },
  },
});
