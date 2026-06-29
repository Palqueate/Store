import type { ReactNode } from 'react'

interface TopbarProps {
  title?: ReactNode
  /** Slot before the title — back button, menu toggle, logo. */
  left?: ReactNode
  /** Slot at the far right — actions, theme toggle, avatar. */
  right?: ReactNode
  /** Center slot (e.g. a search field). */
  children?: ReactNode
  sticky?: boolean
}

/** App top bar. Sits above content, carries title + actions. */
export default function Topbar({ title, left, right, children, sticky = true }: TopbarProps) {
  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'static', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: '16px',
        height: '60px', padding: '0 20px',
        background: 'color-mix(in srgb, var(--card,#171B22) 88%, transparent)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border,rgba(255,255,255,.1))',
      }}
    >
      {left}
      {title ? (
        <div style={{ fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.02em', fontSize: '17px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>{title}</div>
      ) : null}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'center' }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '0 0 auto' }}>{right}</div>
    </header>
  )
}
