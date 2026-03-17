import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import vitePluginSingleSpa from 'vite-plugin-single-spa';

export default defineConfig({
  plugins: [
    vue(),
    vitePluginSingleSpa({
      type: 'mife',
      serverPort: 9081,              // Порт из .env root config-а: VITE_BASE
      spaEntryPoints: 'src/index.ts',
      cssStrategy: 'singleMife',
    }),
  ],
  server: {
    port: 9081,
    cors: true,
  },
  optimizeDeps: {
    entries: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});