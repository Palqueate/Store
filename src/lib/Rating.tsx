import { useState } from 'react'
import type { MouseEvent } from 'react'

const STAR_PATH = 'M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z'

interface RatingProps {
  value?: number
  max?: number
  /** Read-only display when false. */
  editable?: boolean
  /** Allow half-step (0.5) selection and display. */
  allowHalf?: boolean
  size?: number
  /** Filled colour. Defaults to the brand accent. */
  color?: string
  /** Custom glyph as an SVG path `d` on a 0 0 24 24 viewBox. Defaults to a star. */
  iconPath?: string
  onChange?: (value: number) => void
}

function Glyph({ fill, size, color, path }: { fill: number; size: number; color: string; path: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size + 'px', height: size + 'px', lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="var(--muted,#1F2530)" stroke="var(--border,rgba(255,255,255,.16))" strokeWidth={1.2} style={{ position: 'absolute', inset: 0 }}>
        <path d={path} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, width: fill * 100 + '%', overflow: 'hidden' }}>
        <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
          <path d={path} />
        </svg>
      </span>
    </span>
  )
}

export default function Rating({
  value = 0, max = 5, editable = false, allowHalf = false,
  size = 20, color = 'var(--primary,#C9A24B)', iconPath = STAR_PATH, onChange,
}: RatingProps) {
  const [hover, setHover] = useState(0)
  const shown = editable && hover ? hover : value

  function valueAt(index: number, e: MouseEvent<HTMLButtonElement>): number {
    if (!allowHalf) return index + 1
    const rect = e.currentTarget.getBoundingClientRect()
    const half = e.clientX - rect.left < rect.width / 2
    return index + (half ? 0.5 : 1)
  }

  return (
    <span role="img" aria-label={`${value} de ${max}`} style={{ display: 'inline-flex', gap: '3px' }}>
      {Array.from({ length: max }, (_, i) => {
        const fill = Math.max(0, Math.min(1, shown - i))
        const glyph = <Glyph fill={fill} size={size} color={color} path={iconPath} />
        if (!editable) return <span key={i}>{glyph}</span>
        return (
          <button
            key={i}
            onClick={(e) => onChange?.(valueAt(i, e))}
            onMouseMove={(e) => setHover(valueAt(i, e))}
            onMouseLeave={() => setHover(0)}
            aria-label={`${i + 1}`}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', lineHeight: 0 }}
          >
            {glyph}
          </button>
        )
      })}
    </span>
  )
}
