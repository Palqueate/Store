import { css } from '@/shared/ui/css'
import { Btn, StatTile, SegmentedControl, Card, Badge, Tag, EmptyState, Textarea } from '@/lib'
import { useOwnerVM } from './useOwnerVM'

export default function Owner() {
  const vals = useOwnerVM()
  const tabs = [
    { value: 'owner', label: 'Mis palcos' },
    { value: 'metrics', label: 'Estadísticas' },
  ]

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 64px' }}>
      <div style={{ maxWidth: '360px', marginBottom: '24px' }}>
        <SegmentedControl
          block
          size="lg"
          segments={tabs}
          value={vals.activeTab}
          onChange={(v) => v === 'owner' ? vals.goOwnerTab?.() : vals.goMetricsTab?.()}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px', margin: '24px 0 22px' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>PANEL DEL DUEÑO</div>
          <h1 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--foreground,#F4EFE6)' }}>Mis palcos</h1>
        </div>
        <Btn label="Publicar palco" icon="plus" onClick={vals.goPublish} />
      </div>

      <Card padding="16px" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px' }}>
          {(vals.ownerStats || []).map((st: any, i: number) => (
            <StatTile key={i} data={st} />
          ))}
        </div>
      </Card>

      {vals.ownerEmpty ? (
        <EmptyState
          title="Todavía no publicaste ningún palco"
          action={<Btn label="Publicar mi primer palco" onClick={vals.goPublish} />}
        />
      ) : (
        <div style={css(vals.ownerGrid)}>
          {(vals.owned || []).map((o: any, i: number) => (
            <Card key={i} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }} padding="0">
              <div style={{ display: 'flex', gap: '14px', padding: '16px' }}>
                <div style={{ flex: '0 0 auto', width: '92px', height: '92px', borderRadius: '12px', background: 'repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 11px, var(--card,#171B22) 11px 22px)', display: 'grid', placeItems: 'center', fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>PALCO</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Badge tone={o.badgeTone} dot>
                      {o.statusLabel}
                    </Badge>
                    <span style={{ fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.stadiumName}</span>
                  </div>
                  <h3 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', color: 'var(--foreground,#F4EFE6)' }}>{o.title}</h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)', marginBottom: '8px' }}>{o.seats} asientos · {o.parking}</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {(o.modes || []).map((m: any, j: number) => (
                      <Tag key={j}>{m}</Tag>
                    ))}
                  </div>
                </div>
              </div>
              {/* Aviso de revisión pendiente */}
              {o.isPending ? (
                <div style={{ margin: '0 16px 14px', padding: '11px 13px', borderRadius: '11px', background: 'color-mix(in srgb, var(--warning,#E5A94D) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--warning,#E5A94D) 32%, transparent)', fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>
                  En revisión por el equipo de Palqueate. Te avisamos cuando se apruebe.
                </div>
              ) : null}

              {/* Panel de rechazo: motivo general + campos en rojo con respuesta */}
              {o.isRejected && o.review ? (
                <div style={{ margin: '0 16px 14px', padding: '14px', borderRadius: '12px', background: 'color-mix(in srgb, var(--destructive,#E5604D) 8%, transparent)', border: '1px solid color-mix(in srgb, var(--destructive,#E5604D) 34%, transparent)' }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--destructive,#E5604D)', marginBottom: '6px' }}>MOTIVO DEL RECHAZO</div>
                  {o.review.reason ? (
                    <p style={{ margin: '0 0 12px', fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)' }}>{o.review.reason}</p>
                  ) : null}

                  {(o.review.fields || []).length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(o.review.fields || []).map((f: any, k: number) => (
                        <div key={k} style={{ padding: '11px 12px', borderRadius: '10px', background: 'var(--background,#0E1116)', border: '1.5px solid var(--destructive,#E5604D)' }}>
                          <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13.5px', color: 'var(--destructive,#E5604D)', marginBottom: '3px' }}>{f.label}</div>
                          <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)', marginBottom: '9px' }}>{f.reason}</div>
                          <Textarea
                            rows={2}
                            value={f.reply}
                            onInput={f.setReply}
                            placeholder="Explicá por qué el dato está bien, o corregilo con «Editar»…"
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    <Btn label="Editar palco" variant="secondary" onClick={o.edit} />
                    <Btn label="Reenviar a revisión" icon="check" onClick={o.resubmit} />
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '14px 16px', borderTop: '1px solid var(--border,rgba(255,255,255,.08))' }}>
                <div>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>{o.priceLabel}</span>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{o.priceTxt}</div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Btn label="Ver" variant="secondary" onClick={o.view} />
                  <Btn label="Editar" variant="secondary" onClick={o.edit} />
                  {o.canToggle ? (
                    <Btn
                      label={o.toggleLabel}
                      variant={o.isPaused ? 'primary' : 'ghost'}
                      leadingIcon={o.isPaused ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z" /></svg> : undefined}
                      onClick={o.toggle}
                    />
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
