import type { ReactNode } from 'react'

type ResultStatus = 'success' | 'error' | 'info' | 'warning' | 'empty'

interface ResultProps {
  status: ResultStatus
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

const STATUS_CONFIG: Record<ResultStatus, { color: string; bg: string; glyph: ReactNode }> = {
  success: {
    color: 'var(--success,#34D17E)',
    bg: 'color-mix(in srgb, var(--success,#34D17E) 14%, transparent)',
    glyph: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    color: 'var(--destructive,#E5604D)',
    bg: 'color-mix(in srgb, var(--destructive,#E5604D) 14%, transparent)',
    glyph: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
  },
  info: {
    color: 'var(--primary,#C9A24B)',
    bg: 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)',
    glyph: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
  warning: {
    color: 'var(--warning,#F5A623)',
    bg: 'color-mix(in srgb, var(--warning,#F5A623) 14%, transparent)',
    glyph: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
  },
  empty: {
    color: 'var(--subtle-foreground,#6B7480)',
    bg: 'color-mix(in srgb, var(--subtle-foreground,#6B7480) 12%, transparent)',
    glyph: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7l9-4 9 4-9 4-9-4z" />
        <path d="M3 7v10l9 4 9-4V7M12 11v10" />
      </svg>
    ),
  },
}

/** Pantalla de resultado centrada: ícono circular, título, descripción y acciones. */
export default function Result({ status, title, description, actions }: ResultProps) {
  const cfg = STATUS_CONFIG[status]

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      textAlign: 'center', gap: '12px', padding: '48px 24px',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%',
        background: cfg.bg,
        border: `1.5px solid ${cfg.color}`,
        display: 'grid', placeItems: 'center',
        color: cfg.color,
        marginBottom: '4px',
      }}>
        {cfg.glyph}
      </div>
      <div style={{
        fontFamily: 'Archivo', fontWeight: 900, fontSize: '22px',
        letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)',
        lineHeight: 1.15,
      }}>
        {title}
      </div>
      {description && (
        <div style={{
          fontSize: '14px', lineHeight: 1.5,
          color: 'var(--muted-foreground,#9AA6B2)', maxWidth: '360px',
        }}>
          {description}
        </div>
      )}
      {actions && (
        <div style={{ marginTop: '8px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {actions}
        </div>
      )}
    </div>
  )
}
