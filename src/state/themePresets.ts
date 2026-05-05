export type ThemePreset = {
  id: string
  label: string
  category: 'claros' | 'escuros' | 'coloridos'
  background?: string
  text?: string
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'default-original',
    label: 'Padrão original',
    category: 'claros',
  },
  {
    id: 'dark-night',
    label: 'Escuro noturno',
    category: 'escuros',
    background: '#111827',
    text: '#f9fafb',
  },
  {
    id: 'sepia-paper',
    label: 'Sépia papel',
    category: 'coloridos',
    background: '#f8f1e3',
    text: '#4b3c2a',
  },
  {
    id: 'ocean-blue',
    label: 'Azul oceano',
    category: 'coloridos',
    background: '#eaf3ff',
    text: '#102a43',
  },
  {
    id: 'mint-soft',
    label: 'Verde menta',
    category: 'coloridos',
    background: '#ecfdf5',
    text: '#14532d',
  },
  {
    id: 'green-forest',
    label: 'Verde floresta',
    category: 'escuros',
    background: '#052e16',
    text: '#dcfce7',
  },
  {
    id: 'pink-rose',
    label: 'Rosa suave',
    category: 'coloridos',
    background: '#fdf2f8',
    text: '#831843',
  },
  {
    id: 'pink-vibrant',
    label: 'Rosa vibrante',
    category: 'escuros',
    background: '#9d174d',
    text: '#fdf2f8',
  },
  {
    id: 'red-soft',
    label: 'Vermelho suave',
    category: 'coloridos',
    background: '#fef2f2',
    text: '#7f1d1d',
  },
  {
    id: 'red-wine',
    label: 'Vermelho vinho',
    category: 'escuros',
    background: '#450a0a',
    text: '#fee2e2',
  },
  {
    id: 'blue-sky',
    label: 'Azul céu',
    category: 'claros',
    background: '#eff6ff',
    text: '#1e3a8a',
  },
  {
    id: 'blue-deep',
    label: 'Azul profundo',
    category: 'escuros',
    background: '#0c1d4a',
    text: '#dbeafe',
  },
  {
    id: 'purple-lavender',
    label: 'Roxo lavanda',
    category: 'claros',
    background: '#f5f3ff',
    text: '#4c1d95',
  },
  {
    id: 'amber-sand',
    label: 'Âmbar areia',
    category: 'claros',
    background: '#fffbeb',
    text: '#78350f',
  },
  {
    id: 'slate-modern',
    label: 'Cinza moderno',
    category: 'claros',
    background: '#f8fafc',
    text: '#0f172a',
  },
]