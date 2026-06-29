// @ts-nocheck
// Pure view-model style helpers, lifted verbatim from the old computeVals.
// Shared by the per-screen VM hooks. No state, no store — just string/object
// builders for inline styles.

export function navLink(active) { return 'background:none; border:none; cursor:pointer; font-family:Archivo; font-weight:600; font-size:14px; padding:8px 4px; color:' + (active ? 'var(--foreground)' : 'var(--muted-foreground)') + '; border-bottom:2px solid ' + (active ? 'var(--primary)' : 'transparent') + ';' }

export function bnS(active) { return 'display:flex; flex-direction:column; align-items:center; gap:4px; background:none; border:none; cursor:pointer; padding:5px 4px; font-family:Archivo; font-weight:700; font-size:10px; letter-spacing:.01em; color:' + (active ? 'var(--primary)' : 'var(--subtle-foreground)') + ';' }

export function chipS(on) { return { height: '38px', padding: '0 14px', borderRadius: '9px', cursor: 'pointer', fontFamily: 'Archivo', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap', border: '1px solid ' + (on ? 'var(--primary)' : 'var(--border)'), background: (on ? 'var(--primary)' : 'var(--card)'), color: (on ? 'var(--primary-foreground)' : 'var(--muted-foreground)') } }

export function evTagStyle(tag) { var c = tag === 'Copa' ? 'var(--primary)' : (tag === 'Destacado' ? 'var(--success)' : 'var(--muted)'); var t = tag === 'Copa' ? 'var(--primary-foreground)' : (tag === 'Destacado' ? 'var(--success-foreground)' : 'var(--muted-foreground)'); return 'display:inline-block; padding:3px 9px; border-radius:6px; background:' + c + '; color:' + t + '; font-family:Space Mono; font-weight:700; font-size:10px; letter-spacing:.04em;' }

export function selCard(on) { return { position: 'relative', textAlign: 'left', cursor: 'pointer', width: '100%', padding: '16px', borderRadius: '14px', border: '1.5px solid ' + (on ? 'var(--primary)' : 'var(--border)'), background: (on ? 'color-mix(in srgb,var(--primary) 12%, var(--card))' : 'var(--card)') } }

export function statusBadge(st) { var c = st === 'publicado' ? 'var(--success)' : (st === 'pausado' ? 'var(--warning)' : 'var(--subtle-foreground)'); var t = st === 'publicado' ? 'var(--success-foreground)' : (st === 'pausado' ? '#1A1407' : '#fff'); var lbl = st === 'publicado' ? 'Publicado' : (st === 'pausado' ? 'Pausado' : 'Alquilado'); return { lbl: lbl, style: 'display:inline-flex; align-items:center; gap:6px; padding:4px 11px; border-radius:7px; background:' + c + '; color:' + t + '; font-family:Archivo; font-weight:800; font-size:11px;' } }

export function tabS(on) { return 'flex:1; height:40px; border-radius:9px; border:none; cursor:pointer; font-family:Archivo; font-weight:700; font-size:14px; background:' + (on ? 'var(--card)' : 'transparent') + '; color:' + (on ? 'var(--foreground)' : 'var(--muted-foreground)') + '; box-shadow:' + (on ? '0 1px 4px rgba(0,0,0,.25)' : 'none') + ';' }

export function sw(on) { return { track: { width: '46px', height: '27px', borderRadius: '20px', border: 'none', cursor: 'pointer', position: 'relative', flex: '0 0 auto', background: (on ? 'var(--primary)' : 'var(--muted)'), boxShadow: 'inset 0 0 0 1px ' + (on ? 'var(--primary)' : 'var(--border)') }, knob: { display: 'block', position: 'absolute', top: '3px', left: '3px', width: '21px', height: '21px', borderRadius: '50%', background: (on ? 'var(--primary-foreground)' : 'var(--subtle-foreground)'), transform: 'translateX(' + (on ? '19px' : '0px') + ')', transition: 'transform .15s ease' } } }
