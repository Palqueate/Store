import { Card, Badge, Btn } from '@/lib'

// `data` is the evCardVM produced by the store.
export default function EventCard({ data }: { data: any }) {
  const d = data || {}

  // Derive Badge tone from the tag value (mirrors evTagStyle in store).
  const tagTone = d.tag === 'Copa' ? 'brand' : d.tag === 'Destacado' ? 'success' : 'neutral'

  // Derive disabled state from the CTA style string (sold-out path sets cursor:not-allowed).
  const ctaDisabled = typeof d.ctaStyle === 'string' && d.ctaStyle.includes('not-allowed')

  // Imagen promocional del evento. Por pedido de marketing, cuando existe es la
  // protagonista de la tarjeta: se muestra como banner a todo el ancho.
  const promo = (d.images && d.images[0]) || d.image || ''
  const timeText = d.multiDate ? d.timeText : (d.time + ' hs')

  return (
    <Card hover onClick={d.open} padding="0" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {promo ? (
        /* ===== Banner promocional (hero) ===== */
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--muted,#1F2530)' }}>
          <img src={promo} alt={d.opp || ''} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {/* Degradado para que el texto sobreimpreso sea legible sobre cualquier imagen. */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(8,10,14,0) 0%, rgba(8,10,14,.18) 48%, rgba(8,10,14,.9) 100%)' }} />

          {/* Tag (arriba izquierda) */}
          <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
            <Badge tone={tagTone} solid>{d.tag}</Badge>
          </div>

          {/* Chip de fecha (arriba derecha) */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '7px', padding: '5px 10px', borderRadius: '10px', background: 'rgba(8,10,14,.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,.14)' }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--primary,#C9A24B)' }}>{d.dow}</span>
            <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '15px', lineHeight: 1, color: '#fff' }}>{d.day}</span>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'rgba(255,255,255,.82)' }}>{d.month}</span>
            {d.multiDate ? (
              <span style={{ fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.04em', color: 'var(--primary,#C9A24B)', marginLeft: '2px' }}>+{d.datesCount - 1}</span>
            ) : null}
          </div>

          {/* Competición + rival/artista sobreimpresos abajo */}
          <div style={{ position: 'absolute', left: '14px', right: '14px', bottom: '12px' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.03em', color: 'rgba(255,255,255,.8)', marginBottom: '3px' }}>{d.comp}{d.round ? ' · ' + d.round : ''}</div>
            <h3 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '21px', letterSpacing: '-.02em', color: '#fff', lineHeight: 1.08, textShadow: '0 2px 12px rgba(0,0,0,.45)' }}>{d.opp}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,.85)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.stadiumName}</span>
              <span style={{ opacity: .5 }}>·</span>
              <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', flex: '0 0 auto' }}>{timeText}</span>
            </div>
          </div>
        </div>
      ) : (
        /* ===== Sin imagen: layout compacto (fecha + datos) ===== */
        <div style={{ display: 'flex', gap: '14px', padding: '16px 16px 14px' }}>
          {/* date block */}
          <div style={{ flex: '0 0 auto', width: '62px', textAlign: 'center', borderRadius: '12px', background: 'var(--muted,#1F2530)', border: '1px solid var(--border,rgba(255,255,255,.08))', padding: '9px 0' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)' }}>{d.dow}</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '26px', lineHeight: 1, letterSpacing: '-.03em', color: 'var(--foreground,#F4EFE6)', margin: '2px 0' }}>{d.day}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--primary,#C9A24B)' }}>{d.month}</div>
            {d.multiDate ? (
              <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.04em', color: 'var(--subtle-foreground,#6B7480)', marginTop: '3px' }}>+{d.datesCount - 1} fecha{d.datesCount - 1 > 1 ? 's' : ''}</div>
            ) : null}
          </div>

          {/* match info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
              <Badge tone={tagTone}>{d.tag}</Badge>
              <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{d.multiDate ? d.timeText : (d.time + ' hs')}</span>
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.03em', color: 'var(--muted-foreground,#9AA6B2)', marginBottom: '2px' }}>{d.comp}{d.round ? ' · ' + d.round : ''}</div>
            <h3 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '19px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', lineHeight: 1.1 }}>{d.opp}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              {d.stadiumName}
            </div>
          </div>
        </div>
      )}

      {/* availability footer */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '13px 16px', borderTop: '1px solid var(--border,rgba(255,255,255,.08))', background: 'var(--background,#0E1116)' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* dot: bespoke 8px circle — store encodes color semantics in dotStyle string */}
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', flex: '0 0 auto', background: (typeof d.dotStyle === 'string' && d.dotStyle.includes('--subtle-foreground')) ? 'var(--subtle-foreground,#6B7480)' : 'var(--success,#34D17E)' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.availTxt}</span>
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.04em', color: 'var(--subtle-foreground,#6B7480)', marginTop: '3px' }}>{d.priceLabel} · {d.priceTxt}</div>
        </div>
        <Btn label={d.ctaLabel} size="sm" variant={ctaDisabled ? 'secondary' : 'primary'} disabled={ctaDisabled} onClick={d.open} />
      </div>
    </Card>
  )
}
