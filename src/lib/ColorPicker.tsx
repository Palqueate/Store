import { useState, useRef } from 'react'
import FloatingPanel from './Floating'

const DEFAULT_SWATCHES = [
  '#C9A24B','#4A9E71','#E5604D','#5B8BE0',
  '#9B6EE0','#E07A5F','#3AAFA9','#F2CC8F',
  '#81B29A','#F4EFE6','#9AA6B2','#6B7480',
]

interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  label?: string
  swatches?: string[]
}

export default function ColorPicker({ value, onChange, label, swatches }: ColorPickerProps) {
  const [open, setOpen] = useState(false)
  const [hexInput, setHexInput] = useState(value)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const palette = swatches ?? DEFAULT_SWATCHES

  function handleOpen() {
    setHexInput(value)
    setOpen(true)
  }

  function handleSwatchClick(hex: string) {
    onChange(hex)
    setOpen(false)
  }

  function handleHexBlur() {
    const v = hexInput.trim()
    if (/^#[0-9a-fA-F]{6}$/.test(v)) {
      onChange(v)
    }
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <span style={{
          fontFamily: "'Space Mono'",
          fontSize: 10,
          letterSpacing: '.08em',
          color: 'var(--subtle-foreground,#6B7480)',
          marginBottom: 6,
        }}>
          {label}
        </span>
      )}

      <button
        ref={anchorRef}
        onClick={handleOpen}
        style={{
          width: 46,
          height: 46,
          borderRadius: 11,
          border: '1.5px solid var(--border,rgba(255,255,255,.12))',
          background: value,
          cursor: 'pointer',
          padding: 0,
        }}
        aria-label="Seleccionar color"
      />

      <FloatingPanel
        open={open}
        anchorRef={anchorRef}
        onClose={() => setOpen(false)}
        placement="bottom-start"
        gap={6}
      >
        <div
          className="pq-lib-pop"
          style={{
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: 14,
            padding: 16,
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
            minWidth: 220,
          }}
        >
          {/* Swatch grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 6,
          }}>
            {palette.map((hex) => (
              <button
                key={hex}
                onClick={() => handleSwatchClick(hex)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `2px solid ${hex === value ? 'var(--primary,#C9A24B)' : 'transparent'}`,
                  background: hex,
                  cursor: 'pointer',
                  padding: 0,
                }}
                aria-label={hex}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: 'var(--border,rgba(255,255,255,.12))',
            margin: '12px 0',
          }} />

          {/* Hex input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              fontFamily: "'Space Mono'",
              fontSize: 10,
              letterSpacing: '.08em',
              color: 'var(--subtle-foreground,#6B7480)',
            }}>
              HEX
            </span>
            <input
              className="pq-lib-input"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              onBlur={handleHexBlur}
              style={{
                height: 36,
                borderRadius: 8,
                border: '1px solid var(--border,rgba(255,255,255,.12))',
                background: 'var(--background,#0E1116)',
                color: 'var(--foreground,#F4EFE6)',
                fontSize: 13,
                fontFamily: 'Archivo',
                padding: '0 10px',
                width: '100%',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </FloatingPanel>
    </div>
  )
}
