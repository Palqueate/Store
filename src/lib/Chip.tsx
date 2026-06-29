import type { ReactNode } from 'react'

interface ChipProps {
  children?: ReactNode
  /** Selected state — fills with the brand accent, like the app's filter chips. */
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}

export default function Chip({ children, active = false, disabled = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className="pq-lib-chip"
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '7px',
        height: '34px', padding: '0 14px', borderRadius: '9px',
        background: active ? 'color-mix(in srgb, var(--primary,#C9A24B) 16%, var(--background,#0E1116))' : 'var(--card,#171B22)',
        border: '1px solid ' + (active ? 'color-mix(in srgb, var(--primary,#C9A24B) 55%, transparent)' : 'var(--border,rgba(255,255,255,.1))'),
        color: active ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
        fontFamily: 'Archivo', fontWeight: 600, fontSize: '13.5px',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}
