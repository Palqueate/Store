import { CheckCircleIcon } from '@heroicons/react/24/solid'

interface RadioCardOption {
  value: string
  /** Bold title line. */
  title: string
  /** Secondary line under the title. */
  description?: string
  /** Emphasized price, e.g. "$U 1.620.000". Rendered in the accent color. */
  price?: string
  /** Muted suffix after the price, e.g. "/año" or "· por asiento". */
  priceSuffix?: string
  disabled?: boolean
}

interface RadioCardGroupProps {
  value?: string
  options?: RadioCardOption[]
  name?: string
  disabled?: boolean
  onChange?: (value: string) => void
}

/** Single-choice list rendered as full cards — pricing tiers, plan pickers. */
export default function RadioCardGroup({ value = '', options = [], disabled = false, onChange }: RadioCardGroupProps) {
  return (
    <div role="radiogroup" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map((o) => {
        const selected = o.value === value
        const off = disabled || o.disabled
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={off}
            onClick={() => onChange?.(o.value)}
            style={{
              display: 'flex', alignItems: 'center', gap: '14px', width: '100%', textAlign: 'left',
              padding: '15px 17px', borderRadius: '14px', cursor: off ? 'not-allowed' : 'pointer',
              opacity: off ? 0.55 : 1,
              background: selected ? 'var(--accent,rgba(201,162,75,.08))' : 'var(--card,#171B22)',
              border: '1.5px solid ' + (selected ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.10))'),
              transition: 'border-color .15s ease, background .15s ease',
            }}
          >
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>
                {o.title}
              </div>
              {o.description ? (
                <div style={{ fontFamily: 'Archivo', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)', marginTop: '2px' }}>
                  {o.description}
                </div>
              ) : null}
              {o.price ? (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '15px', color: 'var(--primary,#C9A24B)' }}>
                    {o.price}
                  </span>
                  {o.priceSuffix ? (
                    <span style={{ fontFamily: 'Archivo', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                      {o.priceSuffix}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>

            {selected ? (
              <CheckCircleIcon style={{ width: '22px', height: '22px', flex: '0 0 auto', color: 'var(--primary,#C9A24B)' }} />
            ) : (
              <span
                aria-hidden
                style={{
                  width: '20px', height: '20px', borderRadius: '50%', flex: '0 0 auto',
                  border: '1.5px solid var(--border,rgba(255,255,255,.22))',
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
