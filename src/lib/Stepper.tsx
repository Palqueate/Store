interface Step {
  label: string
}

interface StepperProps {
  steps?: Step[]
  /** Zero-based index of the current step. */
  current?: number
}

/** Horizontal numbered progress — checkout, publish wizards. */
export default function Stepper({ steps = [], current = 0 }: StepperProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {steps.map((s, i) => {
        const done = i < current
        const active = i === current
        const reached = done || active
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i === steps.length - 1 ? '0 0 auto' : 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px', flex: '0 0 auto' }}>
              <span
                style={{
                  width: '30px', height: '30px', borderRadius: '50%', display: 'grid', placeItems: 'center',
                  background: done ? 'var(--primary,#C9A24B)' : active ? 'color-mix(in srgb, var(--primary,#C9A24B) 16%, var(--background,#0E1116))' : 'var(--muted,#1F2530)',
                  border: '2px solid ' + (reached ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.14))'),
                  color: done ? 'var(--primary-foreground,#1A1407)' : reached ? 'var(--primary,#C9A24B)' : 'var(--subtle-foreground,#6B7480)',
                  fontFamily: 'Archivo', fontWeight: 800, fontSize: '13px',
                }}
              >
                {done ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                ) : i + 1}
              </span>
              <span style={{ fontFamily: 'Archivo', fontWeight: reached ? 700 : 500, fontSize: '12px', color: reached ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < steps.length - 1 ? (
              <span style={{ flex: 1, height: '2px', margin: '0 8px', marginBottom: '26px', background: done ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.14))' }} />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
