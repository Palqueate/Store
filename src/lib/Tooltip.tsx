import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import FloatingPanel, { type Placement } from './Floating'

type Side = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  label: string
  children: ReactNode
  side?: Side
  /** When true, shows a pointer (pico) on the tooltip aimed at the anchor. */
  arrow?: boolean
  /** Distance in px between the anchor and the tooltip. */
  gap?: number
}

const PLACEMENT: Record<Side, Placement> = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
}

// A small bordered diamond clipped against the bubble edge → a pointer.
const ARROW: Record<Side, CSSProperties> = {
  top: { bottom: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderRight: '1px solid var(--border,rgba(255,255,255,.14))', borderBottom: '1px solid var(--border,rgba(255,255,255,.14))' },
  bottom: { top: '-4px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', borderLeft: '1px solid var(--border,rgba(255,255,255,.14))', borderTop: '1px solid var(--border,rgba(255,255,255,.14))' },
  left: { right: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderTop: '1px solid var(--border,rgba(255,255,255,.14))', borderRight: '1px solid var(--border,rgba(255,255,255,.14))' },
  right: { left: '-4px', top: '50%', transform: 'translateY(-50%) rotate(45deg)', borderLeft: '1px solid var(--border,rgba(255,255,255,.14))', borderBottom: '1px solid var(--border,rgba(255,255,255,.14))' },
}

/** Hover/focus tooltip. Portals above everything (pass-through, no backdrop).
 *  Set `arrow` to show a pico pointing at the referenced element. */
export default function Tooltip({ label, children, side = 'top', arrow = false, gap = 8 }: TooltipProps) {
  const [show, setShow] = useState(false)
  const anchorRef = useRef<HTMLSpanElement>(null)

  return (
    <>
      <span
        ref={anchorRef}
        style={{ display: 'inline-flex' }}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
      >
        {children}
      </span>
      <FloatingPanel open={show} anchorRef={anchorRef} placement={PLACEMENT[side]} gap={gap} backdrop={false} interactive={false} closeOnEscape={false}>
        <span
          role="tooltip"
          className="pq-lib-tip"
          style={{
            position: 'relative', display: 'inline-block', whiteSpace: 'nowrap',
            padding: '6px 10px', borderRadius: '8px',
            background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.14))',
            color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '12.5px',
            boxShadow: '0 8px 20px -6px rgba(0,0,0,.55)',
          }}
        >
          {label}
          {arrow ? (
            <span style={{ position: 'absolute', width: '8px', height: '8px', background: 'var(--muted,#1F2530)', ...ARROW[side] }} />
          ) : null}
        </span>
      </FloatingPanel>
    </>
  )
}
