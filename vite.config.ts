import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Solo publicamos la home (`/`). Sin fallback SPA: /signup, /privacy, etc. responden 404.
export default defineConfig({
  plugins: [react()],
  appType: 'mpa',
})
