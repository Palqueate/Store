import { useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface FabAction {
  key: string
  label: string
  icon: ReactNode
  onClick: () => void
}

interface FabProps {
  icon: ReactNode
  label?: string
  position?: 'br' | 'bl' | 'tr' | 'tl'
  actions?: FabAction[]
  onClick?: () => void
  container?: boolean
}

const positionCoords: Record<NonNullable<FabProps['position']>, CSSProperties> = {
  br: { bottom: '24px', right: '24px' },
  bl: { bottom: '24px', left: '24px' },
  tr: { top: '24px', right: '24px' },
  tl: { top: '24px', left: '24px' },
}

export default function Fab({
  icon,
  label,
  position = 'br',
  actions,
  onClick,
  container = false,
}: FabProps) {
  const [open, setOpen] = useState(false)
  const [mainHover, setMainHover] = useState(false)

  const isRightSide = position.endsWith('r')
  const coords = positionCoords[position]
  const hasActions = Array.isArray(actions) && actions.length > 0

  const wrapperStyle: CSSProperties = {
    position: container ? 'absolute' : 'fixed',
    ...coords,
    zIndex: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: isRightSide ? 'flex-end' : 'flex-start',
    gap: '8px',
  }

  const mainBtnStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: label ? '0 20px 0 16px' : '0',
    height: '52px',
    minWidth: '52px',
    borderRadius: '26px',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Archivo',
    fontWeight: 700,
    fontSize: '14px',
    background: 'var(--primary,#C9A24B)',
    color: 'var(--primary-foreground,#0E1116)',
    boxShadow: '0 8px 24px -6px rgba(0,0,0,.5)',
    filter: mainHover ? 'brightness(1.1)' : 'brightness(1)',
    transition: 'filter .15s ease',
    justifyContent: 'center',
  }

  const mainIconStyle: CSSProperties = {
    width: '22px',
    height: '22px',
    flex: '0 0 auto',
    transition: 'transform .2s ease',
    transform: open && hasActions ? 'rotate(45deg)' : 'rotate(0deg)',
  }

  function handleMainClick() {
    if (hasActions) {
      setOpen(prev => !prev)
    } else {
      onClick?.()
    }
  }

  return (
    <div style={wrapperStyle}>
      {open && hasActions && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {actions!.map(action => (
            <ActionRow
              key={action.key}
              action={action}
              isRightSide={isRightSide}
              onDone={() => setOpen(false)}
            />
          ))}
        </div>
      )}

      <button
        style={mainBtnStyle}
        onClick={handleMainClick}
        onMouseEnter={() => setMainHover(true)}
        onMouseLeave={() => setMainHover(false)}
        aria-label={label ?? 'Acción'}
      >
        <span className="pq-ico" style={mainIconStyle}>
          {icon}
        </span>
        {label && <span>{label}</span>}
      </button>
    </div>
  )
}

interface ActionRowProps {
  action: FabAction
  isRightSide: boolean
  onDone: () => void
}

function ActionRow({ action, isRightSide, onDone }: ActionRowProps) {
  const [hover, setHover] = useState(false)

  const rowStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexDirection: 'row',
    animation: 'pq-lib-fade-in .12s ease both',
  }

  const miniBtnStyle: CSSProperties = {
    width: '42px',
    height: '42px',
    borderRadius: '21px',
    border: '1px solid var(--border,rgba(255,255,255,.12))',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    background: hover ? 'var(--muted,#1F2530)' : 'var(--card,#171B22)',
    color: 'var(--foreground,#F4EFE6)',
    boxShadow: '0 4px 12px -4px rgba(0,0,0,.5)',
    transition: 'background .15s ease',
    flex: '0 0 auto',
  }

  const pillStyle: CSSProperties = {
    background: 'var(--card,#171B22)',
    color: 'var(--foreground,#F4EFE6)',
    fontFamily: 'Archivo',
    fontWeight: 600,
    fontSize: '13px',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid var(--border,rgba(255,255,255,.12))',
    boxShadow: '0 4px 12px -4px rgba(0,0,0,.5)',
    whiteSpace: 'nowrap' as const,
  }

  function handleClick() {
    action.onClick()
    onDone()
  }

  const pill = <span style={pillStyle}>{action.label}</span>
  const miniBtn = (
    <button
      style={miniBtnStyle}
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={action.label}
    >
      <span className="pq-ico" style={{ width: '18px', height: '18px', display: 'grid', placeItems: 'center' }}>
        {action.icon}
      </span>
    </button>
  )

  return (
    <div style={rowStyle}>
      {isRightSide ? (
        <>
          {pill}
          {miniBtn}
        </>
      ) : (
        <>
          {miniBtn}
          {pill}
        </>
      )}
    </div>
  )
}
