import type { ReactNode } from 'react'

type BannerTone = 'brand' | 'success' | 'danger' | 'warn' | 'neutral'

interface BannerProps {
  children?: ReactNode
  tone?: BannerTone
  /** Optional action slot, right-aligned. */
  action?: ReactNode
  onClose?: () => void
}

const TONES: Record<BannerTone, string> = {
  brand: 'var(--primary,#C9A24B)',
  success: 'var(--success,#34D17E)',
  danger: 'var(--destructive,#E5604D)',
  warn: 'var(--warning,#E5A94D)',
  neutral: 'var(--muted-foreground,#9AA6B2)',
}

/** Full-width attention strip — announcements, promos, system notices. */
export default function Banner({ children, tone = 'brand', action, onClose }: BannerProps) {
  const color = TONES[tone] || TONES.brand
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '14px', width: '100%',
        padding: '12px 16px', borderRadius: '12px',
        background: `color-mix(in srgb, ${color} 14%, var(--card,#171B22))`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
      }}
    >
      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flex: '0 0 auto' }} />
      <div style={{ flex: 1, fontFamily: 'Archivo', fontWeight: 600, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{children}</div>
      {action}
      {onClose ? (
        <button onClick={onClose} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', padding: '2px', lineHeight: 0, flex: '0 0 auto' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ) : null}
    </div>
  )
}
