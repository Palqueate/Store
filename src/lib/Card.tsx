import type { CSSProperties, ReactNode } from 'react'

interface CardProps {
  children?: ReactNode
  /** Adds the app's hover-lift gesture and a pointer cursor. */
  hover?: boolean
  /** Warms the border with the brand accent (selected / featured). */
  accent?: boolean
  /** Floats the card with the design system's soft elevation. */
  raised?: boolean
  padding?: string
  onClick?: () => void
  style?: CSSProperties
}

export default function Card({ children, hover = false, accent = false, raised = false, padding = '20px', onClick, style }: CardProps) {
  return (
    <div
      className={hover ? 'pq-lib-clickable' : undefined}
      onClick={onClick}
      style={{
        background: 'var(--card,#171B22)',
        border: '1px solid ' + (accent ? 'color-mix(in srgb, var(--primary,#C9A24B) 45%, var(--border,rgba(255,255,255,.1)))' : 'var(--border,rgba(255,255,255,.1))'),
        borderRadius: '16px',
        padding,
        boxShadow: raised ? '0 30px 70px -40px rgba(0,0,0,.7)' : 'none',
        cursor: onClick || hover ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
