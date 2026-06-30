import { useFacade } from '@/shared/ui/vm/facade'
import { selCard, sw } from '@/shared/ui/vm/helpers'
import { COUNTRY_OPTIONS } from '@/shared/domain/countries'
import { DEFAULT_AMENITIES } from '@/app/store/slices/ownerSlice'

const MIN_PHOTOS = 3

export function usePublishVM(): any {
  const self = useFacade()
  const s = self.state
  var STADIUMS = s.stadiums
  var mobile = s.vw < 860

  var w = s.wz
  var wiz: any = null

  if (w) {
    var editing = !!w.editId
    var stepNames = ['País', 'Estadio', 'Ubicación', 'Asientos', 'Estacionamiento', 'Comodidades', 'Fotos', 'Co-propietarios', 'Cobro', 'Precios']
    var lastStep = stepNames.length - 1

    // Estadios del país elegido (paso 1): lista buscable y ordenada. Escala a
    // cientos de estadios — la UI la virtualiza, así que sólo filtramos acá.
    var sQuery = w.stadiumQuery || ''
    var sNeedle = sQuery.trim().toLowerCase()
    var allStadiums = Object.keys(STADIUMS).map(function (k) { return STADIUMS[k] })
      .filter(function (st) { return (st.country || '') === w.country })
      .sort(function (a, b) { return (a.name || '').localeCompare(b.name || '') })
    var shownStadiums = sNeedle
      ? allStadiums.filter(function (st) {
          return ((st.name || '') + ' ' + (st.city || '') + ' ' + (st.short || '')).toLowerCase().indexOf(sNeedle) >= 0
        })
      : allStadiums

    var curStad = STADIUMS[w.stadium] || {}

    // Comodidades: sugeridas + las personalizadas que ya estén elegidas.
    var amenities = w.amenities || []
    var amenityNames = DEFAULT_AMENITIES.slice()
    amenities.forEach(function (a) { if (amenityNames.indexOf(a) < 0) amenityNames.push(a) })

    var p = w.payout || {}
    var images = w.images || []

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
      s0: w.step === 0, s1: w.step === 1, s2: w.step === 2, s3: w.step === 3, s4: w.step === 4, s5: w.step === 5, s6: w.step === 6, s7: w.step === 7, s8: w.step === 8, s9: w.step === 9,

      // País
      country: w.country,
      countryOptions: COUNTRY_OPTIONS,
      setCountry: function (v) { self.wzSetCountry(v) },

      stadium: w.stadium, stadiumName: curStad.name || '—', stadiumMap: curStad.mapImage || '', x: w.x, y: w.y, title: w.title, seats: String(w.seats), parkN: String(w.parkN), parkHas: w.parkHas, parkPrice: String(w.parkPrice ?? 0),
      images: images,
      photosMin: MIN_PHOTOS,
      photosCount: images.length,
      photosEnough: images.length >= MIN_PHOTOS,
      photosLeft: Math.max(0, MIN_PHOTOS - images.length),
      addImages: function (files) { self.wzAddImages(files) },
      removeImage: function (i) { self.wzRemoveImage(i) },
      parkYesStyle: selCard(w.parkHas === true), parkNoStyle: selCard(w.parkHas === false),

      // Comodidades
      amenityChips: amenityNames.map(function (name) {
        return { name: name, selected: amenities.indexOf(name) >= 0, toggle: function () { self.wzToggleAmenity(name) } }
      }),
      amenityCount: amenities.length,
      amenityDraft: w.amenityDraft || '',
      setAmenityDraft: function (e) { self.wzSet({ amenityDraft: e.target.value }) },
      addAmenity: function () { self.wzAddAmenity(w.amenityDraft); self.wzSet({ amenityDraft: '' }) },

      // Co-propietarios
      coOwners: (w.coOwners || []).map(function (c, i) {
        return {
          name: c.name, email: c.email,
          setName: function (e) { self.wzSetCoOwner(i, 'name', e.target.value) },
          setEmail: function (e) { self.wzSetCoOwner(i, 'email', e.target.value) },
          remove: function () { self.wzRemoveCoOwner(i) },
        }
      }),
      addCoOwner: function () { self.wzAddCoOwner() },

      // Cobro
      payout: {
        country: p.country || '', swift: p.swift || '', bank: p.bank || '', beneficiary: p.beneficiary || '',
        accountNumber: p.accountNumber || '', branch: p.branch || '',
        idFront: p.idFront || '', idBack: p.idBack || '', proofOfAddress: p.proofOfAddress || '', propertyTitle: p.propertyTitle || '',
        setCountry: function (v) { self.wzSetPayout('country', v) },
        setSwift: function (e) { self.wzSetPayout('swift', e.target.value) },
        setBank: function (e) { self.wzSetPayout('bank', e.target.value) },
        setBeneficiary: function (e) { self.wzSetPayout('beneficiary', e.target.value) },
        setAccountNumber: function (e) { self.wzSetPayout('accountNumber', e.target.value) },
        setBranch: function (e) { self.wzSetPayout('branch', e.target.value) },
        addIdFront: function (files) { self.wzAddPayoutDoc('idFront', files) },
        addIdBack: function (files) { self.wzAddPayoutDoc('idBack', files) },
        addProofOfAddress: function (files) { self.wzAddPayoutDoc('proofOfAddress', files) },
        addPropertyTitle: function (files) { self.wzAddPayoutDoc('propertyTitle', files) },
        removeIdFront: function () { self.wzRemovePayoutDoc('idFront') },
        removeIdBack: function () { self.wzRemovePayoutDoc('idBack') },
        removeProofOfAddress: function () { self.wzRemovePayoutDoc('proofOfAddress') },
        removePropertyTitle: function () { self.wzRemovePayoutDoc('propertyTitle') },
      },

      mPalco: w.mPalco, mSeatY: w.mSeatY, mSeatE: w.mSeatE,
      mPalcoStyle: selCard(w.mPalco), mSeatYStyle: selCard(w.mSeatY), mSeatEStyle: selCard(w.mSeatE),
      swPalco: sw(w.mPalco), swSeatY: sw(w.mSeatY), swSeatE: sw(w.mSeatE),
      pricePalco: w.pricePalco, priceSeatY: w.priceSeatY, priceSeatE: w.priceSeatE,
      pricePalcoTxt: self.money(w.pricePalco), priceSeatYTxt: self.money(w.priceSeatY), priceSeatETxt: self.money(w.priceSeatE),
      markers: (w.x != null) ? [{ x: w.x, y: w.y, active: true, label: 'Acá' }] : [],
      locTxt: (w.x != null ? 'Ubicación marcada ✓' : 'Tocá el plano para marcar'),
      nextLabel: w.step >= lastStep ? (editing ? 'Guardar cambios' : 'Publicar palco') : 'Continuar',
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
      setParkPrice: function (e) { self.wzSet({ parkPrice: parseInt((e.target.value || '').replace(/[^0-9]/g, ''), 10) || 0 }) },
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
