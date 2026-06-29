import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  open?: boolean
  title?: string
  children?: ReactNode
  /** Footer slot — typically the action buttons. */
  footer?: ReactNode
  width?: number
  onClose?: () => void
}

export default function Modal({ open = false, title, children, footer, width = 480, onClose }: ModalProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'grid', placeItems: 'center', padding: '20px',
        background: 'color-mix(in srgb, #000 62%, transparent)',
        backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
        animation: 'pq-lib-fade-in .15s ease both',
      }}
    >
      <div
        className="pq-lib-pop"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: width + 'px', maxHeight: '90vh', overflow: 'auto',
          background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))',
          borderRadius: '18px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
        }}
      >
        {title ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 20px', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))' }}>
            <h3 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.02em', fontSize: '19px', color: 'var(--foreground,#F4EFE6)' }}>{title}</h3>
            <button onClick={onClose} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', padding: '2px', lineHeight: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        ) : null}
        <div style={{ padding: '20px', fontSize: '14.5px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>{children}</div>
        {footer ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px 20px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
