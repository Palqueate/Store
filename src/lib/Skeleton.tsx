interface SkeletonProps {
  width?: string
  height?: string
  /** Rounding — 'pill' for avatars/lines, number-ish string otherwise. */
  radius?: string
  circle?: boolean
}

export default function Skeleton({ width = '100%', height = '14px', radius = '8px', circle = false }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'block',
        width, height,
        borderRadius: circle ? '50%' : radius,
        background: 'linear-gradient(90deg, var(--muted,#1F2530) 0%, color-mix(in srgb, var(--subtle-foreground,#6B7480) 18%, var(--muted,#1F2530)) 50%, var(--muted,#1F2530) 100%)',
        backgroundSize: '200% 100%',
        animation: 'pq-lib-shimmer 1.3s ease-in-out infinite',
      }}
    />
  )
}
