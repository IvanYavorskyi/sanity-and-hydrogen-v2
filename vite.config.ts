import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import {reactRouter} from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(), // wires up Hydrogen’s SSR/react-router integrations
    oxygen(), // tells Vite where your server entry is (no index.html needed)
    tsconfigPaths(),
    reactRouter(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {include: []},
  },
});
