import Avatar from './Avatar'

interface Person {
  name?: string
  src?: string
}

interface AvatarGroupProps {
  people?: Person[]
  /** Cap before collapsing into a "+N" tile. */
  max?: number
  size?: number
}

/** Overlapping avatar stack with overflow counter. */
export default function AvatarGroup({ people = [], max = 4, size = 36 }: AvatarGroupProps) {
  const shown = people.slice(0, max)
  const extra = people.length - shown.length
  const overlap = Math.round(size * 0.32)

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center' }}>
      {shown.map((p, i) => (
        <span key={i} style={{ marginLeft: i === 0 ? 0 : '-' + overlap + 'px', borderRadius: '50%', boxShadow: '0 0 0 2px var(--card,#171B22)', zIndex: shown.length - i }}>
          <Avatar name={p.name} src={p.src} size={size} />
        </span>
      ))}
      {extra > 0 ? (
        <span
          style={{
            marginLeft: '-' + overlap + 'px', width: size + 'px', height: size + 'px', borderRadius: '50%',
            display: 'grid', placeItems: 'center', boxShadow: '0 0 0 2px var(--card,#171B22)',
            background: 'var(--muted,#1F2530)', color: 'var(--muted-foreground,#9AA6B2)',
            fontFamily: 'Archivo', fontWeight: 800, fontSize: Math.round(size * 0.32) + 'px',
          }}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  )
}
