import { useState } from 'react'
import type { ReactNode } from 'react'

interface VirtualListProps<T> {
  items: T[]
  itemHeight: number
  height: number
  renderItem: (item: T, index: number) => ReactNode
  overscan?: number
}

/** Lista virtualizada genérica: renderiza solo las filas visibles + overscan para smooth scroll. */
export default function VirtualList<T,>({
  items,
  itemHeight,
  height,
  renderItem,
  overscan = 4,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalHeight = items.length * itemHeight
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(height / itemHeight)
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  return (
    <div
      onScroll={(e) => setScrollTop((e.currentTarget as HTMLDivElement).scrollTop)}
      style={{
        height: height + 'px',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        borderRadius: '14px',
        background: 'var(--card,#171B22)',
      }}
    >
      {/* Full-height spacer so scrollbar represents all items */}
      <div style={{ height: totalHeight + 'px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY + 'px', left: 0, right: 0 }}>
          {visibleItems.map((item, i) => (
            <div key={startIndex + i} style={{ height: itemHeight + 'px', overflow: 'hidden' }}>
              {renderItem(item, startIndex + i)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
