interface ProgressProps {
  /** 0–100. Clamped. */
  value?: number
  /** Bar colour — defaults to the brand accent. */
  color?: string
  height?: number
  /** Show the numeric percentage to the right. */
  showLabel?: boolean
}

export default function Progress({ value = 0, color = 'var(--primary,#C9A24B)', height = 8, showLabel = false }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ flex: 1, height: height + 'px', borderRadius: '100px', background: 'var(--muted,#1F2530)', overflow: 'hidden' }}
      >
        <div style={{ width: pct + '%', height: '100%', borderRadius: '100px', background: color, transition: 'width .35s cubic-bezier(.2,.8,.2,1)' }} />
      </div>
      {showLabel ? (
        <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)', minWidth: '38px', textAlign: 'right' }}>{Math.round(pct)}%</span>
      ) : null}
    </div>
  )
}
