import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Whenever frontend requests /api, Vite proxies it to localhost:3000
      '/api': {
        target: 'https://interview-report-generator-and-analyzer.onrender.com',
        changeOrigin: true,
      }
    }
  }
})