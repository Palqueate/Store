// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { chipS } from '@/shared/ui/vm/helpers'

export function useResultsVM(): any {
  const self = useFacade(); const s = self.state;
  var mobile = s.vw < 860

  var resultCards = self.filtered().map(function (p) { return self.cardVM(p) })

  // Estadios derivados del catálogo (multiselect). [] = todos.
  var fStadiums = s.fStadiums || []
  var stadiumOptions = Object.keys(s.stadiums || {}).map(function (id) { var st = s.stadiums[id]; return { value: id, label: st.short + ' · ' + st.name } })
  function setStadiums(vals) { self.setState({ fStadiums: vals }) }

  // Rango de precios "desde". Si el usuario no movió un extremo, queda en el
  // borde (lo / hi) y el filtro no se aplica (guardado como 0).
  var pb = self.priceBounds()
  var minVal = s.fMinPrice > 0 ? s.fMinPrice : pb.lo
  var maxVal = s.fMaxPrice > 0 ? s.fMaxPrice : pb.hi
  function setMinPrice(v) { var nv = Math.min(v, maxVal); self.setState({ fMinPrice: nv <= pb.lo ? 0 : nv }) }
  function setMaxPrice(v) { var nv = Math.max(v, minVal); self.setState({ fMaxPrice: nv >= pb.hi ? 0 : nv }) }
  var priceActive = s.fMinPrice > 0 || s.fMaxPrice > 0

  var typeFilter = [['all', 'Todas'], ['palcoYear', 'Palco /año'], ['seatYear', 'Asiento /año'], ['seatEvent', 'Por evento']].map(function (o) { return { label: o[1], active: s.fType === o[0], style: chipS(s.fType === o[0]), pick: function () { self.setState({ fType: o[0] }) } } })
  var seatChips = [[0, 'Cualquiera'], [8, '8+'], [10, '10+'], [12, '12+']].map(function (o) { return { label: o[1], active: s.fMinSeats === o[0], style: chipS(s.fMinSeats === o[0]), pick: function () { self.setState({ fMinSeats: o[0] }) } } })
  var sortChips = [['rel', 'Relevancia'], ['price', 'Menor precio'], ['seats', 'Más asientos'], ['rating', 'Mejor rating']].map(function (o) { return { label: o[1], active: s.sort === o[0], style: chipS(s.sort === o[0]), pick: function () { self.setState({ sort: o[0] }) } } })

  var filtersActive = (s.fQuery && s.fQuery.trim() ? 1 : 0) + (fStadiums.length ? 1 : 0) + (s.fType !== 'all' ? 1 : 0) + (s.fMinSeats > 0 ? 1 : 0) + (priceActive ? 1 : 0) + (s.fParking ? 1 : 0)

  return {
    resultCards: resultCards,
    resultsCount: resultCards.length,
    hasResults: resultCards.length > 0,
    noResults: resultCards.length === 0,
    query: s.fQuery,
    setQuery: function (v) { self.setState({ fQuery: v }) },
    stadiumOptions: stadiumOptions,
    stadiumValue: fStadiums,
    setStadiums: setStadiums,
    priceBounds: pb,
    priceMin: minVal,
    priceMax: maxVal,
    priceActive: priceActive,
    priceLabel: self.money(minVal) + ' — ' + self.money(maxVal),
    setMinPrice: setMinPrice,
    setMaxPrice: setMaxPrice,
    typeFilter: typeFilter,
    seatChips: seatChips,
    sortChips: sortChips,
    parkingActive: s.fParking,
    toggleParking: function () { self.setState({ fParking: !s.fParking }) },
    filtersActive: filtersActive || null,
    clearFilters: function () { self.setState({ fQuery: '', fStadiums: [], fType: 'all', fParking: false, fMinSeats: 0, fMinPrice: 0, fMaxPrice: 0, sort: 'rel' }) },
    resultsWrap: mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:flex; gap:30px; align-items:flex-start;',
    resultsSidebar: mobile ? 'width:100%;' : 'width:250px; flex:0 0 250px; position:sticky; top:88px;',
    resultsCol: 'flex:1; min-width:0;',
    resultsGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '240px' : '278px') + ',1fr)); gap:16px; align-content:start;',
  }
}
