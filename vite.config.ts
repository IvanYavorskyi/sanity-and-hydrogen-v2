import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    hydrogen(),
    remix({
      // ← use v3preset(), not preset()
      presets: [hydrogen.v3preset()],
      // your future flags here (opt-in to React Router 7 behaviors)
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_lazyRouteDiscovery: true,
        v3_routeConfig: true,
        v3_singleFetch: true,
      },
      ignoredRouteFiles: ['**/.*'],
    }),
    tsconfigPaths(),
  ],
  build: {assetsInlineLimit: 0},
  ssr: {optimizeDeps: {include: []}},
});
