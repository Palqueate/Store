import { css } from '@/shared/ui/css'
import { Card, Badge, Tag, Rating, Btn } from '@/lib'

// `data` is the cardVM produced by the store.
export default function PalcoCard({ data }: { data: any }) {
  const d = data || {}
  return (
    <Card
      hover
      onClick={d.open}
      padding="0"
      style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}
    >
      {/* Media / hero area */}
      <div style={{ position: 'relative', aspectRatio: '16/10', background: 'repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 13px, var(--card,#171B22) 13px 26px)', flex: '0 0 auto' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)' }}>FOTO · PALCO</div>

        {/* Stadium short name — top-left */}
        <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
          <Badge tone="neutral">{d.stadiumShort}</Badge>
        </div>

        {/* Rating pill — top-right */}
        <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Rating value={typeof d.rating === 'number' ? d.rating : parseFloat(d.rating) || 0} max={5} editable={false} allowHalf size={13} />
          <span style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--foreground,#F4EFE6)' }}>{d.rating}</span>
        </div>

        {d.statusBadge ? (
          <div style={{ position: 'absolute', bottom: '12px', left: '12px' }}>
            {/* statusStyle is a store-driven style object — kept bespoke per rule 2 */}
            <span style={css(d.statusStyle)}>{d.statusBadge}</span>
          </div>
        ) : null}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        <div>
          <h3 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)' }}>{d.title}</h3>
          <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>{d.sector}</div>
        </div>

        {/* Feature chips */}
        {(d.chips || []).length > 0 && (
          <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
            {(d.chips as string[]).map((ch, i) => (
              <Tag key={i}>{ch}</Tag>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border,rgba(255,255,255,.08))' }}>
          <div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.04em', color: 'var(--subtle-foreground,#6B7480)' }}>{d.priceLabel}</div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '20px', color: 'var(--foreground,#F4EFE6)', letterSpacing: '-.02em' }}>{d.priceText}</div>
          </div>
          <Btn label="Ver palco" variant="secondary" size="sm" />
        </div>
      </div>
    </Card>
  )
}
