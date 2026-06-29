import { css } from '@/shared/ui/css'
import { Btn, StatTile, Card, Badge, Table } from '@/lib'
import type { CSSProperties } from 'react'
import { useAdminVM } from './useAdminVM'

export default function Admin() {
  const vals = useAdminVM()
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 80px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '22px' }}>
        <span style={{ width: '42px', height: '42px', borderRadius: '11px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', display: 'grid', placeItems: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" /></svg></span>
        <div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)' }}>SISTEMA · ADMINISTRACIÓN</div>
          <h1 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(24px,3.6vw,36px)', color: 'var(--foreground,#F4EFE6)' }}>Panel de administrador</h1>
        </div>
      </div>

      <div style={css(vals.adminLayout)}>
        {/* sidebar */}
        <aside style={css(vals.adminSidebar)}>
          {(vals.adminTabs || []).map((t: any, i: number) => (
            <button key={i} onClick={t.pick} style={css(t.style)}>
              <span style={{ flex: 1 }}>{t.label}</span>
              {t.badge ? (
                <span style={{ flex: '0 0 auto', minWidth: '20px', height: '20px', padding: '0 6px', borderRadius: '999px', display: 'inline-grid', placeItems: 'center', background: t.active ? 'var(--primary-foreground,#1A1407)' : 'var(--destructive,#E5604D)', color: t.active ? 'var(--primary,#C9A24B)' : '#fff', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '11px' }}>{t.badge}</span>
              ) : null}
            </button>
          ))}
        </aside>

        {/* content */}
        <div style={{ minWidth: 0 }}>

          {/* DASHBOARD */}
          {vals.adminTabDashboard ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <Card padding="20px">
                <div style={css(vals.adminKpiGrid)}>
                  {(vals.adminKpis || []).map((k: any, i: number) => (
                    <StatTile key={i} data={k} />
                  ))}
                </div>
              </Card>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 18px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Recaudación por estadio</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {(vals.adminRevStad || []).map((r: any, i: number) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '7px' }}><span style={{ fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{r.name}</span><span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{r.val}</span></div>
                        <div style={{ height: '10px', borderRadius: '6px', background: 'var(--muted,#1F2530)', overflow: 'hidden' }}><div style={css(r.fill)}></div></div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Actividad reciente</h3>
                  {vals.hasRecent ? (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {(vals.adminRecent || []).map((a: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 0', borderBottom: '1px solid var(--border,rgba(255,255,255,.06))' }}>
                          <span style={{ flex: '0 0 auto', width: '34px', height: '34px', borderRadius: '9px', background: 'color-mix(in srgb,var(--success,#34D17E) 16%, var(--background,#0E1116))', display: 'grid', placeItems: 'center', color: 'var(--success,#34D17E)' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg></span>
                          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)' }}>{a.client}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--subtle-foreground,#6B7480)' }}>{a.code} · {a.when}</div></div>
                          <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>{a.total}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Card>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' }}>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 6px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Ventas · últimos 6 meses</h3>
                  <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>Volumen transado por mes.</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '150px' }}>
                    {(vals.adminMonthBars || []).map((m: any, i: number) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}><div style={css(m.barStyle)}></div></div>
                        <span style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>{m.mo}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Ventas por modalidad</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={css(vals.adminDonut)}></div>
                    <div style={{ flex: 1, minWidth: '140px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(vals.adminModality || []).map((m: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                          <span style={css(m.dot)}></span>
                          <span style={{ flex: 1, fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>{m.label}</span>
                          <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{m.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
              <Card padding="20px">
                <h3 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Top eventos por recaudación</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
                  {(vals.adminTopEvents || []).map((t: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ flex: '0 0 150px', minWidth: 0 }}><div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>vs {t.opp}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>{t.date}</div></div>
                      <div style={{ flex: 1, minWidth: 0 }}><div style={css(t.barStyle)}></div></div>
                      <span style={{ flex: '0 0 auto', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>{t.val}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          ) : null}

          {/* EVENTOS */}
          {vals.adminTabEventos ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div><h2 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Eventos</h2><p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Cargá partidos y shows; aparecen al instante en la app.</p></div>
                <Btn label="Nuevo evento" icon="plus" onClick={vals.openEvModal} />
              </div>
              <Table
                columns={[
                  {
                    key: 'fecha',
                    header: 'FECHA',
                    width: '64px',
                    render: (ev: any) => (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', lineHeight: 1 }}>{ev.date}</div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>{ev.dow}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'evento',
                    header: 'EVENTO',
                    render: (ev: any) => (
                      <div>
                        <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>vs {ev.opp}</div>
                        <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.comp} · {ev.round}</div>
                        {ev.obs ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '4px', maxWidth: '260px', fontSize: '11.5px', color: 'var(--primary,#C9A24B)' }} title={ev.obs}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.obs}</span>
                          </div>
                        ) : null}
                      </div>
                    ),
                  },
                  {
                    key: 'tipo',
                    header: 'TIPO',
                    render: (ev: any) => (
                      <div>
                        <span style={css(ev.tagStyle)}>{ev.tag}</span>
                        <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)', marginTop: '4px' }}>{ev.typeName}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'estadio',
                    header: 'ESTADIO',
                    render: (ev: any) => (
                      <div>
                        <div style={{ fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{ev.stadiumName}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)' }}>{ev.country}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'hora',
                    header: 'HORA',
                    render: (ev: any) => ev.time,
                  },
                  {
                    key: 'acciones',
                    header: '',
                    width: '88px',
                    align: 'right',
                    render: (ev: any) => (
                      <Btn label="Editar" variant="secondary" onClick={() => ev.edit()} />
                    ),
                  },
                ]}
                rows={vals.adminEvents || []}
                onRowClick={(ev: any) => ev.edit()}
              />
            </>
          ) : null}

          {/* ESTADIOS */}
          {vals.adminTabEstadios ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                <div><h2 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Estadios</h2><p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Sedes disponibles para publicar palcos y eventos.</p></div>
                <Btn label="Agregar estadio" icon="plus" onClick={vals.openStadModal} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '14px' }}>
                {(vals.adminStadiums || []).map((st: any, i: number) => (
                  <Card key={i} padding="18px">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '14px' }}>
                      <span style={{ width: '46px', height: '46px', borderRadius: '11px', background: 'repeating-linear-gradient(135deg, var(--muted,#1F2530) 0 7px, var(--card,#171B22) 7px 14px)', display: 'grid', placeItems: 'center', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13px', color: 'var(--primary,#C9A24B)' }}>{st.short}</span>
                      <div style={{ minWidth: 0 }}><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{st.name}</div><div style={{ fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)' }}>{st.city}, {st.country} · {st.address}</div></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '13px' }}>
                      <div style={{ padding: '9px 11px', borderRadius: '9px', background: 'var(--background,#0E1116)' }}><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{st.capacity}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>AFORO</div></div>
                      <div style={{ padding: '9px 11px', borderRadius: '9px', background: 'var(--background,#0E1116)' }}><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{st.year}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>INAUG.</div></div>
                      <div style={{ padding: '9px 11px', borderRadius: '9px', background: 'var(--background,#0E1116)' }}><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{st.levels}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>NIVELES</div></div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '13px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 9px', borderRadius: '7px', background: 'var(--muted,#1F2530)', fontSize: '11.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{st.surface}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 9px', borderRadius: '7px', background: 'var(--muted,#1F2530)', fontSize: '11.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{st.roof}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', paddingTop: '12px', borderTop: '1px solid var(--border,rgba(255,255,255,.08))' }}>
                      <div style={{ display: 'flex', gap: '18px' }}>
                        <div><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', color: 'var(--primary,#C9A24B)' }}>{st.palcos}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>PALCOS</div></div>
                        <div><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '18px', color: 'var(--foreground,#F4EFE6)' }}>{st.events}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '10px', color: 'var(--subtle-foreground,#6B7480)' }}>EVENTOS</div></div>
                      </div>
                      <Btn label="Editar" variant="secondary" onClick={st.edit} />
                    </div>
                  </Card>
                ))}
              </div>
            </>
          ) : null}

          {/* CLIENTES (CRM) */}
          {vals.adminTabClientes ? (
            <>
              <h2 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Clientes</h2>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Base de clientes registrados. Tocá una fila para ver sus compras.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(vals.adminClients || []).map((c: any, i: number) => (
                  <Card key={i} padding="0">
                    <div onClick={c.toggle} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 16px', cursor: 'pointer' }}>
                      <span style={{ flex: '0 0 auto', width: '42px', height: '42px', borderRadius: '11px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', display: 'grid', placeItems: 'center', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px' }}>{c.initials}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                          {c.isAdminUser ? <Badge tone="warn">ADMIN</Badge> : null}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email} · {c.phone}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
                        <div><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{c.ordersN}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>RESERVAS</div></div>
                        <div><div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>{c.spent}</div><div style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>GASTADO</div></div>
                      </div>
                    </div>
                    {c.expanded ? (
                      <div style={{ padding: '0 16px 16px 72px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(c.orderList || []).map((o: any, j: number) => (
                          <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.07))' }}>
                            <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', fontWeight: 700, color: 'var(--primary,#C9A24B)' }}>{o.code}</span>
                            <span style={{ fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)' }}>{o.date}</span>
                            <span style={{ flex: 1 }}></span>
                            <span style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)' }}>{o.items}</span>
                            <span style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{o.total}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </Card>
                ))}
              </div>
            </>
          ) : null}

          {/* RESERVAS */}
          {vals.adminTabReservas ? (
            <>
              <h2 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Reservas</h2>
              {vals.hasReservas ? (
                <Table
                  columns={[
                    {
                      key: 'codigo',
                      header: 'CÓDIGO',
                      render: (r: any) => (
                        <span style={{ fontFamily: "'Space Mono'", fontSize: '12px', fontWeight: 700, color: 'var(--primary,#C9A24B)' }}>{r.code}</span>
                      ),
                    },
                    {
                      key: 'cliente',
                      header: 'CLIENTE',
                      render: (r: any) => r.client,
                    },
                    {
                      key: 'palco',
                      header: 'PALCO',
                      render: (r: any) => r.palco,
                    },
                    {
                      key: 'fecha',
                      header: 'FECHA',
                      render: (r: any) => r.date,
                    },
                    {
                      key: 'total',
                      header: 'TOTAL',
                      align: 'right' as const,
                      render: (r: any) => (
                        <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{r.total}</span>
                      ),
                    },
                  ]}
                  rows={vals.adminReservas || []}
                />
              ) : null}
            </>
          ) : null}

          {/* PALCOS */}
          {vals.adminTabPalcos ? (
            <>
              <h2 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Palcos</h2>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Todos los palcos publicados por los palquistas.</p>
              <Table
                columns={[
                  {
                    key: 'palco',
                    header: 'PALCO',
                    render: (p: any) => (
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13.5px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)' }}>{p.seats} asientos · {p.parking}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'dueno',
                    header: 'DUEÑO',
                    render: (p: any) => p.host,
                  },
                  {
                    key: 'estadio',
                    header: 'ESTADIO',
                    render: (p: any) => p.stadiumName,
                  },
                  {
                    key: 'ocup',
                    header: 'OCUP.',
                    render: (p: any) => (
                      <div>
                        <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', color: 'var(--foreground,#F4EFE6)', marginBottom: '3px' }}>{p.occ}</div>
                        <div style={{ height: '5px', borderRadius: '4px', background: 'var(--muted,#1F2530)', overflow: 'hidden' }}><div style={css(p.occBar)}></div></div>
                      </div>
                    ),
                  },
                  {
                    key: 'desde',
                    header: 'DESDE',
                    render: (p: any) => (
                      <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '13px', color: 'var(--foreground,#F4EFE6)' }}>{p.price}</span>
                    ),
                  },
                  {
                    key: 'estado',
                    header: 'ESTADO',
                    render: (p: any) => <span style={css(p.statusStyle)}>{p.statusLabel}</span>,
                  },
                ]}
                rows={vals.adminPalcos || []}
              />
            </>
          ) : null}

          {/* VERIFICACIÓN */}
          {vals.adminTabVerificacion ? (
            <>
              <h2 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Verificación de palcos</h2>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Palcos registrados esperando aprobación. Revisá cada uno, aprobalo o rechazalo indicando los campos a corregir.</p>
              {vals.pendingCount === 0 ? (
                <Card padding="40px 20px" style={{ textAlign: 'center' } as CSSProperties}>
                  <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)', marginBottom: '6px' }}>No hay palcos pendientes</div>
                  <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Cuando un palquista registre o reenvíe un palco, va a aparecer acá.</div>
                </Card>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '14px' }}>
                  {(vals.adminPending || []).map((p: any, i: number) => (
                    <Card key={i} padding="18px" style={{ display: 'flex', flexDirection: 'column', gap: '12px' } as CSSProperties}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ margin: '0 0 2px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '17px', color: 'var(--foreground,#F4EFE6)' }}>{p.title}</h3>
                          <div style={{ fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{p.host} · {p.stadiumName} · {p.country}</div>
                        </div>
                        <Badge tone={p.resubmitted ? 'brand' : 'warn'} dot>{p.resubmitted ? 'Reenviado' : 'Nuevo'}</Badge>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px' }}>
                        {[['ASIENTOS', p.seats], ['ESTAC.', p.parking], ['COMODID.', p.amenities], ['CO-PROP.', p.coOwners], ['FOTOS', p.photos], ['DOCS', p.docs]].map((cell: any, j: number) => (
                          <div key={j} style={{ padding: '8px 10px', borderRadius: '9px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.08))' }}>
                            <div style={{ fontFamily: "'Space Mono'", fontSize: '9px', letterSpacing: '.06em', color: 'var(--subtle-foreground,#6B7480)' }}>{cell[0]}</div>
                            <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{cell[1]}</div>
                          </div>
                        ))}
                      </div>
                      <Btn label="Revisar palco" icon="arrow" block onClick={p.review} />
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : null}

          {/* FINANZAS */}
          {vals.adminTabFinanzas ? (
            <>
              <h2 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '22px', color: 'var(--foreground,#F4EFE6)' }}>Finanzas</h2>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)' }}>Ingresos, comisiones y pagos a palquistas.</p>
              <Card padding="16px" style={{ marginBottom: '16px' } as CSSProperties}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '12px' }}>
                  {(vals.finKpis || []).map((k: any, i: number) => (
                    <StatTile key={i} data={k} />
                  ))}
                </div>
              </Card>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '16px' }}>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 6px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Comisión · últimos 6 meses</h3>
                  <p style={{ margin: '0 0 16px', fontSize: '12.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>Ingreso neto de Palqueate.</p>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '140px' }}>
                    {(vals.finMonthBars || []).map((m: any, i: number) => (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}><div style={css(m.barStyle)}></div></div>
                        <span style={{ fontFamily: "'Space Mono'", fontSize: '9px', color: 'var(--subtle-foreground,#6B7480)' }}>{m.mo}</span>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card padding="20px">
                  <h3 style={{ margin: '0 0 16px', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '16px', color: 'var(--foreground,#F4EFE6)' }}>Desglose por estadio</h3>
                  <Table
                    columns={[
                      {
                        key: 'name',
                        header: 'ESTADIO',
                        render: (f: any) => f.name,
                      },
                      {
                        key: 'rev',
                        header: 'BRUTO',
                        render: (f: any) => f.rev,
                      },
                      {
                        key: 'comm',
                        header: 'COMIS.',
                        render: (f: any) => (
                          <span style={{ color: 'var(--primary,#C9A24B)' }}>{f.comm}</span>
                        ),
                      },
                      {
                        key: 'payout',
                        header: 'PAYOUT',
                        render: (f: any) => f.payout,
                      },
                    ]}
                    rows={vals.finByStad || []}
                  />
                </Card>
              </div>
            </>
          ) : null}

        </div>
      </div>
    </div>
  )
}
