import { css } from '@/shared/ui/css'
import { Card, Chip, Select, EmptyState, Btn, SearchInput, MultiSelect, RangeSlider } from '@/lib'
import EventCard from '@/shared/ui/components/EventCard'
import { useEventsVM } from './useEventsVM'

export default function Events() {
  const vals = useEventsVM()
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 64px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>AGENDA · PRÓXIMOS EVENTOS</div>
        <h1 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--foreground,#F4EFE6)' }}>
          <span style={{ color: 'var(--primary,#C9A24B)' }}>{vals.eventsCount}</span> eventos
        </h1>
        <p style={{ margin: '0 0 16px', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>Buscá o filtrá por estadio, tipo de evento, rival o cuántos asientos juntos querés, y entrá para ver los palcos disponibles.</p>
        <div style={{ maxWidth: '520px' }}>
          <SearchInput
            value={vals.query}
            placeholder="Buscar evento, rival o sede…"
            onInput={vals.setQuery}
            onClear={() => vals.setQuery('')}
          />
        </div>
      </div>

      <div style={css(vals.eventsWrap)}>
        <aside style={css(vals.eventsSidebar)}>
          <Card padding="18px" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '15px', color: 'var(--foreground,#F4EFE6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Filtros
                {vals.evFiltersActive ? (
                  <span style={{ minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '11px', display: 'grid', placeItems: 'center' }}>
                    {vals.evFiltersActive}
                  </span>
                ) : null}
              </span>
              <button onClick={vals.clearEvFilters} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', fontFamily: "'Space Mono'", fontSize: '11px' }}>
                Limpiar
              </button>
            </div>

            {/* Stadium multiselect */}
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '11px' }}>ESTADIO</div>
              <MultiSelect
                options={vals.evStadiumOptions || []}
                value={vals.evStadiumValue || []}
                onChange={vals.setEvStadiums}
                placeholder="Todos los estadios"
              />
            </div>

            {/* Event-type chips */}
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '11px' }}>TIPO DE EVENTO</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.evTypeChips || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            {/* Club select */}
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '11px' }}>RIVAL / CLUB</div>
              <Select
                value={vals.evClubVal}
                options={vals.evClubOptions || []}
                onChange={(v) => vals.setEvClub({ target: { value: v } })}
              />
            </div>

            {/* Min-seats chips */}
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '11px' }}>ASIENTOS JUNTOS</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                {(vals.evSeatsChips || []).map((c: any, i: number) => (
                  <Chip key={i} active={c.active} onClick={c.pick}>{c.label}</Chip>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.1em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '8px' }}>RANGO DE PRECIO</div>
              <div style={{ fontFamily: "'Archivo'", fontWeight: 700, fontSize: '13.5px', color: vals.evPriceActive ? 'var(--primary,#C9A24B)' : 'var(--foreground,#F4EFE6)', marginBottom: '12px' }}>
                {vals.evPriceLabel}
              </div>
              <RangeSlider
                valueMin={vals.evPriceMin}
                valueMax={vals.evPriceMax}
                min={vals.evPriceBounds.lo}
                max={vals.evPriceBounds.hi}
                step={vals.evPriceBounds.step}
                onChange={vals.setEvPriceRange}
              />
            </div>
          </Card>
        </aside>

        <div style={css(vals.eventsCol)}>
          {vals.hasEvents ? (
            <div style={css(vals.eventsGrid)}>
              {(vals.eventCardsF || []).map((ev: any, i: number) => (
                <EventCard key={i} data={ev} />
              ))}
            </div>
          ) : null}

          {vals.noEvents ? (
            <EmptyState
              title="Sin eventos con esos filtros"
              description="Probá cambiar el rival o la cantidad de asientos."
              action={<Btn label="Limpiar filtros" onClick={vals.clearEvFilters} />}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}
