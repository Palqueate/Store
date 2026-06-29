import type { ReactNode } from 'react'

interface TagProps {
  children?: ReactNode
  /** Shows an × button and fires onRemove. */
  onRemove?: () => void
}

/** Compact removable token — for active filters, selected items, etc. */
export default function Tag({ children, onRemove }: TagProps) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        height: '28px', padding: onRemove ? '0 6px 0 12px' : '0 12px', borderRadius: '8px',
        background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.1))',
        color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap',
      }}
    >
      {children}
      {onRemove ? (
        <button
          onClick={onRemove}
          aria-label="Quitar"
          style={{ display: 'grid', placeItems: 'center', width: '18px', height: '18px', padding: 0, borderRadius: '5px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ) : null}
    </span>
  )
}
