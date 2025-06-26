import { vercelPreset } from '@vercel/react-router/vite';
import type { Config } from '@react-router/dev/config';

export default {
  // Tell Vercel you want full SSR
  ssr: true,
  // Hook into Vercel’s build+split logic
  presets: [vercelPreset()],
} satisfies Config;
