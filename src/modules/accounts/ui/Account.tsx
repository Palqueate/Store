import { useAccountVM } from './useAccountVM'
import { css } from '@/shared/ui/css'
import {
  Avatar,
  Badge,
  Btn,
  Card,
  Divider,
  EmptyState,
  Field,
  SegmentedControl,
  Select,
  Stack,
  StatTile,
  Toggle,
} from '@/lib'

const TABS = [
  { value: 'compras', label: 'Mis compras' },
  { value: 'perfil', label: 'Datos de la cuenta' },
]

// ── small icon helpers ──────────────────────────────────────────────────────
function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconCard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  )
}

// ── order card ──────────────────────────────────────────────────────────────
function OrderCard({ o }: { o: any }) {
  return (
    <Card padding="0" style={{ overflow: 'hidden' }}>
      {/* header row */}
      <div style={css("display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; padding:15px 18px; background:var(--muted,#1F2530); border-bottom:1px solid var(--border,rgba(255,255,255,.08));")}>
        <Stack direction="row" gap={12} align="center">
          <span style={css("font-family:'Space Mono'; font-size:13px; font-weight:700; color:var(--foreground,#F4EFE6);")}>{o.code}</span>
          <span style={css("font-size:12.5px; color:var(--subtle-foreground,#6B7480);")}>{o.date}</span>
        </Stack>
        <span style={css("font-family:'Archivo'; font-weight:800; font-size:16px; color:var(--foreground,#F4EFE6);")}>{o.total}</span>
      </div>

      {/* items */}
      <div style={{ padding: '14px 18px' }}>
        <Stack gap={12}>
          {(o.items || []).map((it: any, i: number) => (
            <Stack key={i} direction="row" gap={12} align="flex-start">
              <span style={css("flex:0 0 auto; width:34px; height:34px; border-radius:9px; background:color-mix(in srgb,var(--primary,#C9A24B) 16%, var(--background,#0E1116)); display:grid; place-items:center; color:var(--primary,#C9A24B);")}><IconPin /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={css("font-family:'Archivo'; font-weight:700; font-size:14.5px; color:var(--foreground,#F4EFE6);")}>{it.title}</div>
                <div style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>{it.stadiumName} · {it.modeLabel}</div>
                <div style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>{it.seatsText} · {it.meta}</div>
              </div>
              <span style={css("font-family:'Archivo'; font-weight:700; font-size:14px; color:var(--foreground,#F4EFE6); white-space:nowrap;")}>{it.price}</span>
            </Stack>
          ))}

          {o.hasFood ? (
            <>
              <Divider dashed />
              <div>
                <div style={css("font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:8px;")}>BOTANA &amp; BEBIDAS</div>
                <Stack gap={6}>
                  {(o.foodLines || []).map((f: any, i: number) => (
                    <Stack key={i} direction="row" gap={8} align="center" style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                      <span style={css("min-width:20px; height:20px; padding:0 5px; border-radius:6px; background:var(--muted,#1F2530); color:var(--primary,#C9A24B); font-family:'Space Mono'; font-weight:700; font-size:11px; display:grid; place-items:center;")}>{f.qty}</span>
                      <span style={{ flex: 1 }}>{f.name}</span>
                      <span style={css("color:var(--foreground,#F4EFE6); font-family:'Archivo'; font-weight:600;")}>{f.price}</span>
                    </Stack>
                  ))}
                </Stack>
              </div>
            </>
          ) : null}
        </Stack>
      </div>

      {/* footer: sumar más botana y bebidas a esta compra (si el evento no pasó) */}
      <div style={css("display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:10px; padding:13px 18px; border-top:1px solid var(--border,rgba(255,255,255,.08));")}>
        <span style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>
          {!o.canAddSnacks
            ? 'El evento ya pasó · botana no disponible'
            : (o.hasFood ? '¿Querés sumar más botana y bebidas?' : '¿Sumás botana y bebidas para el día del evento?')}
        </span>
        <Btn label={o.hasFood ? 'Sumar más snacks' : 'Agregar snacks'} icon="plus" variant="secondary" size="sm" disabled={!o.canAddSnacks} onClick={o.addSnacks} />
      </div>
    </Card>
  )
}

// ── notification row ────────────────────────────────────────────────────────
function NotifRow({ label, sub, on, onToggle, last = false }: { label: string; sub: string; on: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      padding: '13px 0',
      borderBottom: last ? 'none' : '1px solid var(--border,rgba(255,255,255,.07))',
    }}>
      <div>
        <div style={css("font-family:'Archivo'; font-weight:700; font-size:14.5px; color:var(--foreground,#F4EFE6);")}>{label}</div>
        <div style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>{sub}</div>
      </div>
      <Toggle on={on} onToggle={onToggle} />
    </div>
  )
}

