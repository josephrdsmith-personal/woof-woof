import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: true, // Expose to all network interfaces
    port: 5173,
    strictPort: true, // Fail if port is in use
  },
});
