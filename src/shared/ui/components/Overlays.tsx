import { useState } from 'react'
import { css } from '@/shared/ui/css'
import { Modal, Btn, Field, Select, Combobox, FileDropzone, Textarea } from '@/lib'
import { useOverlaysVM } from '@/shared/ui/vm/useOverlaysVM'
import { dataUrlExt, isImageDataUrl, fileTypeLabel } from '@/shared/lib/readImages'

const attExt = dataUrlExt
// Slug seguro para nombres de archivo (sin acentos ni símbolos).
function attSlug(s: string) {
  return (s || 'adjunto').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'adjunto'
}

// Descarga un adjunto (data URL) como archivo con un nombre legible.
function DownloadLink({ href, name, label = 'Descargar', compact = false }: any) {
  return (
    <a
      href={href}
      download={name}
      title="Descargar adjunto"
      style={compact ? {
        position: 'absolute', bottom: '5px', right: '5px', width: '24px', height: '24px',
        display: 'grid', placeItems: 'center', borderRadius: '7px', textDecoration: 'none',
        background: 'color-mix(in srgb, var(--background,#0E1116) 78%, transparent)',
        border: '1px solid var(--border,rgba(255,255,255,.2))', color: 'var(--foreground,#F4EFE6)',
      } : {
        display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px',
        padding: '6px 10px', borderRadius: '8px', textDecoration: 'none',
        border: '1px solid var(--border,rgba(255,255,255,.16))', background: 'transparent',
        color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 700, fontSize: '12px',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></svg>
      {compact ? null : label}
    </a>
  )
}

// ──────────────────────────────────────────────────────────
// BottomNav  (no lib equivalent — stays bespoke)
// ──────────────────────────────────────────────────────────
export function BottomNav() {
  const vals = useOverlaysVM()
  return (
    <>
      {vals.showMobileNav ? (<div style={css("height:66px;")} />) : null}
      <nav style={css(vals.bottomNavStyle)}>
        <button onClick={vals.goHome} style={css(vals.bnHome)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" /></svg>Explorar</button>
        <button onClick={vals.goEvents} style={css(vals.bnResults)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>Eventos</button>
        <button onClick={vals.goOwner} style={css(vals.bnOwner)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h0M15 9h0M9 13h0M15 13h0M9 17h6" /></svg>Mi palco</button>
        <button onClick={vals.goCart} style={css(vals.bnCart)}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>Carrito</button>
      </nav>
    </>
  )
}

// ──────────────────────────────────────────────────────────
// AcctBackdrop  (no lib equivalent — stays bespoke)
// ──────────────────────────────────────────────────────────
export function AcctBackdrop() {
  const vals = useOverlaysVM()
  return vals.acctMenuOpen ? (
    <div onClick={vals.toggleAcctMenu} style={css("position:fixed; inset:0; z-index:50;")} />
  ) : null
}

// ──────────────────────────────────────────────────────────
// AuthModal  →  lib Modal
// ──────────────────────────────────────────────────────────
export function AuthModal() {
  const vals = useOverlaysVM()
  return (
    <Modal open={!!vals.isAuthOpen} onClose={vals.closeAuth} width={420}>
      {/* Branded header — can't use Modal's title prop because the content
          is a conditional logo + two different heading/body pairs */}
      <div style={css("margin:-20px -20px 0; padding:24px 24px 20px; border-bottom:1px solid var(--border,rgba(255,255,255,.1));")}>
        <div style={css("display:flex; align-items:center; gap:9px; margin-bottom:6px;")}>
          <span style={css("display:grid; place-items:center; width:30px; height:30px; border-radius:8px; background:var(--primary,#C9A24B);")}><span style={css("width:11px; height:11px; border-radius:50%; border:3px solid var(--primary-foreground,#1A1407);")} /></span>
          <span style={css("font-family:'Archivo'; font-weight:900; font-size:17px; letter-spacing:-.03em; color:var(--foreground,#F4EFE6);")}>PALQUEATE</span>
        </div>
        {vals.authIsRegister ? (
          <>
            <h2 style={css("margin:6px 0 2px; font-family:'Archivo'; font-weight:800; font-size:24px; letter-spacing:-.02em; color:var(--foreground,#F4EFE6);")}>Creá tu cuenta</h2>
            <p style={css("margin:0; font-size:13.5px; color:var(--muted-foreground,#9AA6B2);")}>Para reservar palcos y ver tus compras.</p>
          </>
        ) : null}
        {vals.authIsLogin ? (
          <>
            <h2 style={css("margin:6px 0 2px; font-family:'Archivo'; font-weight:800; font-size:24px; letter-spacing:-.02em; color:var(--foreground,#F4EFE6);")}>Iniciá sesión</h2>
            <p style={css("margin:0; font-size:13.5px; color:var(--muted-foreground,#9AA6B2);")}>Bienvenido de vuelta al palco.</p>
          </>
        ) : null}
      </div>

      {/* Form body */}
      <div style={css("display:flex; flex-direction:column; gap:12px; margin-top:4px;")}>
        {vals.authIsRegister ? (
          <Field label="NOMBRE Y APELLIDO" value={vals.authName} onInput={vals.setAuthName} placeholder="Ej. María Eugenia" />
        ) : null}
        <Field label="CORREO" type="email" value={vals.authEmail} onInput={vals.setAuthEmail} placeholder="vos@correo.com" />
        {vals.authIsRegister ? (
          <Field label="TELÉFONO (OPCIONAL)" type="tel" value={vals.authPhone} onInput={vals.setAuthPhone} placeholder="099 123 456" />
        ) : null}
        <Field label="CONTRASEÑA" type="password" value={vals.authPass} onInput={vals.setAuthPass} placeholder="••••••••" />

        {vals.authErr ? (
          <div style={css("display:flex; align-items:center; gap:8px; padding:10px 12px; border-radius:10px; background:color-mix(in srgb,var(--destructive,#E5604D) 14%, var(--background,#0E1116)); border:1px solid color-mix(in srgb,var(--destructive,#E5604D) 36%, transparent); color:var(--destructive,#E5604D); font-size:13px; font-weight:600;")}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>{vals.authErr}</div>
        ) : null}

        <div style={css("margin-top:4px;")}><Btn label={vals.authSubmitLabel} block={true} size="lg" onClick={vals.submitAuth} /></div>

        {vals.authIsLogin ? (
          <>
            <div style={css("display:flex; align-items:center; gap:8px; padding:9px 12px; border-radius:10px; background:var(--muted,#1F2530); color:var(--muted-foreground,#9AA6B2); font-size:12px; line-height:1.4;")}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary,#C9A24B)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={css("flex:0 0 auto;")}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>Demo: el ingreso te lleva a la cuenta de <strong style={css("color:var(--foreground,#F4EFE6);")}>María Eugenia</strong>.</div>
            <div style={css("text-align:center; font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>¿No tenés cuenta? <button onClick={vals.switchToRegister} style={css("background:none; border:none; cursor:pointer; color:var(--primary,#C9A24B); font-family:'Archivo'; font-weight:700; font-size:13px;")}>Registrate</button></div>
          </>
        ) : null}
        {vals.authIsRegister ? (
          <div style={css("text-align:center; font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>¿Ya tenés cuenta? <button onClick={vals.switchToLogin} style={css("background:none; border:none; cursor:pointer; color:var(--primary,#C9A24B); font-family:'Archivo'; font-weight:700; font-size:13px;")}>Iniciá sesión</button></div>
        ) : null}
      </div>
    </Modal>
  )
}

// ──────────────────────────────────────────────────────────
// EventModal  →  lib Modal
// ──────────────────────────────────────────────────────────
export function EventModal() {
  const vals = useOverlaysVM()
  return (
    <Modal
      open={!!vals.adminEvModal}
      onClose={vals.closeEvModal}
      title={vals.evEditing ? 'Editar evento' : 'Nuevo evento'}
      width={520}
      footer={
        <>
          <Btn label="Cancelar" variant="ghost" onClick={vals.closeEvModal} />
          <Btn label={vals.evEditing ? 'Guardar cambios' : 'Crear evento'} icon="check" onClick={vals.adminCreateEvent} />
        </>
      }
    >
      <div style={css("display:flex; flex-direction:column; gap:14px;")}>
        <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px;")}>
          <div>
            <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>TIPO DE EVENTO</label>
            <Select value={vals.evDtype} options={vals.evTypeOptions} onChange={(v) => vals.setEvType({ target: { value: v } })} />
          </div>
          <div>
            <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>PAÍS</label>
            <Combobox value={vals.evCountry} options={vals.countryOptions} placeholder="Elegí o buscá…" onChange={(v) => vals.setEvCountry({ target: { value: v } })} />
          </div>
        </div>
        <div>
          <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>ESTADIO</label>
          {vals.evHasStadiums ? (
            <Select value={vals.evStadiumSel} options={vals.stadOptions} onChange={(v) => vals.setEvStadiumSel({ target: { value: v } })} />
          ) : (
            <div style={css("display:flex; align-items:center; gap:8px; padding:11px 13px; border-radius:11px; background:var(--muted,#1F2530); border:1px solid var(--border,rgba(255,255,255,.12)); font-size:13px; color:var(--muted-foreground,#9AA6B2);")}>
              No hay estadios en {vals.evCountry}. Agregá uno desde la pestaña Estadios.
            </div>
          )}
        </div>
        <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px;")}>
          <Field label="FECHA" type="date" value={vals.evDate} onInput={vals.setEvDate} />
          <Field label="HORA" type="text" value={vals.evTime} onInput={vals.setEvTime} placeholder="17:00" />
        </div>
        <Field label="RIVAL / TÍTULO DEL EVENTO" value={vals.evOpp} onInput={vals.setEvOpp} placeholder="Ej. Costa FC" />
        <div style={css("display:grid; grid-template-columns:1fr 1fr; gap:12px;")}>
          <Field label="COMPETICIÓN" value={vals.evComp} onInput={vals.setEvComp} placeholder="Ej. Torneo Apertura" />
          <Field label="INSTANCIA (OPCIONAL)" value={vals.evRound} onInput={vals.setEvRound} placeholder="Ej. Fecha 7" />
        </div>
        <div>
          <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>IMÁGENES DEL EVENTO (OPCIONAL)</label>
          <FileDropzone accept="image/*" multiple hint="Arrastrá imágenes o hacé clic para subir" onFiles={vals.addEvImages} />
          {(vals.evImages || []).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(88px,1fr))', gap: '10px', marginTop: '10px' }}>
              {(vals.evImages || []).map((src: string, i: number) => (
                <div key={i} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', aspectRatio: '1 / 1' }}>
                  <img src={src} alt={'Imagen ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <button
                    onClick={() => vals.removeEvImage(i)}
                    aria-label="Quitar imagen"
                    style={{
                      position: 'absolute', top: '6px', right: '6px', width: '24px', height: '24px',
                      display: 'grid', placeItems: 'center', borderRadius: '50%', cursor: 'pointer',
                      border: 'none', background: 'color-mix(in srgb, var(--background,#0E1116) 70%, transparent)',
                      color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

// ──────────────────────────────────────────────────────────
// StadiumModal  →  lib Modal
// ──────────────────────────────────────────────────────────
export function StadiumModal() {
  const vals = useOverlaysVM()
  return (
    <Modal
      open={!!vals.adminStadModal}
      onClose={vals.closeStadModal}
      title={vals.stadEditing ? 'Editar estadio' : 'Agregar estadio'}
      width={460}
      footer={
        <>
          <Btn label="Cancelar" variant="ghost" onClick={vals.closeStadModal} />
          <Btn label={vals.stadEditing ? 'Guardar cambios' : 'Agregar estadio'} icon="check" onClick={vals.adminAddStadium} />
        </>
      }
    >
      <div style={css("display:flex; flex-direction:column; gap:14px;")}>
        <Field label="NOMBRE DEL ESTADIO" value={vals.stadName} onInput={vals.setStadName} placeholder="Ej. Estadio Centenario" />
        <div style={css("display:grid; grid-template-columns:1fr 1.4fr; gap:12px;")}>
          <Field label="SIGLA" value={vals.stadShort} onInput={vals.setStadShort} placeholder="EC" />
          <Field label="CIUDAD" value={vals.stadCity} onInput={vals.setStadCity} />
        </div>
        <div>
          <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>PAÍS</label>
          <Combobox value={vals.stadCountry} options={vals.countryOptions} placeholder="Elegí o buscá…" onChange={(v) => vals.setStadCountry({ target: { value: v } })} />
        </div>
        <Field label="DIRECCIÓN" value={vals.stadAddress} onInput={vals.setStadAddress} placeholder="Calle y número" />
        <div style={css("display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px;")}>
          <Field label="AFORO" type="number" value={vals.stadCapacity} onInput={vals.setStadCapacity} placeholder="40000" />
          <Field label="AÑO INAUG." type="number" value={vals.stadYear} onInput={vals.setStadYear} placeholder="2016" />
          <Field label="NIVELES PALCOS" type="number" value={vals.stadLevels} onInput={vals.setStadLevels} placeholder="2" />
        </div>
        <div style={css("display:grid; grid-template-columns:1.4fr 1fr; gap:12px;")}>
          <div>
            <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>SUPERFICIE</label>
            <Combobox value={vals.stadSurface} options={vals.surfaceOptions} placeholder="Elegí o buscá…" onChange={(v) => vals.setStadSurface({ target: { value: v } })} />
          </div>
          <div>
            <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>TECHADO</label>
            <Select value={vals.stadRoof} options={vals.roofOptions} onChange={(v) => vals.setStadRoof({ target: { value: v } })} />
          </div>
        </div>
        <div>
          <label style={css("display:block; font-family:'Space Mono'; font-size:10px; letter-spacing:.08em; color:var(--subtle-foreground,#6B7480); margin-bottom:6px;")}>MAPA DEL ESTADIO (OPCIONAL)</label>
          {vals.stadMapImage ? (
            <div style={{ position: 'relative', borderRadius: '13px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)' }}>
              <img src={vals.stadMapImage} alt="Mapa del estadio" style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={vals.removeStadMap}
                aria-label="Quitar mapa"
                style={{ position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px', display: 'grid', placeItems: 'center', borderRadius: '50%', cursor: 'pointer', border: 'none', background: 'color-mix(in srgb, var(--background,#0E1116) 72%, transparent)', color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
          ) : (
            <FileDropzone accept="image/*" hint="Subí el plano o foto aérea del estadio" onFiles={vals.addStadMap} />
          )}
          <div style={css("font-size:12px; color:var(--muted-foreground,#9AA6B2); margin-top:6px;")}>
            Si lo cargás, los dueños ubican su palco sobre este mapa en lugar del plano genérico.
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ──────────────────────────────────────────────────────────
// PalcoReviewModal  →  lib Modal (verificación de palcos)
// ──────────────────────────────────────────────────────────
export function PalcoReviewModal() {
  const vals = useOverlaysVM()
  const r = vals.palcoReview
  // Lightbox para ver un adjunto (foto o documento) en grande.
  const [zoom, setZoom] = useState<string | null>(null)
  return (
    <>
    <Modal
      open={!!vals.palcoReviewOpen}
      onClose={vals.closePalcoReview}
      title="Verificar palco"
      width={680}
      footer={
        <>
          <Btn label="Cancelar" variant="ghost" onClick={vals.closePalcoReview} />
          <Btn label="Rechazar" variant="danger" onClick={r ? r.reject : undefined} />
          <Btn label="Aprobar" icon="check" onClick={r ? r.approve : undefined} />
        </>
      }
    >
      {r ? (
        <div style={css("display:flex; flex-direction:column; gap:16px;")}>
          {/* Cabecera del palco */}
          <div>
            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', color: 'var(--foreground,#F4EFE6)' }}>{r.title}</div>
            <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>{r.host} · {r.stadiumName}</div>
          </div>

          {r.resubmitted ? (
            <div style={{ padding: '10px 13px', borderRadius: '10px', background: 'color-mix(in srgb, var(--primary,#C9A24B) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--primary,#C9A24B) 32%, transparent)', fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>
              El palquista reenvió este palco tras el rechazo. Revisá sus respuestas en cada campo marcado.
            </div>
          ) : null}

          {/* Galería de fotos · cada una descargable */}
          {(r.images || []).length > 0 ? (
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '8px' }}>
                FOTOS DEL PALCO · {(r.images || []).length}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(86px,1fr))', gap: '8px' }}>
                {(r.images || []).map((src: string, i: number) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={src} alt={'Foto ' + (i + 1)} onClick={() => setZoom(src)} title="Ver en grande" style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'contain', background: 'var(--background,#0E1116)', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.12))', display: 'block', cursor: 'zoom-in' }} />
                    <DownloadLink compact href={src} name={attSlug(r.title) + '-foto-' + (i + 1) + '.' + attExt(src)} />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
            CAMPOS DEL PALCO · marcá los que no se validan
          </div>

          {/* Campos revisables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(r.fields || []).map((f: any) => (
              <div
                key={f.key}
                style={{
                  padding: '12px 14px', borderRadius: '12px',
                  border: '1.5px solid ' + (f.flagged ? 'var(--destructive,#E5604D)' : 'var(--border,rgba(255,255,255,.1))'),
                  background: f.flagged ? 'color-mix(in srgb, var(--destructive,#E5604D) 9%, transparent)' : 'var(--background,#0E1116)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.06em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '4px' }}>{f.label}</div>
                    {f.isDoc ? (
                      f.image ? (
                        isImageDataUrl(f.image) ? (
                          <div>
                            <img src={f.image} alt={f.label} onClick={() => setZoom(f.image)} title="Ver en grande" style={{ maxWidth: '160px', maxHeight: '110px', objectFit: 'contain', background: 'var(--background,#0E1116)', borderRadius: '8px', border: '1px solid var(--border,rgba(255,255,255,.12))', display: 'block', cursor: 'zoom-in' }} />
                            <DownloadLink href={f.image} name={attSlug(r.title) + '-' + attSlug(f.label) + '.' + attExt(f.image)} />
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '9px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.12))' }}>
                              <span style={{ flex: '0 0 auto', display: 'grid', placeItems: 'center', width: '34px', height: '34px', borderRadius: '8px', background: 'var(--muted,#1F2530)', color: 'var(--primary,#C9A24B)' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                              </span>
                              <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>Archivo {fileTypeLabel(f.image)}</span>
                            </div>
                            <DownloadLink href={f.image} name={attSlug(r.title) + '-' + attSlug(f.label) + '.' + attExt(f.image)} />
                          </div>
                        )
                      ) : (
                        <span style={{ fontSize: '13px', color: 'var(--destructive,#E5604D)' }}>Sin documento</span>
                      )
                    ) : (
                      <div style={{ fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px', color: 'var(--foreground,#F4EFE6)', wordBreak: 'break-word' }}>{f.value}</div>
                    )}
                  </div>
                  <button
                    onClick={f.toggle}
                    style={{
                      flex: '0 0 auto', padding: '7px 11px', borderRadius: '8px', cursor: 'pointer',
                      fontFamily: "'Archivo'", fontWeight: 700, fontSize: '12px',
                      border: '1.5px solid ' + (f.flagged ? 'var(--destructive,#E5604D)' : 'var(--border,rgba(255,255,255,.16))'),
                      background: f.flagged ? 'var(--destructive,#E5604D)' : 'transparent',
                      color: f.flagged ? '#fff' : 'var(--muted-foreground,#9AA6B2)',
                    }}
                  >
                    {f.flagged ? 'No validado' : 'Marcar'}
                  </button>
                </div>

                {f.ownerReply ? (
                  <div style={{ marginTop: '10px', padding: '8px 11px', borderRadius: '8px', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--primary,#C9A24B)', marginBottom: '3px' }}>RESPUESTA DEL PALQUISTA</div>
                    <div style={{ fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{f.ownerReply}</div>
                  </div>
                ) : null}

                {f.flagged ? (
                  <div style={{ marginTop: '10px' }}>
                    <Textarea
                      rows={2}
                      value={f.reason}
                      onInput={f.setReason}
                      placeholder="Motivo: por qué este campo no se valida…"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          {/* Motivo general del rechazo */}
          <Textarea
            label="MOTIVO GENERAL DEL RECHAZO (SI RECHAZÁS)"
            rows={3}
            value={r.reason}
            onInput={r.setReason}
            placeholder="Resumen de por qué se rechaza el palco…"
          />
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>
            {r.flaggedCount} {r.flaggedCount === 1 ? 'campo marcado' : 'campos marcados'} · Aprobar publica el palco; Rechazar lo devuelve al palquista para revisar.
          </div>
        </div>
      ) : null}
    </Modal>

    {/* Lightbox: ver el adjunto en grande */}
    {zoom ? (
      <div
        onClick={() => setZoom(null)}
        style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'grid', placeItems: 'center', padding: '32px', background: 'color-mix(in srgb, var(--background,#0E1116) 86%, black)', cursor: 'zoom-out' }}
      >
        <button
          onClick={() => setZoom(null)}
          aria-label="Cerrar"
          style={{ position: 'absolute', top: '16px', right: '16px', display: 'grid', placeItems: 'center', width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--border,rgba(255,255,255,.2))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', cursor: 'pointer', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', lineHeight: 1 }}
        >
          ×
        </button>
        <img src={zoom} alt="Adjunto" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 24px 60px -16px rgba(0,0,0,.8)', cursor: 'default' }} />
      </div>
    ) : null}
    </>
  )
}

// ──────────────────────────────────────────────────────────
// Toast  — STAYS BESPOKE
// Reason: vals.toast is a declarative string|null flag managed by store
// state. The lib's useToast() is an imperative hook — there is no clean
// mapping without modifying store.ts or adding a useEffect bridge.
// Behavior preservation takes priority over adoption.
// ──────────────────────────────────────────────────────────
export function Toast() {
  const vals = useOverlaysVM()
  return vals.toast ? (
    <div style={css("position:fixed; left:50%; bottom:26px; transform:translateX(-50%); z-index:90; display:flex; align-items:center; gap:10px; padding:13px 18px; border-radius:12px; background:var(--foreground,#F4EFE6); color:var(--background,#0E1116); font-family:'Archivo'; font-weight:700; font-size:14px; box-shadow:0 20px 50px -15px rgba(0,0,0,.6); animation:pq-up .3s ease both;")}>
      <span style={css("width:8px; height:8px; border-radius:50%; background:var(--success,#34D17E);")} />
      {vals.toast}
    </div>
  ) : null
}
