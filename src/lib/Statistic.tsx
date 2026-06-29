import { useEffect, useRef, useState } from 'react'

interface Trend {
  value: number
  direction: 'up' | 'down'
}

interface StatisticProps {
  label: string
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  countUp?: boolean
  trend?: Trend
}

function ArrowUp() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}

/** Métrica grande con animación count-up opcional y tendencia coloreada. */
export default function Statistic({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  countUp = false,
  trend,
}: StatisticProps) {
  const [displayed, setDisplayed] = useState(countUp ? 0 : value)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const duration = 1000

  useEffect(() => {
    if (!countUp) {
      setDisplayed(value)
      return
    }
    startRef.current = null
    const from = 0
    const to = value

    function tick(ts: number) {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(from + (to - from) * eased)
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayed(to)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current) }
  }, [value, countUp])

  const formatted = displayed.toFixed(decimals)
  const trendColor = trend?.direction === 'up' ? 'var(--success,#34D17E)' : 'var(--destructive,#E5604D)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em',
        textTransform: 'uppercase', color: 'var(--subtle-foreground,#6B7480)',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        {prefix && (
          <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '20px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            {prefix}
          </span>
        )}
        <span style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '40px', letterSpacing: '-.03em', color: 'var(--foreground,#F4EFE6)', lineHeight: 1 }}>
          {formatted}
        </span>
        {suffix && (
          <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '20px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            {suffix}
          </span>
        )}
      </div>
      {trend && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          color: trendColor,
          fontFamily: "'Space Mono'", fontSize: '11px', fontWeight: 700,
        }}>
          <span className="pq-ico" style={{ width: '13px', height: '13px' }}>
            {trend.direction === 'up' ? <ArrowUp /> : <ArrowDown />}
          </span>
          {Math.abs(trend.value).toFixed(1)}%
        </div>
      )}
    </div>
  )
}
