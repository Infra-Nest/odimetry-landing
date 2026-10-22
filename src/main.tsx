import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/manrope/wght.css'
import '@fontsource-variable/sora/wght.css'
import './index.css'
import { initI18n } from './i18n/config'
import App from './App.tsx'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

void initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
