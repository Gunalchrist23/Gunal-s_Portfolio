import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 8080,
    strictPort: true, // fail if 8080 is already in use instead of auto-picking another port
  },
});
