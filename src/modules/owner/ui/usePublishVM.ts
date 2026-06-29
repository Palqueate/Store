// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { selCard, sw } from '@/shared/ui/vm/helpers'

export function usePublishVM(): any {
  const self = useFacade()
  const s = self.state
  var STADIUMS = s.stadiums
  var mobile = s.vw < 860

  var w = s.wz
  var wiz: any = null

  if (w) {
    var editing = !!w.editId
    var stepNames = ['Estadio', 'Ubicación', 'Asientos', 'Fotos', 'Estacionamiento', 'Precios']

    // Estadio (paso 0): lista buscable y ordenada. Escala a cientos de
    // estadios — la UI la virtualiza, así que sólo filtramos + ordenamos acá.
    var sQuery = w.stadiumQuery || ''
    var sNeedle = sQuery.trim().toLowerCase()
    var allStadiums = Object.keys(STADIUMS).map(function (k) { return STADIUMS[k] })
      .sort(function (a, b) { return (a.name || '').localeCompare(b.name || '') })
    var shownStadiums = sNeedle
      ? allStadiums.filter(function (st) {
          return ((st.name || '') + ' ' + (st.city || '') + ' ' + (st.short || '')).toLowerCase().indexOf(sNeedle) >= 0
        })
      : allStadiums

    wiz = {
      editing: editing,
      step: w.step, stepName: stepNames[w.step], progress: Math.round(((w.step + 1) / stepNames.length) * 100),
      steps: stepNames.map(function (nm, i) {
        return {
          name: nm, num: String(i + 1), active: i === w.step,
          dotStyle: { width: '26px', height: '26px', borderRadius: '50%', display: 'grid', placeItems: 'center', fontFamily: 'Space Mono', fontWeight: '700', fontSize: '12px', flex: '0 0 auto', background: (i < w.step ? 'var(--success)' : (i === w.step ? 'var(--primary)' : 'var(--muted)')), color: (i < w.step ? 'var(--success-foreground)' : (i === w.step ? 'var(--primary-foreground)' : 'var(--subtle-foreground)')) },
          labelStyle: { whiteSpace: 'nowrap', fontFamily: 'Archivo', fontWeight: (i === w.step ? '700' : '500'), fontSize: '13px', color: (i === w.step ? 'var(--foreground)' : 'var(--subtle-foreground)') },
        }
      }),
      s0: w.step === 0, s1: w.step === 1, s2: w.step === 2, s3: w.step === 3, s4: w.step === 4, s5: w.step === 5,
      stadium: w.stadium, stadiumName: STADIUMS[w.stadium].name, x: w.x, y: w.y, title: w.title, seats: String(w.seats), parkN: String(w.parkN), parkHas: w.parkHas,
      images: w.images || [],
      addImages: function (files) { self.wzAddImages(files) },
      removeImage: function (i) { self.wzRemoveImage(i) },
      gpcStyle: selCard(w.stadium === 'gpc'), cdsStyle: selCard(w.stadium === 'cds'),
      parkYesStyle: selCard(w.parkHas === true), parkNoStyle: selCard(w.parkHas === false),
      mPalco: w.mPalco, mSeatY: w.mSeatY, mSeatE: w.mSeatE,
      mPalcoStyle: selCard(w.mPalco), mSeatYStyle: selCard(w.mSeatY), mSeatEStyle: selCard(w.mSeatE),
      swPalco: sw(w.mPalco), swSeatY: sw(w.mSeatY), swSeatE: sw(w.mSeatE),
      pricePalco: w.pricePalco, priceSeatY: w.priceSeatY, priceSeatE: w.priceSeatE,
      pricePalcoTxt: self.money(w.pricePalco), priceSeatYTxt: self.money(w.priceSeatY), priceSeatETxt: self.money(w.priceSeatE),
      markers: (w.x != null) ? [{ x: w.x, y: w.y, active: true, label: 'Acá' }] : [],
      locTxt: (w.x != null ? 'Ubicación marcada ✓' : 'Tocá el plano para marcar'),
      nextLabel: w.step >= 5 ? (editing ? 'Guardar cambios' : 'Publicar palco') : 'Continuar',
      gpcSel: w.stadium === 'gpc', cdsSel: w.stadium === 'cds',
      pickGpc: function () { self.wzSet({ stadium: 'gpc' }) },
      pickCds: function () { self.wzSet({ stadium: 'cds' }) },
      stadiumQuery: sQuery,
      setStadiumQuery: function (v) { self.wzSet({ stadiumQuery: v }) },
      clearStadiumQuery: function () { self.wzSet({ stadiumQuery: '' }) },
      stadiumTotal: allStadiums.length,
      stadiumShown: shownStadiums.length,
      stadiumNoResults: shownStadiums.length === 0,
      stadiums: shownStadiums.map(function (st) {
        return {
          id: st.id, name: st.name, city: st.city, short: st.short,
          capacity: st.capacity ? (Number(st.capacity).toLocaleString('es-UY') + ' personas') : '',
          selected: w.stadium === st.id,
          pick: function () { self.wzSet({ stadium: st.id }) },
        }
      }),
      onPick: function (x, y) { self.wzSet({ x: x, y: y }) },
      setTitle: function (e) { self.wzSet({ title: e.target.value }) },
      incSeats: function () { self.wzSet({ seats: Math.min(40, (w.seats || 0) + 1) }) },
      decSeats: function () { self.wzSet({ seats: Math.max(1, (w.seats || 1) - 1) }) },
      setParkYes: function () { self.wzSet({ parkHas: true }) },
      setParkNo: function () { self.wzSet({ parkHas: false }) },
      incPark: function () { self.wzSet({ parkN: Math.min(30, (w.parkN || 0) + 1) }) },
      decPark: function () { self.wzSet({ parkN: Math.max(1, (w.parkN || 1) - 1) }) },
      tPalco: function () { self.wzSet({ mPalco: !w.mPalco }) },
      tSeatY: function () { self.wzSet({ mSeatY: !w.mSeatY }) },
      tSeatE: function () { self.wzSet({ mSeatE: !w.mSeatE }) },
      setPricePalco: function (e) { self.wzSet({ pricePalco: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }) },
      setPriceSeatY: function (e) { self.wzSet({ priceSeatY: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }) },
      setPriceSeatE: function (e) { self.wzSet({ priceSeatE: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }) },
      next: function () { self.wzNext() },
      back: function () { self.wzBack() },
    }
  }

  return {
    wiz: wiz,
    wizMapCol: mobile ? 'display:flex; flex-direction:column; gap:18px;' : 'display:grid; grid-template-columns:minmax(0,1fr) 300px; gap:28px; align-items:start;',
  }
}
