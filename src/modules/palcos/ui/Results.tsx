import { css } from '@/shared/ui/css'
import PalcoCard from '@/shared/ui/components/PalcoCard'
import { Card, Chip, Toggle, Btn, EmptyState } from '@/lib'
import { useResultsVM } from './useResultsVM'

const FILTER_LABEL: React.CSSProperties = {
  fontFamily: "'Space Mono'",
  fontSize: '10px',
  letterSpacing: '.1em',
  color: 'var(--subtle-foreground,#6B7480)',
  marginBottom: '11px',
}

export default function Results() {
  const vals = useResultsVM()
  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(20px,3vw,32px) clamp(16px,4vw,40px)' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '9px' }}>EXPLORAR · PALCOS</div>
        <h1 style={{ margin: 0, fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--foreground,#F4EFE6)' }}>
          <span style={{ color: 'var(--primary,#C9A24B)' }}>{vals.resultsCount}</span> palcos disponibles
        </h1>
      </div>

      <div style={css(vals.resultsWrap)}>
        <aside style={css(vals.resultsSidebar)}>
          <Card padding="18px" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)' }}>Filtros</span>
              <Btn label="Limpiar" variant="ghost" size="sm" onClick={vals.clearFilters} />
            </div>

            <div>
              <div style={FILTER_LABEL}>ESTADIO</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.stadiumFilter || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            <div>
              <div style={FILTER_LABEL}>MODALIDAD</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.typeFilter || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            <div>
              <div style={FILTER_LABEL}>ASIENTOS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.seatChips || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            <div>
              <div style={FILTER_LABEL}>ORDENAR POR</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.sortChips || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Toggle on={vals.parkingActive} onToggle={vals.toggleParking} />
              <span style={{ fontFamily: "'Archivo'", fontWeight: 600, fontSize: '13.5px', color: vals.parkingActive ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)', cursor: 'pointer' }} onClick={vals.toggleParking}>
                Con estacionamiento
              </span>
            </div>
          </Card>
        </aside>

        <div style={css(vals.resultsCol)}>
          {vals.hasResults ? (
            <div style={css(vals.resultsGrid)}>
              {(vals.resultCards || []).map((p: any, i: number) => <PalcoCard key={i} data={p} />)}
            </div>
          ) : null}
          {vals.noResults ? (
            <EmptyState
              title="Sin palcos con esos filtros"
              description="Probá ampliar la búsqueda o limpiar los filtros."
              action={<Btn label="Limpiar filtros" onClick={vals.clearFilters} />}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
