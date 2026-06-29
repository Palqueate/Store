import { useState } from 'react'
import type { ReactNode } from 'react'

interface CollapsibleProps {
  title: ReactNode
  children?: ReactNode
  defaultOpen?: boolean
}

/** Single show/hide region — lighter than Accordion for one-off toggles. */
export default function Collapsible({ title, children, defaultOpen = false }: CollapsibleProps) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0', textAlign: 'left',
          fontFamily: 'Archivo', fontWeight: 700, fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .18s ease' }}>
          <path d="M9 6l6 6-6 6" />
        </svg>
        {title}
      </button>
      {open ? <div style={{ padding: '4px 0 10px 24px', fontSize: '13.5px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)', animation: 'pq-lib-fade-in .16s ease both' }}>{children}</div> : null}
    </div>
  )
}
