import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/users': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false
      },
      '/auth/login': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        secure: false
      }
    }
  }
})