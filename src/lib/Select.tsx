import { useRef, useState, useCallback } from 'react'
import FloatingPanel from './Floating'

interface Option {
  label: string
  value: string
}

interface SelectProps {
  label?: string
  value?: string
  options?: Option[]
  placeholder?: string
  hint?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary,#C9A24B)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M4 12l5 5L20 6" />
    </svg>
  )
}

export default function Select({ label = '', value = '', options = [], placeholder, hint = '', disabled = false, onChange }: SelectProps) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState<string | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const close = useCallback(() => setOpen(false), [])

  const selected = options.find((o) => o.value === value)

  return (
    <div style={{ width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>{label}</label>
      ) : null}

      <div
        ref={anchorRef}
        className="pq-lib-input"
        onClick={() => { if (!disabled) setOpen((o) => !o) }}
        style={{
          position: 'relative', width: '100%', height: '46px', padding: '0 38px 0 14px', borderRadius: '11px',
          display: 'flex', alignItems: 'center', boxSizing: 'border-box',
          background: 'var(--background,#0E1116)', border: '1.5px solid var(--border,rgba(255,255,255,.12))',
          color: selected ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
          fontFamily: 'Archivo', fontWeight: 500, fontSize: '15px',
          cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected ? selected.label : (placeholder || 'Seleccionar...')}
        </span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--subtle-foreground,#6B7480)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '14px', top: '50%', transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`, transition: 'transform .18s ease', pointerEvents: 'none' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <FloatingPanel open={open} anchorRef={anchorRef} onClose={close} placement="bottom-start" matchWidth gap={4}>
        <div
          className="pq-lib-pop"
          style={{
            background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '12px', boxShadow: '0 16px 40px -12px rgba(0,0,0,.7)', overflow: 'hidden',
            maxHeight: '280px', overflowY: 'auto',
          }}
        >
          {options.map((o) => {
            const isSelected = o.value === value
            return (
              <div
                key={o.value}
                onClick={() => { onChange?.(o.value); close() }}
                onMouseEnter={() => setHover(o.value)}
                onMouseLeave={() => setHover((h) => (h === o.value ? null : h))}
                style={{
                  padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                  cursor: 'pointer', fontSize: '14px', fontFamily: 'Archivo',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
                  background: hover === o.value ? 'var(--muted,#1F2530)' : 'transparent',
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.label}</span>
                {isSelected ? <CheckIcon /> : null}
              </div>
            )
          })}
        </div>
      </FloatingPanel>

      {hint ? <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)', marginTop: '6px' }}>{hint}</div> : null}
    </div>
  )
}
