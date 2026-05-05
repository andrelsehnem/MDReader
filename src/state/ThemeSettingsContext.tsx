import { useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { THEME_PRESETS, type ThemePreset } from './themePresets.ts'
import { ThemeSettingsContext } from './useThemeSettings.ts'

const STORAGE_KEY = 'mdreader-theme-preset'
const DEFAULT_PRESET_ID = THEME_PRESETS[0].id

const getInitialPresetId = () => {
  const cachedId = localStorage.getItem(STORAGE_KEY)
  if (!cachedId) return DEFAULT_PRESET_ID

  if (cachedId === 'light-classic') {
    return DEFAULT_PRESET_ID
  }

  const exists = THEME_PRESETS.some((preset) => preset.id === cachedId)
  return exists ? cachedId : DEFAULT_PRESET_ID
}

const applyPresetToCss = (preset: ThemePreset) => {
  const root = document.documentElement

  if (!preset.background || !preset.text) {
    root.style.removeProperty('--bg')
    root.style.removeProperty('--text')
    root.style.removeProperty('--text-h')
    return
  }

  root.style.setProperty('--bg', preset.background)
  root.style.setProperty('--text', preset.text)
  root.style.setProperty('--text-h', preset.text)
}

export function ThemeSettingsProvider({ children }: PropsWithChildren) {
  const [selectedPresetId, setSelectedPresetId] = useState(getInitialPresetId)

  useEffect(() => {
    const preset = THEME_PRESETS.find((current) => current.id === selectedPresetId) ?? THEME_PRESETS[0]
    applyPresetToCss(preset)
    localStorage.setItem(STORAGE_KEY, preset.id)
  }, [selectedPresetId])

  const value = useMemo(
    () => ({
      selectedPresetId,
      setSelectedPresetId,
      presets: THEME_PRESETS,
    }),
    [selectedPresetId],
  )

  return <ThemeSettingsContext.Provider value={value}>{children}</ThemeSettingsContext.Provider>
}
