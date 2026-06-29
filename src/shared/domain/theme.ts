export interface Theme {
  name: string
  vars: Record<string, string>
}

export const THEMES: Record<string, Theme> = {
  palco: { name: 'Palco · noche', vars: { '--background': '#0E1116', '--card': '#171B22', '--muted': '#1F2530', '--border': 'rgba(255,255,255,.09)', '--foreground': '#F4EFE6', '--muted-foreground': '#9AA6B2', '--subtle-foreground': '#6B7480', '--primary': '#C9A24B', '--primary-foreground': '#1A1407', '--success': '#34D17E', '--success-foreground': '#06120B', '--destructive': '#E5604D', '--warning': '#E5A94D' } },
  cancha: { name: 'Cancha · día', vars: { '--background': '#EEF0EC', '--card': '#FFFFFF', '--muted': '#F4F5F1', '--border': 'rgba(16,22,18,.12)', '--foreground': '#14181C', '--muted-foreground': '#566069', '--subtle-foreground': '#8B949C', '--primary': '#0F7A43', '--primary-foreground': '#FFFFFF', '--success': '#0F7A43', '--success-foreground': '#FFFFFF', '--destructive': '#C8402B', '--warning': '#B07A1E' } },
}

export const THEME_ORDER = ['palco', 'cancha']
