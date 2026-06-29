import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import Tooltip from './Tooltip'
import { themeVarStyle } from './Floating'

// ------------------------------------------------------------------
// Sidebar (UINavSidebar port) — app-shell navigation.
//   Faithful to the gallery's UINavSidebar:
//   • Groups of NavGroup { title?, items, pushToBottom? }.
//   • NavItem { title, href|onClick, icon, initial, badge, children, defaultOpen, external }.
//     Items with children act as a toggle; nesting is recursive, no depth limit.
//     Badge renders to the right, BEFORE the chevron.
//   • Expanded: inline accordion submenus (DefaultOpen). Collapsed: icon rail;
//     hover a leaf -> tooltip, hover an item with children -> flyout panel.
//   • Slots: brandContent, collapsedBrandContent, topBarRight, children (main body).
//   • collapsible floating chevron toggle. embedded = render just the panel (demos).
//   Restyled in Palqueate (short theme vars), so it re-skins with the theme.
// ------------------------------------------------------------------

export interface NavItem {
  title: string
  href?: string
  onClick?: () => void
  /** Leading icon (use a Heroicon). */
  icon?: ReactNode
  /** Initial badge as an alternative to an SVG icon. */
  initial?: string
  /** Right-aligned label; on items with children it sits before the chevron. */
  badge?: ReactNode
  /** Recursive submenu. Item with children acts as a toggle (href ignored). */
  children?: NavItem[]
  /** Whether the submenu starts open (only when children present). Default true. */
  defaultOpen?: boolean
  external?: boolean
  /** Stable key for active matching (falls back to href, then title). */
  key?: string
}

export interface NavGroup {
  title?: string
  items: NavItem[]
  /** Push this group to the bottom (mt-auto). */
  pushToBottom?: boolean
}

interface SidebarProps {
  groups: NavGroup[]
  brandContent?: ReactNode
  collapsedBrandContent?: ReactNode
  /** Content on the right of the top bar (search, profile, actions). */
  topBarRight?: ReactNode
  /** Main body, rendered to the right of the sidebar (ignored when embedded). */
  children?: ReactNode
  width?: number
  collapsedWidth?: number
  collapsible?: boolean
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  /** Demo mode: render only the sidebar panel, no shell/topbar/main. */
  embedded?: boolean
  /** Active item key/href — highlights it and its parent trail. */
  activeKey?: string
  onNavigate?: (item: NavItem) => void
}

const itemKey = (it: NavItem) => it.key ?? it.href ?? it.title

