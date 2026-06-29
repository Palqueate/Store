import { css } from '@/shared/ui/css'
import { Card, EmptyState, Btn, Rating, Stack, Divider, Carousel } from '@/lib'
import StadiumMap from '@/shared/ui/components/StadiumMap'
import { useEventPalcosVM } from './useEventPalcosVM'

export default function EventPalcos() {
  const vals = useEventPalcosVM()
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

      {/* Event header */}
      <Card
        padding="18px"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          background: 'linear-gradient(110deg, var(--card,#171B22), var(--muted,#1F2530))',
          marginBottom: '26px',
          borderRadius: '18px',
        }}
      >
        {/* Date badge */}
        <div style={{
          flex: '0 0 auto', width: '78px', textAlign: 'center', borderRadius: '13px',
          background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.1))',
          padding: '11px 0',
        }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)' }}>{vals.ep.dow}</div>
          <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '32px', lineHeight: 1, letterSpacing: '-.03em', color: 'var(--foreground,#F4EFE6)', margin: '2px 0' }}>{vals.ep.day}</div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--primary,#C9A24B)' }}>{vals.ep.month}</div>
        </div>

        {/* Event images — inline carousel, only when at least one was uploaded */}
        {(vals.ep.images || []).length > 0 ? (
          <div style={{ flex: '0 0 auto', width: 'clamp(200px, 32vw, 280px)', height: '150px', borderRadius: '13px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
            <Carousel
              showArrows
              showDots
              height={150}
              slides={vals.ep.images.map((src: string, i: number) => (
                <img key={i} src={src} alt={(vals.ep.opp || '') + ' · ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              ))}
            />
          </div>
        ) : null}

        {/* Event info */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <Stack direction="row" align="center" gap={8} style={{ marginBottom: '6px' }}>
            <span style={css(vals.ep.tagStyle)}>{vals.ep.tag}</span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>
              {vals.ep.comp}{vals.ep.round ? ' · ' + vals.ep.round : ''} · {vals.ep.multiDate && !vals.ep.hasOccSelected ? 'Varias funciones' : vals.ep.time + ' hs'}
            </span>
          </Stack>
          <h1 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '112%', letterSpacing: '-.03em', fontSize: 'clamp(26px,4.2vw,40px)', color: 'var(--foreground,#F4EFE6)' }}>
            {vals.ep.opp}
          </h1>
          <Stack direction="row" align="center" gap={6} style={{ fontSize: '14px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {vals.ep.stadiumName}
          </Stack>
          {vals.ep.obs ? (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '12px', padding: '10px 12px', borderRadius: '10px', background: 'color-mix(in srgb, var(--primary,#C9A24B) 10%, transparent)', border: '1px solid color-mix(in srgb, var(--primary,#C9A24B) 30%, transparent)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--primary,#C9A24B)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', marginTop: '1px' }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
              <span style={{ fontSize: '13.5px', lineHeight: 1.45, color: 'var(--foreground,#F4EFE6)' }}>{vals.ep.obs}</span>
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
          <h2 style={{ margin: '0 0 14px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)' }}>
            Palcos con asientos para este evento
          </h2>

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
              {(vals.epList || []).map((p: any, i: number) => (
                <Card
                  key={i}
                  hover
                  onClick={p.open}
                  padding="16px"
                  style={{ display: 'flex', gap: '14px', alignItems: 'stretch' }}
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
                      variant="primary"
                      onClick={p.open}
                    />
                  </Stack>
                </Card>
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
            <StadiumMap stadium={vals.ep.stadium} name={vals.ep.stadiumName} mapImage={vals.ep.stadiumMap} markers={vals.epMarkers} />
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
