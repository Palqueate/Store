import { TrashIcon } from '@heroicons/react/24/outline'
import { Btn, Card, EmptyState, QuantityStepper, Tag, DescriptionList } from '@/lib'
import { css } from '@/shared/ui/css'
import { useCartVM } from './useCartVM'

export default function Cart() {
  const vals = useCartVM()
  return (
    <div style={css("max-width:1060px; margin:0 auto; padding:clamp(18px,3vw,32px) clamp(16px,4vw,40px) 60px;")}>
      <h1 style={css("margin:0 0 22px; font-family:'Archivo'; font-weight:800; font-stretch:110%; letter-spacing:-.03em; font-size:clamp(28px,4.5vw,42px); color:var(--foreground,#F4EFE6);")}>Tu carrito</h1>

      {vals.cartEmpty ? (
        <EmptyState
          icon={<><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></>}
          title="Tu carrito está vacío"
          description="Buscá un evento y reservá tu lugar para la temporada o el próximo partido."
          action={<Btn label="Explorar eventos" onClick={vals.goExplore} />}
        />
      ) : null}

      {vals.hasCartItems ? (
        <div style={css(vals.cartCol)}>
          <div style={css("display:flex; flex-direction:column; gap:12px;")}>
            {(vals.cartItems || []).map((it: any, i: number) => (
              <Card key={i} padding="15px">
                <div style={css("display:flex; gap:14px;")}>
                  <div style={css("flex:0 0 auto; width:84px; height:84px; border-radius:11px; background:repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 10px, var(--card,#171B22) 10px 20px); display:grid; place-items:center; font-family:'Space Mono'; font-size:9px; color:var(--subtle-foreground,#6B7480);")}>PALCO</div>
                  <div style={css("flex:1; min-width:0;")}>
                    <div style={css("display:flex; align-items:center; gap:8px; margin-bottom:5px;")}>
                      <Tag>{it.tag}</Tag>
                      <span style={css("font-size:12px; color:var(--subtle-foreground,#6B7480);")}>{it.stadiumName}</span>
                    </div>
                    <h3 style={css("margin:0 0 3px; font-family:'Archivo'; font-weight:800; font-size:17px; color:var(--foreground,#F4EFE6);")}>{it.title}</h3>
                    <div style={css("font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>{it.modeLabel}</div>
                    <div style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>{it.meta}</div>
                  </div>
                  <button className="pq-trash" aria-label="Quitar reserva" onClick={it.remove}>
                    <TrashIcon />
                  </button>
                </div>

                {/* Desglose del ítem: cada concepto con su importe + subtotal */}
                <div style={css("margin-top:12px; padding-top:12px; border-top:1px solid var(--border,rgba(255,255,255,.1)); display:flex; flex-direction:column; gap:6px;")}>
                  <div style={css("display:flex; justify-content:space-between; gap:12px; font-size:13.5px;")}>
                    <span style={css("color:var(--foreground,#F4EFE6); font-weight:600;")}>{it.baseLabel}<span style={css("color:var(--muted-foreground,#9AA6B2); font-weight:400;")}>{it.qtyNote}</span></span>
                    <span style={css("color:var(--foreground,#F4EFE6); white-space:nowrap;")}>{it.price}</span>
                  </div>
                  {it.hasParking ? (
                    <div style={css("display:flex; justify-content:space-between; gap:12px; font-size:13.5px;")}>
                      <span style={css("color:var(--foreground,#F4EFE6); font-weight:600;")}>🅿️ {it.parkingText}<span style={css("color:var(--muted-foreground,#9AA6B2); font-weight:400;")}>{it.parkingUnitNote}</span></span>
                      <span style={css("color:var(--foreground,#F4EFE6); white-space:nowrap;")}>{it.parkingPrice}</span>
                    </div>
                  ) : null}
                  {(it.snackLines || []).map((sn: any, j: number) => (
                    <div key={j} style={css("display:flex; justify-content:space-between; align-items:center; gap:10px; font-size:13.5px;")}>
                      <span style={css("color:var(--foreground,#F4EFE6); font-weight:600; min-width:0; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;")}>🍿 {sn.name}</span>
                      <div style={css("display:flex; align-items:center; gap:10px; flex:0 0 auto;")}>
                        <QuantityStepper
                          value={sn.qty}
                          min={1}
                          max={99}
                          onChange={(next: number) => { if (next > sn.qty) sn.inc(); else if (next < sn.qty) sn.dec() }}
                        />
                        <span style={css("color:var(--foreground,#F4EFE6); white-space:nowrap; min-width:64px; text-align:right;")}>{sn.price}</span>
                        <button className="pq-trash" aria-label="Quitar snack" onClick={sn.remove}>
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={it.editSnacks}
                    style={css("align-self:flex-start; margin-top:2px; background:none; border:none; cursor:pointer; padding:0; font-family:'Archivo'; font-weight:700; font-size:12.5px; color:var(--primary,#C9A24B);")}
                  >
                    {it.hasSnacks ? '🍿 Editar botana y bebidas' : '🍿 Agregar botana y bebidas'}
                  </button>
                  <div style={css("display:flex; justify-content:space-between; gap:12px; align-items:baseline; margin-top:4px;")}>
                    <span style={css("font-family:'Archivo'; font-weight:700; font-size:13px; color:var(--subtle-foreground,#6B7480);")}>Subtotal del ítem</span>
                    <span style={css("font-family:'Archivo'; font-weight:800; font-size:18px; color:var(--foreground,#F4EFE6); white-space:nowrap;")}>{it.lineTotal}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <aside style={css(vals.stickySum)}>
            <Card padding="18px">
              <div style={css("font-family:'Archivo'; font-weight:800; font-size:16px; color:var(--foreground,#F4EFE6); margin-bottom:16px;")}>Resumen</div>
              <DescriptionList
                items={[
                  { term: 'Subtotal palco', value: vals.cartSub },
                  { term: 'Comisión de servicio', value: vals.cartFee },
                  ...(vals.hasSnacks ? [{ term: 'Botana y bebidas', value: vals.cartSnacks }] : []),
                ]}
              />
              <div style={css("display:flex; justify-content:space-between; align-items:baseline; margin-top:16px; padding-top:14px; border-top:1px solid var(--border,rgba(255,255,255,.1));")}>
                <span style={css("font-family:'Archivo'; font-weight:700; font-size:15px; color:var(--foreground,#F4EFE6);")}>Total</span>
                <span style={css("font-family:'Archivo'; font-weight:900; font-size:24px; letter-spacing:-.02em; color:var(--foreground,#F4EFE6);")}>{vals.cartTotal}</span>
              </div>
              <div style={css("margin-top:18px;")}>
                <Btn label="Ir a pagar" icon="arrow" block={true} size="lg" onClick={vals.goCheckout} />
              </div>
            </Card>
          </aside>
        </div>
      ) : null}
    </div>
  )
}
