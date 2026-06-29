interface RangeSliderProps {
  min?: number
  max?: number
  step?: number
  /** Lower thumb value. */
  valueMin?: number
  /** Upper thumb value. */
  valueMax?: number
  label?: string
  /** Renders "min — max" (formatted) to the right of the label. */
  showValue?: boolean
  /** Formats the values shown when `showValue` is on. */
  format?: (value: number) => string
  /** Fired with the clamped (min, max) pair on every change. */
  onChange?: (min: number, max: number) => void
}

/**
 * Dual-thumb range slider. Two native range inputs share one track: the
 * inputs are transparent and pass through pointer events, while only their
 * thumbs stay interactive (see `.pq-lib-range-*` in lib.css). Themes for free
 * via the short CSS vars, like the single Slider.
 */
export default function RangeSlider({
  min = 0, max = 100, step = 1, valueMin = min, valueMax = max,
  label, showValue = false, format, onChange,
}: RangeSliderProps) {
  const span = max > min ? max - min : 1
  const loPct = ((valueMin - min) / span) * 100
  const hiPct = ((valueMax - min) / span) * 100
  const fmt = format || ((n: number) => String(n))

  // Clamp so the thumbs can't cross each other.
  const changeMin = (v: number) => onChange?.(Math.min(v, valueMax), valueMax)
  const changeMax = (v: number) => onChange?.(valueMin, Math.max(v, valueMin))

  return (
    <div style={{ width: '100%' }}>
      {label || showValue ? (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          {label ? <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>{label}</span> : <span />}
          {showValue ? <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)' }}>{fmt(valueMin)} — {fmt(valueMax)}</span> : null}
        </div>
      ) : null}
      <div className="pq-lib-range" style={{ position: 'relative', height: '22px' }}>
        <div className="pq-lib-range-track" />
        <div className="pq-lib-range-fill" style={{ left: loPct + '%', right: (100 - hiPct) + '%' }} />
        <input
          className="pq-lib-range-input"
          type="range"
          value={valueMin}
          min={min}
          max={max}
          step={step}
          aria-label={(label ? label + ' · ' : '') + 'mínimo'}
          onChange={(e) => changeMin(Number(e.target.value))}
          // Lift the lower thumb above the upper one once it crosses the
          // midpoint, so it stays grabbable when both pile up near the top.
          style={{ zIndex: loPct > 50 ? 5 : 3 }}
        />
        <input
          className="pq-lib-range-input"
          type="range"
          value={valueMax}
          min={min}
          max={max}
          step={step}
          aria-label={(label ? label + ' · ' : '') + 'máximo'}
          onChange={(e) => changeMax(Number(e.target.value))}
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  )
}
