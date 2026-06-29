import { useRef, useCallback } from 'react'
import type { ClipboardEvent, KeyboardEvent, ChangeEvent, CSSProperties } from 'react'

interface PinInputProps {
  length?: number
  value: string
  onChange: (v: string) => void
  mask?: boolean
  label?: string
}

/** Row of single-character PIN boxes with auto-advance and paste support. */
export default function PinInput({
  length = 4,
  value,
  onChange,
  mask = false,
  label,
}: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const focus = useCallback((i: number) => {
    refs.current[i]?.focus()
  }, [])

  function handleChange(i: number, e: ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\D/g, '')
    const digit = raw.slice(-1) // take last char in case browser doubled up
    const arr = Array.from({ length }, (_, k) => value[k] ?? '')
    arr[i] = digit
    onChange(arr.join(''))
    if (digit && i < length - 1) focus(i + 1)
  }

  function handleKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) {
        // Current box already empty — clear previous and move back
        const arr = Array.from({ length }, (_, k) => value[k] ?? '')
        arr[i - 1] = ''
        onChange(arr.join(''))
        focus(i - 1)
      } else if (value[i]) {
        // Clear current box, stay put
        const arr = Array.from({ length }, (_, k) => value[k] ?? '')
        arr[i] = ''
        onChange(arr.join(''))
      }
      e.preventDefault()
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1)
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      focus(i + 1)
    }
  }

  function handlePaste(i: number, e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length - i)
    if (!digits) return
    const arr = Array.from({ length }, (_, k) => value[k] ?? '')
    for (let d = 0; d < digits.length; d++) {
      if (i + d < length) arr[i + d] = digits[d]
    }
    onChange(arr.join(''))
    const lastFilled = Math.min(i + digits.length, length - 1)
    focus(lastFilled)
  }

  const boxStyle: CSSProperties = {
    width: '46px',
    height: '46px',
    textAlign: 'center',
    borderRadius: '11px',
    border: '1.5px solid var(--border,rgba(255,255,255,.12))',
    background: 'var(--background,#0E1116)',
    color: 'var(--foreground,#F4EFE6)',
    fontFamily: 'Archivo',
    fontSize: '15px',
    fontWeight: 700,
    outline: 'none',
    flexShrink: 0,
  }

  return (
    <div style={{ width: '100%' }}>
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

      <div style={{ display: 'flex', gap: '10px' }}>
        {Array.from({ length }, (_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el }}
            className="pq-lib-input"
            type={mask ? 'password' : 'text'}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value[i] ?? ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={(e) => handlePaste(i, e)}
            style={boxStyle}
          />
        ))}
      </div>
    </div>
  )
}
