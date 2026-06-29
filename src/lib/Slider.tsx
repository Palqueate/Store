interface SliderProps {
  value?: number
  min?: number
  max?: number
  step?: number
  label?: string
  /** Renders the current value to the right of the label. */
  showValue?: boolean
  onChange?: (value: number) => void
}

/** Range slider. Uses native input with accentColor so it themes for free. */
export default function Slider({ value = 0, min = 0, max = 100, step = 1, label, showValue = false, onChange }: SliderProps) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0
  return (
    <div style={{ width: '100%' }}>
      {label || showValue ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          {label ? <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>{label}</span> : <span />}
          {showValue ? <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)' }}>{value}</span> : null}
        </div>
      ) : null}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{
          width: '100%', height: '6px', borderRadius: '100px', appearance: 'none', WebkitAppearance: 'none',
          accentColor: 'var(--primary,#C9A24B)', cursor: 'pointer',
          background: `linear-gradient(to right, var(--primary,#C9A24B) ${pct}%, var(--muted,#1F2530) ${pct}%)`,
        }}
      />
    </div>
  )
}
