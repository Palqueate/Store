// @ts-nocheck
// Search / events filter state. Mutations happen via the generic setState in
// the view-model (chips toggle these keys directly), so this slice is state-only.
export const createFiltersSlice = () => ({
  fStadium: 'all',
  fType: 'all',
  fParking: false,
  fMinSeats: 0,
  sort: 'rel',
  evStadium: 'all',
  evComp: 'all',
  evClub: 'all',
  evSeats: 0,
  statPid: 'all',
})
