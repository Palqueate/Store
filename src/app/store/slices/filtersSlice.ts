// Search / events filter state. Mutations happen via the generic setState in
// the view-model (chips toggle these keys directly), so this slice is state-only.
//
// Estadios son multiselect: `fStadiums` / `evStadiums` son arrays de ids; un
// array vacío significa "todos". El rango de precios (`fMinPrice`/`fMaxPrice`)
// y las búsquedas de texto (`fQuery`/`evQuery`) usan 0 / '' como "sin filtro".
export const createFiltersSlice = () => ({
  // --- Palcos (explorar) ---
  fQuery: '',
  fStadiums: [] as string[],
  fParking: false,
  fMinSeats: 0,
  fMinPrice: 0,
  fMaxPrice: 0,
  sort: 'rel',
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
