import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { UploadPage } from './pages/UploadPage.tsx'
import { EditorPage } from './pages/EditorPage.tsx'
import { SettingsPage } from './pages/SettingsPage.tsx'

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
        <Routes>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/upload" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