function Chevron({ rotate = 0, size = 16 }: { rotate?: number; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform .18s ease', transform: `rotate(${rotate}deg)`, flex: '0 0 auto' }}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function Glyph({ item, size = 18 }: { item: NavItem; size?: number }) {
  if (item.icon) return <span className="pq-ico" style={{ width: size + 'px', height: size + 'px', flex: '0 0 auto' }}>{item.icon}</span>
  if (item.initial) {
    return (
      <span style={{ width: size + 'px', height: size + 'px', flex: '0 0 auto', display: 'grid', placeItems: 'center', borderRadius: '6px', background: 'var(--muted,#1F2530)', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: 'Archivo', fontWeight: 800, fontSize: Math.round(size * 0.55) + 'px' }}>{item.initial}</span>
    )
  }
  return <span style={{ width: size + 'px', flex: '0 0 auto' }} />
}

function ItemBadge({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span style={{ flex: '0 0 auto', minWidth: '20px', height: '20px', padding: '0 7px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: '100px', background: active ? 'color-mix(in srgb, var(--primary,#C9A24B) 22%, transparent)' : 'var(--muted,#1F2530)', color: active ? 'var(--primary,#C9A24B)' : 'var(--subtle-foreground,#6B7480)', fontFamily: "'Space Mono'", fontSize: '10.5px', fontWeight: 700 }}>{children}</span>
  )
}

// Collapsed-rail item. Module-level (stable hover state) and portals its
// tooltip/flyout to <body> so it escapes the rail's scroll-clip and paints
// above the main content. Hover-bridge + close timer keep it open while the
// pointer travels from the icon to the panel.
function SidebarCollapsedRow({ glyph, label, active, hasKids, dot, onActivate, flyout }: {
  glyph: ReactNode; label: string; active: boolean; hasKids: boolean; dot: boolean; onActivate: () => void; flyout: ReactNode
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [pos, setPos] = useState<{ iconTop: number; iconCenterY: number; btnRight: number; border: number } | null>(null)
  const [layout, setLayout] = useState<{ top: number; maxH: number; picoTop: number } | null>(null)

  function open() {
    if (timer.current) clearTimeout(timer.current)
    const r = btnRef.current?.getBoundingClientRect()
    const aside = btnRef.current?.closest('aside')?.getBoundingClientRect()
    if (r && aside) setPos({ iconTop: r.top, iconCenterY: r.top + r.height / 2, btnRight: r.right, border: aside.right })
  }
  function scheduleClose() {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => { setPos(null); setLayout(null) }, 130)
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  // Clamp the flyout to the viewport. If it would overflow the bottom, shift it
  // up; if it's taller than the screen, cap the height and let it scroll. The
  // pico stays aimed at the icon even when the panel shifts.
  useLayoutEffect(() => {
    if (!pos) return
    const vh = window.innerHeight
    const m = 8
    const maxH = vh - m * 2
    const h = Math.min(panelRef.current?.scrollHeight ?? 0, maxH)
    let top = pos.iconTop
    if (top + h > vh - m) top = vh - m - h
    if (top < m) top = m
    const picoTop = Math.max(12, Math.min(h - 12, pos.iconCenterY - top))
    setLayout({ top, maxH, picoTop })
  }, [pos])

  const button = (
    <button
      ref={btnRef}
      aria-label={label}
      aria-current={active}
      onClick={() => { if (!hasKids) onActivate() }}
      style={{
        position: 'relative', display: 'grid', placeItems: 'center', width: '44px', height: '44px', borderRadius: '11px', border: 'none', cursor: 'pointer',
        background: active ? 'color-mix(in srgb, var(--primary,#C9A24B) 16%, transparent)' : 'transparent',
        color: active ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--muted,#1F2530)' }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {glyph}
      {dot ? <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary,#C9A24B)' }} /> : null}
    </button>
  )

  // Leaf: reuse the Tooltip component (side=right, with its pico).
  if (!hasKids) {
    return (
      <li style={{ listStyle: 'none', display: 'flex', justifyContent: 'center' }}>
        <Tooltip label={label} side="right" arrow gap={15}>{button}</Tooltip>
      </li>
    )
  }

  // Has children: hover flyout panel (portaled), kept open by a close timer.
  return (
    <li style={{ listStyle: 'none', position: 'relative', display: 'flex', justifyContent: 'center' }} onMouseEnter={open} onMouseLeave={scheduleClose}>
      {button}
      {pos ? createPortal(
        // Bridge spans icon→border (hover survives); panel lands at the border so
        // its pico tip coincides with the navsidebar edge, aimed at the icon.
        // Position is clamped to the viewport and the panel scrolls if too tall.
        <div onMouseEnter={open} onMouseLeave={scheduleClose} style={{ ...themeVarStyle(btnRef.current), position: 'fixed', top: (layout ? layout.top : pos.iconTop) + 'px', left: pos.btnRight + 'px', paddingLeft: (pos.border + 6 - pos.btnRight) + 'px', zIndex: 1100, visibility: layout ? 'visible' : 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <div
              ref={panelRef}
              className="pq-lib-tip"
              style={{ minWidth: '210px', maxHeight: (layout ? layout.maxH : window.innerHeight - 16) + 'px', overflowY: 'auto', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))', borderRadius: '12px', padding: '8px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)' }}
            >
              {flyout}
            </div>
            <span style={{ position: 'absolute', left: '-4px', top: (layout ? layout.picoTop : 22) + 'px', width: '8px', height: '8px', background: 'var(--card,#171B22)', borderLeft: '1px solid var(--border,rgba(255,255,255,.12))', borderBottom: '1px solid var(--border,rgba(255,255,255,.12))', transform: 'translateY(-50%) rotate(45deg)' }} />
          </div>
        </div>,
        document.body,
      ) : null}
    </li>
  )
}

export default function Sidebar({
  groups, brandContent, collapsedBrandContent, topBarRight, children,
  width = 288, collapsedWidth = 64, collapsible = true,
  defaultCollapsed = false, collapsed: collapsedProp, onCollapsedChange,
  embedded = false, activeKey, onNavigate,
}: SidebarProps) {
  const [collapsedState, setCollapsedState] = useState(defaultCollapsed)
  const collapsed = collapsedProp ?? collapsedState

  // open submenu keys; seed with defaultOpen (true unless explicitly false)
  const [openState, setOpenState] = useState<Record<string, boolean>>(() => {
    const seed: Record<string, boolean> = {}
    const walk = (items: NavItem[]) => items.forEach((it) => {
      if (it.children?.length) { seed[itemKey(it)] = it.defaultOpen !== false; walk(it.children) }
    })
    groups.forEach((g) => walk(g.items))
    return seed
  })

  function setCollapsed(next: boolean) {
    if (collapsedProp == null) setCollapsedState(next)
    onCollapsedChange?.(next)
  }
  function isOpen(it: NavItem) { return openState[itemKey(it)] ?? (it.defaultOpen !== false) }
  function toggleOpen(it: NavItem) { setOpenState((p) => ({ ...p, [itemKey(it)]: !isOpen(it) })) }
  function activate(it: NavItem) { it.onClick?.(); onNavigate?.(it) }

  function isActive(it: NavItem): boolean { return activeKey != null && itemKey(it) === activeKey }
  function inActiveTrail(it: NavItem): boolean {
    if (isActive(it)) return true
    return (it.children || []).some(inActiveTrail)
  }

  // Scroll affordance: fade shadows on the nav when it overflows (short screens).
  const navScrollRef = useRef<HTMLDivElement>(null)
  const [navShadow, setNavShadow] = useState({ up: false, down: false })
  function updateNavShadows() {
    const el = navScrollRef.current
    if (!el) return
    const up = el.scrollTop > 2
    const down = el.scrollTop + el.clientHeight < el.scrollHeight - 2
    setNavShadow((s) => (s.up === up && s.down === down ? s : { up, down }))
  }
  useEffect(() => {
    updateNavShadows()
    const onR = () => updateNavShadows()
    window.addEventListener('resize', onR)
    return () => window.removeEventListener('resize', onR)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // Recompute after every render so collapse/search/expand changes update it.
  useLayoutEffect(() => { updateNavShadows() })

  // ---- expanded row (recursive) ----
  function Row({ item, depth }: { item: NavItem; depth: number }) {
    const active = isActive(item)
    const trail = !active && inActiveTrail(item)
    const hasKids = !!item.children?.length
    const open = hasKids && isOpen(item)
    return (
      <li>
        <button
          onClick={() => (hasKids ? toggleOpen(item) : activate(item))}
          aria-current={active}
          aria-expanded={hasKids ? open : undefined}
          style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: '11px', width: '100%',
            padding: '8px 10px', paddingLeft: 10 + depth * 18 + 'px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: active ? 'color-mix(in srgb, var(--primary,#C9A24B) 15%, transparent)' : 'transparent',
            color: active || trail ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
            fontFamily: 'Archivo', fontWeight: active ? 700 : 600, fontSize: '14px',
            transition: 'background .15s ease, color .15s ease',
          }}
          onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--muted,#1F2530)' }}
          onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
        >
          {active ? <span style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '18px', borderRadius: '0 3px 3px 0', background: 'var(--primary,#C9A24B)' }} /> : null}
          {depth === 0 || item.icon || item.initial ? <Glyph item={item} /> : null}
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</span>
          {item.badge != null ? <ItemBadge active={active}>{item.badge}</ItemBadge> : null}
          {hasKids ? <Chevron rotate={open ? 90 : 0} /> : null}
        </button>
        {hasKids && open ? (
          <ul role="list" style={{ listStyle: 'none', margin: '2px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {item.children!.map((c) => <Row key={itemKey(c)} item={c} depth={depth + 1} />)}
          </ul>
        ) : null}
      </li>
    )
  }

  // ---- collapsed rail: flyout panel (recursive submenu) for an item ----
  // Just the content — the box/scroll/clamp is applied by SidebarCollapsedRow.
  function collapsedFlyout(item: NavItem): ReactNode {
    return (
      <>
        <div style={{ padding: '4px 10px 8px', fontFamily: "'Space Mono'", fontSize: '9.5px', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--subtle-foreground,#6B7480)' }}>{item.title}</div>
        <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {item.children!.map((c) => <Row key={itemKey(c)} item={c} depth={0} />)}
        </ul>
      </>
    )
  }

  const aside = (
    <aside
      style={{
        position: 'relative', width: (collapsed ? collapsedWidth : width) + 'px', flex: '0 0 auto', alignSelf: 'stretch',
        display: 'flex', flexDirection: 'column', minHeight: embedded ? '420px' : '100%',
        background: 'var(--card,#171B22)', borderRight: '1px solid var(--border,rgba(255,255,255,.1))',
        transition: 'width .2s cubic-bezier(.2,.8,.2,1)', overflow: 'visible',
      }}
    >
      {(brandContent || collapsedBrandContent) ? (
        <div style={{ padding: collapsed ? '0' : '0 16px', display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start', alignItems: 'center', overflow: 'hidden', height: '60px', flex: '0 0 auto', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))' }}>
          {collapsed ? (collapsedBrandContent ?? brandContent) : brandContent}
        </div>
      ) : null}

      <div style={{ position: 'relative', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <div ref={navScrollRef} onScroll={updateNavShadows} style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: collapsed ? '12px 8px' : '14px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {groups.map((g, gi) => (
          <div key={gi} style={{ marginTop: g.pushToBottom ? 'auto' : 0, marginBottom: '10px' }}>
            {g.title && !collapsed ? <div style={{ padding: '4px 10px 8px', fontFamily: "'Space Mono'", fontSize: '9.5px', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--subtle-foreground,#6B7480)' }}>{g.title}</div> : null}
            {g.title && collapsed && gi > 0 ? <div style={{ height: '1px', background: 'var(--border,rgba(255,255,255,.08))', margin: '6px 8px' }} /> : null}
            <ul role="list" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: collapsed ? '4px' : '2px' }}>
              {g.items.map((it) => {
                if (!collapsed) return <Row key={itemKey(it)} item={it} depth={0} />
                const kids = !!it.children?.length
                return (
                  <SidebarCollapsedRow
                    key={itemKey(it)}
                    glyph={<Glyph item={it} size={20} />}
                    label={it.title}
                    active={inActiveTrail(it)}
                    hasKids={kids}
                    dot={kids || it.badge != null}
                    onActivate={() => activate(it)}
                    flyout={kids ? collapsedFlyout(it) : null}
                  />
                )
              })}
            </ul>
          </div>
        ))}
      </div>
        {navShadow.up ? <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '26px', background: 'linear-gradient(var(--card,#171B22), transparent)', pointerEvents: 'none', zIndex: 2 }} /> : null}
        {navShadow.down ? <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '30px', background: 'linear-gradient(transparent, var(--card,#171B22))', pointerEvents: 'none', zIndex: 2 }} /> : null}
      </div>

      {collapsible ? (
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          style={{
            position: 'absolute', top: '47px', right: '-13px', zIndex: 60, width: '26px', height: '26px', padding: 0, display: 'grid', placeItems: 'center', borderRadius: '50%',
            background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.14))', boxShadow: '0 4px 12px -4px rgba(0,0,0,.5)',
            color: 'var(--muted-foreground,#9AA6B2)', cursor: 'pointer',
          }}
        >
          <Chevron rotate={collapsed ? 0 : 180} size={15} />
        </button>
      ) : null}
    </aside>
  )

  if (embedded) return aside

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0, width: '100%' }}>
      {aside}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {topBarRight ? (
          <div style={{ height: '60px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', padding: '0 20px', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))', background: 'color-mix(in srgb, var(--card,#171B22) 88%, transparent)' }}>
            {topBarRight}
          </div>
        ) : null}
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>{children}</div>
      </div>
    </div>
  )
}
