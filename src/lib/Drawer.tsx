import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface DrawerProps {
  open?: boolean
  title?: string
  children?: ReactNode
  footer?: ReactNode
  side?: 'right' | 'left'
  width?: number
  onClose?: () => void
}

/** Slide-over panel — filters, carts, detail side-sheets. */
export default function Drawer({ open = false, title, children, footer, side = 'right', width = 380, onClose }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'color-mix(in srgb, #000 55%, transparent)', animation: 'pq-lib-fade-in .15s ease both' }}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, bottom: 0, [side]: 0,
          width: '100%', maxWidth: width + 'px',
          display: 'flex', flexDirection: 'column',
          background: 'var(--card,#171B22)',
          [side === 'right' ? 'borderLeft' : 'borderRight']: '1px solid var(--border,rgba(255,255,255,.12))',
          boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          animation: `pq-lib-drawer-${side} .22s cubic-bezier(.2,.8,.2,1) both`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', padding: '18px 20px', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))', flex: '0 0 auto' }}>
          <h3 style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.02em', fontSize: '18px', color: 'var(--foreground,#F4EFE6)' }}>{title}</h3>
          <button onClick={onClose} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', padding: '2px', lineHeight: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '20px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14.5px', lineHeight: 1.5 }}>{children}</div>
        {footer ? <div style={{ flex: '0 0 auto', display: 'flex', gap: '10px', justifyContent: 'flex-end', padding: '16px 20px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>{footer}</div> : null}
      </div>
    </div>
  )
}
