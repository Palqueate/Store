import { useRef, useState } from 'react'
import { MONTHS_ES, WEEKDAYS_ES, monthMatrix, sameDay, formatDMY } from './Calendar'
import FloatingPanel from './Floating'

// ── types ─────────────────────────────────────────────────────────────────────

export interface DateRangeValue {
  start: Date | null
  end: Date | null
}

interface DateRangeProps {
  value?: DateRangeValue
  onChange: (r: DateRangeValue) => void
  label?: string
  min?: Date
  max?: Date
  disabled?: boolean
}

// ── icons ──────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

function ChevLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

// ── range grid ────────────────────────────────────────────────────────────────

interface RangeGridProps {
  start: Date | null
  end: Date | null
  hover: Date | null
  onDay: (d: Date) => void
  onHover: (d: Date | null) => void
  min?: Date
  max?: Date
}

function RangeGrid({ start, end, hover, onDay, onHover, min, max }: RangeGridProps) {
  const today = new Date()
  const seed = start ?? new Date()
  const [viewYear, setViewYear] = useState(seed.getFullYear())
  const [viewMonth, setViewMonth] = useState(seed.getMonth())

  const grid = monthMatrix(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function isDisabled(d: Date): boolean {
    if (min && d < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true
    if (max && d > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true
    return false
  }

  function inRange(d: Date): boolean {
    if (!start) return false
    // When only start is chosen and user is hovering, preview the range
    const effectiveEnd = end ?? hover
    if (!effectiveEnd) return false
    const lo = start <= effectiveEnd ? start : effectiveEnd
    const hi = start <= effectiveEnd ? effectiveEnd : start
    const dn = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const ln = new Date(lo.getFullYear(), lo.getMonth(), lo.getDate())
    const hn = new Date(hi.getFullYear(), hi.getMonth(), hi.getDate())
    return dn > ln && dn < hn
  }

  function isEndpoint(d: Date): boolean {
    if (start && sameDay(d, start)) return true
    if (end && sameDay(d, end)) return true
    return false
  }

  return (
    <div style={{ fontFamily: 'Archivo', userSelect: 'none', width: '100%' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button
          onClick={prevMonth}
          aria-label="Mes anterior"
          style={{ display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--muted-foreground,#9AA6B2)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted,#1F2530)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ChevLeft />
        </button>
        <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.06em', color: 'var(--foreground,#F4EFE6)', textTransform: 'uppercase' }}>
          {MONTHS_ES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          aria-label="Mes siguiente"
          style={{ display: 'grid', placeItems: 'center', width: '30px', height: '30px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--muted-foreground,#9AA6B2)', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted,#1F2530)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          <ChevRight />
        </button>
      </div>

      {/* weekday row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
        {WEEKDAYS_ES.map((wd) => (
          <div key={wd} style={{ textAlign: 'center', fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', padding: '2px 0 6px' }}>
            {wd}
          </div>
        ))}
      </div>

      {/* day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {grid.map((d, i) => {
          const inMonth = d.getMonth() === viewMonth
          const isToday = sameDay(d, today)
          const endpoint = isEndpoint(d)
          const inRng = inRange(d)
          const disabled = isDisabled(d)

          return (
            <button
              key={i}
              onClick={() => !disabled && onDay(d)}
              onMouseEnter={() => !disabled && onHover(d)}
              onMouseLeave={() => onHover(null)}
              disabled={disabled}
              aria-label={formatDMY(d)}
              style={{
                height: '34px', borderRadius: '8px',
                border: isToday && !endpoint ? '1.5px solid var(--primary,#C9A24B)' : '1.5px solid transparent',
                background: endpoint
                  ? 'var(--primary,#C9A24B)'
                  : inRng
                    ? 'color-mix(in srgb, var(--primary,#C9A24B) 18%, transparent)'
                    : 'transparent',
                color: endpoint ? 'var(--primary-foreground,#0E1116)' : inMonth ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
                fontFamily: 'Archivo', fontWeight: endpoint ? 700 : inMonth ? 500 : 400, fontSize: '13px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.35 : 1,
                transition: 'background .1s ease',
              }}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── component ─────────────────────────────────────────────────────────────────

export default function DateRange({ value, onChange, label, min, max, disabled = false }: DateRangeProps) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState<Date | null>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const start = value?.start ?? null
  const end = value?.end ?? null

  // picking state: 'start' → next click sets start; 'end' → next click sets end
  const [phase, setPhase] = useState<'start' | 'end'>('start')

  function handleDay(d: Date) {
    if (phase === 'start' || (!start && !end)) {
      onChange({ start: d, end: null })
      setPhase('end')
    } else {
      // second click — ensure start <= end
      if (start && d < start) {
        onChange({ start: d, end: start })
      } else {
        onChange({ start, end: d })
      }
      setPhase('start')
      setOpen(false)
    }
  }

  function handleClose() {
    setOpen(false)
    setPhase('start')
  }

  function formatRange(): string {
    if (start && end) return `${formatDMY(start)} → ${formatDMY(end)}`
    if (start) return `${formatDMY(start)} → ...`
    return ''
  }

  const placeholder = 'dd/mm/aaaa → dd/mm/aaaa'
  const display = formatRange()

  return (
    <div style={{ width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>
          {label}
        </label>
      ) : null}

      {/* trigger */}
      <button
        ref={anchorRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            setOpen((v) => !v)
            setPhase('start')
          }
        }}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '46px',
          paddingLeft: '14px', paddingRight: '14px', borderRadius: '11px',
          background: 'var(--background,#0E1116)',
          border: '1.5px solid ' + (open ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.12))'),
          color: display ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
          fontFamily: 'Archivo', fontWeight: 500, fontSize: '14px',
          cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color .15s ease',
        }}
      >
        <span className="pq-ico" style={{ width: '18px', height: '18px', flex: '0 0 auto', color: open ? 'var(--primary,#C9A24B)' : 'var(--subtle-foreground,#6B7480)' }}>
          <CalendarIcon />
        </span>
        <span style={{ flex: 1 }}>{display || placeholder}</span>
      </button>

      {/* popover */}
      <FloatingPanel open={open} anchorRef={anchorRef} onClose={handleClose} placement="bottom-start" gap={8}>
        <div
          className="pq-lib-pop"
          role="dialog"
          aria-label="Selector de rango de fechas"
          style={{
            width: '300px', background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '16px', padding: '16px',
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          }}
        >
          {/* hint */}
          <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '12px', textTransform: 'uppercase' }}>
            {phase === 'start' ? 'Seleccioná la fecha de inicio' : 'Seleccioná la fecha de fin'}
          </div>

          <RangeGrid
            start={start}
            end={end}
            hover={hover}
            onDay={handleDay}
            onHover={setHover}
            min={min}
            max={max}
          />

          {/* clear */}
          {(start || end) ? (
            <button
              onClick={() => { onChange({ start: null, end: null }); setPhase('start') }}
              style={{ display: 'block', width: '100%', marginTop: '12px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'transparent', color: 'var(--subtle-foreground,#6B7480)', fontFamily: 'Archivo', fontWeight: 600, fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted,#1F2530)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              Limpiar rango
            </button>
          ) : null}
        </div>
      </FloatingPanel>
    </div>
  )
}
