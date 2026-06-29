import { css } from '@/shared/ui/css'
import { Btn, Card, Chip, QuantityStepper, EmptyState } from '@/lib'
import { useFoodVM } from './useFoodVM'

export default function Food() {
  const vals = useFoodVM()
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(16px,2.5vw,28px) clamp(16px,4vw,40px) 90px' }}>
      {/* Back nav */}
      <Btn
        label="Volver a mi reserva"
        variant="ghost"
        icon="back"
        onClick={vals.goConfirm}
        size="sm"
      />
      <div style={{ marginBottom: '16px' }} />

      {/* Header row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>BOTANA &amp; BEBIDAS</div>
          <h1 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '115%', letterSpacing: '-.035em', fontSize: 'clamp(28px,5vw,46px)', color: 'var(--foreground,#F4EFE6)' }}>Dejá todo servido</h1>
        </div>

        {/* Venue badge */}
        <Card padding="10px 14px" style={{ borderRadius: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '34px', height: '34px', borderRadius: '9px', background: 'color-mix(in srgb,var(--success,#34D17E) 18%, var(--background,#0E1116))', display: 'grid', placeItems: 'center', color: 'var(--success,#34D17E)' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            <div style={{ lineHeight: '1.25' }}>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{vals.resCtx.palco}</div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.resCtx.stadium}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Two-column layout: menu + order aside */}
      <div style={css(vals.foodWrap)}>
        {/* ── Left: category filter + food grid ── */}
        <div style={{ minWidth: 0 }}>
          {/* Category filter chips */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', paddingBottom: '6px', marginBottom: '18px' }}>
            {(vals.foodCatChips || []).map((c: any, i: number) => (
              <Chip key={i} active={c.active} onClick={c.pick}>
                {c.label}
              </Chip>
            ))}
          </div>

          {/* Food item grid */}
          <div style={css(vals.foodGrid)}>
            {(vals.foodItems || []).map((it: any, i: number) => (
              <Card key={i} padding="0" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '14px' }}>
                {/* Thumbnail placeholder */}
                <div style={{ position: 'relative', aspectRatio: '5/4', background: 'repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 11px, var(--card,#171B22) 11px 22px)', display: 'grid', placeItems: 'center', color: 'var(--subtle-foreground,#6B7480)' }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                  <span style={{ position: 'absolute', top: '9px', left: '10px', fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.06em', color: 'var(--subtle-foreground,#6B7480)' }}>{it.catTag}</span>
                </div>

                {/* Card body */}
                <div style={{ padding: '13px', display: 'flex', flexDirection: 'column', gap: '9px', flex: 1 }}>
                  <div>
                    <h3 style={{ margin: '0 0 3px', fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', lineHeight: '1.2' }}>{it.name}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>{it.desc}</div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--primary,#C9A24B)' }}>{it.price}</span>

                    {/* noQty: item not yet in cart → show Add button */}
                    {it.noQty ? (
                      <Btn label="Agregar" icon="plus" size="sm" variant="secondary" onClick={it.add} />
                    ) : null}

                    {/* hasQty: item already in cart → show QuantityStepper */}
                    {it.hasQty ? (
                      <QuantityStepper
                        value={it.qty}
                        min={0}
                        max={99}
                        onChange={(next) => {
                          if (next > it.qty) it.add()
                          else it.dec()
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Right: order aside ── */}
        <aside style={css(vals.stickySum)}>
          <Card padding="18px">
            {/* Aside header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Tu pedido</span>
              <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>{vals.foodCount} ítems</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '14px' }}>
              Servido en {vals.resCtx.palco} cuando llegues.
            </div>

            {/* Empty order state */}
            {vals.foodEmpty ? (
              <EmptyState
                title="Todavía no agregaste nada"
                description="Agregá botana y bebidas del menú."
                icon={<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />}
              />
            ) : null}

            {/* Order lines + total + CTA */}
            {vals.hasFood ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', maxHeight: '280px', overflow: 'auto' }}>
                  {(vals.foodLines || []).map((l: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ flex: '0 0 auto', minWidth: '24px', height: '24px', padding: '0 6px', borderRadius: '7px', background: 'var(--muted,#1F2530)', color: 'var(--primary,#C9A24B)', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '12px', display: 'grid', placeItems: 'center' }}>{l.qty}</span>
                      <span style={{ flex: 1, minWidth: 0, fontSize: '13px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.name}</span>
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>{l.price}</span>
                    </div>
                  ))}
                </div>

                {/* Total row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '14px', paddingTop: '13px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 700, color: 'var(--foreground,#F4EFE6)' }}>Total</span>
                  <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>{vals.foodTotalTxt}</span>
                </div>

                {/* Confirm CTA */}
                <div style={{ marginTop: '16px' }}>
                  <Btn label="Confirmar pedido" block onClick={vals.confirmFood} size="lg" />
                </div>
              </>
            ) : null}
          </Card>
        </aside>
      </div>
    </div>
  )
}
