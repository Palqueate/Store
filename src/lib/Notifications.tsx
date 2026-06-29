import { useRef, useState } from 'react'
import type { ReactNode, CSSProperties } from 'react'
import FloatingPanel from './Floating'

interface NotificationItem {
  id: string
  title: string
  desc?: string
  time?: string
  read?: boolean
  icon?: ReactNode
}

interface NotificationsProps {
  items?: NotificationItem[]
  onMarkAllRead?: () => void
}

export default function Notifications({ items = [], onMarkAllRead }: NotificationsProps) {
  const [open, setOpen] = useState(false)
  const [btnHover, setBtnHover] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const hasUnread = items.some(item => item.read !== true)

  const btnStyle: CSSProperties = {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '11px',
    border: 'none',
    cursor: 'pointer',
    background: btnHover ? 'var(--muted,#1F2530)' : 'transparent',
    color: btnHover ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
    transition: 'background .15s ease, color .15s ease',
  }

  const dotStyle: CSSProperties = {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--destructive,#E5604D)',
    border: '2px solid var(--background,#0E1116)',
    pointerEvents: 'none',
  }

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px 12px',
    borderBottom: '1px solid var(--border,rgba(255,255,255,.1))',
  }

  const headerTitleStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: 800,
    fontSize: '15px',
    color: 'var(--foreground,#F4EFE6)',
    margin: 0,
  }

  const markReadBtnStyle: CSSProperties = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Archivo',
    fontWeight: 600,
    fontSize: '12px',
    color: 'var(--primary,#C9A24B)',
    padding: 0,
  }

  const listStyle: CSSProperties = {
    maxHeight: '360px',
    overflowY: 'auto',
  }

  const emptyStyle: CSSProperties = {
    padding: '32px 16px',
    textAlign: 'center',
    color: 'var(--subtle-foreground,#6B7480)',
    fontFamily: 'Archivo',
    fontSize: '14px',
  }

  return (
    <>
      <button
        ref={anchorRef}
        style={btnStyle}
        onClick={() => setOpen(prev => !prev)}
        onMouseEnter={() => setBtnHover(true)}
        onMouseLeave={() => setBtnHover(false)}
        aria-label="Notificaciones"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {hasUnread && <span style={dotStyle} />}
      </button>

      <FloatingPanel open={open} anchorRef={anchorRef} onClose={() => setOpen(false)} placement="bottom-end" gap={8}>
        <div style={{
          width: '320px',
          background: 'var(--card,#171B22)',
          border: '1px solid var(--border,rgba(255,255,255,.12))',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
        }} className="pq-lib-tip">
          <div style={headerStyle}>
            <p style={headerTitleStyle}>Notificaciones</p>
            {onMarkAllRead && (
              <button
                style={markReadBtnStyle}
                onClick={() => {
                  onMarkAllRead()
                }}
              >
                Marcar leídas
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div style={emptyStyle}>Sin notificaciones</div>
          ) : (
            <div style={listStyle}>
              {items.map((item, idx) => (
                <NotificationRow
                  key={item.id}
                  item={item}
                  isLast={idx === items.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </FloatingPanel>
    </>
  )
}

interface NotificationRowProps {
  item: NotificationItem
  isLast: boolean
}

function NotificationRow({ item, isLast }: NotificationRowProps) {
  const isRead = item.read === true

  const rowStyle: CSSProperties = {
    display: 'flex',
    gap: '12px',
    padding: '13px 16px',
    alignItems: 'flex-start',
    borderBottom: isLast ? 'none' : '1px solid var(--border,rgba(255,255,255,.08))',
    cursor: 'default',
    background: isRead ? 'transparent' : 'color-mix(in srgb, var(--primary,#C9A24B) 6%, transparent)',
  }

  const unreadDotStyle: CSSProperties = {
    flex: '0 0 auto',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: isRead ? 'transparent' : 'var(--primary,#C9A24B)',
    marginTop: '6px',
  }

  const iconStyle: CSSProperties = {
    width: '20px',
    height: '20px',
    flex: '0 0 auto',
    color: isRead ? 'var(--subtle-foreground,#6B7480)' : 'var(--primary,#C9A24B)',
    marginTop: '1px',
  }

  const titleStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontWeight: isRead ? 500 : 700,
    fontSize: '13.5px',
    color: isRead ? 'var(--muted-foreground,#9AA6B2)' : 'var(--foreground,#F4EFE6)',
  }

  const descStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontSize: '12px',
    color: 'var(--subtle-foreground,#6B7480)',
    marginTop: '2px',
    lineHeight: 1.4,
  }

  const timeStyle: CSSProperties = {
    fontFamily: "'Space Mono'",
    fontSize: '10px',
    color: 'var(--subtle-foreground,#6B7480)',
    marginTop: '4px',
    letterSpacing: '.04em',
  }

  return (
    <div style={rowStyle}>
      <span style={unreadDotStyle} />
      {item.icon && (
        <span className="pq-ico" style={iconStyle}>
          {item.icon}
        </span>
      )}
      <div>
        <p style={{ ...titleStyle, margin: 0 }}>{item.title}</p>
        {item.desc && <p style={{ ...descStyle, margin: 0 }}>{item.desc}</p>}
        {item.time && <p style={{ ...timeStyle, margin: 0 }}>{item.time}</p>}
      </div>
    </div>
  )
}
