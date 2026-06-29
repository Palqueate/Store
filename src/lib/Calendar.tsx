import { useState } from 'react'

// ── helpers ──────────────────────────────────────────────────────────────────

export const MONTHS_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

export const WEEKDAYS_ES = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

/** Returns a 6×7 matrix of Date objects for the calendar grid (week starts Monday). */
export function monthMatrix(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  // getDay(): 0=Sun,1=Mon,...,6=Sat → shift so Mon=0
  const startDow = (first.getDay() + 6) % 7
  const grid: Date[] = []
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(year, month, 1 - startDow + i))
  }
  return grid
}

export function sameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export function formatDMY(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${d.getFullYear()}`
}

// ── component ─────────────────────────────────────────────────────────────────

interface CalendarProps {
  value?: Date | null
  onChange: (d: Date) => void
  min?: Date
  max?: Date
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export default function Calendar({ value, onChange, min, max }: CalendarProps) {
  const seed = value ?? new Date()
  const [viewYear, setViewYear] = useState(seed.getFullYear())
  const [viewMonth, setViewMonth] = useState(seed.getMonth())

  const today = new Date()
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
          <ChevronLeft />
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
          <ChevronRight />
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
          const isSelected = value != null && sameDay(d, value)
          const disabled = isDisabled(d)

          return (
            <button
              key={i}
              onClick={() => !disabled && onChange(d)}
              disabled={disabled}
              aria-label={formatDMY(d)}
              aria-pressed={isSelected}
              style={{
                height: '34px', borderRadius: '8px', border: isToday && !isSelected ? '1.5px solid var(--primary,#C9A24B)' : '1.5px solid transparent',
                background: isSelected ? 'var(--primary,#C9A24B)' : 'transparent',
                color: isSelected ? 'var(--primary-foreground,#0E1116)' : inMonth ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
                fontFamily: 'Archivo', fontWeight: isSelected ? 700 : inMonth ? 500 : 400, fontSize: '13px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.35 : 1,
                transition: 'background .12s ease',
              }}
              onMouseEnter={(e) => { if (!disabled && !isSelected) e.currentTarget.style.background = 'var(--muted,#1F2530)' }}
              onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
