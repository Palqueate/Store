import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import FloatingPanel from './Floating'

interface ContextMenuItem {
  key: string
  label: string
  icon?: ReactNode
  danger?: boolean
  disabled?: boolean
  divider?: boolean
  onClick?: () => void
}

interface ContextMenuProps {
  items?: ContextMenuItem[]
  children: ReactNode
}

const dividerStyle: CSSProperties = {
  height: '1px',
  background: 'var(--border,rgba(255,255,255,.1))',
  margin: '4px 6px',
}

function itemColor(item: ContextMenuItem): string {
  if (item.danger) return 'var(--destructive,#E5604D)'
  if (item.disabled) return 'var(--subtle-foreground,#6B7480)'
  return 'var(--foreground,#F4EFE6)'
}

export default function ContextMenu({ items = [], children }: ContextMenuProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const anchorRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <div
        ref={anchorRef}
        style={{ display: 'contents' }}
        onContextMenu={e => {
          e.preventDefault()
          setPos({ x: e.clientX, y: e.clientY })
        }}
      >
        {children}
      </div>

      <FloatingPanel
        open={pos !== null}
        anchorPoint={pos}
        anchorRef={anchorRef}
        onClose={() => setPos(null)}
        placement="bottom-start"
        gap={0}
      >
        <div
          className="pq-lib-tip"
          style={{
            minWidth: '190px',
            background: 'var(--card,#171B22)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            borderRadius: '12px',
            padding: '6px',
            boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
          }}
        >
          {items.map(item =>
            item.divider ? (
              <div key={item.key} style={dividerStyle} />
            ) : (
              <button
                key={item.key}
                disabled={item.disabled}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: hoveredKey === item.key ? 'var(--muted,#1F2530)' : 'none',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  fontFamily: 'Archivo',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: itemColor(item),
                  opacity: item.disabled ? 0.5 : 1,
                }}
                onMouseEnter={() => { if (!item.disabled) setHoveredKey(item.key) }}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => {
                  if (item.disabled) return
                  item.onClick?.()
                  setPos(null)
                }}
              >
                {item.icon && (
                  <span className="pq-ico" style={{ width: '16px', height: '16px', flex: '0 0 auto' }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            )
          )}
        </div>
      </FloatingPanel>
    </>
  )
}
