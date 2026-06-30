import { Btn, Card, Stack, Toggle, QuantityStepper, Field, FileDropzone, SearchInput, VirtualList, EmptyState, Combobox } from '@/lib'
import { css } from '@/shared/ui/css'
import StadiumMap from '@/shared/ui/components/StadiumMap'
import { isImageDataUrl, fileTypeLabel } from '@/shared/lib/readImages'
import { usePublishVM } from './usePublishVM'

/** Slot de subida de un documento único (imagen o PDF). Muestra la vista previa
 *  —miniatura si es imagen, tarjeta de archivo si no— con un botón para
 *  quitarla, o una zona de subida cuando todavía no hay archivo. */
function DocSlot({ label, hint, value, onFiles, onRemove }: any) {
  const removeBtn = (
    <button
      onClick={onRemove}
      aria-label="Quitar documento"
      style={{
        position: 'absolute', top: '8px', right: '8px', width: '26px', height: '26px',
        display: 'grid', placeItems: 'center', borderRadius: '50%', cursor: 'pointer',
        border: 'none', background: 'color-mix(in srgb, var(--background,#0E1116) 70%, transparent)',
        color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', lineHeight: 1,
      }}
    >
      ×
    </button>
  )
  return (
    <div>
      <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '8px' }}>
        {label}
      </div>
      {value ? (
        isImageDataUrl(value) ? (
          <div style={{ position: 'relative', borderRadius: '13px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)' }}>
            <img src={value} alt={label} style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', background: 'var(--background,#0E1116)', display: 'block' }} />
            {removeBtn}
          </div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 44px 14px 14px', borderRadius: '13px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)' }}>
            <span style={{ flex: '0 0 auto', display: 'grid', placeItems: 'center', width: '40px', height: '40px', borderRadius: '9px', background: 'var(--muted,#1F2530)', color: 'var(--primary,#C9A24B)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>Archivo {fileTypeLabel(value)} cargado</div>
              <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>Se podrá descargar en la revisión</div>
            </div>
            {removeBtn}
          </div>
        )
      ) : (
        <FileDropzone accept="image/*,application/pdf" hint={hint || 'Subir imagen o PDF'} onFiles={onFiles} />
      )}
    </div>
  )
}

