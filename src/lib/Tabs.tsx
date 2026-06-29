interface Tab {
  key: string
  label: string
}

interface TabsProps {
  tabs?: Tab[]
  active?: string
  onChange?: (key: string) => void
  /** 'underline' (default, matches the app's nav) or 'pill'. */
  variant?: 'underline' | 'pill'
}

export default function Tabs({ tabs = [], active = '', onChange, variant = 'underline' }: TabsProps) {
  if (variant === 'pill') {
    return (
      <div style={{ display: 'inline-flex', gap: '4px', padding: '4px', borderRadius: '12px', background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.08))' }}>
        {tabs.map((t) => {
          const on = t.key === active
          return (
            <button
              key={t.key}
              onClick={() => onChange?.(t.key)}
              style={{
                border: 'none', cursor: 'pointer', padding: '8px 16px', borderRadius: '9px',
                background: on ? 'var(--primary,#C9A24B)' : 'transparent',
                color: on ? 'var(--primary-foreground,#1A1407)' : 'var(--muted-foreground,#9AA6B2)',
                fontFamily: 'Archivo', fontWeight: 700, fontSize: '13.5px', whiteSpace: 'nowrap',
                transition: 'background .15s ease, color .15s ease',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))' }}>
      {tabs.map((t) => {
        const on = t.key === active
        return (
          <button
            key={t.key}
            onClick={() => onChange?.(t.key)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '10px 12px',
              fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap',
              color: on ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
              borderBottom: '2px solid ' + (on ? 'var(--primary,#C9A24B)' : 'transparent'),
              marginBottom: '-1px', transition: 'color .15s ease, border-color .15s ease',
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
