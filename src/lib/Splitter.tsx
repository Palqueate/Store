import { useState, useRef, useCallback } from 'react'
import type { ReactNode, PointerEvent } from 'react'

export interface SplitterProps {
  left: ReactNode
  right: ReactNode
  defaultSplit?: number
  min?: number
  max?: number
  direction?: 'horizontal' | 'vertical'
}

export default function Splitter({
  left,
  right,
  defaultSplit = 50,
  min = 15,
  max = 85,
  direction = 'horizontal',
}: SplitterProps) {
  const [split, setSplit] = useState(defaultSplit)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isH = direction === 'horizontal'

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragging(true)

      const container = containerRef.current
      if (!container) return

      function onMove(ev: globalThis.PointerEvent) {
        if (!container) return
        const rect = container.getBoundingClientRect()
        let pct: number
        if (isH) {
          pct = ((ev.clientX - rect.left) / rect.width) * 100
        } else {
          pct = ((ev.clientY - rect.top) / rect.height) * 100
        }
        const clamped = Math.min(max, Math.max(min, pct))
        setSplit(clamped)
      }

      function onUp() {
        setDragging(false)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [isH, min, max],
  )

  const gripDot: React.CSSProperties = {
    width: isH ? '3px' : '24px',
    height: isH ? '24px' : '3px',
    borderRadius: '2px',
    background: dragging
      ? 'var(--primary,#C9A24B)'
      : 'var(--subtle-foreground,rgba(255,255,255,.25))',
    transition: 'background .15s ease',
    flexShrink: 0,
  }

  const dividerStyle: React.CSSProperties = {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isH ? 'col-resize' : 'row-resize',
    zIndex: 10,
    background: dragging
      ? 'color-mix(in srgb, var(--primary,#C9A24B) 10%, transparent)'
      : 'transparent',
    borderLeft: isH
      ? `1px solid ${dragging ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'}`
      : 'none',
    borderRight: isH
      ? `1px solid ${dragging ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'}`
      : 'none',
    borderTop: !isH
      ? `1px solid ${dragging ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'}`
      : 'none',
    borderBottom: !isH
      ? `1px solid ${dragging ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'}`
      : 'none',
    width: isH ? '10px' : '100%',
    height: isH ? '100%' : '10px',
    transition: 'background .15s ease, border-color .15s ease',
    userSelect: 'none',
    touchAction: 'none',
  }

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: isH ? 'row' : 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* First pane */}
      <div
        style={{
          overflow: 'hidden',
          flexShrink: 0,
          [isH ? 'width' : 'height']: split + '%',
          [isH ? 'height' : 'width']: '100%',
        }}
      >
        {left}
      </div>

      {/* Divider */}
      <div
        style={dividerStyle}
        onPointerDown={onPointerDown}
      >
        <span style={gripDot} />
      </div>

      {/* Second pane */}
      <div
        style={{
          overflow: 'hidden',
          flex: 1,
          [isH ? 'height' : 'width']: '100%',
        }}
      >
        {right}
      </div>
    </div>
  )
}
