import { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode, RefObject } from 'react'

// ------------------------------------------------------------------
// FloatingPanel — renders anchored content in a portal on document.body
// with position:fixed, so it escapes ALL ancestor overflow:hidden and
// stacking contexts and floats above everything. Flips when it would
// overflow the viewport, clamps to the edges, and repositions on
// scroll / resize / content change. Optional click-outside backdrop.
//
// Use it for every anchored popover (dropdowns, date pickers, combobox
// lists, menus, tooltips, …). This is THE fix for "the calendar renders
// inside the card instead of above everything".
// ------------------------------------------------------------------

export type Placement =
  | 'bottom-start' | 'bottom-end' | 'bottom'
  | 'top-start' | 'top-end' | 'top'
  | 'right-start' | 'right' | 'left-start' | 'left'

// The theme's short CSS custom properties (set on the app's root wrapper).
const THEME_VARS = ['--background', '--card', '--muted', '--border', '--foreground', '--muted-foreground', '--subtle-foreground', '--primary', '--primary-foreground', '--success', '--success-foreground', '--destructive', '--warning']

/** Copy the active theme's CSS vars off an in-tree element. Portaled content
 *  lives on document.body — OUTSIDE the themed wrapper — so it doesn't inherit
 *  these vars and would fall back to the dark defaults. Re-applying them on the
 *  portal root makes the popover follow the app theme. */
export function themeVarStyle(el: HTMLElement | null | undefined): Record<string, string> {
  if (!el || typeof getComputedStyle === 'undefined') return {}
  const cs = getComputedStyle(el)
  const out: Record<string, string> = {}
  for (const v of THEME_VARS) {
    const val = cs.getPropertyValue(v)
    if (val) out[v] = val.trim()
  }
  return out
}

interface FloatingPanelProps {
  open: boolean
  /** Anchor element ref (ignored if anchorPoint is set). */
  anchorRef?: RefObject<HTMLElement | null>
  /** Anchor to a fixed viewport point instead of an element (e.g. context menu at cursor). */
  anchorPoint?: { x: number; y: number } | null
  onClose?: () => void
  placement?: Placement
  /** Gap in px between anchor and panel. */
  gap?: number
  /** Make the panel match the anchor's width (selects / comboboxes). */
  matchWidth?: boolean
  /** Render a transparent full-screen backdrop that closes on click. Off for tooltips. */
  backdrop?: boolean
  /** Whether the panel captures pointer events. Off for tooltips (pass-through). */
  interactive?: boolean
  /** Close when Escape is pressed. */
  closeOnEscape?: boolean
  zIndex?: number
  children: ReactNode
}

export default function FloatingPanel({
  open, anchorRef, anchorPoint, onClose, placement = 'bottom-start',
  gap = 8, matchWidth = false, backdrop = true, interactive = true, closeOnEscape = true,
  zIndex = 1000, children,
}: FloatingPanelProps) {
  const floatingRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number; width?: number } | null>(null)

  useLayoutEffect(() => {
    if (!open) { setPos(null); return }

    function anchorRect(): { top: number; bottom: number; left: number; right: number; width: number } | null {
      if (anchorPoint) return { top: anchorPoint.y, bottom: anchorPoint.y, left: anchorPoint.x, right: anchorPoint.x, width: 0 }
      const el = anchorRef?.current
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width }
    }

    function compute() {
      const a = anchorRect()
      const f = floatingRef.current
      if (!a) return
      const fw = f?.offsetWidth ?? 0
      const fh = f?.offsetHeight ?? 0
      const vw = window.innerWidth
      const vh = window.innerHeight
      const dash = placement.indexOf('-')
      const main = dash < 0 ? placement : placement.slice(0, dash)
      const align = dash < 0 ? '' : placement.slice(dash + 1)
      let top = 0
      let left = 0

      if (main === 'bottom' || main === 'top') {
        let t = main === 'bottom' ? a.bottom + gap : a.top - gap - fh
        // flip vertically if it would overflow
        if (main === 'bottom' && t + fh > vh - 8 && a.top - gap - fh > 8) t = a.top - gap - fh
        if (main === 'top' && t < 8 && a.bottom + gap + fh < vh - 8) t = a.bottom + gap
        top = t
        if (align === 'end') left = a.right - fw
        else if (align === 'start') left = a.left
        else left = a.left + a.width / 2 - fw / 2 // bare main / center
      } else {
        // left/right: align top to anchor (start) or center vertically (bare).
        top = align === 'start' ? a.top : a.top + (a.bottom - a.top) / 2 - fh / 2
        left = main === 'right' ? a.right + gap : a.left - gap - fw
        if (main === 'right' && left + fw > vw - 8 && a.left - gap - fw > 8) left = a.left - gap - fw
        if (main === 'left' && left < 8 && a.right + gap + fw < vw - 8) left = a.right + gap
      }

      left = Math.max(8, Math.min(left, vw - fw - 8))
      top = Math.max(8, Math.min(top, vh - fh - 8))
      setPos({ top, left, width: matchWidth ? a.width : undefined })
    }

    compute()
    const onScroll = () => compute()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    let ro: ResizeObserver | null = null
    if (floatingRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(() => compute())
      ro.observe(floatingRef.current)
    }
    function onKey(e: KeyboardEvent) { if (closeOnEscape && e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('keydown', onKey)
      ro?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, gap, matchWidth, anchorPoint?.x, anchorPoint?.y])

  if (open === false) return null
  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      {backdrop ? (
        <div onPointerDown={() => onClose?.()} style={{ position: 'fixed', inset: 0, zIndex }} />
      ) : null}
      <div
        ref={floatingRef}
        style={{
          ...themeVarStyle(anchorRef?.current),
          position: 'fixed',
          top: pos ? pos.top : -9999,
          left: pos ? pos.left : -9999,
          width: pos?.width,
          zIndex: zIndex + 1,
          visibility: pos ? 'visible' : 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div style={{ pointerEvents: interactive ? 'auto' : 'none' }}>{children}</div>
      </div>
    </>,
    document.body,
  )
}