// ── section card (consistent heading + content) ─────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <h3 style={css("margin:0 0 18px; font-family:'Archivo'; font-weight:800; font-size:17px; color:var(--foreground,#F4EFE6);")}>{title}</h3>
      {children}
    </Card>
  )
}

// ── main screen ─────────────────────────────────────────────────────────────
export default function Account() {
  const vals = useAccountVM()
  const activeTab = vals.acctTabCompras ? 'compras' : 'perfil'

  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 64px' }}>

      {/* ── hero header ── */}
      <Stack direction="row" gap={16} align="center" wrap style={{ marginBottom: '20px' }}>
        <Avatar
          src={vals.acctHasPhoto ? vals.acctPhoto : undefined}
          name={vals.userInitials ?? vals.userName ?? ''}
          size={72}
          square
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <Stack direction="row" gap={9} align="center" wrap style={{ marginBottom: '3px' }}>
            <h1 style={css("margin:0; line-height:1.05; font-family:'Archivo'; font-weight:800; font-stretch:110%; letter-spacing:-.03em; font-size:clamp(24px,3.6vw,34px); color:var(--foreground,#F4EFE6);")}>{vals.userName}</h1>
            {vals.acctVerified ? (
              <Badge tone="success">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
                Verificada
              </Badge>
            ) : null}
          </Stack>
          <div style={css("font-size:13.5px; color:var(--muted-foreground,#9AA6B2);")}>{vals.userEmail} · miembro desde {vals.memberSince}</div>
        </div>
      </Stack>

      {/* ── stat strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '12px', marginBottom: '22px' }}>
        {(vals.acctStats || []).map((st: any, i: number) => (
          <StatTile key={i} data={st} />
        ))}
      </div>

      {/* ── tab switcher ── */}
      <div style={{ marginBottom: '22px', maxWidth: '360px' }}>
        <SegmentedControl
          block
          segments={TABS}
          value={activeTab}
          onChange={(v) => v === 'compras' ? vals.setAcctCompras() : vals.setAcctPerfil()}
        />
      </div>

      {/* ══════════════════════════ COMPRAS ══════════════════════════ */}
      {vals.acctTabCompras ? (
        <>
          {vals.hasOrders ? (
            <Stack gap={14}>
              {(vals.myOrders || []).map((o: any, i: number) => (
                <OrderCard key={i} o={o} />
              ))}
            </Stack>
          ) : null}

          {vals.noOrdersAcct ? (
            <Card style={{ border: '1px dashed var(--border,rgba(255,255,255,.14))' }}>
              <EmptyState
                title="Todavía no hiciste compras"
                description="Reservá un palco o un asiento y tus compras van a aparecer acá."
                action={<Btn label="Ver eventos" onClick={vals.goEvents} />}
              />
            </Card>
          ) : null}
        </>
      ) : null}

      {/* ══════════════════════════ PERFIL ═══════════════════════════ */}
      {vals.acctTabPerfil ? (
        <Stack gap={16}>

          {/* foto de perfil */}
          <Card>
            <h3 style={css("margin:0 0 16px; font-family:'Archivo'; font-weight:800; font-size:17px; color:var(--foreground,#F4EFE6);")}>Foto de perfil</h3>
            <Stack direction="row" gap={18} align="center" wrap>
              <Avatar
                src={vals.acctHasPhoto ? vals.acctPhoto : undefined}
                name={vals.userInitials ?? vals.userName ?? ''}
                size={84}
                square
              />
              <Stack gap={9}>
                <label style={css("display:inline-flex; align-items:center; gap:8px; height:42px; padding:0 16px; border-radius:11px; border:none; background:var(--primary,#C9A24B); color:var(--primary-foreground,#1A1407); font-family:'Archivo'; font-weight:800; font-size:13.5px; cursor:pointer;")}>
                  <IconCamera />
                  Subir foto
                  <input type="file" accept="image/*" onChange={vals.onPhotoPick} style={{ display: 'none' }} />
                </label>
                {vals.acctHasPhoto ? (
                  <Btn label="Quitar foto" variant="secondary" size="sm" onClick={vals.removePhoto} />
                ) : null}
                <span style={css("font-size:11.5px; color:var(--subtle-foreground,#6B7480);")}>JPG o PNG, se recorta a cuadrado.</span>
              </Stack>
            </Stack>
          </Card>

          {/* datos personales */}
          <SectionCard title="Datos personales">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
              <Field label="NOMBRE Y APELLIDO" value={vals.pfName} onInput={vals.setPfName} />
              <Field label="CÉDULA DE IDENTIDAD" value={vals.pfCi} onInput={vals.setPfCi} placeholder="0.000.000-0" />
              <Field label="CORREO" type="email" value={vals.pfEmail} onInput={vals.setPfEmail} />
              <Field label="TELÉFONO" type="tel" value={vals.pfPhone} onInput={vals.setPfPhone} placeholder="099 123 456" />
              <Field label="FECHA DE NACIMIENTO" type="date" value={vals.pfBirth} onInput={vals.setPfBirth} />
            </div>
          </SectionCard>

          {/* dirección */}
          <SectionCard title="Dirección">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <Field label="DIRECCIÓN" value={vals.pfAddress} onInput={vals.setPfAddress} placeholder="Calle, número, apto" />
              </div>
              <Field label="CIUDAD" value={vals.pfCity} onInput={vals.setPfCity} />
              <Field label="PAÍS" value={vals.pfCountry} onInput={vals.setPfCountry} />
            </div>
            <div style={{ marginTop: '20px' }}>
              <Btn label="Guardar cambios" onClick={vals.saveProfile} />
            </div>
          </SectionCard>

          {/* preferencias */}
          <SectionCard title="Preferencias">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px' }}>
              <Select
                label="ESTADIO FAVORITO"
                value={vals.favStadiumVal}
                onChange={(v) => vals.setFavStadium({ target: { value: v } } as any)}
                options={vals.stadiumOptions}
              />
              <Select
                label="IDIOMA"
                value={vals.langVal}
                onChange={(v) => vals.setLang({ target: { value: v } } as any)}
                options={[
                  { value: 'Español (UY)', label: 'Español (UY)' },
                  { value: 'Português (BR)', label: 'Português (BR)' },
                  { value: 'English (US)', label: 'English (US)' },
                ]}
              />
            </div>
          </SectionCard>

          {/* notificaciones */}
          <Card>
            <h3 style={css("margin:0 0 6px; font-family:'Archivo'; font-weight:800; font-size:17px; color:var(--foreground,#F4EFE6);")}>Notificaciones</h3>
            <p style={css("margin:0 0 16px; font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>Elegí cómo querés que te avisemos.</p>
            <div>
              <NotifRow label="Correo electrónico" sub="Confirmaciones y recordatorios de eventos" on={vals.notifEmail} onToggle={vals.toggleNotifEmail} />
              <NotifRow label="SMS" sub="Avisos urgentes el día del evento" on={vals.notifSms} onToggle={vals.toggleNotifSms} />
              <NotifRow label="Push" sub="Notificaciones en la app" on={vals.notifPush} onToggle={vals.toggleNotifPush} />
              <NotifRow label="Promociones" sub="Ofertas y novedades de Palqueate" on={vals.notifPromos} onToggle={vals.toggleNotifPromos} last />
            </div>
          </Card>

          {/* método de pago */}
          <Card>
            <h3 style={css("margin:0 0 16px; font-family:'Archivo'; font-weight:800; font-size:17px; color:var(--foreground,#F4EFE6);")}>Método de pago</h3>
            <Stack direction="row" gap={14} align="center" style={{ padding: '16px', borderRadius: '13px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
              <span style={css("flex:0 0 auto; width:46px; height:32px; border-radius:7px; background:linear-gradient(135deg, var(--primary,#C9A24B), color-mix(in srgb,var(--primary,#C9A24B) 60%, #000)); display:grid; place-items:center; color:var(--primary-foreground,#1A1407);")}><IconCard /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={css("font-family:'Archivo'; font-weight:700; font-size:14.5px; color:var(--foreground,#F4EFE6);")}>{vals.cardBrand} •••• {vals.cardLast4}</div>
                <div style={css("font-size:12.5px; color:var(--muted-foreground,#9AA6B2);")}>{vals.cardName} · vence {vals.cardExp}</div>
              </div>
              <span style={css("font-family:'Space Mono'; font-size:11px; color:var(--subtle-foreground,#6B7480);")}>Principal</span>
            </Stack>
          </Card>

          {/* sesión */}
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Btn label="Cerrar sesión" icon="logout" variant="danger" onClick={vals.doLogout} />
          </div>

        </Stack>
      ) : null}

    </div>
  )
}
