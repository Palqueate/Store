import { Btn, Card, Stack, Toggle, Stepper, QuantityStepper, Field, FileDropzone, SearchInput, VirtualList, EmptyState } from '@/lib'
import { css } from '@/shared/ui/css'
import StadiumMap from '@/shared/ui/components/StadiumMap'
import { usePublishVM } from './usePublishVM'

export default function Publish() {
  const vals = usePublishVM()
  return (
    <div style={{ maxWidth: '920px', margin: '0 auto', padding: 'clamp(16px,2.5vw,28px) clamp(16px,4vw,40px) 64px' }}>
      {vals.wiz ? (
        <>
          {/* Back link */}
          <button
            onClick={vals.wiz.back}
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
            Atrás
          </button>

          {/* Stepper */}
          <div style={{ marginBottom: '24px', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', paddingBottom: '6px' }}>
            <Stepper
              steps={(vals.wiz.steps || []).map((st: any) => ({ label: st.name }))}
              current={vals.wiz.step}
            />
          </div>

          {vals.wiz.editing ? (
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>
              EDITANDO PALCO
            </div>
          ) : null}

          <h1 style={{ margin: '0 0 20px', fontFamily: "'Archivo'", fontWeight: 900, fontStretch: '112%', letterSpacing: '-.03em', fontSize: 'clamp(26px,4.5vw,40px)', color: 'var(--foreground,#F4EFE6)' }}>
            {vals.wiz.stepName}
          </h1>

          {/* STEP 0 — Estadio */}
          {vals.wiz.s0 ? (
            <Stack gap={14}>
              <p style={{ margin: 0, color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>
                ¿En qué estadio está tu palco? Buscalo por nombre o ciudad.
              </p>

              <SearchInput
                value={vals.wiz.stadiumQuery}
                placeholder="Buscar estadio o ciudad…"
                onInput={vals.wiz.setStadiumQuery}
                onClear={vals.wiz.clearStadiumQuery}
              />

              <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)' }}>
                {vals.wiz.stadiumShown === vals.wiz.stadiumTotal
                  ? `${vals.wiz.stadiumTotal} estadios`
                  : `${vals.wiz.stadiumShown} de ${vals.wiz.stadiumTotal} estadios`}
              </div>

              {vals.wiz.stadiumNoResults ? (
                <EmptyState
                  title="No encontramos estadios"
                  description="Probá con otro nombre o ciudad."
                />
              ) : (
                <VirtualList
                  items={vals.wiz.stadiums}
                  itemHeight={72}
                  height={Math.min(432, Math.max(144, vals.wiz.stadiumShown * 72))}
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
            </Stack>
          ) : null}

          {/* STEP 1 — Ubicación */}
          {vals.wiz.s1 ? (
            <div style={css(vals.wizMapCol)}>
              <StadiumMap
                stadium={vals.wiz.stadium}
                name={vals.wiz.stadiumName}
                shape={vals.wiz.stadiumShape}
                mapImage={vals.wiz.stadiumMap}
                markers={vals.wiz.markers}
                interactive={true}
                onPick={vals.wiz.onPick}
              />
              <Card padding="18px">
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)', marginBottom: '8px' }}>
                  Marcá dónde está
                </div>
                <p style={{ margin: '0 0 14px', fontSize: '13.5px', lineHeight: '1.5', color: 'var(--muted-foreground,#9AA6B2)' }}>
                  Tocá el plano de <strong style={{ color: 'var(--foreground,#F4EFE6)' }}>{vals.wiz.stadiumName}</strong> en el punto donde se ubica tu palco. Los hinchas lo verán exactamente ahí.
                </p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '9px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.1))', fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: 'var(--primary,#C9A24B)' }} />
                  {vals.wiz.locTxt}
                </div>
              </Card>
            </div>
          ) : null}

          {/* STEP 2 — Asientos */}
          {vals.wiz.s2 ? (
            <Stack gap={20} style={{ maxWidth: '520px' }}>
              <Field
                label="NOMBRE DE LA PUBLICACIÓN"
                value={vals.wiz.title}
                onInput={vals.wiz.setTitle}
                placeholder="Ej. Palco Familiar Tribuna Norte"
              />

              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '10px' }}>
                  ¿CUÁNTOS ASIENTOS TIENE?
                </div>
                <Card padding="16px 20px" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <QuantityStepper
                    value={parseInt(vals.wiz.seats) || 0}
                    min={1}
                    max={40}
                    onChange={(v) => {
                      const cur = parseInt(vals.wiz.seats) || 0
                      if (v > cur) vals.wiz.incSeats()
                      else if (v < cur) vals.wiz.decSeats()
                    }}
                  />
                </Card>
              </div>
            </Stack>
          ) : null}

          {/* STEP 3 — Fotos */}
          {vals.wiz.s3 ? (
            <Stack gap={18} style={{ maxWidth: '620px' }}>
              <p style={{ margin: 0, color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>
                Sumá fotos del palco: la vista desde los asientos, el interior, el bar. Es opcional, pero ayuda a que los hinchas se decidan más rápido.
              </p>

              <FileDropzone
                accept="image/*"
                multiple
                hint="Arrastrá fotos o hacé clic para subir"
                onFiles={vals.wiz.addImages}
              />

              {(vals.wiz.images || []).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(108px,1fr))', gap: '12px' }}>
                  {(vals.wiz.images || []).map((src: string, i: number) => (
                    <div key={i} style={{ position: 'relative', borderRadius: '13px', overflow: 'hidden', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', aspectRatio: '1 / 1' }}>
                      <img src={src} alt={'Foto ' + (i + 1)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      <button
                        onClick={() => vals.wiz.removeImage(i)}
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
          ) : null}

          {/* STEP 4 — Estacionamiento */}
          {vals.wiz.s4 ? (
            <>
              <p style={{ margin: '0 0 18px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>
                ¿El palco incluye lugares de estacionamiento?
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', maxWidth: '520px', marginBottom: '20px' }}>
                <Card
                  hover
                  accent={vals.wiz.parkHas === true}
                  onClick={vals.wiz.setParkYes}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 18px', textAlign: 'center' }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--foreground,#F4EFE6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                    <rect x="3" y="3" width="18" height="18" rx="3" /><path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
                  </svg>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>Sí, incluye</div>
                </Card>

                <Card
                  hover
                  accent={vals.wiz.parkHas === false}
                  onClick={vals.wiz.setParkNo}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 18px', textAlign: 'center' }}
                >
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                    <circle cx="12" cy="12" r="9" /><path d="M5 5l14 14" />
                  </svg>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>No incluye</div>
                </Card>
              </div>

              {vals.wiz.parkHas ? (
                <div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '10px' }}>
                    ¿PARA CUÁNTOS AUTOS?
                  </div>
                  <Card padding="14px 18px" style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <QuantityStepper
                      value={parseInt(vals.wiz.parkN) || 0}
                      min={1}
                      max={30}
                      onChange={(v) => {
                        const cur = parseInt(vals.wiz.parkN) || 0
                        if (v > cur) vals.wiz.incPark()
                        else if (v < cur) vals.wiz.decPark()
                      }}
                    />
                  </Card>
                </div>
              ) : null}
            </>
          ) : null}

          {/* STEP 5 — Modalidad y precios */}
          {vals.wiz.s5 ? (
            <>
              <p style={{ margin: '0 0 18px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>
                Activá las modalidades de alquiler y poné su precio. Podés combinar varias.
              </p>
              <Stack gap={14}>

                {/* Palco entero · 1 año */}
                <Card accent={vals.wiz.mPalco} padding="18px 20px">
                  <Stack direction="row" gap={14} align="center">
                    <Toggle on={vals.wiz.mPalco} onToggle={vals.wiz.tPalco} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Palco entero · 1 año</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Una persona alquila todo el palco por la temporada.</div>
                    </div>
                  </Stack>
                  {vals.wiz.mPalco ? (
                    <div style={{ marginTop: '14px' }}>
                      <Field
                        label="PRECIO $U / AÑO"
                        type="number"
                        value={String(vals.wiz.pricePalco)}
                        onInput={vals.wiz.setPricePalco}
                        placeholder="0"
                      />
                    </div>
                  ) : null}
                </Card>

                {/* Asiento · 1 año */}
                <Card accent={vals.wiz.mSeatY} padding="18px 20px">
                  <Stack direction="row" gap={14} align="center">
                    <Toggle on={vals.wiz.mSeatY} onToggle={vals.wiz.tSeatY} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Asiento · 1 año</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Cada asiento se alquila por separado, toda la temporada.</div>
                    </div>
                  </Stack>
                  {vals.wiz.mSeatY ? (
                    <div style={{ marginTop: '14px' }}>
                      <Field
                        label="PRECIO $U / AÑO · ASIENTO"
                        type="number"
                        value={String(vals.wiz.priceSeatY)}
                        onInput={vals.wiz.setPriceSeatY}
                        placeholder="0"
                      />
                    </div>
                  ) : null}
                </Card>

                {/* Asiento · por evento */}
                <Card accent={vals.wiz.mSeatE} padding="18px 20px">
                  <Stack direction="row" gap={14} align="center">
                    <Toggle on={vals.wiz.mSeatE} onToggle={vals.wiz.tSeatE} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Asiento · por evento</div>
                      <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Alquiler único de un asiento para un evento puntual.</div>
                    </div>
                  </Stack>
                  {vals.wiz.mSeatE ? (
                    <div style={{ marginTop: '14px' }}>
                      <Field
                        label="PRECIO $U / EVENTO · ASIENTO"
                        type="number"
                        value={String(vals.wiz.priceSeatE)}
                        onInput={vals.wiz.setPriceSeatE}
                        placeholder="0"
                      />
                    </div>
                  ) : null}
                </Card>

              </Stack>
            </>
          ) : null}

          {/* Footer nav */}
          <Stack direction="row" justify="flex-end" gap={12} style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid var(--border,rgba(255,255,255,.1))' }}>
            <Btn label="Atrás" variant="secondary" size="lg" onClick={vals.wiz.back} />
            <Btn label={vals.wiz.nextLabel} icon="arrow" size="lg" onClick={vals.wiz.next} />
          </Stack>
        </>
      ) : null}
    </div>
  )
}
