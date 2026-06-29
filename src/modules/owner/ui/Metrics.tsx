import { css } from '@/shared/ui/css'
import { SegmentedControl, Progress, Sparkline, Table, StatTile, Card, EmptyState, Btn } from '@/lib'
import { useMetricsVM } from './useMetricsVM'

// The store emits bar styles as CSS STRINGS (e.g. "width:100%; height:64%; ...").
// Extract a numeric percentage for the given field from either a string or an object.
function pctFrom(style: any, field: 'width' | 'height' = 'width'): number {
  let raw: unknown
  if (typeof style === 'string') {
    const m = style.match(new RegExp(field + '\\s*:\\s*([\\d.]+)%'))
    raw = m ? m[1] : undefined
  } else {
    raw = style?.[field]
  }
  if (typeof raw === 'number') return Math.max(0, Math.min(100, raw))
  if (typeof raw === 'string') return Math.max(0, Math.min(100, parseFloat(raw) || 0))
  return 0
}

// Extract the fill color out of a CSS string (or object) bar style.
function colorFrom(style: any): string | undefined {
  if (typeof style === 'string') {
    const m = style.match(/background(?:-color)?\s*:\s*([^;]+)/)
    return m ? m[1].trim() : undefined
  }
  return style?.background || style?.backgroundColor || undefined
}

// ─── Detalle por palco — columnas ──────────────────────────────────────────
function metRowColumns(rows: any[]) {
  return [
    {
      key: 'palco',
      header: 'Palco',
      width: '30%',
      render: (r: any) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {r.title}
            </span>
            <span style={css(r.statusStyle)}>{r.statusLabel}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>{r.stadiumName}</div>
        </div>
      ),
    },
    {
      key: 'revenue',
      header: 'Recaudación',
      align: 'right' as const,
      render: (r: any) => (
        <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>
          {r.revenue}
        </span>
      ),
    },
    {
      key: 'occ',
      header: 'Ocupación anual',
      width: '22%',
      render: (r: any) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--foreground,#F4EFE6)' }}>{r.occPct}</span>
            <span style={{ fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{r.occTxt}</span>
          </div>
          <Progress value={pctFrom(r.occBar)} height={7} color={colorFrom(r.occBar) || 'var(--success,#34D17E)'} />
        </div>
      ),
    },
    {
      key: 'views',
      header: 'Vistas',
      align: 'right' as const,
      render: (r: any) => (
        <span style={{ fontFamily: "'Space Mono'", fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{r.views}</span>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      align: 'right' as const,
      render: (r: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', fontFamily: "'Space Mono'", fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--primary,#C9A24B)" stroke="none">
            <path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" />
          </svg>
          {r.rating}
        </div>
      ),
    },
  ]
}

export default function Metrics() {
  const vals = useMetricsVM()
  // Build Sparkline data arrays from bar-style objects
  const trendData: number[] = (vals.metTrend || []).map((t: any) => pctFrom(t.barStyle, 'height'))
  const eventBarData: number[] = (vals.metEventBars || []).map((e: any) => pctFrom(e.barStyle, 'height'))

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 64px' }}>
      {/* Tab header — unchanged */}
      <div style={{ maxWidth: '360px', marginBottom: '24px' }}>
        <SegmentedControl
          block
          size="lg"
          segments={[{ value: 'owner', label: 'Mis palcos' }, { value: 'metrics', label: 'Estadísticas' }]}
          value={vals.activeTab}
          onChange={(v) => v === 'owner' ? vals.goOwnerTab?.() : vals.goMetricsTab?.()}
        />
      </div>

      {/* Empty state */}
      {vals.metEmpty ? (
        <EmptyState
          title="Todavía no tenés palcos"
          description="Publicá tu primer palco para empezar a ver estadísticas."
          action={<Btn label="Publicar palco" onClick={vals.goPublish} />}
        />
      ) : null}

      {vals.hasMet ? (
        <>
          {/* Header + palco chips */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>
              RENDIMIENTO · {vals.metScope}
            </div>
            <h1 style={{ margin: '0 0 14px', fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(26px,4vw,40px)', color: 'var(--foreground,#F4EFE6)' }}>
              Estadísticas de tus palcos
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(vals.statPidChips || []).map((c: any, i: number) => (
                <button key={i} onClick={c.pick} style={css(c.style)}>{c.label}</button>
              ))}
            </div>
          </div>

          {/* KPIs */}
          <div style={css(vals.metKpiGrid)}>
            {(vals.metKpis || []).map((k: any, i: number) => (
              <StatTile key={i} data={k} />
            ))}
          </div>

          {/* Two panels: revenue by modality + views trend */}
          <div style={css(vals.metPanelGrid)}>
            {/* Recaudación por modalidad — Progress bars */}
            <Card padding="20px">
              <h3 style={{ margin: '0 0 18px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>
                Recaudación por modalidad
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(vals.metRevBars || []).map((b: any, i: number) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}>
                      <span style={{ fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{b.l}</span>
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{b.v}</span>
                    </div>
                    <Progress
                      value={pctFrom(b.fillStyle)}
                      height={10}
                      color={colorFrom(b.fillStyle) || 'var(--primary,#C9A24B)'}
                    />
                  </div>
                ))}
              </div>
            </Card>

            {/* Vistas últimos 6 meses — Sparkline bar + month labels */}
            <Card padding="20px">
              <h3 style={{ margin: '0 0 6px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>
                Vistas · últimos 6 meses
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                Cuánta gente miró tu publicación.
              </p>
              <div style={{ position: 'relative' }}>
                <Sparkline
                  data={trendData}
                  type="bar"
                  width={320}
                  height={110}
                />
                {/* Month labels below bars */}
                <div style={{ display: 'flex', gap: '0', marginTop: '6px' }}>
                  {(vals.metTrend || []).map((t: any, i: number) => (
                    <span
                      key={i}
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        fontFamily: "'Space Mono'",
                        fontSize: '9px',
                        color: 'var(--subtle-foreground,#6B7480)',
                      }}
                    >
                      {t.mo}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Entradas vendidas por evento — Sparkline bar + labels */}
          {vals.hasEventBars ? (
            <Card padding="20px" style={{ marginTop: '16px' }}>
              <h3 style={{ margin: '0 0 6px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>
                Entradas vendidas por evento
              </h3>
              <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>
                Butacas vendidas para cada fecha.
              </p>
              <Sparkline
                data={eventBarData}
                type="bar"
                width={480}
                height={130}
              />
              {/* Event labels: sold count + date + opponent */}
              <div style={{ display: 'flex', marginTop: '8px' }}>
                {(vals.metEventBars || []).map((e: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: 'center',
                      lineHeight: 1.25,
                    }}
                  >
                    <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>
                      {e.sold}
                    </div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--foreground,#F4EFE6)' }}>
                      {e.day} {e.mon}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.opp}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Detalle por palco — Table */}
          <Card padding="20px" style={{ marginTop: '16px' }}>
            <h3 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>
              Detalle por palco
            </h3>
            <Table
              columns={metRowColumns(vals.metRows || [])}
              rows={vals.metRows || []}
              onRowClick={(r) => r.pick?.()}
              empty="Sin palcos para mostrar"
            />
          </Card>
        </>
      ) : null}
    </div>
  )
}
