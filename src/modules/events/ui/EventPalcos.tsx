import { useState } from 'react'
import { css } from '@/shared/ui/css'
import { Card, EmptyState, Btn, Rating, Stack, Divider, Carousel } from '@/lib'
import StadiumMap from '@/shared/ui/components/StadiumMap'
import { useEventPalcosVM } from './useEventPalcosVM'

export default function EventPalcos() {
  const vals = useEventPalcosVM()
  // Palco resaltado al pasar el mouse: enlaza el listado con su marcador en el mapa.
  const [hoverId, setHoverId] = useState<string | null>(null)

  // Orden del listado de palcos. Los agotados quedan siempre al final.
  const [sortKey, setSortKey] = useState<'priceDesc' | 'priceAsc' | 'rating'>('rating')
  const sortOptions: { key: typeof sortKey; label: string }[] = [
    { key: 'priceDesc', label: 'Mayor precio' },
    { key: 'priceAsc', label: 'Menor precio' },
    { key: 'rating', label: 'Mejor rating' },
  ]
  const sortCmp: Record<typeof sortKey, (a: any, b: any) => number> = {
    priceDesc: (a, b) => b.price - a.price,
    priceAsc: (a, b) => a.price - b.price,
    rating: (a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0),
  }
  const epList = (vals.epList || []).slice().sort(
    (a: any, b: any) => (a.soldOut ? 1 : 0) - (b.soldOut ? 1 : 0) || sortCmp[sortKey](a, b)
  )
  const mapMarkers = (vals.epMarkers || []).map((m: any) => ({
    ...m,
    highlight: m.id != null && m.id === hoverId,
    hover: (on: boolean) => setHoverId(on ? m.id : null),
  }))
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(14px,2vw,24px) clamp(16px,4vw,40px) 64px' }}>

      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <Btn
          variant="ghost"
          size="sm"
          icon="back"
          label="Todos los eventos"
          onClick={vals.goEvents}
        />
      </div>

      {/* Event header — hero: la imagen es protagonista y la info va sobreimpresa */}
      <Card
        padding="0"
        style={{
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '26px',
          borderRadius: '18px',
          minHeight: 'clamp(240px, 36vw, 380px)',
          background: 'linear-gradient(125deg, var(--card,#171B22), var(--muted,#1F2530))',
        }}
      >
        {/* Capa de fondo: imagen(es) del evento a todo el ancho */}
        {(vals.ep.images || []).length > 0 ? (
          <div style={{ position: 'absolute', inset: 0 }}>
            <Carousel
              showArrows
              showDots
              height="100%"
              slides={vals.ep.images.map((src: string, i: number) => (
                <img key={i} src={src} alt={(vals.ep.opp || '') + ' · ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ))}
            />
          </div>
        ) : null}

        {/* Degradados para que el texto sobreimpreso sea legible sobre cualquier imagen */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(8,10,14,0) 0%, rgba(8,10,14,.25) 42%, rgba(8,10,14,.92) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(96deg, rgba(8,10,14,.6) 0%, rgba(8,10,14,.15) 45%, rgba(8,10,14,0) 70%)' }} />

        {/* Chip de fecha (arriba izquierda) */}
        <div style={{
          position: 'absolute', top: '16px', left: '16px', textAlign: 'center', minWidth: '64px',
          padding: '9px 12px', borderRadius: '13px',
          background: 'rgba(8,10,14,.5)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,.16)',
        }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'rgba(255,255,255,.72)' }}>{vals.ep.dow}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '30px', lineHeight: 1, letterSpacing: '-.03em', color: '#fff', margin: '2px 0' }}>{vals.ep.day}</div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--primary,#C9A24B)' }}>{vals.ep.month}</div>
        </div>

        {/* Info sobreimpresa (abajo) */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 'clamp(16px,3vw,28px)', pointerEvents: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={css(vals.ep.tagStyle)}>{vals.ep.tag}</span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'rgba(255,255,255,.82)' }}>
              {vals.ep.comp}{vals.ep.round ? ' · ' + vals.ep.round : ''} · {vals.ep.multiDate && !vals.ep.hasOccSelected ? 'Varias funciones' : vals.ep.time + ' hs'}
            </span>
          </div>
          <h1 style={{ margin: '0 0 6px', fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '112%', letterSpacing: '-.03em', fontSize: 'clamp(30px,5vw,52px)', lineHeight: 1.02, color: '#fff', textShadow: '0 2px 18px rgba(0,0,0,.5)' }}>
            {vals.ep.opp}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'rgba(255,255,255,.9)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {vals.ep.stadiumName}
          </div>
          {vals.ep.obs ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '14px', maxWidth: '560px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(8,10,14,.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid color-mix(in srgb, var(--primary,#C9A24B) 38%, transparent)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary,#C9A24B)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: '1px' }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              <span style={{ fontSize: '13.5px', lineHeight: 1.45, color: '#fff' }}>{vals.ep.obs}</span>
            </div>
          ) : null}
        </div>
      </Card>

      {/* Function (date + time) picker — only when the event has more than one */}
      {vals.ep.multiDate ? (
        <Card padding="18px" style={{ marginBottom: '26px', borderRadius: '18px' }}>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', marginBottom: '4px' }}>
            Elegí fecha y hora
          </div>
          <p style={{ margin: '0 0 14px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            Este evento tiene varias funciones. Seleccioná una para ver los palcos disponibles.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '10px' }}>
            {(vals.epDates || []).map((o: any, i: number) => (
              <button
                key={i}
                onClick={o.pick}
                disabled={o.soldOut}
                style={{
                  textAlign: 'left', cursor: o.soldOut ? 'not-allowed' : 'pointer', padding: '12px 14px', borderRadius: '13px',
                  display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
                  border: '1.5px solid ' + (o.selected ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'),
                  background: o.selected ? 'color-mix(in srgb, var(--primary,#C9A24B) 12%, var(--card,#171B22))' : 'var(--card,#171B22)',
                  opacity: o.soldOut ? 0.55 : 1,
                }}
              >
                <span style={{ flex: '0 0 auto', width: '52px', textAlign: 'center', padding: '7px 0', borderRadius: '9px', background: o.selected ? 'var(--primary,#C9A24B)' : 'var(--muted,#1F2530)', color: o.selected ? 'var(--primary-foreground,#1A1407)' : 'var(--foreground,#F4EFE6)' }}>
                  <span style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.08em' }}>{o.dow}</span>
                  <span style={{ display: 'block', fontFamily: "'Archivo'", fontWeight: 900, fontSize: '18px', lineHeight: 1 }}>{o.day}</span>
                  <span style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.08em' }}>{o.month}</span>
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{o.time} hs</span>
                  <span style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '11px', color: o.soldOut ? 'var(--subtle-foreground,#6B7480)' : 'var(--success,#34D17E)', marginTop: '2px' }}>{o.availTxt}</span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      ) : null}

      <div style={css(vals.epWrap)}>
        {/* Palco list */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', margin: '0 0 14px' }}>
            <h2 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)' }}>
              Palcos con asientos para este evento
            </h2>
            {vals.ep.hasAvail ? (
              <div role="group" aria-label="Ordenar palcos" style={{ display: 'inline-flex', padding: '3px', borderRadius: '11px', background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.09))' }}>
                {sortOptions.map((o) => {
                  const active = sortKey === o.key
                  return (
                    <button
                      key={o.key}
                      onClick={() => setSortKey(o.key)}
                      aria-pressed={active}
                      style={{
                        cursor: 'pointer', border: 'none', padding: '6px 12px', borderRadius: '8px',
                        fontFamily: "'Space Mono'", fontSize: '11.5px', letterSpacing: '.02em',
                        background: active ? 'var(--primary,#C9A24B)' : 'transparent',
                        color: active ? 'var(--primary-foreground,#1A1407)' : 'var(--muted-foreground,#9AA6B2)',
                        fontWeight: active ? 700 : 400,
                        transition: 'background .15s ease, color .15s ease',
                      }}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            ) : null}
          </div>

          {vals.ep.needsDate ? (
            <Card padding="0">
              <EmptyState
                title="Elegí una fecha y hora"
                description="Seleccioná una función arriba para ver los palcos con asientos disponibles."
              />
            </Card>
          ) : null}

          {vals.ep.hasAvail ? (
            <div style={css(vals.epListGrid)}>
              {epList.map((p: any, i: number) => (
                <div
                  key={i}
                  onMouseEnter={() => { if (!p.soldOut) setHoverId(p.id) }}
                  onMouseLeave={() => setHoverId(null)}
                >
                <Card
                  hover={!p.soldOut}
                  accent={!p.soldOut && hoverId === p.id}
                  onClick={p.soldOut ? undefined : p.open}
                  padding="16px"
                  style={{
                    display: 'flex', gap: '14px', alignItems: 'stretch',
                    transition: 'box-shadow .16s ease',
                    opacity: p.soldOut ? 0.55 : 1,
                    cursor: p.soldOut ? 'default' : 'pointer',
                    boxShadow: !p.soldOut && hoverId === p.id ? '0 10px 30px -12px color-mix(in srgb, var(--primary,#C9A24B) 45%, transparent)' : undefined,
                  }}
                >
                  {/* Palco thumbnail */}
                  <div style={{
                    flex: '0 0 auto', width: '86px', height: '86px', borderRadius: '12px',
                    background: 'repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 11px, var(--card,#171B22) 11px 22px)',
                    display: 'grid', placeItems: 'center',
                    fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)',
                  }}>
                    PALCO
                  </div>

                  {/* Main info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" align="center" gap={8} style={{ marginBottom: '3px' }}>
                      <h3 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>
                        {p.title}
                      </h3>
                      <Rating value={parseFloat(p.rating) || 0} editable={false} size={11} />
                    </Stack>
                    <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                      {p.sector} · {p.parking}
                    </div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--foreground,#F4EFE6)', marginTop: '7px' }}>
                      {p.freeTxt}
                    </div>
                    {/* Occupancy bar — kept bespoke: p.barFill.width is an opaque CSS string from the store */}
                    <div style={css(p.barStyle)}><div style={css(p.barFill)} /></div>
                  </div>

                  {/* Price + CTA */}
                  <Stack direction="col" align="flex-end" justify="space-between" gap={10} style={{ flex: '0 0 auto' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>POR ASIENTO</div>
                      <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{p.priceTxt}</div>
                    </div>
                    <Btn
                      label={p.ctaLabel}
                      size="sm"
                      variant={p.soldOut ? 'secondary' : 'primary'}
                      disabled={p.soldOut}
                      onClick={p.open}
                    />
                  </Stack>
                </Card>
                </div>
              ))}
            </div>
          ) : null}

          {vals.ep.noAvail ? (
            <Card padding="0">
              <EmptyState
                title="Sin palcos disponibles para este evento"
                description="Probá con otra fecha desde la agenda de eventos."
              />
            </Card>
          ) : null}
        </div>

        {/* Stadium map sidebar */}
        <aside style={css(vals.epMapCol)}>
          <Card padding="16px">
            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', marginBottom: '4px' }}>
              Mapa del estadio
            </div>
            <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
              Tocá un palco disponible para ver sus asientos.
            </p>
            <StadiumMap stadium={vals.ep.stadium} name={vals.ep.stadiumName} mapImage={vals.ep.stadiumMap} markers={mapMarkers} />
            <div style={{ margin: '14px 0 10px' }}><Divider /></div>
            <Stack direction="row" gap={16} style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--muted-foreground,#9AA6B2)' }}>
              <Stack direction="row" align="center" gap={6}>
                <span style={{ width: '13px', height: '13px', borderRadius: '4px', background: 'var(--primary,#C9A24B)', flexShrink: 0 }} />
                Disponible
              </Stack>
              <Stack direction="row" align="center" gap={6}>
                <span style={{ width: '13px', height: '13px', borderRadius: '4px', background: 'var(--muted,#1F2530)', border: '1.5px dashed var(--subtle-foreground,#6B7480)', flexShrink: 0 }} />
                Agotado
              </Stack>
            </Stack>
          </Card>
        </aside>
      </div>
    </div>
  )
}
