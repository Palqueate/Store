import { Card, Badge, Btn } from '@/lib'

// `data` is the evCardVM produced by the store.
export default function EventCard({ data }: { data: any }) {
  const d = data || {}

  // Derive Badge tone from the tag value (mirrors evTagStyle in store).
  const tagTone = d.tag === 'Copa' ? 'brand' : d.tag === 'Destacado' ? 'success' : 'neutral'

  // Derive disabled state from the CTA style string (sold-out path sets cursor:not-allowed).
  const ctaDisabled = typeof d.ctaStyle === 'string' && d.ctaStyle.includes('not-allowed')

  // Compact card shows only the first image as a thumbnail (no carousel here).
  const thumb = (d.images && d.images[0]) || d.image || ''

  return (
    <Card hover onClick={d.open} padding="0" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '14px', padding: '16px 16px 14px' }}>
        {/* event image thumbnail — only when one was uploaded */}
        {thumb ? (
          <div style={{ flex: '0 0 auto', width: '62px', height: '62px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.08))' }}>
            <img src={thumb} alt={'vs ' + (d.opp || '')} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        ) : null}

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
          <h3 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '19px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', lineHeight: 1.1 }}>vs {d.opp}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {d.stadiumName}
          </div>
        </div>
      </div>

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
