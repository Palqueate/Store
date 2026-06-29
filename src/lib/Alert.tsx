import type { ReactNode } from 'react'

type AlertTone = 'info' | 'success' | 'danger' | 'warn'

interface AlertProps {
  children?: ReactNode
  title?: string
  tone?: AlertTone
  onClose?: () => void
}

const TONES: Record<AlertTone, string> = {
  info: 'var(--primary,#C9A24B)',
  success: 'var(--success,#34D17E)',
  danger: 'var(--destructive,#E5604D)',
  warn: 'var(--warning,#E5A94D)',
}

const ICONS: Record<AlertTone, ReactNode> = {
  info: <path d="M12 16v-4M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z" />,
  success: <path d="M20 6L9 17l-5-5" />,
  danger: <path d="M12 8v4M12 16h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  warn: <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
}

export default function Alert({ children, title, tone = 'info', onClose }: AlertProps) {
  const color = TONES[tone] || TONES.info
  return (
    <div
      role="alert"
      style={{
        display: 'flex', gap: '12px', alignItems: 'flex-start',
        padding: '14px 16px', borderRadius: '14px',
        background: `color-mix(in srgb, ${color} 12%, var(--card,#171B22))`,
        border: `1px solid color-mix(in srgb, ${color} 38%, transparent)`,
      }}
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: '1px' }}>
        {ICONS[tone]}
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title ? <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)', marginBottom: children ? '3px' : 0 }}>{title}</div> : null}
        {children ? <div style={{ fontSize: '13.5px', lineHeight: 1.45, color: 'var(--muted-foreground,#9AA6B2)' }}>{children}</div> : null}
      </div>
      {onClose ? (
        <button onClick={onClose} aria-label="Cerrar" style={{ flex: '0 0 auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', padding: '2px', lineHeight: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ) : null}
    </div>
  )
}
