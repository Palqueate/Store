import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent, RefObject } from 'react'
import FloatingPanel from './Floating'

export interface NavMenuChild {
  key: string
  label: string
  icon?: ReactNode
  onClick?: () => void
}

export interface NavMenuItem {
  key: string
  label: string
  icon?: ReactNode
  children?: NavMenuChild[]
}

export interface NavMenuProps {
  items: NavMenuItem[]
  active?: string
  onSelect?: (key: string) => void
}

function ChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function NavMenu({ items, active, onSelect }: NavMenuProps) {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)

  function handleTopClick(item: NavMenuItem, e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    if (item.children?.length) {
      if (openKey === item.key) {
        setOpenKey(null)
      } else {
        anchorRef.current = e.currentTarget
        setOpenKey(item.key)
      }
    } else {
      setOpenKey(null)
      onSelect?.(item.key)
    }
  }

  function handleChildClick(child: NavMenuChild) {
    setOpenKey(null)
    child.onClick?.()
    onSelect?.(child.key)
  }

  function isActive(item: NavMenuItem): boolean {
    if (active === item.key) return true
    return (item.children ?? []).some((c) => c.key === active)
  }

  const openItem = openKey !== null ? items.find((i) => i.key === openKey) ?? null : null

  return (
    <nav
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: '2px',
        background: 'var(--card,#171B22)',
        borderBottom: '1px solid var(--border,rgba(255,255,255,.1))',
        padding: '0 8px',
      }}
    >
      {items.map((item) => {
        const active_ = isActive(item)
        const open = openKey === item.key
        const hasKids = !!item.children?.length

        return (
          <div key={item.key}>
            <button
              onClick={(e) => handleTopClick(item, e)}
              aria-haspopup={hasKids}
              aria-expanded={hasKids ? open : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '0 12px',
                height: '44px',
                border: 'none',
                background: open
                  ? 'color-mix(in srgb, var(--primary,#C9A24B) 10%, transparent)'
                  : 'transparent',
                color: active_
                  ? 'var(--primary,#C9A24B)'
                  : 'var(--muted-foreground,#9AA6B2)',
                fontFamily: 'Archivo',
                fontWeight: active_ ? 700 : 600,
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                borderBottom: active_
                  ? '2px solid var(--primary,#C9A24B)'
                  : '2px solid transparent',
                marginBottom: '-1px',
                borderRadius: '10px 10px 0 0',
                transition:
                  'background .15s ease, color .15s ease, border-color .15s ease',
              }}
              onMouseEnter={(e) => {
                if (!open)
                  e.currentTarget.style.background =
                    'var(--muted,#1F2530)'
              }}
              onMouseLeave={(e) => {
                if (!open)
                  e.currentTarget.style.background = 'transparent'
              }}
            >
              {item.icon ? (
                <span
                  className="pq-ico"
                  style={{ width: '16px', height: '16px', flex: '0 0 auto' }}
                >
                  {item.icon}
                </span>
              ) : null}
              <span>{item.label}</span>
              {hasKids ? (
                <span
                  className="pq-ico"
                  style={{
                    width: '14px',
                    height: '14px',
                    flex: '0 0 auto',
                    transition: 'transform .18s ease',
                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <ChevronDown />
                </span>
              ) : null}
            </button>
          </div>
        )
      })}

      {/* Single floating dropdown for whichever top item is open */}
      <FloatingPanel
        open={openKey !== null}
        anchorRef={anchorRef as RefObject<HTMLElement>}
        onClose={() => setOpenKey(null)}
        placement="bottom-start"
        gap={4}
      >
        {openItem?.children ? (
          <div
            className="pq-lib-tip"
            style={{
              minWidth: '200px',
              background: 'var(--card,#171B22)',
              border: '1px solid var(--border,rgba(255,255,255,.12))',
              borderRadius: '12px',
              padding: '6px',
              boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
            }}
          >
            {openItem.children.map((child) => {
              const ca = child.key === active
              return (
                <button
                  key={child.key}
                  onClick={() => handleChildClick(child)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 10px',
                    borderRadius: '8px',
                    border: 'none',
                    background: ca
                      ? 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)'
                      : 'transparent',
                    color: ca
                      ? 'var(--primary,#C9A24B)'
                      : 'var(--foreground,#F4EFE6)',
                    fontFamily: 'Archivo',
                    fontWeight: ca ? 700 : 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background .12s ease, color .12s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!ca)
                      e.currentTarget.style.background =
                        'var(--muted,#1F2530)'
                  }}
                  onMouseLeave={(e) => {
                    if (!ca)
                      e.currentTarget.style.background =
                        'transparent'
                  }}
                >
                  {child.icon ? (
                    <span
                      className="pq-ico"
                      style={{
                        width: '16px',
                        height: '16px',
                        flex: '0 0 auto',
                      }}
                    >
                      {child.icon}
                    </span>
                  ) : null}
                  <span style={{ flex: 1, whiteSpace: 'nowrap' }}>
                    {child.label}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
      </FloatingPanel>
    </nav>
  )
}
