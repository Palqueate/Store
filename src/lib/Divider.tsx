import type { ReactNode } from 'react'

interface DividerProps {
  /** Optional centered label (e.g. "o"). Horizontal only. */
  children?: ReactNode
  vertical?: boolean
  /** Dashed line — matches the app's ticket-stub separators. */
  dashed?: boolean
}

export default function Divider({ children, vertical = false, dashed = false }: DividerProps) {
  const lineStyle = (dashed ? 'dashed' : 'solid') + ' var(--border,rgba(255,255,255,.1))'

  if (vertical) {
    return <span style={{ alignSelf: 'stretch', width: '1px', borderLeft: '1px ' + lineStyle, margin: '0 2px' }} />
  }

  if (children) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', width: '100%' }}>
        <span style={{ flex: 1, height: 0, borderTop: '1px ' + lineStyle }} />
        <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--subtle-foreground,#6B7480)' }}>{children}</span>
        <span style={{ flex: 1, height: 0, borderTop: '1px ' + lineStyle }} />
      </div>
    )
  }

  return <div style={{ width: '100%', height: 0, borderTop: '1px ' + lineStyle }} />
}
