import { useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import FloatingPanel from './Floating'

interface UserMenuItem {
  key: string
  label: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  divider?: boolean
  onClick?: () => void
}

interface UserMenuProps {
  name: string
  email?: string
  src?: string
  items?: UserMenuItem[]
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase()
}

export default function UserMenu({ name, email, src, items = [] }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const [hoverTrigger, setHoverTrigger] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const triggerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
    border: 'none',
    background: hoverTrigger ? 'var(--muted,#1F2530)' : 'transparent',
    padding: '6px 10px 6px 6px',
    borderRadius: '12px',
    transition: 'background .15s ease',
  }

  const avatarStyle: CSSProperties = {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'color-mix(in srgb, var(--primary,#C9A24B) 20%, transparent)',
    border: '1.5px solid var(--border,rgba(255,255,255,.1))',
    flexShrink: 0,
  }

  const initialsStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize: '13px',
    color: 'var(--primary,#C9A24B)',
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    height: '100%',
  }

  const nameStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize: '14px',
    color: 'var(--foreground,#F4EFE6)',
    whiteSpace: 'nowrap',
  }

  const chevronStyle: CSSProperties = {
    transition: 'transform .15s ease',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    color: 'var(--subtle-foreground,#6B7480)',
    display: 'flex',
    alignItems: 'center',
  }

  const headerStyle: CSSProperties = {
    padding: '12px 14px',
    marginBottom: '4px',
    borderBottom: '1px solid var(--border,rgba(255,255,255,.1))',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const headerAvatarStyle: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'color-mix(in srgb, var(--primary,#C9A24B) 20%, transparent)',
    border: '1.5px solid var(--border,rgba(255,255,255,.1))',
    flexShrink: 0,
  }

  const headerInitialsStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize: '15px',
    color: 'var(--primary,#C9A24B)',
    display: 'grid',
    placeItems: 'center',
    width: '100%',
    height: '100%',
  }

  const headerNameStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: 800,
    fontSize: '15px',
    color: 'var(--foreground,#F4EFE6)',
  }

  const headerEmailStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontSize: '12px',
    color: 'var(--subtle-foreground,#6B7480)',
    marginTop: '2px',
  }

  const dividerStyle: CSSProperties = {
    height: '1px',
    background: 'var(--border,rgba(255,255,255,.1))',
    margin: '4px 0',
  }

  const iconSpanStyle: CSSProperties = {
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }

  function getItemStyle(item: UserMenuItem): CSSProperties {
    const isHovered = hoveredItem === item.key
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '9px 12px',
      borderRadius: '10px',
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: '14px',
      color: item.disabled
        ? 'var(--subtle-foreground,#6B7480)'
        : item.danger
          ? 'var(--destructive,#E5604D)'
          : 'var(--foreground,#F4EFE6)',
      background: isHovered && !item.disabled ? 'var(--muted,#1F2530)' : 'transparent',
      opacity: item.disabled ? 0.5 : 1,
      transition: 'background .12s ease',
    }
  }

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        style={triggerStyle}
        onMouseEnter={() => setHoverTrigger(true)}
        onMouseLeave={() => setHoverTrigger(false)}
        onClick={() => setOpen(prev => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span style={avatarStyle}>
          {src ? (
            <img
              src={src}
              width="34"
              height="34"
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
              alt={name}
            />
          ) : (
            <span style={initialsStyle}>{getInitials(name)}</span>
          )}
        </span>

        <span style={nameStyle}>{name}</span>

        <span style={chevronStyle}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <FloatingPanel open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} placement="bottom-end" gap={6}>
        <div
          style={{
            minWidth: '220px',
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '14px',
            padding: '6px',
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          }}
          className="pq-lib-tip"
        >
          <div style={headerStyle}>
            <span style={headerAvatarStyle}>
              {src ? (
                <img
                  src={src}
                  width="40"
                  height="40"
                  style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={name}
                />
              ) : (
                <span style={headerInitialsStyle}>{getInitials(name)}</span>
              )}
            </span>
            <div>
              <div style={headerNameStyle}>{name}</div>
              {email && <div style={headerEmailStyle}>{email}</div>}
            </div>
          </div>

          {items.map(item =>
            item.divider ? (
              <div key={item.key} style={dividerStyle} />
            ) : (
              <div
                key={item.key}
                style={getItemStyle(item)}
                onMouseEnter={() => !item.disabled && setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => {
                  if (item.disabled) return
                  item.onClick?.()
                  setOpen(false)
                }}
                role="menuitem"
                aria-disabled={item.disabled}
              >
                {item.icon && (
                  <span className="pq-ico" style={iconSpanStyle}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </div>
            )
          )}
        </div>
      </FloatingPanel>
    </>
  )
}
