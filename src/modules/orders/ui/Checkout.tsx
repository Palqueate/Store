import { Banner, Btn, Card, DescriptionList, Field, SegmentedControl, Spinner } from '@/lib'
import { css } from '@/shared/ui/css'
import { useCheckoutVM } from './useCheckoutVM'

export default function Checkout() {
  const vals = useCheckoutVM()
  return (
    <div style={css('max-width:1060px; margin:0 auto; padding:clamp(18px,3vw,32px) clamp(16px,4vw,40px) 60px;')}>
      <button
        onClick={vals.goCart}
        style={css('display:inline-flex; align-items:center; gap:8px; background:none; border:none; cursor:pointer; color:var(--muted-foreground,#9AA6B2); font-family:\'Archivo\'; font-weight:600; font-size:14px; margin-bottom:14px;')}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Volver al carrito
      </button>

      <h1 style={css('margin:0 0 22px; font-family:\'Archivo\'; font-weight:800; font-stretch:110%; letter-spacing:-.03em; font-size:clamp(28px,4.5vw,42px); color:var(--foreground,#F4EFE6);')}>
        Finalizá tu reserva
      </h1>

      {vals.loggedOut ? (
        <div style={{ marginBottom: '18px' }}>
          <Banner
            tone="brand"
            action={
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <Btn label="Ingresar" variant="secondary" size="sm" onClick={vals.openLogin} />
                <Btn label="Crear cuenta" variant="primary" size="sm" onClick={vals.openRegister} />
              </div>
            }
          >
            <div>
              <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)' }}>
                Iniciá sesión para completar tu compra
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                Así guardás tu reserva y la ves en tu historial.
              </div>
            </div>
          </Banner>
        </div>
      ) : null}

      <div style={css(vals.checkoutCol)}>
        <div style={css('display:flex; flex-direction:column; gap:16px;')}>
          {/* Section 1 — Contact */}
          <Card padding="20px">
            <div style={css('font-family:\'Archivo\'; font-weight:800; font-size:16px; color:var(--foreground,#F4EFE6); margin-bottom:16px; display:flex; align-items:center; gap:9px;')}>
              <span style={css('width:24px; height:24px; border-radius:50%; background:var(--primary,#C9A24B); color:var(--primary-foreground,#1A1407); display:grid; place-items:center; font-family:\'Space Mono\'; font-weight:700; font-size:12px;')}>1</span>
              Tus datos
            </div>
            <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
              <div style={css('grid-column:1 / -1;')}>
                <Field
                  label="NOMBRE Y APELLIDO"
                  value={vals.contactName}
                  onInput={vals.setName}
                  placeholder="Ej. María Eugenia"
                />
              </div>
              <div style={css('grid-column:1 / -1;')}>
                <Field
                  label="CORREO"
                  type="email"
                  value={vals.contactEmail}
                  onInput={vals.setEmail}
                  placeholder="vos@correo.com"
                />
              </div>
            </div>
          </Card>

          {/* Section 2 — Payment */}
          <Card padding="20px">
            <div style={css('font-family:\'Archivo\'; font-weight:800; font-size:16px; color:var(--foreground,#F4EFE6); margin-bottom:16px; display:flex; align-items:center; gap:9px;')}>
              <span style={css('width:24px; height:24px; border-radius:50%; background:var(--primary,#C9A24B); color:var(--primary-foreground,#1A1407); display:grid; place-items:center; font-family:\'Space Mono\'; font-weight:700; font-size:12px;')}>2</span>
              Pago
            </div>

            <div style={{ marginBottom: '16px' }}>
              <SegmentedControl
                block
                segments={[
                  { value: 'card', label: 'Tarjeta' },
                  { value: 'transfer', label: 'Transferencia' },
                ]}
                value={vals.payMethod}
                onChange={vals.setPayMethod}
              />
            </div>

            <div style={css('display:grid; grid-template-columns:1fr 1fr; gap:12px;')}>
              <div style={css('grid-column:1 / -1;')}>
                <Field label="NÚMERO DE TARJETA" placeholder="1234 5678 9012 3456" />
              </div>
              <Field label="VENCE" placeholder="MM/AA" />
              <Field label="CVV" placeholder="123" />
            </div>
          </Card>
        </div>

        {/* Aside — Order summary */}
        <aside style={css(vals.stickySum)}>
          <Card padding="18px">
            <div style={css('font-family:\'Archivo\'; font-weight:800; font-size:16px; color:var(--foreground,#F4EFE6); margin-bottom:14px;')}>
              Tu reserva
            </div>

            {/* Cart items — cada palco con su estacionamiento y snacks */}
            <div style={css('display:flex; flex-direction:column; gap:12px; margin-bottom:14px;')}>
              {(vals.cartItems || []).map((it: any, i: number) => (
                <div key={i} style={css('display:flex; flex-direction:column; gap:3px; font-size:13px;')}>
                  <div style={css('display:flex; justify-content:space-between; gap:10px;')}>
                    <span style={css('color:var(--foreground,#F4EFE6); font-weight:600; min-width:0;')}>{it.title}</span>
                    <span style={css('color:var(--foreground,#F4EFE6); white-space:nowrap; font-family:\'Archivo\'; font-weight:700;')}>{it.lineTotal}</span>
                  </div>
                  <span style={css('color:var(--muted-foreground,#9AA6B2); font-size:12px;')}>{it.seatsText}</span>
                  {it.hasParking ? (
                    <span style={css('color:var(--muted-foreground,#9AA6B2); font-size:12px;')}>🅿️ {it.parkingText} · {it.parkingPrice}</span>
                  ) : null}
                  {it.hasSnacks ? (
                    <span style={css('color:var(--muted-foreground,#9AA6B2); font-size:12px;')}>🍿 {it.snackCount} snack{it.snackCount === 1 ? '' : 's'} · {it.snacksTotalTxt}</span>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Summary breakdown */}
            <DescriptionList
              items={[
                { term: 'Subtotal palco', value: vals.cartSub },
                { term: 'Comisión', value: vals.cartFee },
                ...(vals.hasSnacks ? [{ term: 'Botana y bebidas', value: vals.cartSnacks }] : []),
              ]}
            />

            {/* Total row */}
            <div style={css('display:flex; justify-content:space-between; align-items:baseline; margin-top:12px; padding-top:12px; border-top:1px solid var(--border,rgba(255,255,255,.1));')}>
              <span style={css('font-family:\'Archivo\'; font-weight:700; color:var(--foreground,#F4EFE6);')}>Total</span>
              <span style={css('font-family:\'Archivo\'; font-weight:900; font-size:23px; color:var(--foreground,#F4EFE6);')}>{vals.cartTotal}</span>
            </div>

            {/* Pay button */}
            <div style={{ marginTop: '16px' }}>
              <Btn
                label={vals.payLabel}
                variant="primary"
                size="lg"
                block
                disabled={!!vals.paying}
                leadingIcon={vals.paying ? <Spinner size={17} color="var(--primary-foreground,#1A1407)" /> : undefined}
                onClick={vals.pay}
              />
            </div>

            <p style={css('margin:10px 0 0; text-align:center; font-size:11px; color:var(--subtle-foreground,#6B7480);')}>
              Pago protegido · prototipo, no se cobra de verdad
            </p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
