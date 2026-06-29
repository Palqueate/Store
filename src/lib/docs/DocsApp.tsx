import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { THEMES, THEME_ORDER } from '@/shared/domain/theme'
import { Badge, Btn, Drawer, IconButton, ToastProvider, Sidebar } from '../index'
import type { NavGroup, NavItem } from '../index'
import {
  Bars3Icon, SunIcon, MoonIcon, MagnifyingGlassIcon, HomeIcon,
  CursorArrowRaysIcon, PencilSquareIcon, TableCellsIcon, BellAlertIcon,
  RectangleGroupIcon, ViewColumnsIcon,
} from '@heroicons/react/24/outline'
import { DocPage } from './ui'
import { ENTRIES, BY_SLUG, CATEGORY_ORDER } from './registry'
import { COMP_ICON } from './compIcons'

// Routes off the URL hash: #showcase/<slug>. Falls back to the first entry.
function slugFromHash(): string {
  const seg = window.location.hash.replace(/^#\/?/, '').split('/')
  const s = seg[1] || ''
  // 'inicio' is the landing leaf (no submenu); unknown/empty falls back to it.
  return BY_SLUG[s] ? s : 'inicio'
}

const CAT_ICON: Record<string, ReactNode> = {
  'Acciones': <CursorArrowRaysIcon />,
  'Inputs': <PencilSquareIcon />,
  'Datos': <TableCellsIcon />,
  'Feedback': <BellAlertIcon />,
  'Navegación': <Bars3Icon />,
  'Overlays': <RectangleGroupIcon />,
  'Layout': <ViewColumnsIcon />,
}

export default function DocsApp() {
  const [themeIdx, setThemeIdx] = useState(0)
  const themeKey = THEME_ORDER[themeIdx]
  const theme = THEMES[themeKey]
  const isDark = themeKey === 'palco'

  const [slug, setSlug] = useState(slugFromHash())
  const [query, setQuery] = useState('')
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280)
  const [navOpen, setNavOpen] = useState(false)
  const [navCollapsed, setNavCollapsed] = useState(false)
  const mobile = vw < 880
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    const onHash = () => setSlug(slugFromHash())
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHash)
    return () => { window.removeEventListener('resize', onResize); window.removeEventListener('hashchange', onHash) }
  }, [])

  useEffect(() => { contentRef.current?.scrollTo({ top: 0 }) }, [slug])

  function goTo(s: string) {
    setSlug(s)
    setNavOpen(false)
    window.location.hash = '#showcase/' + s
  }

  const entry = BY_SLUG[slug] || ENTRIES[0]

  // Registry → NavGroup[] for the library's own Sidebar.
  // No search: each category is a collapsible parent item (icon + count badge)
  // whose children are its components — same grouping as the reference site.
  // With a search query: a flat list so closed accordions don't hide matches.
  const groups: NavGroup[] = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q) {
      const items: NavItem[] = ENTRIES
        .filter((e) => e.name.toLowerCase().includes(q))
        .map((e) => ({ key: e.slug, title: e.name, icon: COMP_ICON[e.slug] ?? CAT_ICON[e.category], onClick: () => goTo(e.slug) }))
      return [{ items }]
    }
    // Top-level leaf (no submenu) followed by the category accordions.
    const inicio: NavItem = { key: 'inicio', title: 'Inicio', icon: <HomeIcon />, onClick: () => goTo('inicio') }
    const cats: NavItem[] = CATEGORY_ORDER
      .map((cat): NavItem | null => {
        const comps = ENTRIES.filter((e) => e.category === cat)
        if (!comps.length) return null
        return {
          key: 'cat:' + cat,
          title: cat,
          icon: CAT_ICON[cat],
          badge: String(comps.length),
          defaultOpen: comps.some((e) => e.slug === slug),
          children: comps.map((e) => ({ key: e.slug, title: e.name, icon: COMP_ICON[e.slug] ?? CAT_ICON[e.category], onClick: () => goTo(e.slug) })),
        }
      })
      .filter((it): it is NavItem => it !== null)
    return [{ items: [inicio, ...cats] }]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const rootStyle = {
    ...theme.vars,
    background: 'var(--background)', color: 'var(--foreground)', height: '100vh',
    fontFamily: "'Archivo', system-ui, sans-serif",
    transition: 'background .35s ease, color .35s ease',
    display: 'flex', overflow: 'hidden',
  } as CSSProperties

  const pMark = (
    <span style={{ width: '30px', height: '30px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', fontFamily: 'Archivo', fontWeight: 900, flex: '0 0 auto' }}>P</span>
  )

  const brand = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {pMark}
      <div>
        <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>Palqueate</div>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)' }}>UI KIT · {ENTRIES.length}</div>
      </div>
    </div>
  )

  const searchBox = (
    <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
      <MagnifyingGlassIcon style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '15px', height: '15px', color: 'var(--subtle-foreground,#6B7480)', pointerEvents: 'none' }} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar componente…"
        className="pq-input"
        style={{ width: '100%', height: '38px', padding: '0 12px 0 34px', borderRadius: '9px', background: 'var(--background,#0E1116)', border: '1.5px solid var(--border,rgba(255,255,255,.12))', color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontSize: '13.5px', outline: 'none' }}
      />
    </div>
  )

  const themeToggle = (
    <IconButton aria-label="Cambiar tema" variant="soft" onClick={() => setThemeIdx((i) => (i + 1) % THEME_ORDER.length)}>
      {isDark ? <SunIcon /> : <MoonIcon />}
    </IconButton>
  )

  const topBarRight = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'space-between' }}>
      {!mobile ? searchBox : <span style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>{slug === 'inicio' ? 'Inicio' : entry.name}</span>}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!mobile ? <Badge tone="brand" dot>{theme.name}</Badge> : null}
        {themeToggle}
        <Btn label="← App" variant="ghost" size="sm" onClick={() => { window.location.hash = '' }} />
      </div>
    </div>
  )

  const intro = (
    <div style={{ maxWidth: '880px', margin: '0 auto' }}>
      <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--primary,#C9A24B)' }}>Palqueate · UI Kit</div>
      <h1 style={{ margin: '10px 0 12px', fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.03em', fontSize: 'clamp(30px,5vw,46px)', color: 'var(--foreground,#F4EFE6)' }}>Librería de componentes</h1>
      <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.55, color: 'var(--muted-foreground,#9AA6B2)', maxWidth: '620px' }}>{ENTRIES.length} componentes en {CATEGORY_ORDER.length} categorías, una página por cada uno, todos reactivos al tema. Elegí una categoría o usá el buscador.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '14px', marginTop: '28px' }}>
        {CATEGORY_ORDER.map((cat) => {
          const comps = ENTRIES.filter((e) => e.category === cat)
          if (!comps.length) return null
          return (
            <button
              key={cat}
              className="pq-lib-clickable"
              onClick={() => goTo(comps[0].slug)}
              style={{ textAlign: 'left', cursor: 'pointer', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '14px', padding: '18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className="pq-ico" style={{ width: '20px', height: '20px', color: 'var(--primary,#C9A24B)' }}>{CAT_ICON[cat]}</span>
                <span style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{cat}</span>
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{comps.length} componentes</div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const docBody = (
    <div ref={contentRef} style={{ height: '100%', overflowY: 'auto', padding: 'clamp(20px,4vw,44px)' }}>
      {slug === 'inicio' ? intro : <DocPage entry={entry} />}
    </div>
  )

  return (
    <div style={rootStyle}>
      <ToastProvider>
        {!mobile ? (
          // Desktop: the docs site IS the library's <Sidebar> app-shell.
          <Sidebar
            groups={groups}
            activeKey={slug}
            brandContent={brand}
            collapsedBrandContent={pMark}
            topBarRight={topBarRight}
            collapsed={navCollapsed}
            onCollapsedChange={setNavCollapsed}
          >
            {docBody}
          </Sidebar>
        ) : (
          <>
            <Drawer open={navOpen} side="left" width={300} title="Componentes" onClose={() => setNavOpen(false)}>
              <div style={{ margin: '-20px', display: 'flex', height: '100%' }}>
                <Sidebar groups={groups} activeKey={slug} brandContent={brand} collapsible={false} embedded />
              </div>
            </Drawer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ height: '60px', flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', borderBottom: '1px solid var(--border,rgba(255,255,255,.1))' }}>
                <IconButton aria-label="Menú" variant="ghost" onClick={() => setNavOpen(true)}><Bars3Icon /></IconButton>
                <div style={{ flex: 1 }}>{topBarRight}</div>
              </div>
              {docBody}
            </div>
          </>
        )}
      </ToastProvider>
    </div>
  )
}