/** Encabezado de sección del formulario de carga (numerado, con descripción). */
function Section({ n, title, desc, children }: any) {
  return (
    <section style={{ paddingTop: '26px', marginTop: '26px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: desc ? '6px' : '16px' }}>
        <span style={{ flex: '0 0 auto', width: '28px', height: '28px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: 'var(--muted,#1F2530)', color: 'var(--primary,#C9A24B)', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '13px' }}>{n}</span>
        <h2 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 900, letterSpacing: '-.02em', fontSize: 'clamp(20px,3vw,26px)', color: 'var(--foreground,#F4EFE6)' }}>{title}</h2>
      </div>
      {desc ? <p style={{ margin: '0 0 18px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>{desc}</p> : null}
      {children}
    </section>
  )
}

/** Subtítulo dentro de una sección (etiqueta en mayúsculas). */
function SubLabel({ children }: any) {
  return (
    <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', margin: '4px 0 10px' }}>
      {children}
    </div>
  )
}

export default function Publish() {
  const vals = usePublishVM()
  const w = vals.wiz
  if (!w) return null
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: 'clamp(16px,2.5vw,28px) clamp(16px,4vw,40px) 64px' }}>
      {/* Cancel link */}
      <button
        onClick={w.cancel}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--muted-foreground,#9AA6B2)',
          fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px',
          marginBottom: '16px',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Volver al panel
      </button>

      {w.editing ? (
        <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>
          EDITANDO PALCO
        </div>
      ) : null}

      <h1 style={{ margin: '0 0 8px', fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '112%', letterSpacing: '-.03em', fontSize: 'clamp(26px,4.5vw,40px)', color: 'var(--foreground,#F4EFE6)' }}>
        {w.editing ? 'Editar palco' : 'Publicar un palco'}
      </h1>
      <p style={{ margin: 0, color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>
        Completá todo en esta página y mandalo a revisión. Podés ir saltando entre secciones.
      </p>

      {/* ───── 1 · Dónde está ───── */}
      <Section n="1" title="¿Dónde está el palco?" desc="Elegí el país y el estadio, y marcá la ubicación exacta en el plano.">
        <Stack gap={20}>
          <div style={{ maxWidth: '520px' }}>
            <Combobox
              label="PAÍS"
              options={w.countryOptions}
              value={w.country}
              onChange={w.setCountry}
              placeholder="Elegí un país…"
            />
            <div style={{ marginTop: '8px', fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
              {w.stadiumTotal === 0
                ? 'Todavía no hay estadios cargados en este país'
                : `${w.stadiumTotal} ${w.stadiumTotal === 1 ? 'estadio disponible' : 'estadios disponibles'}`}
            </div>
          </div>

          <div>
            <SubLabel>ESTADIO</SubLabel>
            <SearchInput
              value={w.stadiumQuery}
              placeholder="Buscar estadio o ciudad…"
              onInput={w.setStadiumQuery}
              onClear={w.clearStadiumQuery}
            />
            <div style={{ margin: '10px 0', fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
              {w.stadiumShown === w.stadiumTotal ? `${w.stadiumTotal} estadios` : `${w.stadiumShown} de ${w.stadiumTotal} estadios`}
            </div>
            {w.stadiumNoResults ? (
              <EmptyState title="No encontramos estadios" description="Probá con otro nombre o ciudad, o elegí otro país." />
            ) : (
              <VirtualList
                items={w.stadiums}
                itemHeight={72}
                height={Math.min(360, Math.max(144, w.stadiumShown * 72))}
                renderItem={(st: any) => (
                  <button
                    onClick={st.pick}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px', width: '100%', height: '72px',
                      padding: '0 16px', cursor: 'pointer', textAlign: 'left',
                      background: st.selected ? 'color-mix(in srgb, var(--primary,#C9A24B) 14%, transparent)' : 'transparent',
                      border: 'none', borderBottom: '1px solid var(--border,rgba(255,255,255,.07))',
                      boxShadow: st.selected ? 'inset 3px 0 0 var(--primary,#C9A24B)' : 'none',
                    }}
                  >
                    <span style={{ flex: '0 0 auto', width: '44px', height: '44px', borderRadius: '11px', display: 'grid', placeItems: 'center', background: 'var(--muted,#1F2530)', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                      {st.short}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.name}</span>
                      <span style={{ display: 'block', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {st.city}{st.capacity ? ' · ' + st.capacity : ''}
                      </span>
                    </span>
                    {st.selected ? (
                      <span style={{ flex: '0 0 auto', width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary,#C9A24B)', display: 'grid', placeItems: 'center' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground,#1A1407)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      </span>
                    ) : null}
                  </button>
                )}
              />
            )}
          </div>

          <div>
            <SubLabel>UBICACIÓN EN EL PLANO</SubLabel>
            <div style={css(vals.wizMapCol)}>
              <StadiumMap
                stadium={w.stadium}
                name={w.stadiumName}
                mapImage={w.stadiumMap}
                markers={w.markers}
                interactive={true}
                onPick={w.onPick}
              />
              <Card padding="18px">
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)', marginBottom: '8px' }}>
                  Marcá dónde está
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '13.5px', lineHeight: '1.5', color: 'var(--muted-foreground,#9AA6B2)' }}>
                  Tocá el plano de <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>{w.stadiumName}</strong> en el punto donde se ubica tu palco. Los hinchas lo verán exactamente ahí.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '9px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.1))', fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: 'var(--primary,#C9A24B)' }} />
                  {w.locTxt}
                </div>
              </Card>
            </div>
          </div>
        </Stack>
      </Section>

      {/* ───── 2 · El palco ───── */}
      <Section n="2" title="El palco" desc="Ponele un nombre, indicá los asientos y si incluye estacionamiento.">
        <Stack gap={22}>
          <div style={{ maxWidth: '520px' }}>
            <Field
              label="NOMBRE DE LA PUBLICACIÓN"
              value={w.title}
              onInput={w.setTitle}
              placeholder="Ej. Palco Familiar Tribuna Norte"
            />
          </div>

          <div>
            <SubLabel>¿CUÁNTOS ASIENTOS TIENE?</SubLabel>
            <Card padding="16px 20px" style={{ display: 'inline-flex', alignItems: 'center' }}>
              <QuantityStepper
                value={parseInt(w.seats) || 0}
                min={1}
                max={40}
                onChange={(v) => {
                  const cur = parseInt(w.seats) || 0
                  if (v > cur) w.incSeats()
                  else if (v < cur) w.decSeats()
                }}
              />
            </Card>
          </div>

          <div>
            <SubLabel>ESTACIONAMIENTO</SubLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '520px', marginBottom: '16px' }}>
              <Card hover accent={w.parkHas === true} onClick={w.setParkYes} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 18px', textAlign: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--foreground,#F4EFE6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                  <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                </svg>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>Sí, incluye</div>
              </Card>
              <Card hover accent={w.parkHas === false} onClick={w.setParkNo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 18px', textAlign: 'center' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                  <circle cx="12" cy="12" r="9" /><path d="M5 5l14 14" />
                </svg>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>No incluye</div>
              </Card>
            </div>

            {w.parkHas ? (
              <div>
                <SubLabel>¿PARA CUÁNTOS AUTOS?</SubLabel>
                <Card padding="14px 18px" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <QuantityStepper
                    value={parseInt(w.parkN) || 0}
                    min={1}
                    max={30}
                    onChange={(v) => {
                      const cur = parseInt(w.parkN) || 0
                      if (v > cur) w.incPark()
                      else if (v < cur) w.decPark()
                    }}
                  />
                </Card>
                <div style={{ marginTop: '18px', maxWidth: '320px' }}>
                  <Field label="PRECIO $U POR LUGAR" type="number" value={w.parkPrice} onInput={w.setParkPrice} placeholder="0" />
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)' }}>
                    Por el mismo período que la reserva. El cliente elige cuántos lugares sumar.
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <SubLabel>COMODIDADES</SubLabel>
            <p style={{ margin: '0 0 12px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14px' }}>
              Marcá todo lo que tiene el palco. Podés sumar las que quieras.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxWidth: '620px' }}>
              {(w.amenityChips || []).map((a: any) => (
                <button
                  key={a.name}
                  onClick={a.toggle}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '9px 14px', borderRadius: '999px', cursor: 'pointer',
                    fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px',
                    background: a.selected ? 'color-mix(in srgb, var(--primary,#C9A24B) 18%, transparent)' : 'var(--background,#0E1116)',
                    border: '1.5px solid ' + (a.selected ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.14))'),
                    color: a.selected ? 'var(--foreground,#F4EFE6)' : 'var(--muted-foreground,#9AA6B2)',
                  }}
                >
                  <span style={{ width: '16px', height: '16px', borderRadius: '50%', display: 'grid', placeItems: 'center', background: a.selected ? 'var(--primary,#C9A24B)' : 'transparent', border: a.selected ? 'none' : '1.5px solid var(--border,rgba(255,255,255,.2))' }}>
                    {a.selected ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground,#1A1407)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    ) : null}
                  </span>
                  {a.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', marginTop: '14px', maxWidth: '620px' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <Field label="AGREGAR OTRA COMODIDAD" value={w.amenityDraft} onInput={w.setAmenityDraft} placeholder="Ej. Sommelier, Calefacción radiante…" />
              </div>
              <Btn label="Agregar" variant="secondary" size="lg" onClick={w.addAmenity} />
            </div>
            <div style={{ marginTop: '10px', fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
              {w.amenityCount} {w.amenityCount === 1 ? 'comodidad elegida' : 'comodidades elegidas'}
            </div>
          </div>
        </Stack>
      </Section>

      {/* ───── 3 · Fotos ───── */}
      <Section n="3" title="Fotos del palco" desc={`Subí al menos ${w.photosMin} fotos: la vista desde los asientos, el interior, el bar. Cuantas más sumes, más rápido se deciden los hinchas.`}>
        <Stack gap={18} style={{ maxWidth: '620px' }}>
          <FileDropzone accept="image/*" multiple hint="Arrastrá fotos o hacé clic para subir" onFiles={w.addImages} />
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: w.photosEnough ? 'var(--success,#5BBF8A)' : 'var(--subtle-foreground,#6B7480)' }}>
            {w.photosEnough ? `${w.photosCount} fotos ✓` : `${w.photosCount} de ${w.photosMin} · faltan ${w.photosLeft}`}
          </div>
          {(w.images || []).length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(108px,1fr))', gap: '12px' }}>
              {(w.images || []).map((src: string, i: number) => (
                <div key={i} style={{ position: 'relative', borderRadius: '13px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', aspectRatio: '1 / 1' }}>
                  <img src={src} alt={'Foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                  <button
                    onClick={() => w.removeImage(i)}
                    aria-label="Quitar foto"
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
        </Stack>
      </Section>

      {/* ───── 4 · Co-propietarios ───── */}
      <Section n="4" title="Co-propietarios" desc="¿El palco tiene más dueños? Sumá a cada uno con su nombre y email. Es opcional.">
        <Stack gap={16} style={{ maxWidth: '620px' }}>
          {(w.coOwners || []).length > 0 ? (
            <Stack gap={12}>
              {(w.coOwners || []).map((c: any, i: number) => (
                <Card key={i} padding="16px 18px">
                  <Stack direction="row" justify="space-between" align="center" style={{ marginBottom: '12px' }}>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
                      CO-PROPIETARIO {i + 1}
                    </div>
                    <button onClick={c.remove} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--destructive,#E5604D)', fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px' }}>
                      Quitar
                    </button>
                  </Stack>
                  <Stack gap={12}>
                    <Field label="NOMBRE" value={c.name} onInput={c.setName} placeholder="Nombre y apellido" />
                    <Field label="EMAIL" type="email" value={c.email} onInput={c.setEmail} placeholder="email@ejemplo.com" />
                  </Stack>
                </Card>
              ))}
            </Stack>
          ) : null}
          <div>
            <Btn label="Agregar co-propietario" variant="secondary" size="lg" onClick={w.addCoOwner} />
          </div>
        </Stack>
      </Section>

      {/* ───── 5 · Cobro ───── */}
      <Section n="5" title="Datos de cobro" desc="La cuenta donde vas a cobrar y la documentación que respalda la titularidad del palco.">
        <Stack gap={20} style={{ maxWidth: '620px' }}>
          <Stack gap={14}>
            <Combobox
              label="PAÍS DE LA CUENTA BANCARIA"
              options={w.countryOptions}
              value={w.payout.country}
              onChange={w.payout.setCountry}
              placeholder="Elegí un país…"
            />
            <Field label="SWIFT / BIC (OPCIONAL)" value={w.payout.swift} onInput={w.payout.setSwift} placeholder="Ej. BROUUYMM" />
            <Field label="BANCO" value={w.payout.bank} onInput={w.payout.setBank} placeholder="Nombre del banco" />
            <Field label="NOMBRE COMPLETO DEL BENEFICIARIO" value={w.payout.beneficiary} onInput={w.payout.setBeneficiary} placeholder="Titular de la cuenta" />
            <Field label="NÚMERO DE CUENTA BANCARIA" value={w.payout.accountNumber} onInput={w.payout.setAccountNumber} placeholder="Nº de cuenta" />
            <Field label="SUCURSAL DEL BANCO" value={w.payout.branch} onInput={w.payout.setBranch} placeholder="Sucursal" />
          </Stack>

          <div>
            <SubLabel>DOCUMENTACIÓN</SubLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>
              <DocSlot label="DOCUMENTO DE IDENTIDAD · ANVERSO" hint="Subir anverso" value={w.payout.idFront} onFiles={w.payout.addIdFront} onRemove={w.payout.removeIdFront} />
              <DocSlot label="DOCUMENTO DE IDENTIDAD · REVERSO" hint="Subir reverso" value={w.payout.idBack} onFiles={w.payout.addIdBack} onRemove={w.payout.removeIdBack} />
              <DocSlot label="COMPROBANTE DE DOMICILIO (≤ 3 MESES)" hint="Subir comprobante" value={w.payout.proofOfAddress} onFiles={w.payout.addProofOfAddress} onRemove={w.payout.removeProofOfAddress} />
              <DocSlot label="TÍTULO DE PROPIEDAD DEL PALCO" hint="Subir título" value={w.payout.propertyTitle} onFiles={w.payout.addPropertyTitle} onRemove={w.payout.removePropertyTitle} />
            </div>
          </div>
        </Stack>
      </Section>

      {/* ───── 6 · Modalidades y precios ───── */}
      <Section n="6" title="Modalidades y precios" desc="Activá las modalidades de alquiler y poné su precio. Podés combinar varias.">
        <Stack gap={14}>
          <Card accent={w.mPalco} padding="18px 20px">
            <Stack direction="row" gap={14} align="center">
              <Toggle on={w.mPalco} onToggle={w.tPalco} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Palco entero · 1 año</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Una persona alquila todo el palco por la temporada.</div>
              </div>
            </Stack>
            {w.mPalco ? (
              <div style={{ marginTop: '14px' }}>
                <Field label="PRECIO $U / AÑO" type="number" value={String(w.pricePalco)} onInput={w.setPricePalco} placeholder="0" />
              </div>
            ) : null}
          </Card>

          <Card accent={w.mSeatY} padding="18px 20px">
            <Stack direction="row" gap={14} align="center">
              <Toggle on={w.mSeatY} onToggle={w.tSeatY} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Asiento · 1 año</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Cada asiento se alquila por separado, toda la temporada.</div>
              </div>
            </Stack>
            {w.mSeatY ? (
              <div style={{ marginTop: '14px' }}>
                <Field label="PRECIO $U / AÑO · ASIENTO" type="number" value={String(w.priceSeatY)} onInput={w.setPriceSeatY} placeholder="0" />
              </div>
            ) : null}
          </Card>

          <Card accent={w.mSeatE} padding="18px 20px">
            <Stack direction="row" gap={14} align="center">
              <Toggle on={w.mSeatE} onToggle={w.tSeatE} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Asiento · por evento</div>
                <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Alquiler único de un asiento para un evento puntual.</div>
              </div>
            </Stack>
            {w.mSeatE ? (
              <div style={{ marginTop: '14px' }}>
                <Field label="PRECIO $U / EVENTO · ASIENTO" type="number" value={String(w.priceSeatE)} onInput={w.setPriceSeatE} placeholder="0" />
              </div>
            ) : null}
          </Card>
        </Stack>
      </Section>

      {/* Footer · enviar */}
      <Stack direction="row" justify="flex-end" gap={12} style={{ marginTop: '34px', paddingTop: '20px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>
        <Btn label="Cancelar" variant="secondary" size="lg" onClick={w.cancel} />
        <Btn label={w.submitLabel} icon="arrow" size="lg" onClick={w.submit} />
      </Stack>
    </div>
  )
}
