import type { ReactNode } from 'react'

type Status = 'online' | 'busy' | 'offline' | 'brand'

interface StatusDotProps {
  status?: Status
  label?: ReactNode
  /** Soft pulsing ring around the dot — for "live" states. */
  pulse?: boolean
}

const COLORS: Record<Status, string> = {
  online: 'var(--success,#34D17E)',
  busy: 'var(--destructive,#E5604D)',
  offline: 'var(--subtle-foreground,#6B7480)',
  brand: 'var(--primary,#C9A24B)',
}

export default function StatusDot({ status = 'online', label, pulse = false }: StatusDotProps) {
  const color = COLORS[status] || COLORS.online
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ position: 'relative', width: '9px', height: '9px', flex: '0 0 auto' }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
        {pulse ? (
          <span style={{ position: 'absolute', inset: '-4px', borderRadius: '50%', background: color, opacity: 0.28, animation: 'pq-lib-spin 2s linear infinite' }} />
        ) : null}
      </span>
      {label ? <span style={{ fontFamily: 'Archivo', fontWeight: 600, fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{label}</span> : null}
    </span>
  )
}
