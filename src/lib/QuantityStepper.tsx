interface QuantityStepperProps {
  value?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

/** +/- numeric counter — seats, tickets, food quantities. */
export default function QuantityStepper({ value = 0, min = 0, max = 99, step = 1, onChange }: QuantityStepperProps) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n))

  function btn(label: string, to: number, disabled: boolean, sign: 'minus' | 'plus') {
    return (
      <button
        onClick={() => onChange?.(clamp(to))}
        disabled={disabled}
        aria-label={label}
        style={{
          width: '38px', height: '38px', display: 'grid', placeItems: 'center', borderRadius: '10px',
          background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.1))',
          color: 'var(--foreground,#F4EFE6)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round">
          {sign === 'minus' ? <path d="M5 12h14" /> : <path d="M12 5v14M5 12h14" />}
        </svg>
      </button>
    )
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      {btn('Restar', value - step, value <= min, 'minus')}
      <span style={{ minWidth: '32px', textAlign: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{value}</span>
      {btn('Sumar', value + step, value >= max, 'plus')}
    </div>
  )
}
