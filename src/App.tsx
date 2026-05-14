import { lazy, Suspense } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { AdsterraRouteLoader } from './components/AdsterraRouteLoader.tsx'
import { Analytics } from '@vercel/analytics/react'
import { useCookieConsent } from './state/useCookieConsent.ts'
import { CookieConsentBanner } from './components/CookieConsentBanner.tsx'

const LandingPage = lazy(() => import('./pages/LandingPage.tsx').then((module) => ({ default: module.LandingPage })))
const UploadPage = lazy(() => import('./pages/UploadPage.tsx').then((module) => ({ default: module.UploadPage })))
const EditorPage = lazy(() => import('./pages/EditorPage.tsx').then((module) => ({ default: module.EditorPage })))
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage.tsx').then((module) => ({ default: module.SettingsPage })),
)
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage.tsx').then((module) => ({ default: module.PrivacyPolicyPage })),
)

function App() {
  const { hasTrackingConsent } = useCookieConsent()

  return (
    <div className="app-shell">
      {hasTrackingConsent ? <AdsterraRouteLoader /> : null}
      <header className="app-header">
        <NavLink to="/" className="app-logo" aria-label="Início">MD<em>reader</em></NavLink>
        <nav className="main-nav" aria-label="Navegação principal">
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
            Upload
          </NavLink>
          <NavLink to="/editor" className={({ isActive }) => (isActive ? 'active' : '')}>
            Editor
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? 'active' : '')}>
            Configurações
          </NavLink>
        </nav>
      </header>

      <main className="app-content">
        <Suspense fallback={<p>Carregando página…</p>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/privacidade" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <CookieConsentBanner />
      {hasTrackingConsent ? <Analytics /> : null}
    </div>
  )
}

export default App
