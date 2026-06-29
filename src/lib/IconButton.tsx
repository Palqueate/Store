import type { ReactNode } from 'react'

interface IconButtonProps {
  children: ReactNode
  'aria-label': string
  variant?: 'solid' | 'soft' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

const SIZES = { sm: 34, md: 40, lg: 46 }
const ICON = { sm: 16, md: 18, lg: 20 }

export default function IconButton({ children, variant = 'soft', size = 'md', disabled = false, onClick, ...rest }: IconButtonProps) {
  const dim = SIZES[size] || SIZES.md
  const isz = ICON[size] || ICON.md
  let bg = 'transparent', col = 'var(--muted-foreground,#9AA6B2)', border = 'none'
  if (variant === 'solid') { bg = 'var(--primary,#C9A24B)'; col = 'var(--primary-foreground,#1A1407)' }
  else if (variant === 'soft') { bg = 'var(--muted,#1F2530)'; col = 'var(--foreground,#F4EFE6)' }
  else if (variant === 'outline') { border = '1px solid var(--border,rgba(255,255,255,.14))'; col = 'var(--foreground,#F4EFE6)' }

  return (
    <button
      {...rest}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: dim + 'px', height: dim + 'px', borderRadius: '11px', padding: 0,
        display: 'grid', placeItems: 'center', background: bg, color: col, border,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'background .15s ease, border-color .15s ease',
      }}
    >
      {/* .pq-ico sizes any passed icon (Heroicons ship no width/height). */}
      <span className="pq-ico" style={{ width: isz + 'px', height: isz + 'px' }}>{children}</span>
    </button>
  )
}
