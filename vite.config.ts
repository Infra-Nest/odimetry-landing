import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { localeHtmlPlugin } from './vite.locale-html'

// Solo publicamos la home y las variantes de idioma. Sin fallback SPA:
// /signup, /privacy, etc. responden 404.
export default defineConfig({
  plugins: [react(), localeHtmlPlugin()],
  appType: 'mpa',
})
