import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { EditorProvider } from './state/EditorContext.tsx'
import { ThemeSettingsProvider } from './state/ThemeSettingsContext.tsx'
import { CookieConsentProvider } from './state/CookieConsentContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeSettingsProvider>
        <EditorProvider>
          <CookieConsentProvider>
            <App />
          </CookieConsentProvider>
        </EditorProvider>
      </ThemeSettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
