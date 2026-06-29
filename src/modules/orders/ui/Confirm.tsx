import { Btn, Card, Banner, Result } from '@/lib'
import { css } from '@/shared/ui/css'
import { useConfirmVM } from './useConfirmVM'

export default function Confirm() {
  const vals = useConfirmVM()
  if (!vals.conf) return null
  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: 'clamp(16px,4vw,40px) clamp(16px,4vw,40px) 64px' }}>
      <Result status="success" title="¡Reserva confirmada!" description="Te enviamos los detalles por correo. Tu lugar te espera en el estadio." />

      <Card padding="0" style={{ textAlign: 'left', overflow: 'hidden', borderRadius: '18px' }}>
        <div style={css("display:flex; align-items:center; justify-content:space-between; gap:14px; padding:18px 20px; background:var(--muted,#1F2530); border-bottom:1px dashed var(--border,rgba(255,255,255,.16));")}>
          <div>
            <div style={css("font-family:'Space Mono'; font-size:10px; letter-spacing:.1em; color:var(--subtle-foreground,#6B7480); margin-bottom:4px;")}>CÓDIGO DE RESERVA</div>
            <div style={css("font-family:'Archivo'; font-weight:900; font-size:22px; letter-spacing:.02em; color:var(--foreground,#F4EFE6);")}>{vals.conf.code}</div>
          </div>
          <div style={css("width:58px; height:58px; border-radius:10px; background:repeating-linear-gradient(45deg, var(--foreground,#F4EFE6) 0 4px, var(--muted,#1F2530) 4px 8px); border:3px solid var(--foreground,#F4EFE6);")} title="QR" />
        </div>
        <div style={css("padding:18px 20px; display:flex; flex-direction:column; gap:14px;")}>
          {(vals.conf.items || []).map((it: any, i: number) => (
            <div key={i} style={css("display:flex; gap:13px; align-items:flex-start;")}>
              <span style={css("flex:0 0 auto; width:38px; height:38px; border-radius:9px; background:color-mix(in srgb,var(--primary,#C9A24B) 16%, var(--background,#0E1116)); display:grid; place-items:center; color:var(--primary,#C9A24B);")}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg></span>
              <div style={css("flex:1;")}>
                <div style={css("font-family:'Archivo'; font-weight:700; font-size:15px; color:var(--foreground,#F4EFE6);")}>{it.title}</div>
                <div style={css("font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>{it.stadiumName} · {it.modeLabel}</div>
                <div style={css("font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>{it.seatsText} · {it.meta}</div>
              </div>
              <div style={css("font-family:'Archivo'; font-weight:800; font-size:15px; color:var(--foreground,#F4EFE6); white-space:nowrap;")}>{it.price}</div>
            </div>
          ))}
          <div style={css("display:flex; justify-content:space-between; align-items:baseline; padding-top:13px; border-top:1px solid var(--border,rgba(255,255,255,.1));")}>
            <span style={css("color:var(--muted-foreground,#9AA6B2); font-size:14px;")}>Total pagado</span>
            <span style={css("font-family:'Archivo'; font-weight:900; font-size:22px; color:var(--foreground,#F4EFE6);")}>{vals.conf.total}</span>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <Banner tone="success" action={<Btn label="Ver el menú" onClick={vals.goFood} />}>
          <div>
            <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Pedí tu botana y bebidas 🍻</div>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)', marginTop: '2px' }}>Dejá todo listo y encontralo servido apenas llegues al palco.</div>
          </div>
        </Banner>
      </div>

      <div style={{ marginTop: '18px', textAlign: 'center' }}>
        <Btn label="Volver al inicio" variant="secondary" onClick={vals.goHome} />
      </div>
    </div>
  )
}
