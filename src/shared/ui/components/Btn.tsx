import type { CSSProperties, ReactNode } from 'react'

type IconName = 'none' | 'arrow' | 'back' | 'plus' | 'cart' | 'calendar' | 'search' | 'logout' | 'check'

interface BtnProps {
  label?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  /** Built-in icon set (kept for back-compat). Prefer leadingIcon/trailingIcon. */
  icon?: IconName
  /** Any custom node (e.g. a Heroicon) rendered before the label. Wins over `icon`. */
  leadingIcon?: ReactNode
  /** Any custom node rendered after the label. Wins over `icon`. */
  trailingIcon?: ReactNode
  block?: boolean
  disabled?: boolean
  /** Square icon-only button when no label is given. */
  onClick?: () => void
}

const SIZES: Record<string, { h: string; px: string; fs: string; r: string; isz: string }> = {
  sm: { h: '38px', px: '16px', fs: '13px', r: '10px', isz: '15' },
  md: { h: '46px', px: '20px', fs: '15px', r: '12px', isz: '16' },
  lg: { h: '52px', px: '26px', fs: '16px', r: '13px', isz: '18' },
}

function Icon({ name, sz }: { name: Exclude<IconName, 'none'>; sz: string }) {
  const common = { width: sz, height: sz, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (name) {
    case 'back': return <svg {...common} strokeWidth={2.5}><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
    case 'plus': return <svg {...common} strokeWidth={2.6}><path d="M12 5v14M5 12h14" /></svg>
    case 'cart': return <svg {...common} strokeWidth={2.4}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
    case 'calendar': return <svg {...common} strokeWidth={2.2}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
    case 'search': return <svg {...common} strokeWidth={2.5}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
    case 'logout': return <svg {...common} strokeWidth={2}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>
    case 'check': return <svg {...common} strokeWidth={2.6}><path d="M20 6L9 17l-5-5" /></svg>
    case 'arrow': return <svg {...common} strokeWidth={2.5}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  }
}

export default function Btn({ label = '', variant = 'primary', size = 'md', icon = 'none', leadingIcon, trailingIcon, block = false, disabled = false, onClick }: BtnProps) {
  const sz = SIZES[size] || SIZES.md
  let bg: string, col: string, border: string
  if (variant === 'secondary') { bg = 'transparent'; col = 'var(--foreground,#F4EFE6)'; border = '1px solid var(--border,rgba(255,255,255,.16))' }
  else if (variant === 'ghost') { bg = 'transparent'; col = 'var(--muted-foreground,#9AA6B2)'; border = 'none' }
  else if (variant === 'danger') { bg = 'transparent'; col = 'var(--destructive,#E5604D)'; border = '1px solid color-mix(in srgb,var(--destructive,#E5604D) 40%, transparent)' }
  else { bg = 'var(--primary,#C9A24B)'; col = 'var(--primary-foreground,#1A1407)'; border = 'none' }

  const style: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '9px',
    height: sz.h, padding: '0 ' + sz.px, borderRadius: sz.r, border, background: bg, color: col,
    fontFamily: 'Archivo', fontWeight: 800, fontSize: sz.fs, whiteSpace: 'nowrap', cursor: disabled ? 'not-allowed' : 'pointer',
    width: block ? '100%' : 'auto', opacity: disabled ? 0.6 : 1,
  }

  // Custom nodes win; otherwise fall back to the built-in enum behaviour.
  const lead = leadingIcon != null
    ? <span className="pq-ico" style={{ width: sz.isz + 'px', height: sz.isz + 'px' }}>{leadingIcon}</span>
    : (icon !== 'none' && icon !== 'arrow' ? <Icon name={icon as Exclude<IconName, 'none'>} sz={sz.isz} /> : null)
  const trail = trailingIcon != null
    ? <span className="pq-ico" style={{ width: sz.isz + 'px', height: sz.isz + 'px' }}>{trailingIcon}</span>
    : (icon === 'arrow' ? <Icon name="arrow" sz={sz.isz} /> : null)

  return (
    <button onClick={onClick} disabled={disabled} style={style}>
      {lead}
      {label ? <span>{label}</span> : null}
      {trail}
    </button>
  )
}
