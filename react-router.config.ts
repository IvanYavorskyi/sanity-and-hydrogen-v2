// react-router.config.ts
import type {Config} from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
  appDirectory: 'app',
  buildDirectory: 'dist',
  ssr: true,
  presets: [vercelPreset()],
} satisfies Config;
