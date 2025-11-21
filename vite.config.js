import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ONLY for local development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/analyze': 'https://medprompt-backend.onrender.com',
    }
  }
})
