import type { ReactNode } from 'react'

interface TimelineItem {
  title: ReactNode
  meta?: string
  body?: ReactNode
  /** 'done' fills the node with brand; 'active' rings it; else muted. */
  state?: 'done' | 'active' | 'pending'
}

interface TimelineProps {
  items?: TimelineItem[]
}

/** Vertical event trail — order history, booking status, activity. */
export default function Timeline({ items = [] }: TimelineProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => {
        const last = i === items.length - 1
        const done = it.state === 'done'
        const active = it.state === 'active'
        return (
          <div key={i} style={{ display: 'flex', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '0 0 auto' }}>
              <span
                style={{
                  width: '14px', height: '14px', borderRadius: '50%', marginTop: '3px',
                  background: done ? 'var(--primary,#C9A24B)' : 'var(--muted,#1F2530)',
                  border: '2px solid ' + (done || active ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.16))'),
                  boxShadow: active ? '0 0 0 4px color-mix(in srgb, var(--primary,#C9A24B) 22%, transparent)' : 'none',
                }}
              />
              {!last ? <span style={{ flex: 1, width: '2px', background: 'var(--border,rgba(255,255,255,.12))', margin: '4px 0' }} /> : null}
            </div>
            <div style={{ paddingBottom: last ? 0 : '20px', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)' }}>{it.title}</span>
                {it.meta ? <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{it.meta}</span> : null}
              </div>
              {it.body ? <div style={{ marginTop: '3px', fontSize: '13.5px', lineHeight: 1.45, color: 'var(--muted-foreground,#9AA6B2)' }}>{it.body}</div> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
