import { Card, Chip, Select, SearchInput, EmptyState, Btn } from '@/lib'
import EventCard from '@/shared/ui/components/EventCard'
import { useEventsVM } from './useEventsVM'

export default function Events() {
  const vals = useEventsVM()
  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: 'clamp(18px,3vw,32px) clamp(16px,4vw,40px) 64px' }}>
      <div style={{ marginBottom: '18px' }}>
        <div style={{ fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.12em', color: 'var(--primary,#C9A24B)', marginBottom: '8px' }}>AGENDA · PRÓXIMOS EVENTOS</div>
        <h1 style={{ margin: '0 0 4px', fontFamily: "'Archivo'", fontWeight: 800, fontStretch: '110%', letterSpacing: '-.03em', fontSize: 'clamp(28px,4.5vw,44px)', color: 'var(--foreground,#F4EFE6)' }}>
          <span style={{ color: 'var(--primary,#C9A24B)' }}>{vals.eventsCount}</span> eventos
        </h1>
        <p style={{ margin: 0, color: 'var(--muted-foreground,#9AA6B2)', fontSize: '15px' }}>Buscá por nombre, estadio o tipo, y entrá para ver los palcos disponibles.</p>
      </div>

      {/* Compact filter toolbar */}
      <Card padding="12px" style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          {/* Search — grows to fill */}
          <div style={{ flex: '1 1 240px', minWidth: '200px' }}>
            <SearchInput
              value={vals.evQuery}
              placeholder="Buscar evento, estadio o tipo…"
              onInput={vals.setEvQuery}
              onClear={() => vals.setEvQuery('')}
            />
          </div>

          {/* Compact selects */}
          <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
            <Select value={vals.evStadiumVal} options={vals.evStadiumOptions} onChange={vals.setEvStadium} />
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
            <Select value={vals.evCompVal} options={vals.evCompOptions} onChange={vals.setEvComp} />
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '140px' }}>
            <Select value={vals.evSeatsVal} options={vals.evSeatsOptions} onChange={vals.setEvSeats} />
          </div>
          <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
            <Select value={vals.evSortVal} options={vals.evSortOptions} onChange={vals.setEvSort} />
          </div>

          {/* Availability toggle */}
          <Chip active={vals.evOnlyAvail} onClick={vals.toggleOnlyAvail}>Con cupo</Chip>

          {/* Clear — only when something is active */}
          {vals.evFiltersActive ? (
            <button
              onClick={vals.clearEvFilters}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', fontFamily: "'Space Mono'", fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              Limpiar
              <span style={{ minWidth: '18px', height: '18px', padding: '0 5px', borderRadius: '9px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', fontWeight: 700, fontSize: '11px', display: 'grid', placeItems: 'center' }}>
                {vals.evFiltersActive}
              </span>
            </button>
          ) : null}
        </div>
      </Card>

      {vals.hasEvents ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px', alignContent: 'start' }}>
          {(vals.eventCardsF || []).map((ev: any, i: number) => (
            <EventCard key={i} data={ev} />
          ))}
        </div>
      ) : null}

      {vals.noEvents ? (
        <EmptyState
          title="Sin eventos con esos filtros"
          description="Probá con otro texto, estadio o tipo de evento."
          action={<Btn label="Limpiar filtros" onClick={vals.clearEvFilters} />}
        />
      ) : null}
    </div>
  )
}
