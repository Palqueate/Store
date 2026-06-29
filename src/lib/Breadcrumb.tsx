interface Crumb {
  label: string
  onClick?: () => void
}

interface BreadcrumbProps {
  items?: Crumb[]
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  return (
    <nav style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
      {items.map((c, i) => {
        const last = i === items.length - 1
        return (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={c.onClick}
              disabled={last || !c.onClick}
              style={{
                background: 'none', border: 'none', padding: 0,
                cursor: last || !c.onClick ? 'default' : 'pointer',
                fontFamily: 'Archivo', fontWeight: last ? 700 : 500, fontSize: '13.5px',
                color: last ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
              }}
            >
              {c.label}
            </button>
            {!last ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--subtle-foreground,#6B7480)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            ) : null}
          </span>
        )
      })}
    </nav>
  )
}
