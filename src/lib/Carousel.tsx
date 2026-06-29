import { useState, useEffect, useRef, useCallback } from 'react'
import type { ReactNode, CSSProperties } from 'react'

export interface CarouselProps {
  slides: ReactNode[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  height?: number | string
  /** Slide index to start on (e.g. when opening a lightbox at a clicked image). */
  initialIndex?: number
}

function ChevronLeft({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

export default function Carousel({
  slides,
  autoPlay = false,
  interval = 4000,
  showDots = true,
  showArrows = true,
  height = 320,
  initialIndex = 0,
}: CarouselProps) {
  const [index, setIndex] = useState(initialIndex)
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = slides.length

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (!autoPlay || hovered) return
    timerRef.current = setInterval(next, interval)
    return () => {
      if (timerRef.current !== null) clearInterval(timerRef.current)
    }
  }, [autoPlay, hovered, interval, next])

  const arrowBtn: CSSProperties = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '1px solid var(--border,rgba(255,255,255,.18))',
    background: 'var(--card,#171B22)',
    color: 'var(--foreground,#F4EFE6)',
    cursor: 'pointer',
    opacity: 0.88,
    transition: 'opacity .15s ease, background .15s ease, border-color .15s ease',
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '14px',
        height: typeof height === 'number' ? height + 'px' : height,
        background: 'var(--card,#171B22)',
        border: '1px solid var(--border,rgba(255,255,255,.1))',
        userSelect: 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Track */}
      <div
        style={{
          display: 'flex',
          height: '100%',
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform .4s cubic-bezier(.2,.8,.2,1)',
          willChange: 'transform',
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            style={{
              minWidth: '100%',
              height: '100%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {slide}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && total > 1 ? (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            style={{ ...arrowBtn, left: '12px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted,#1F2530)'
              e.currentTarget.style.borderColor = 'var(--primary,#C9A24B)'
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card,#171B22)'
              e.currentTarget.style.borderColor = 'var(--border,rgba(255,255,255,.18))'
              e.currentTarget.style.opacity = '0.88'
            }}
          >
            <span className="pq-ico" style={{ width: '20px', height: '20px' }}>
              <ChevronLeft />
            </span>
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            style={{ ...arrowBtn, right: '12px' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--muted,#1F2530)'
              e.currentTarget.style.borderColor = 'var(--primary,#C9A24B)'
              e.currentTarget.style.opacity = '1'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--card,#171B22)'
              e.currentTarget.style.borderColor = 'var(--border,rgba(255,255,255,.18))'
              e.currentTarget.style.opacity = '0.88'
            }}
          >
            <span className="pq-ico" style={{ width: '20px', height: '20px' }}>
              <ChevronRight />
            </span>
          </button>
        </>
      ) : null}

      {/* Dots */}
      {showDots && total > 1 ? (
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '7px',
            zIndex: 10,
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => setIndex(i)}
              style={{
                width: i === index ? '22px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                background:
                  i === index
                    ? 'var(--primary,#C9A24B)'
                    : 'rgba(255,255,255,.25)',
                transition: 'width .25s cubic-bezier(.2,.8,.2,1), background .2s ease',
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
