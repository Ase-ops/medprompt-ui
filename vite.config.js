import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
  proxy: {
    '/analyze': 'https://medprompt-backend.onrender.com',
    '/feedback': 'https://medprompt-backend.onrender.com'
  }
}
