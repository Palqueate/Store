import type { ReactNode } from 'react'

interface EmptyStateProps {
  title?: string
  description?: string
  /** Optional SVG path(s) for the glyph — drawn with currentColor stroke. */
  icon?: ReactNode
  /** Optional action slot (e.g. a Btn). */
  action?: ReactNode
}

export default function EmptyState({ title = 'Nada por aquí', description, icon, action }: EmptyStateProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px', padding: '48px 24px' }}>
      <span
        style={{
          width: '64px', height: '64px', borderRadius: '18px', marginBottom: '8px',
          display: 'grid', placeItems: 'center',
          background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.1))',
          color: 'var(--subtle-foreground,#6B7480)',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          {icon || <><path d="M3 7l9-4 9 4-9 4-9-4z" /><path d="M3 7v10l9 4 9-4V7M12 11v10" /></>}
        </svg>
      </span>
      <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{title}</div>
      {description ? <div style={{ fontSize: '14px', color: 'var(--muted-foreground,#9AA6B2)', maxWidth: '320px', lineHeight: 1.45 }}>{description}</div> : null}
      {action ? <div style={{ marginTop: '12px' }}>{action}</div> : null}
    </div>
  )
}
