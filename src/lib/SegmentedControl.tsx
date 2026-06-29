interface Segment {
  value: string
  label: string
}

interface SegmentedControlProps {
  segments?: Segment[]
  value?: string
  block?: boolean
  /** Size of the control. Bigger = more padding / taller. */
  size?: 'sm' | 'md' | 'lg'
  onChange?: (value: string) => void
}

const SIZES = {
  sm: { trackPad: '2px', trackRadius: '10px', btnPad: '6px 12px', btnRadius: '8px', font: '12.5px' },
  md: { trackPad: '3px', trackRadius: '12px', btnPad: '9px 16px', btnRadius: '9px', font: '13.5px' },
  lg: { trackPad: '4px', trackRadius: '14px', btnPad: '13px 22px', btnRadius: '11px', font: '15px' },
}

/** Attached single-choice toggle — view switchers, on/off pairs. */
export default function SegmentedControl({ segments = [], value = '', block = false, size = 'md', onChange }: SegmentedControlProps) {
  const sz = SIZES[size] || SIZES.md
  return (
    <div
      role="tablist"
      style={{
        display: block ? 'grid' : 'inline-grid',
        gridTemplateColumns: `repeat(${segments.length || 1}, 1fr)`,
        gap: '3px', padding: sz.trackPad, borderRadius: sz.trackRadius,
        background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.08))',
        width: block ? '100%' : 'auto',
      }}
    >
      {segments.map((s) => {
        const on = s.value === value
        return (
          <button
            key={s.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange?.(s.value)}
            style={{
              padding: sz.btnPad, borderRadius: sz.btnRadius, border: 'none', cursor: 'pointer',
              background: on ? 'var(--card,#171B22)' : 'transparent',
              color: on ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
              fontFamily: 'Archivo', fontWeight: 700, fontSize: sz.font, whiteSpace: 'nowrap',
              boxShadow: on ? '0 2px 8px -4px rgba(0,0,0,.5)' : 'none',
              transition: 'background .15s ease, color .15s ease',
            }}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
