import { useRef, useState } from 'react'
import Calendar, { formatDMY } from './Calendar'
import FloatingPanel from './Floating'

// ── calendar icon ─────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}

// ── component ─────────────────────────────────────────────────────────────────

interface DatePickerProps {
  value?: Date | null
  onChange: (d: Date) => void
  placeholder?: string
  label?: string
  min?: Date
  max?: Date
  disabled?: boolean
}

export default function DatePicker({
  value, onChange, placeholder = 'Seleccionar fecha', label, min, max, disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  function handleSelect(d: Date) {
    onChange(d)
    setOpen(false)
  }

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
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', width: '100%', height: '46px',
          paddingLeft: '14px', paddingRight: '14px', borderRadius: '11px',
          background: 'var(--background,#0E1116)',
          border: '1.5px solid ' + (open ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.12))'),
          color: value ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
          fontFamily: 'Archivo', fontWeight: 500, fontSize: '15px',
          cursor: disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
          opacity: disabled ? 0.6 : 1,
          transition: 'border-color .15s ease',
        }}
      >
        <span className="pq-ico" style={{ width: '18px', height: '18px', flex: '0 0 auto', color: open ? 'var(--primary,#C9A24B)' : 'var(--subtle-foreground,#6B7480)' }}>
          <CalendarIcon />
        </span>
        <span style={{ flex: 1 }}>{value ? formatDMY(value) : placeholder}</span>
      </button>

      {/* popover */}
      <FloatingPanel open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} placement="bottom-start" gap={8}>
        <div
          className="pq-lib-pop"
          role="dialog"
          aria-label="Selector de fecha"
          style={{
            width: '280px', background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '16px', padding: '16px',
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          }}
        >
          <Calendar value={value} onChange={handleSelect} min={min} max={max} />
        </div>
      </FloatingPanel>
    </div>
  )
}
