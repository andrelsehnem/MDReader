import { useThemeSettings } from '../state/useThemeSettings.ts'

const CATEGORY_ORDER = ['claros', 'escuros', 'coloridos'] as const

const CATEGORY_LABELS: Record<(typeof CATEGORY_ORDER)[number], string> = {
  claros: 'Claros',
  escuros: 'Escuros',
  coloridos: 'Coloridos',
}

export function SettingsPage() {
  const { presets, selectedPresetId, setSelectedPresetId } = useThemeSettings()

  const groupedPresets = CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: presets.filter((preset) => preset.category === category),
  })).filter((group) => group.items.length > 0)

  return (
    <section className="page settings-page">
      <h2>Configurações</h2>
      <p className="page-subtitle">Escolha uma combinação de cores para personalizar a experiência de leitura.</p>

      {groupedPresets.map((group) => (
        <section key={group.category} className="settings-group">
          <h3>{group.label}</h3>
          <div className="settings-grid" role="radiogroup" aria-label={`Temas ${group.label.toLowerCase()}`}>
            {group.items.map((preset) => {
              const isActive = preset.id === selectedPresetId

              return (
                <button
                  key={preset.id}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  className={`theme-card${isActive ? ' active' : ''}`}
                  onClick={() => setSelectedPresetId(preset.id)}
                >
                  <span className="theme-name">{preset.label}</span>
                  <span
                    className="theme-preview"
                    style={{
                      backgroundColor: preset.background ?? 'var(--bg)',
                      color: preset.text ?? 'var(--text-h)',
                    }}
                  >
                    Aa
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </section>
  )
}