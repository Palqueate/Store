interface SpinnerProps {
  size?: number
  /** Stroke colour — defaults to the brand accent. */
  color?: string
  thickness?: number
}

export default function Spinner({ size = 22, color = 'var(--primary,#C9A24B)', thickness = 2.5 }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      style={{
        display: 'inline-block', width: size + 'px', height: size + 'px',
        border: thickness + 'px solid color-mix(in srgb, ' + color + ' 22%, transparent)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'pq-lib-spin .7s linear infinite',
      }}
    />
  )
}
