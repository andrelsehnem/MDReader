import { createContext, useContext } from 'react'
import type { ThemePreset } from './themePresets.ts'

export type ThemeSettingsContextValue = {
  selectedPresetId: string
  setSelectedPresetId: (presetId: string) => void
  presets: ThemePreset[]
}

export const ThemeSettingsContext = createContext<ThemeSettingsContextValue | null>(null)

export function useThemeSettings() {
  const context = useContext(ThemeSettingsContext)

  if (!context) {
    throw new Error('useThemeSettings must be used within ThemeSettingsProvider')
  }

  return context
}