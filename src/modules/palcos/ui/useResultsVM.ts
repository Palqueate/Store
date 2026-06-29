// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { chipS } from '@/shared/ui/vm/helpers'

export function useResultsVM(): any {
  const self = useFacade(); const s = self.state;
  var mobile = s.vw < 860

  var resultCards = self.filtered().map(function (p) { return self.cardVM(p) })
  var stadiumFilter = [['all', 'Todos'], ['gpc', 'GPC'], ['cds', 'CDS']].map(function (o) { return { label: o[1], active: s.fStadium === o[0], style: chipS(s.fStadium === o[0]), pick: function () { self.setState({ fStadium: o[0] }) } } })
  var typeFilter = [['all', 'Todas'], ['palcoYear', 'Palco /año'], ['seatYear', 'Asiento /año'], ['seatEvent', 'Por evento']].map(function (o) { return { label: o[1], active: s.fType === o[0], style: chipS(s.fType === o[0]), pick: function () { self.setState({ fType: o[0] }) } } })
  var seatChips = [[0, 'Cualquiera'], [8, '8+'], [10, '10+'], [12, '12+']].map(function (o) { return { label: o[1], active: s.fMinSeats === o[0], style: chipS(s.fMinSeats === o[0]), pick: function () { self.setState({ fMinSeats: o[0] }) } } })
  var sortChips = [['rel', 'Relevancia'], ['price', 'Menor precio'], ['seats', 'Más asientos'], ['rating', 'Mejor rating']].map(function (o) { return { label: o[1], active: s.sort === o[0], style: chipS(s.sort === o[0]), pick: function () { self.setState({ sort: o[0] }) } } })

  return {
    resultCards: resultCards,
    resultsCount: resultCards.length,
    hasResults: resultCards.length > 0,
    noResults: resultCards.length === 0,
    stadiumFilter: stadiumFilter,
    typeFilter: typeFilter,
    seatChips: seatChips,
    sortChips: sortChips,
    parkingActive: s.fParking,
    toggleParking: function () { self.setState({ fParking: !s.fParking }) },
    clearFilters: function () { self.setState({ fStadium: 'all', fType: 'all', fParking: false, fMinSeats: 0, sort: 'rel' }) },
    resultsWrap: mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:flex; gap:30px; align-items:flex-start;',
    resultsSidebar: mobile ? 'width:100%;' : 'width:250px; flex:0 0 250px; position:sticky; top:88px;',
    resultsCol: 'flex:1; min-width:0;',
    resultsGrid: 'display:grid; grid-template-columns:repeat(auto-fill,minmax(' + (mobile ? '240px' : '278px') + ',1fr)); gap:16px; align-content:start;',
  }
}
