import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(import.meta.dirname, 'src'),
      '@api': resolve(import.meta.dirname, 'src/api'),
      '@assets': resolve(import.meta.dirname, 'src/assets'),
      '@components': resolve(import.meta.dirname, 'src/components'),
      '@context': resolve(import.meta.dirname, 'src/context'),
      '@hooks': resolve(import.meta.dirname, 'src/hooks'),
      '@pages': resolve(import.meta.dirname, 'src/pages'),
      '@routes': resolve(import.meta.dirname, 'src/routes'),
      '@services': resolve(import.meta.dirname, 'src/services'),
      '@styles': resolve(import.meta.dirname, 'src/styles'),
      '@types': resolve(import.meta.dirname, 'src/types'),
      '@utils': resolve(import.meta.dirname, 'src/utils'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
  },
  build: {
    target: 'es2020',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom')) return 'vendor'
          if (id.includes('node_modules/react-router')) return 'vendor'
          if (id.includes('node_modules/react') && !id.includes('react-dom')) return 'vendor'
          if (id.includes('node_modules/@tanstack')) return 'query'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) return 'ui'
        },
      },
    },
  },
})
