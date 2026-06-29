import { useRef } from 'react'
import { css } from '@/shared/ui/css'

interface Marker {
  id?: string | number
  x: number
  y: number
  active?: boolean
  label?: string
  kind?: 'sel' | 'open' | 'full'
  badge?: number | string | null
  click?: (() => void) | null
  /** Emphasises this marker (scale + ring + label) — e.g. while its list row is hovered. */
  highlight?: boolean
  /** Notifies the caller when the pointer enters (true) / leaves (false) the marker. */
  hover?: ((on: boolean) => void) | null
}

interface StadiumMapProps {
  stadium?: string
  /** Stadium display name for the name plate. Falls back to the legacy id map. */
  name?: string
  /** Real plan/photo of the stadium (data URL). When set it becomes the
   *  background and the synthetic pitch is hidden — the marker is placed on it. */
  mapImage?: string
  markers?: Marker[]
  interactive?: boolean
  onPick?: (x: number, y: number) => void
}

// Display names for the two seed stadiums when callers still pass only an id.
const LEGACY_NAMES: Record<string, string> = {
  gpc: 'Gran Parque Central',
  cds: 'Campeón del Siglo',
}

export default function StadiumMap({ stadium = 'gpc', name, mapImage, markers = [], interactive = false, onPick }: StadiumMapProps) {
  const elRef = useRef<HTMLDivElement | null>(null)

  function onField(e: React.MouseEvent) {
    if (!interactive || typeof onPick !== 'function') return
    const el = elRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    onPick(Math.max(5, Math.min(95, x)), Math.max(7, Math.min(93, y)))
  }

  // Every stadium renders as a rectangular pitch.
  const plateName = name || LEGACY_NAMES[stadium] || 'Estadio'
  const geo = { aspect: '1.22', radius: '16px', inset: '22% 18%', name: plateName }

  const built = (markers || []).map((m) => {
    const kind = m.kind || (m.active ? 'sel' : 'open')
    const hl = !!m.highlight
    const z = hl ? 7 : (kind === 'sel' ? 6 : (kind === 'open' ? 5 : 3))
    const clk = (typeof m.click === 'function')
      ? (e: React.MouseEvent) => { if (e && e.stopPropagation) e.stopPropagation(); m.click!() }
      : undefined
    const hov = (typeof m.hover === 'function') ? m.hover : null
    const transform = 'translate(-50%,-50%)' + (hl ? ' scale(1.22)' : '')
    const wrap = 'position:absolute; left:' + m.x + '%; top:' + m.y + '%; transform:' + transform + '; z-index:' + z + '; transition:transform .16s ease;' + (clk ? ' cursor:pointer;' : '')
    let dot: string
    if (kind === 'sel') {
      dot = 'width:26px; height:26px; border-radius:7px; background:var(--primary,#C9A24B); border:2px solid var(--background,#0E1116); box-shadow:0 0 0 4px color-mix(in srgb,var(--primary,#C9A24B) 32%, transparent); animation:pq-pulse 2.1s ease-in-out infinite; display:grid; place-items:center; color:var(--primary-foreground,#1A1407); font-family:Space Mono; font-weight:700; font-size:11px;'
    } else if (kind === 'open') {
      dot = 'width:25px; height:25px; border-radius:7px; background:var(--primary,#C9A24B); border:2px solid var(--background,#0E1116); box-shadow:' + (hl ? '0 0 0 5px color-mix(in srgb,var(--primary,#C9A24B) 38%, transparent), 0 8px 22px -5px rgba(0,0,0,.6)' : '0 6px 16px -5px rgba(0,0,0,.55)') + '; display:grid; place-items:center; color:var(--primary-foreground,#1A1407); font-family:Space Mono; font-weight:700; font-size:11px; transition:box-shadow .16s ease;'
    } else {
      dot = 'width:17px; height:17px; border-radius:5px; background:var(--card,#171B22); border:1.5px dashed var(--subtle-foreground,#6B7480); opacity:' + (hl ? '.95' : '.5') + ';' + (hl ? ' box-shadow:0 0 0 4px color-mix(in srgb,var(--subtle-foreground,#6B7480) 28%, transparent);' : '') + ' transition:opacity .16s ease, box-shadow .16s ease;'
    }
    return { wrapStyle: wrap, dotStyle: dot, label: ((kind === 'sel' || hl) && m.label) ? m.label : '', badge: (m.badge != null ? String(m.badge) : ''), onClick: clk, onHover: hov }
  })

  const showHint = !!(interactive && (!markers || markers.length === 0))
  const containerStyle = 'position:relative; width:100%; aspect-ratio:' + geo.aspect + '; border-radius:' + geo.radius + '; overflow:hidden; background:radial-gradient(130% 130% at 50% -10%, color-mix(in srgb,var(--primary,#C9A24B) 7%, transparent), transparent 45%), var(--muted,#1F2530); border:1px solid var(--border,rgba(255,255,255,.1)); box-shadow:inset 0 0 70px rgba(0,0,0,.4); cursor:' + (interactive ? 'crosshair' : 'default') + ';'
  const pitchStyle = 'position:absolute; inset:' + geo.inset + '; border-radius:6px; border:2px solid rgba(255,255,255,.5); background:repeating-linear-gradient(90deg, #1f7d46 0 28px, #1b6f3e 28px 56px); box-shadow:0 14px 36px rgba(0,0,0,.45);'

  const hasImage = !!mapImage

  return (
    <div ref={elRef} onClick={onField} style={css(containerStyle)}>
      {hasImage ? (
        /* real stadium plan/photo */
        <img src={mapImage} alt={plateName} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none', userSelect: 'none' }} />
      ) : (
        <>
          {/* sector labels */}
          <div style={{ position: 'absolute', top: '9px', left: 0, right: 0, textAlign: 'center', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.22em', color: 'var(--subtle-foreground,#6B7480)' }}>NORTE</div>
          <div style={{ position: 'absolute', bottom: '9px', left: 0, right: 0, textAlign: 'center', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.22em', color: 'var(--subtle-foreground,#6B7480)' }}>SUR</div>
          <div style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.22em', color: 'var(--subtle-foreground,#6B7480)' }}>OESTE</div>
          <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.22em', color: 'var(--subtle-foreground,#6B7480)' }}>ESTE</div>

          {/* pitch */}
          <div style={css(pitchStyle)}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,.45)', transform: 'translateX(-1px)' }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: '24%', aspectRatio: '1', border: '2px solid rgba(255,255,255,.45)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
            <div style={{ position: 'absolute', left: '50%', top: '50%', width: '6px', height: '6px', background: 'rgba(255,255,255,.6)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '14%', height: '54%', border: '2px solid rgba(255,255,255,.4)', borderLeft: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '14%', height: '54%', border: '2px solid rgba(255,255,255,.4)', borderRight: 'none' }} />
            <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '6%', height: '26%', border: '2px solid rgba(255,255,255,.4)', borderLeft: 'none' }} />
            <div style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', width: '6%', height: '26%', border: '2px solid rgba(255,255,255,.4)', borderRight: 'none' }} />
          </div>
        </>
      )}

      {/* palco markers */}
      {built.map((m, i) => (
        <div
          key={i}
          onClick={m.onClick}
          onMouseEnter={m.onHover ? () => m.onHover!(true) : undefined}
          onMouseLeave={m.onHover ? () => m.onHover!(false) : undefined}
          style={css(m.wrapStyle)}
        >
          {m.label ? (
            <div style={{ position: 'absolute', bottom: '150%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '8px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '11px', boxShadow: '0 8px 20px -6px rgba(0,0,0,.6)' }}>
              {m.label}
              <span style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', border: '5px solid transparent', borderTopColor: 'var(--primary,#C9A24B)' }} />
            </div>
          ) : null}
          <div style={css(m.dotStyle)}>{m.badge}</div>
        </div>
      ))}

      {/* hint when empty interactive */}
      {showHint ? (
        <div style={{ position: 'absolute', left: '50%', bottom: '14%', transform: 'translateX(-50%)', padding: '8px 14px', borderRadius: '10px', background: 'color-mix(in srgb,var(--background,#0E1116) 86%, transparent)', border: '1px dashed var(--border,rgba(255,255,255,.2))', color: 'var(--muted-foreground,#9AA6B2)', fontFamily: "'Space Mono'", fontSize: '11px', pointerEvents: 'none' }}>↥ Tocá el plano para ubicar tu palco</div>
      ) : null}

      {/* stadium name plate */}
      <div style={{ position: 'absolute', top: '9px', right: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '8px', background: 'color-mix(in srgb,var(--background,#0E1116) 80%, transparent)', border: '1px solid var(--border,rgba(255,255,255,.12))', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.04em', color: 'var(--muted-foreground,#9AA6B2)' }}>{geo.name}</div>
    </div>
  )
}
