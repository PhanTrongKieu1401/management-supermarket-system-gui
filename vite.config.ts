// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/management-supermarket-system-gui/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['Breadcrumb'].includes(tag),
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    global: {},
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://test-payment.momo.vn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 3000 // Đặt giới hạn lớn hơn 500kB
  }
});
