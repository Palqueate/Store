import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import FloatingPanel from './Floating'

interface PopoverProps {
  trigger: ReactNode
  children?: ReactNode
  align?: 'left' | 'right'
  width?: number
}

/** Click-triggered floating panel for rich content (filters, forms).
 *  Portals above everything — never clipped by the parent card. */
export default function Popover({ trigger, children, align = 'left', width = 260 }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)

  return (
    <>
      <span ref={anchorRef} onClick={() => setOpen((v) => !v)} style={{ display: 'inline-flex', cursor: 'pointer' }}>{trigger}</span>
      <FloatingPanel open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} placement={align === 'right' ? 'bottom-end' : 'bottom-start'}>
        <div
          className="pq-lib-pop"
          style={{
            width: width + 'px', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '14px', padding: '16px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
            color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14px',
          }}
        >
          {children}
        </div>
      </FloatingPanel>
    </>
  )
}
