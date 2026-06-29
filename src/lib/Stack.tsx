import type { CSSProperties, ReactNode } from 'react'

interface StackProps {
  children?: ReactNode
  /** Main axis. 'col' (default) stacks vertically, 'row' horizontally. */
  direction?: 'row' | 'col'
  gap?: number
  align?: CSSProperties['alignItems']
  justify?: CSSProperties['justifyContent']
  wrap?: boolean
  style?: CSSProperties
}

/** Minimal flex layout primitive — the one knob every layout needs. */
export default function Stack({ children, direction = 'col', gap = 12, align, justify, wrap = false, style }: StackProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'row' ? 'row' : 'column',
        gap: gap + 'px',
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
