import { useCallback } from 'react'
import type { ChangeEvent, CSSProperties } from 'react'

interface NumberInputProps {
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (n: number) => void
  label?: string
  disabled?: boolean
}

/** Full-width numeric input with decrement/increment buttons. */
export default function NumberInput({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  disabled = false,
}: NumberInputProps) {
  const clamp = useCallback(
    (n: number) => {
      let v = n
      if (min !== undefined) v = Math.max(min, v)
      if (max !== undefined) v = Math.min(max, v)
      return v
    },
    [min, max],
  )

  const canDecrement = min === undefined ? true : value > min
  const canIncrement = max === undefined ? true : value < max

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    if (raw === '' || raw === '-') return
    const parsed = Number(raw)
    if (!isNaN(parsed)) onChange(clamp(parsed))
  }

  const btnBase: CSSProperties = {
    width: '40px',
    height: '46px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '11px',
    background: 'var(--muted,#1F2530)',
    border: '1.5px solid var(--border,rgba(255,255,255,.12))',
    color: 'var(--foreground,#F4EFE6)',
    flexShrink: 0,
    transition: 'opacity .15s',
  }

  return (
    <div style={{ width: '100%', opacity: disabled ? 0.6 : 1 }}>
      {label ? (
        <div
          style={{
            fontFamily: "'Space Mono'",
            fontSize: '10px',
            letterSpacing: '.08em',
            color: 'var(--subtle-foreground,#6B7480)',
            marginBottom: '6px',
          }}
        >
          {label}
        </div>
      ) : null}

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%' }}>
        {/* Decrement */}
        <button
          onClick={() => onChange(clamp(value - step))}
          disabled={disabled || !canDecrement}
          aria-label="Disminuir"
          style={{
            ...btnBase,
            cursor: disabled || !canDecrement ? 'not-allowed' : 'pointer',
            opacity: disabled || !canDecrement ? 0.4 : 1,
          }}
        >
          <span className="pq-ico" style={{ width: 18, height: 18 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </span>
        </button>

        {/* Input */}
        <input
          className="pq-lib-input"
          type="text"
          inputMode="numeric"
          pattern="[0-9\-]*"
          value={value}
          disabled={disabled}
          onChange={handleInputChange}
          style={{
            flex: 1,
            height: '46px',
            borderRadius: '11px',
            border: '1.5px solid var(--border,rgba(255,255,255,.12))',
            background: 'var(--background,#0E1116)',
            color: 'var(--foreground,#F4EFE6)',
            fontFamily: 'Archivo',
            fontSize: '15px',
            fontWeight: 500,
            textAlign: 'center',
            outline: 'none',
            minWidth: 0,
          }}
        />

        {/* Increment */}
        <button
          onClick={() => onChange(clamp(value + step))}
          disabled={disabled || !canIncrement}
          aria-label="Aumentar"
          style={{
            ...btnBase,
            cursor: disabled || !canIncrement ? 'not-allowed' : 'pointer',
            opacity: disabled || !canIncrement ? 0.4 : 1,
          }}
        >
          <span className="pq-ico" style={{ width: 18, height: 18 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}
