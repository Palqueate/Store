import type { ReactNode } from 'react'

/** Styled keyboard key — for shortcut hints. */
export default function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        minWidth: '22px', height: '22px', padding: '0 6px',
        borderRadius: '6px', background: 'var(--muted,#1F2530)',
        border: '1px solid var(--border,rgba(255,255,255,.14))',
        borderBottomWidth: '2px',
        fontFamily: "'Space Mono'", fontSize: '11px', fontWeight: 700,
        color: 'var(--muted-foreground,#9AA6B2)', lineHeight: 1,
      }}
    >
      {children}
    </kbd>
  )
}
