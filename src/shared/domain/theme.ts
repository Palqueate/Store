export interface Theme {
  name: string
  vars: Record<string, string>
}

export const THEMES: Record<string, Theme> = {
  // Notas de accesibilidad: --muted-foreground y --subtle-foreground se eligen
  // para cumplir WCAG AA (≥4.5:1 sobre --background y --card). El "subtle" tenue
  // original fallaba el contraste en ambos temas; se oscureció/aclaró sin perder
  // la jerarquía visual respecto del "muted".
  palco: { name: 'Palco · noche', vars: { '--background': '#0E1116', '--card': '#171B22', '--muted': '#1F2530', '--border': 'rgba(255,255,255,.09)', '--foreground': '#F4EFE6', '--muted-foreground': '#AEB8C4', '--subtle-foreground': '#8A94A1', '--primary': '#C9A24B', '--primary-foreground': '#1A1407', '--success': '#34D17E', '--success-foreground': '#06120B', '--destructive': '#E5604D', '--warning': '#E5A94D' } },
  cancha: { name: 'Cancha · día', vars: { '--background': '#EEF0EC', '--card': '#FFFFFF', '--muted': '#F4F5F1', '--border': 'rgba(16,22,18,.12)', '--foreground': '#14181C', '--muted-foreground': '#4C555E', '--subtle-foreground': '#5E6A75', '--primary': '#0F7A43', '--primary-foreground': '#FFFFFF', '--success': '#0F7A43', '--success-foreground': '#FFFFFF', '--destructive': '#C8402B', '--warning': '#B07A1E' } },
}

export const THEME_ORDER = ['palco', 'cancha']
