interface AvatarProps {
  /** Image URL. Falls back to initials when absent. */
  src?: string
  name?: string
  size?: number
  /** Square-ish rounded tile instead of a circle. */
  square?: boolean
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ src, name = '', size = 40, square = false }: AvatarProps) {
  const radius = square ? Math.round(size * 0.28) + 'px' : '50%'
  const common = { width: size + 'px', height: size + 'px', borderRadius: radius, flex: '0 0 auto' as const, objectFit: 'cover' as const }

  if (src) {
    return <img src={src} alt={name} style={{ ...common, border: '1px solid var(--border,rgba(255,255,255,.1))' }} />
  }

  return (
    <span
      aria-label={name}
      style={{
        ...common,
        display: 'grid', placeItems: 'center',
        background: 'color-mix(in srgb, var(--primary,#C9A24B) 18%, var(--card,#171B22))',
        border: '1px solid color-mix(in srgb, var(--primary,#C9A24B) 30%, transparent)',
        color: 'var(--primary,#C9A24B)',
        fontFamily: 'Archivo', fontWeight: 800, fontSize: Math.round(size * 0.36) + 'px', letterSpacing: '.01em',
      }}
    >
      {initials(name)}
    </span>
  )
}
