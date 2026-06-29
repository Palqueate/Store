import type { ReactNode } from 'react'

interface NavItem {
  key: string
  label: string
  /** Optional leading icon node (e.g. a Heroicon). */
  icon?: ReactNode
  /** Optional trailing badge/count. */
  badge?: ReactNode
}

interface NavSidebarProps {
  items?: NavItem[]
  active?: string
  onSelect?: (key: string) => void
  /** Top slot — logo, brand, user. */
  header?: ReactNode
  /** Bottom slot — settings, logout. */
  footer?: ReactNode
  width?: number
}

/** Vertical navigation rail. Highlights the active item with a brand accent. */
export default function NavSidebar({ items = [], active = '', onSelect, header, footer, width = 240 }: NavSidebarProps) {
  return (
    <nav
      style={{
        width: width + 'px', flex: '0 0 auto', alignSelf: 'stretch',
        display: 'flex', flexDirection: 'column',
        background: 'var(--card,#171B22)',
        borderRight: '1px solid var(--border,rgba(255,255,255,.1))',
      }}
    >
      {header ? <div style={{ padding: '20px 18px', borderBottom: '1px solid var(--border,rgba(255,255,255,.08))' }}>{header}</div> : null}

      <div className="pq-noscroll" style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((it) => {
          const on = it.key === active
          return (
            <button
              key={it.key}
              onClick={() => onSelect?.(it.key)}
              aria-current={on}
              style={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
                padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: on ? 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)' : 'transparent',
                color: on ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
                fontFamily: 'Archivo', fontWeight: on ? 700 : 600, fontSize: '14px',
                transition: 'background .15s ease, color .15s ease',
              }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--muted,#1F2530)' }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent' }}
            >
              {on ? <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '18px', borderRadius: '0 3px 3px 0', background: 'var(--primary,#C9A24B)' }} /> : null}
              {it.icon ? <span className="pq-ico" style={{ width: '18px', height: '18px' }}>{it.icon}</span> : null}
              <span style={{ flex: 1 }}>{it.label}</span>
              {it.badge}
            </button>
          )
        })}
      </div>

      {footer ? <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border,rgba(255,255,255,.08))' }}>{footer}</div> : null}
    </nav>
  )
}
