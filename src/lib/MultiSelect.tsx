import { useState, useRef, useCallback } from 'react'
import type { MouseEvent } from 'react'
import FloatingPanel from './Floating'

interface MSOption { label: string; value: string }
interface MultiSelectProps {
  options: MSOption[]
  value: string[]
  onChange: (v: string[]) => void
  placeholder?: string
  label?: string
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 6l3 3 5-5" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l8 8M10 2l-8 8" />
    </svg>
  )
}

export default function MultiSelect({ options, value, onChange, placeholder = 'Seleccionar...', label }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => setOpen(false), [])

  function toggleValue(v: string) {
    if (value.includes(v)) {
      onChange(value.filter(x => x !== v))
    } else {
      onChange([...value, v])
    }
  }

  function removeValue(v: string, e: MouseEvent) {
    e.stopPropagation()
    onChange(value.filter(x => x !== v))
  }

  const selectedOptions = options.filter(o => value.includes(o.value))

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>
          {label}
        </label>
      ) : null}

      <div
        ref={anchorRef}
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'relative',
          minHeight: '46px',
          padding: '6px 40px 6px 8px',
          borderRadius: '11px',
          border: '1.5px solid var(--border,rgba(255,255,255,.12))',
          background: 'var(--background,#0E1116)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          alignItems: 'center',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        {selectedOptions.length === 0 ? (
          <span style={{ color: 'var(--subtle-foreground,#6B7480)', fontSize: '15px', fontFamily: 'Archivo', fontWeight: 500 }}>
            {placeholder}
          </span>
        ) : (
          selectedOptions.map(opt => (
            <span
              key={opt.value}
              style={{
                height: '28px',
                padding: '0 6px 0 10px',
                borderRadius: '8px',
                background: 'var(--muted,#1F2530)',
                border: '1px solid var(--border,rgba(255,255,255,.12))',
                color: 'var(--foreground,#F4EFE6)',
                fontSize: '13px',
                fontFamily: 'Archivo',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {opt.label}
              <button
                onClick={(e) => removeValue(opt.value, e)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '16px',
                  height: '16px',
                }}
              >
                <CloseIcon />
              </button>
            </span>
          ))
        )}

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
          className="pq-lib-pop"
          style={{
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '12px',
            boxShadow: '0 16px 40px -12px rgba(0,0,0,.7)',
            overflow: 'hidden',
          }}
        >
          {options.map(opt => {
            const isSelected = value.includes(opt.value)
            return (
              <div
                key={opt.value}
                onClick={() => toggleValue(opt.value)}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: isSelected ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
                }}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '5px',
                    border: `1.5px solid ${isSelected ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.12))'}`,
                    background: isSelected ? 'var(--primary,#C9A24B)' : 'transparent',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {isSelected && <CheckIcon />}
                </span>
                {opt.label}
              </div>
            )
          })}
        </div>
      </FloatingPanel>
    </div>
  )
}
