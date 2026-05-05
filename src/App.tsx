import { lazy, Suspense } from 'react'
import { NavLink, Navigate, Route, Routes } from 'react-router-dom'

const UploadPage = lazy(() => import('./pages/UploadPage.tsx').then((module) => ({ default: module.UploadPage })))
const EditorPage = lazy(() => import('./pages/EditorPage.tsx').then((module) => ({ default: module.EditorPage })))
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage.tsx').then((module) => ({ default: module.SettingsPage })),
)

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>MD Reader & Editor</h1>
        <nav className="main-nav" aria-label="Navegação principal">
          <NavLink to="/upload" className={({ isActive }) => (isActive ? 'active' : '')}>
            Upload e visualização
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
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/editor" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
