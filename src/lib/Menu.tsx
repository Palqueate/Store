import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import FloatingPanel from './Floating'

interface MenuItem {
  key: string
  label: string
  icon?: ReactNode
  danger?: boolean
  onClick?: () => void
}

interface MenuProps {
  /** The clickable that opens the menu. */
  trigger: ReactNode
  items?: MenuItem[]
  align?: 'left' | 'right'
}

/** Dropdown action menu. Closes on outside click or item select. */
export default function Menu({ trigger, items = [], align = 'left' }: MenuProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)

  return (
    <>
      <span ref={anchorRef} onClick={() => setOpen((v) => !v)} style={{ display: 'inline-flex', cursor: 'pointer' }}>{trigger}</span>
      <FloatingPanel open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} placement={align === 'right' ? 'bottom-end' : 'bottom-start'} gap={6}>
        <div
          role="menu"
          className="pq-lib-tip"
          style={{
            minWidth: '180px',
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          }}
        >
          {items.map((it) => (
            <button
              key={it.key}
              role="menuitem"
              onClick={() => { it.onClick?.(); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 10px', borderRadius: '8px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px',
                color: it.danger ? 'var(--destructive,#E5604D)' : 'var(--foreground,#F4EFE6)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted,#1F2530)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {it.icon ? <span style={{ display: 'inline-flex', flex: '0 0 auto' }}>{it.icon}</span> : null}
              {it.label}
            </button>
          ))}
        </div>
      </FloatingPanel>
    </>
  )
}
