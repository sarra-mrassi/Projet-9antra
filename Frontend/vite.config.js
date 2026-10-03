import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/images': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/reservations': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/services': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/api/services': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/avis': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/admin': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
})
