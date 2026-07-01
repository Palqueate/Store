// Events filter state. Mutations happen via the generic setState in the
// view-model (chips toggle these keys directly), so this slice is state-only.
//
// Estadios son multiselect: `evStadiums` es un array de ids; array vacío =
// "todos". El rango de precios (`evMinPrice`/`evMaxPrice`) y la búsqueda de
// texto (`evQuery`) usan 0 / '' como "sin filtro".
export const createFiltersSlice = () => ({
  // --- Eventos (agenda) ---
  evQuery: '',
  evStadiums: [] as string[],
  evType: 'all',
  evSeats: 0,
  evMinPrice: 0,
  evMaxPrice: 0,
  // --- Métricas (owner) ---
  statPid: 'all',
})
