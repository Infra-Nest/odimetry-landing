import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import "./index.css"
import './i18n/config'
import App from "./App.tsx"
import { AuthProvider } from './context/AuthContext'
import { initializeAppSettings } from './utils/appSettings'

// Deshabilitar la restauración automática de scroll de React Router
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

initializeAppSettings();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
