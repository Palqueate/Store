import { Result, Card, Btn } from '@/lib'
import { css } from '@/shared/ui/css'
import { useFoodConfirmVM } from './useFoodConfirmVM'

export default function FoodConfirm() {
  const vals = useFoodConfirmVM()
  return (
    <div style={{ maxWidth: '660px', margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,4vw,40px) 64px', textAlign: 'center' }}>
      <Result
        status="success"
        title="¡Pedido confirmado!"
        description={
          <>
            Tu botana y bebidas te esperan en <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>{vals.resCtx.palco}</strong>. Llegás y está todo servido.
          </>
        }
      />

      <Card padding="0" style={{ textAlign: 'left', overflow: 'hidden', borderRadius: '18px' }}>
        <div style={css('padding:20px;')}>
          <div style={css("font-family:'Space Mono'; font-size:11px; letter-spacing:.1em; color:var(--subtle-foreground,#6B7480); margin-bottom:14px;")}>
            PEDIDO · {vals.resCtx.code}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(vals.foodLines || []).map((l: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={css("flex:0 0 auto; min-width:24px; height:24px; padding:0 6px; border-radius:7px; background:var(--muted,#1F2530); color:var(--primary,#C9A24B); font-family:'Space Mono'; font-weight:700; font-size:12px; display:grid; place-items:center;")}>
                  {l.qty}
                </span>
                <span style={{ flex: 1, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{l.name}</span>
                <span style={css("font-family:'Archivo'; font-weight:700; font-size:14px; color:var(--foreground,#F4EFE6);")}>{l.price}</span>
              </div>
            ))}
          </div>
          <div style={css("display:flex; justify-content:space-between; align-items:baseline; margin-top:14px; padding-top:13px; border-top:1px solid var(--border,rgba(255,255,255,.1));")}>
            <span style={{ color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14px' }}>Total</span>
            <span style={css("font-family:'Archivo'; font-weight:900; font-size:22px; color:var(--foreground,#F4EFE6);")}>{vals.foodTotalTxt}</span>
          </div>
        </div>
      </Card>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '22px' }}>
        <Btn label={vals.backLabel} variant="primary" onClick={vals.back} />
        <Btn label="Ir al inicio" variant="secondary" onClick={vals.goHome} />
      </div>
    </div>
  )
}
