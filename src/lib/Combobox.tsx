import { useState, useRef, useCallback } from 'react'
import type { ChangeEvent, KeyboardEvent } from 'react'
import FloatingPanel from './Floating'

interface ComboboxOption { label: string; value: string }
interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
  label?: string
}

export default function Combobox({ options, value, onChange, placeholder = 'Seleccionar...', label }: ComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find(o => o.value === value)?.label ?? ''
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))

  const close = useCallback(() => {
    setOpen(false)
    setQuery('')
  }, [])

  const select = useCallback((opt: ComboboxOption) => {
    onChange(opt.value)
    close()
  }, [onChange, close])

  function handleFocus() {
    setOpen(true)
    setQuery('')
    setHighlighted(0)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setOpen(true)
    setHighlighted(0)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[highlighted]) select(filtered[highlighted])
    } else if (e.key === 'Escape') {
      close()
      inputRef.current?.blur()
    }
  }

  const displayValue = open ? query : selectedLabel

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>
          {label}
        </label>
      ) : null}
      <div ref={anchorRef} style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          className="pq-lib-input"
          type="text"
          value={displayValue}
          placeholder={placeholder}
          onFocus={handleFocus}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          style={{
            width: '100%',
            height: '46px',
            padding: '0 38px 0 14px',
            borderRadius: '11px',
            background: 'var(--background,#0E1116)',
            border: '1.5px solid var(--border,rgba(255,255,255,.12))',
            color: (open ? query : selectedLabel) ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
            fontFamily: 'Archivo',
            fontWeight: 500,
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="var(--subtle-foreground,#6B7480)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"
          style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <FloatingPanel
        open={open}
        anchorRef={anchorRef}
        onClose={close}
        placement="bottom-start"
        matchWidth
        gap={4}
      >
        <div
          className="pq-noscroll pq-lib-pop"
          style={{
            maxHeight: '220px',
            overflowY: 'auto',
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '12px',
            boxShadow: '0 16px 40px -12px rgba(0,0,0,.7)',
          }}
        >
          {filtered.length === 0 ? (
            <div style={{ padding: '10px 14px', fontSize: '14px', color: 'var(--subtle-foreground,#6B7480)' }}>
              Sin resultados
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === value
              const isHighlighted = i === highlighted
              return (
                <div
                  key={opt.value}
                  onMouseEnter={() => setHighlighted(i)}
                  onClick={() => select(opt)}
                  style={{
                    padding: '10px 14px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    color: isSelected ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
                    background: isSelected
                      ? 'color-mix(in srgb, var(--primary,#C9A24B) 12%, transparent)'
                      : isHighlighted
                        ? 'var(--muted,#1F2530)'
                        : 'transparent',
                  }}
                >
                  {opt.label}
                </div>
              )
            })
          )}
        </div>
      </FloatingPanel>
    </div>
  )
}
