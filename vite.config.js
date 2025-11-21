import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/analyze': 'https://medprompt-backend.onrender.com',  // Replace with your actual Render backend URL
      '/feedback': 'https://medprompt-backend.onrender.com'
    }
  },
  build: {
    rollupOptions: {
      external: ['tslib']
    }
  }
})
