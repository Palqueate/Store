interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  type?: 'line' | 'bar'
  fill?: boolean
}

/** Mini gráfico sparkline SVG. Soporta tipo línea (con relleno opcional) y barras. Sin ejes. */
export default function Sparkline({
  data,
  width = 120,
  height = 32,
  color = 'var(--primary,#C9A24B)',
  type = 'line',
  fill = false,
}: SparklineProps) {
  if (!data.length) return <svg width={width} height={height} />

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  function scaleY(v: number) {
    // Flip: SVG Y grows downward; map max→2px, min→(height-2)px for padding
    return height - 2 - ((v - min) / range) * (height - 4)
  }

  if (type === 'bar') {
    const barW = width / data.length
    const gap = Math.max(1, barW * 0.15)
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
        {data.map((v, i) => {
          const barHeight = ((v - min) / range) * (height - 4) + 2
          const x = i * barW + gap / 2
          const w = barW - gap
          const y = height - barHeight
          return (
            <rect
              key={i}
              x={x} y={y} width={Math.max(1, w)} height={barHeight}
              rx={Math.min(2, w / 3)}
              fill={color}
              opacity={0.85}
            />
          )
        })}
      </svg>
    )
  }

  // line type
  const step = data.length > 1 ? width / (data.length - 1) : width
  const points = data.map((v, i) => `${i * step},${scaleY(v)}`).join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      {fill && data.length > 1 && (
        <polygon
          points={`0,${height} ${points} ${(data.length - 1) * step},${height}`}
          fill={color}
          opacity={0.18}
        />
      )}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) * step}
          cy={scaleY(data[data.length - 1])}
          r={2.5}
          fill={color}
        />
      )}
    </svg>
  )
}
