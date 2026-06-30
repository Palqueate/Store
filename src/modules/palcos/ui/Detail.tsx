import { useState } from 'react'
import { Btn, Card, Badge, Rating, StatTile, Avatar, Divider, Carousel, Modal, QuantityStepper } from '@/lib'
import { css } from '@/shared/ui/css'
import StadiumMap from '@/shared/ui/components/StadiumMap'
import SeatGrid from '@/shared/ui/components/SeatGrid'
import { useDetailVM } from './useDetailVM'

export default function Detail() {
  const vals = useDetailVM()
  const images: string[] = vals.det.images || []
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({ open: false, index: 0 })
  const openLightbox = (i: number) => setLightbox({ open: true, index: i })
  const closeLightbox = () => setLightbox((s) => ({ ...s, open: false }))
  return (
    <div style={css('max-width:1240px; margin:0 auto; padding:clamp(14px,2vw,24px) clamp(16px,4vw,40px) 64px;')}>
      {/* Back button via Btn with built-in back icon */}
      <Btn
        variant="ghost"
        icon="back"
        label={vals.det.backLabel}
        onClick={vals.det.back}
        size="sm"
      />

      <div style={css(vals.detailWrap)}>
        {/* LEFT column */}
        <div style={css('min-width:0; display:flex; flex-direction:column; gap:26px;')}>

          {/* Header: stadium name, title, meta */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontFamily: "'Space Mono'", fontSize: '12px', letterSpacing: '.06em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {vals.det.stadiumName}
            </div>
            <h1 style={{ margin: '0 0 12px', fontFamily: 'Archivo', fontWeight: 900, fontStretch: '115%', letterSpacing: '-.035em', fontSize: 'clamp(30px,5vw,48px)', lineHeight: .98, color: 'var(--foreground,#F4EFE6)' }}>
              {vals.det.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <Badge tone="neutral">{vals.det.sector}</Badge>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Rating value={typeof vals.det.rating === 'number' ? vals.det.rating : parseFloat(vals.det.rating) || 0} max={5} size={14} editable={false} />
                <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.det.rating}</span>
              </div>
              <Avatar name={vals.det.host} size={24} square />
            </div>
          </div>

          {/* Photo gallery — inline carousel when images exist, striped placeholder otherwise. Click a slide to open the lightbox carousel at that index. */}
          {images.length > 0 ? (
            <Carousel
              showArrows
              showDots
              height="clamp(240px,38vw,400px)"
              slides={images.map((src, i) => (
                <div key={i} onClick={() => openLightbox(i)} style={{ width: '100%', height: '100%', background: 'var(--muted,#1F2530)' }}>
                  <img src={src} alt={`Foto ${i + 1} del palco`} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', cursor: 'zoom-in' }} />
                </div>
              ))}
            />
          ) : (
            <div style={css('position:relative; border-radius:16px; overflow:hidden; height:clamp(240px,38vw,400px); background:repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 15px, var(--card,#171B22) 15px 30px);')}>
              <div style={css("position:absolute; inset:0; display:grid; place-items:center; font-family:'Space Mono'; font-size:12px; letter-spacing:.1em; color:var(--subtle-foreground,#6B7480);")} >VISTA DESDE EL PALCO</div>
            </div>
          )}

          {/* Facts: seats, parking, rating — via StatTile */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px' }}>
            <StatTile data={{ label: 'ASIENTOS', value: vals.det.seatsN, icon: undefined }} />
            <StatTile data={{ label: 'ESTACIONAMIENTO', value: vals.det.parkLabel, icon: undefined }} />
            <StatTile data={{ label: 'RATING DE HUÉSPEDES', value: vals.det.rating, icon: 'star', accent: true }} />
          </div>

          {/* Amenities */}
          {(vals.det.amenities || []).length > 0 ? (
            <div>
              <h3 style={{ margin: '0 0 12px', fontFamily: 'Archivo', fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)' }}>
                Comodidades
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '9px' }}>
                {(vals.det.amenities || []).map((a: string, i: number) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '8px 13px', borderRadius: '999px', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))', fontFamily: 'Archivo', fontWeight: 600, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary,#C9A24B)' }} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {/* Stadium map */}
          <div>
            <h3 style={{ margin: '0 0 6px', fontFamily: 'Archivo', fontWeight: 800, fontSize: '20px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)' }}>
              ¿Dónde está el palco?
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: 'var(--muted-foreground,#9AA6B2)' }}>
              El marcador dorado muestra la ubicación exacta dentro del estadio.
            </p>
            <StadiumMap stadium={vals.det.stadium} name={vals.det.stadiumName} mapImage={vals.det.stadiumMap} markers={vals.det.markers} />
          </div>
        </div>

        {/* RIGHT column · booking card */}
        <div style={css(vals.detailBooking)}>
          <Card raised padding="18px" style={{ borderRadius: '18px' }}>

            {/* Event context banner (when navigating from an event) */}
            {vals.det.fromEvent ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 13px', borderRadius: '12px', background: 'color-mix(in srgb,var(--primary,#C9A24B) 12%, var(--background,#0E1116))', border: '1px solid color-mix(in srgb,var(--primary,#C9A24B) 32%, transparent)', marginBottom: '14px' }}>
                <span style={{ flex: '0 0 auto', width: '36px', height: '36px', borderRadius: '9px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', display: 'grid', placeItems: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{vals.det.eventOpp}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.det.eventWhen}</div>
                </div>
              </div>
            ) : null}

            {/* Mode selector */}
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '12px' }}>
              ELEGÍ TU MODALIDAD
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {(vals.det.modeCards || []).map((m: any, i: number) => (
                <button key={i} onClick={m.pick} style={css(m.style)}>
                  <div style={css(m.dotStyle)}>
                    {m.check ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground,#1A1407)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    ) : null}
                  </div>
                  <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)', paddingRight: '24px' }}>{m.title}</div>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{m.sub}</div>
                  <div style={{ marginTop: '5px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '18px', color: 'var(--primary,#C9A24B)' }}>{m.price}</span>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>{m.term}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Event chip list */}
            {vals.det.showEvents ? (
              <div style={{ marginTop: '18px' }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '10px' }}>
                  EVENTO
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '188px', overflowY: 'auto' }}>
                  {(vals.det.eventChips || []).map((e: any, i: number) => (
                    <button key={i} onClick={e.pick} style={css(e.style)}>
                      <span style={css(e.dateStyle)}>{e.date}</span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'Archivo', fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.label}</span>
                        <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--muted-foreground,#9AA6B2)' }}>{e.time} hs</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Seat selector */}
            {vals.det.showSeats ? (
              <div style={{ marginTop: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '11px' }}>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)' }}>ASIENTOS</span>
                  <div style={{ display: 'flex', gap: '11px', fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'var(--success,#34D17E)' }} />Vos
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'var(--muted,#1F2530)', boxShadow: 'inset 0 0 0 1.5px var(--border,rgba(255,255,255,.2))' }} />Libre
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: 'var(--muted,#1F2530)', opacity: .45 }} />Ocupado
                    </span>
                  </div>
                </div>
                <SeatGrid seats={vals.det.seatList} />
              </div>
            ) : null}

            {/* Estacionamiento (add-on) */}
            {vals.det.canAddParking ? (
              <div style={{ marginTop: '16px', padding: '14px 15px', borderRadius: '13px', border: '1.5px solid var(--border)', background: 'var(--card)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>Sumar estacionamiento</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.det.parkUnitPrice} por lugar · {vals.det.parkAvailLabel}</div>
                  </div>
                  <QuantityStepper
                    value={vals.det.parkSel}
                    min={0}
                    max={vals.det.parkAvail}
                    onChange={(v: number) => vals.setPark(v)}
                  />
                </div>
                {vals.det.parkSel > 0 ? (
                  <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                    <span>Estacionamiento ({vals.det.parkSel})</span>
                    <span style={{ fontFamily: "'Archivo'", fontWeight: 700, color: 'var(--foreground,#F4EFE6)' }}>{vals.det.parkSubtotal}</span>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Agregar snacks (abre el modal de botana y bebidas) */}
            <button
              onClick={vals.openSnacks}
              style={{
                marginTop: '14px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px',
                padding: '13px 15px', borderRadius: '13px', cursor: 'pointer',
                border: '1.5px dashed var(--border)', background: 'transparent', color: 'var(--foreground,#F4EFE6)',
                fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                <span style={{ fontSize: '17px' }}>🍿</span>
                {vals.snackCount > 0 ? ('Snacks · ' + vals.snackCount + ' agregados') : 'Agregar snacks'}
              </span>
              <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--primary,#C9A24B)' }}>
                {vals.snackCount > 0 ? ('Editar · ' + vals.det.snacksTotalTxt) : '+ Botana y bebidas'}
              </span>
            </button>

            {/* Price summary + CTA */}
            <Divider />
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{vals.det.unitNote}</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.det.summary}</div>
              </div>
              <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: '26px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', textAlign: 'right' }}>{vals.det.total}</div>
            </div>

            <Btn label="Reservar" icon="cart" block disabled={vals.reserveDisabled} onClick={vals.addToCart} />
            <p style={{ margin: '11px 0 0', textAlign: 'center', fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)' }}>
              No se cobra todavía · revisás en el carrito
            </p>
          </Card>
        </div>
      </div>

      {/* Lightbox: click a gallery image to view it large in a carousel */}
      {images.length > 0 ? (
        <Modal open={lightbox.open} onClose={closeLightbox} width={1040}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={closeLightbox}
              aria-label="Cerrar"
              style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 20, display: 'grid', placeItems: 'center', width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border,rgba(255,255,255,.18))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', cursor: 'pointer' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
            <Carousel
              key={lightbox.index}
              initialIndex={lightbox.index}
              height="70vh"
              showArrows
              showDots
              slides={images.map((src, i) => (
                <div key={i} style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: 'var(--background,#0E1116)' }}>
                  <img src={src} alt={`Foto ${i + 1} del palco`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
              ))}
            />
          </div>
        </Modal>
      ) : null}
    </div>
  )
}
