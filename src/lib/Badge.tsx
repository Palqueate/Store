import type { ReactNode } from 'react'

type BadgeTone = 'neutral' | 'brand' | 'success' | 'danger' | 'warn'

interface BadgeProps {
  children?: ReactNode
  tone?: BadgeTone
  /** Solid fill instead of the default soft tinted fill. */
  solid?: boolean
  /** Leading dot — handy for status badges (available / paused). */
  dot?: boolean
}

const TONES: Record<BadgeTone, { color: string; ink: string }> = {
  neutral: { color: 'var(--muted-foreground,#9AA6B2)', ink: 'var(--foreground,#F4EFE6)' },
  brand: { color: 'var(--primary,#C9A24B)', ink: 'var(--primary-foreground,#1A1407)' },
  success: { color: 'var(--success,#34D17E)', ink: 'var(--success-foreground,#06120B)' },
  danger: { color: 'var(--destructive,#E5604D)', ink: '#FFFFFF' },
  warn: { color: 'var(--warning,#E5A94D)', ink: '#1A1407' },
}

export default function Badge({ children, tone = 'neutral', solid = false, dot = false }: BadgeProps) {
  const t = TONES[tone] || TONES.neutral
  const bg = solid ? t.color : `color-mix(in srgb, ${t.color} 15%, transparent)`
  const fg = solid ? t.ink : t.color
  const border = solid ? 'none' : `1px solid color-mix(in srgb, ${t.color} 35%, transparent)`

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        height: '24px', padding: '0 10px', borderRadius: '100px',
        background: bg, border, color: fg,
        fontFamily: 'Archivo', fontWeight: 700, fontSize: '11.5px', letterSpacing: '.01em',
        whiteSpace: 'nowrap', lineHeight: 1,
      }}
    >
      {dot ? (
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: solid ? t.ink : t.color, flex: '0 0 auto' }} />
      ) : null}
      {children}
    </span>
  )
}
