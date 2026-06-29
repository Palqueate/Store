interface RadioOption {
  label: string
  value: string
}

interface RadioGroupProps {
  value?: string
  options?: RadioOption[]
  name?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

export default function RadioGroup({ value = '', options = [], disabled = false, onChange }: RadioGroupProps) {
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((o) => {
        const selected = o.value === value
        return (
          <label key={o.value} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
            <button
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={disabled}
              onClick={() => onChange?.(o.value)}
              style={{
                width: '20px', height: '20px', borderRadius: '50%', flex: '0 0 auto', padding: 0,
                display: 'grid', placeItems: 'center', cursor: 'inherit',
                background: 'var(--background,#0E1116)',
                border: '1.5px solid ' + (selected ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.16))'),
                transition: 'border-color .15s ease',
              }}
            >
              {selected ? <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary,#C9A24B)' }} /> : null}
            </button>
            <span style={{ fontFamily: 'Archivo', fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)' }}>{o.label}</span>
          </label>
        )
      })}
    </div>
  )
}
