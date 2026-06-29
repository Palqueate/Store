import type { ReactNode } from 'react'

interface ProgressRingProps {
  /** 0–100. */
  value?: number
  size?: number
  thickness?: number
  color?: string
  /** Center content — defaults to the percentage. */
  children?: ReactNode
}

/** Circular progress indicator with optional center label. */
export default function ProgressRing({ value = 0, size = 72, thickness = 7, color = 'var(--primary,#C9A24B)', children }: ProgressRingProps) {
  const pct = Math.max(0, Math.min(100, value))
  const r = (size - thickness) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)

  return (
    <div style={{ position: 'relative', width: size + 'px', height: size + 'px', display: 'inline-grid', placeItems: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted,#1F2530)" strokeWidth={thickness} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .4s cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <span style={{ position: 'absolute', fontFamily: 'Archivo', fontWeight: 800, fontSize: Math.round(size * 0.26) + 'px', color: 'var(--foreground,#F4EFE6)' }}>
        {children != null ? children : Math.round(pct) + '%'}
      </span>
    </div>
  )
}
