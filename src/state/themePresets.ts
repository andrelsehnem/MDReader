export type ThemePreset = {
  id: string
  label: string
  category: 'claros' | 'escuros' | 'coloridos'
  background?: string
  text?: string
}

export const THEME_PRESETS: ThemePreset[] = [
  // ── Claros ──────────────────────────────────────────────────
  { id: 'default-original', label: 'Padrão',         category: 'claros' },
  { id: 'chalk-white',      label: 'Giz branco',      category: 'claros',    background: '#fafaf9', text: '#1c1917' },
  { id: 'warm-ivory',       label: 'Marfim quente',   category: 'claros',    background: '#fef9f0', text: '#2c1a0e' },
  { id: 'arctic-paper',     label: 'Papel ártico',    category: 'claros',    background: '#f0f4f8', text: '#0f2040' },
  { id: 'zinc-clean',       label: 'Zinco limpo',     category: 'claros',    background: '#f4f4f5', text: '#09090b' },
  { id: 'sage-paper',       label: 'Papel sálvia',    category: 'claros',    background: '#f2f5f0', text: '#1a2e1a' },
  { id: 'blue-sky',         label: 'Azul céu',        category: 'claros',    background: '#eff6ff', text: '#1e3a8a' },
  { id: 'purple-lavender',  label: 'Lavanda',         category: 'claros',    background: '#f5f3ff', text: '#4c1d95' },
  { id: 'amber-sand',       label: 'Âmbar areia',     category: 'claros',    background: '#fffbeb', text: '#78350f' },

  // ── Escuros ──────────────────────────────────────────────────
  { id: 'obsidian',         label: 'Obsidiana',       category: 'escuros',   background: '#0d0d0f', text: '#e8e6e3' },
  { id: 'midnight-navy',    label: 'Meia-noite',      category: 'escuros',   background: '#060d1f', text: '#c7d8f0' },
  { id: 'charcoal',         label: 'Carvão',          category: 'escuros',   background: '#18181b', text: '#fafafa' },
  { id: 'deep-plum',        label: 'Ameixa pura',     category: 'escuros',   background: '#130c1c', text: '#e9d8fd' },
  { id: 'forest-night',     label: 'Floresta',        category: 'escuros',   background: '#0b1a0f', text: '#c6efcc' },
  { id: 'amber-ember',      label: 'Brasa âmbar',     category: 'escuros',   background: '#1a0f00', text: '#fde68a' },
  { id: 'cool-slate',       label: 'Ardósia',         category: 'escuros',   background: '#0f172a', text: '#e2e8f0' },
  { id: 'deep-wine',        label: 'Vinho escuro',    category: 'escuros',   background: '#1a0008', text: '#ffd6e0' },

  // ── Coloridos ───────────────────────────────────────────────
  { id: 'sepia-paper',      label: 'Sépia',           category: 'coloridos', background: '#f8f1e3', text: '#4b3c2a' },
  { id: 'aqua-fog',         label: 'Névoa aqua',      category: 'coloridos', background: '#e8f4f8', text: '#0c3d52' },
  { id: 'blush-rose',       label: 'Blush rosé',      category: 'coloridos', background: '#fdf0f5', text: '#6b0f3a' },
  { id: 'matcha-green',     label: 'Chá matcha',      category: 'coloridos', background: '#edf5ec', text: '#1a3d1f' },
  { id: 'lavender-field',   label: 'Campo lavanda',   category: 'coloridos', background: '#f3f0ff', text: '#3b1d8a' },
  { id: 'sand-dune',        label: 'Duna dourada',    category: 'coloridos', background: '#fef3c7', text: '#6b2d00' },
  { id: 'rose-quartz',      label: 'Quartzo rosa',    category: 'coloridos', background: '#fff1f3', text: '#8b1a3c' },
  { id: 'copper-teal',      label: 'Azul-petróleo',   category: 'coloridos', background: '#e6f4f1', text: '#0d3b35' },
  { id: 'peach-mist',       label: 'Névoa pêssego',   category: 'coloridos', background: '#fff7f0', text: '#5c2800' },
  { id: 'ocean-blue',       label: 'Oceano',          category: 'coloridos', background: '#eaf3ff', text: '#102a43' },
]
