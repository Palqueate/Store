import { useFacade } from '@/shared/ui/vm/facade'
import { bnS } from '@/shared/ui/vm/helpers'
import { COUNTRY_OPTIONS } from '@/shared/domain/countries'
import { PALCO_REVIEW_FIELDS } from '@/modules/palcos/domain/Palco'

const PAYOUT_DOC_KEYS = { 'payout.idFront': 'idFront', 'payout.idBack': 'idBack', 'payout.proofOfAddress': 'proofOfAddress', 'payout.propertyTitle': 'propertyTitle' }

export function useOverlaysVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const STAD_LIST = Object.keys(s.stadiums).map(function (k) { return s.stadiums[k] })
  const EVENT_TYPES = s.eventTypes

  const evTypeOptions = EVENT_TYPES.map(function (t) { return { value: t.id, label: t.name } })
  // Stadium options for the event modal are scoped to the chosen country:
  // pick the country first, then only its stadiums are selectable.
  const evStadList = STAD_LIST.filter(function (st) { return (st.country || '') === s.evDraft.country })
  const stadOptions = evStadList.map(function (st) { return { value: st.id, label: st.name } })

  // ── PalcoReviewModal (verificación de palcos) ──
  const reviewP = s.palcoReviewId ? self.byId(s.palcoReviewId) : null
  let palcoReview: any = null
  if (reviewP) {
    const pay = reviewP.payout || {}
    const stadName = (s.stadiums[reviewP.stadium] || {}).name || reviewP.stadium
    const valueFor = function (key) {
      switch (key) {
        case 'country': return reviewP.country || '—'
        case 'stadium': return stadName
        case 'map': return reviewP.map ? ('x ' + Math.round(reviewP.map.x) + '% · y ' + Math.round(reviewP.map.y) + '%') : '—'
        case 'seats': return (reviewP.seats || 0) + ' asientos'
        case 'parking': return reviewP.parking && reviewP.parking.has ? ('Sí · ' + reviewP.parking.n + ' lugares') : 'No incluye'
        case 'amenities': return (reviewP.amenities || []).join(', ') || '—'
        case 'images': return (reviewP.images || []).length + ' fotos'
        case 'coOwners': return (reviewP.coOwners || []).length ? reviewP.coOwners.map(function (c) { return c.name + ' (' + c.email + ')' }).join(' · ') : 'Ninguno'
        case 'payout.country': return pay.country || '—'
        case 'payout.swift': return pay.swift || '—'
        case 'payout.bank': return pay.bank || '—'
        case 'payout.beneficiary': return pay.beneficiary || '—'
        case 'payout.accountNumber': return pay.accountNumber || '—'
        case 'payout.branch': return pay.branch || '—'
        default: return '—'
      }
    }
    const flags = s.palcoReviewFlags || {}
    const prevFields = (reviewP.review && reviewP.review.fields) || []
    const fields = PALCO_REVIEW_FIELDS.map(function (f) {
      const docField = PAYOUT_DOC_KEYS[f.key]
      const fl = flags[f.key]
      const prev = prevFields.find(function (x) { return x.key === f.key })
      return {
        key: f.key, label: f.label,
        value: docField ? '' : valueFor(f.key),
        image: docField ? (pay[docField] || '') : '',
        isDoc: !!docField,
        flagged: !!(fl && fl.on),
        reason: (fl && fl.reason) || '',
        ownerReply: (prev && prev.ownerReply) || '',
        toggle: function () { self.togglePalcoReviewFlag(f.key, f.label) },
        setReason: function (v) { self.setPalcoReviewFlagReason(f.key, f.label, v) },
      }
    })
    palcoReview = {
      id: reviewP.id, title: reviewP.title, host: reviewP.host, stadiumName: stadName,
      images: reviewP.images || [],
      resubmitted: reviewP.status === 'pendiente' && !!reviewP.review,
      reason: s.palcoReviewReason,
      setReason: function (v) { self.setPalcoReviewReason(v) },
      fields: fields,
      flaggedCount: fields.filter(function (f) { return f.flagged }).length,
      approve: function () { self.approvePalcoReview() },
      reject: function () { self.rejectPalcoReview() },
    }
  }

  return {
    // ── PalcoReviewModal ──
    palcoReviewOpen: !!s.palcoReviewId,
    palcoReview: palcoReview,
    closePalcoReview: function () { self.closePalcoReview() },

    // ── BottomNav ──
    showMobileNav: mobile,
    bottomNavStyle: 'position:fixed; left:0; right:0; bottom:0; z-index:70; ' + (mobile ? 'display:grid;' : 'display:none;') + ' grid-template-columns:repeat(4,1fr); align-items:center; padding:8px 8px 10px; background:color-mix(in srgb, var(--background,#0E1116) 90%, transparent); backdrop-filter:blur(16px); border-top:1px solid var(--border,rgba(255,255,255,.1));',
    goHome: function () { self.go('home') },
    goEvents: function () { self.goEvents() },
    goOwner: function () { self.go('owner') },
    goCart: function () { self.go('cart') },
    bnHome: bnS(s.screen === 'home'),
    bnResults: bnS(s.screen === 'events' || s.screen === 'eventPalcos' || s.screen === 'detail' || s.screen === 'results'),
    bnOwner: bnS(s.screen === 'owner' || s.screen === 'publish' || s.screen === 'metrics'),
    bnCart: bnS(s.screen === 'cart' || s.screen === 'checkout' || s.screen === 'confirm' || s.screen === 'food' || s.screen === 'foodConfirm'),

    // ── AcctBackdrop ──
    acctMenuOpen: s.acctMenu,
    toggleAcctMenu: function () { self.toggleAcctMenu() },

    // ── AuthModal ──
    isAuthOpen: !!s.authView,
    closeAuth: function () { self.closeAuth() },
    authIsLogin: s.authView === 'login',
    authIsRegister: s.authView === 'register',
    authErr: s.authErr,
    authSubmitLabel: s.authView === 'register' ? 'Crear cuenta' : 'Ingresar',
    authName: s.authForm.name,
    authEmail: s.authForm.email,
    authPhone: s.authForm.phone,
    authPass: s.authForm.pass,
    setAuthName: function (e) { self.setAuthField('name', e.target.value) },
    setAuthEmail: function (e) { self.setAuthField('email', e.target.value) },
    setAuthPhone: function (e) { self.setAuthField('phone', e.target.value) },
    setAuthPass: function (e) { self.setAuthField('pass', e.target.value) },
    submitAuth: function () { if (s.authView === 'register') self.doRegister(); else self.doLogin() },
    switchToLogin: function () { self.switchAuth('login') },
    switchToRegister: function () { self.switchAuth('register') },

    // ── EventModal ──
    adminEvModal: s.adminEvModal,
    evEditing: !!s.evEditId,
    closeEvModal: function () { self.closeEvModal() },
    adminCreateEvent: function () { self.adminCreateEvent() },
    evTypeOptions: evTypeOptions,
    stadOptions: stadOptions,
    countryOptions: COUNTRY_OPTIONS,
    evDtype: s.evDraft.type,
    evStadiumSel: s.evDraft.stadium,
    evCountry: s.evDraft.country,
    evHasStadiums: evStadList.length > 0,
    evDates: s.evDraft.dates,
    evOpp: s.evDraft.opp,
    evObs: s.evDraft.obs,
    evImages: s.evDraft.images,
    addEvImages: function (files) { self.adminAddEventImages(files) },
    removeEvImage: function (i) { self.adminRemoveEventImage(i) },
    setEvType: function (e) { self.setEvDraft('type', e.target.value) },
    setEvStadiumSel: function (e) { self.setEvStadium(e.target.value) },
    setEvCountry: function (e) { self.setEvCountry(e.target.value) },
    addEvDate: function () { self.addEvDate() },
    removeEvDate: function (i) { self.removeEvDate(i) },
    setEvDateAt: function (i, field, v) { self.setEvDateAt(i, field, v) },
    setEvOpp: function (e) { self.setEvDraft('opp', e.target.value) },
    setEvObs: function (v) { self.setEvDraft('obs', v) },

    // ── StadiumModal ──
    adminStadModal: s.adminStadModal,
    stadEditing: !!s.stadEditId,
    closeStadModal: function () { self.closeStadModal() },
    adminAddStadium: function () { self.adminAddStadium() },
    stadName: s.stadDraft.name,
    stadShort: s.stadDraft.short,
    stadCity: s.stadDraft.city,
    stadCountry: s.stadDraft.country,
    stadAddress: s.stadDraft.address,
    stadCapacity: s.stadDraft.capacity,
    stadYear: s.stadDraft.year,
    stadSurface: s.stadDraft.surface,
    stadLevels: s.stadDraft.levels,
    stadRoof: s.stadDraft.roof,
    stadMapImage: s.stadDraft.mapImage,
    setStadName: function (e) { self.setStadDraft('name', e.target.value) },
    setStadShort: function (e) { self.setStadDraft('short', e.target.value) },
    setStadCity: function (e) { self.setStadDraft('city', e.target.value) },
    setStadCountry: function (e) { self.setStadDraft('country', e.target.value) },
    setStadAddress: function (e) { self.setStadDraft('address', e.target.value) },
    setStadCapacity: function (e) { self.setStadDraft('capacity', e.target.value) },
    setStadYear: function (e) { self.setStadDraft('year', e.target.value) },
    setStadSurface: function (e) { self.setStadDraft('surface', e.target.value) },
    setStadLevels: function (e) { self.setStadDraft('levels', e.target.value) },
    setStadRoof: function (e) { self.setStadDraft('roof', e.target.value) },
    addStadMap: function (files) { self.adminAddStadMap(files) },
    removeStadMap: function () { self.adminRemoveStadMap() },
    surfaceOptions: [
      { value: 'Césped natural', label: 'Césped natural' },
      { value: 'Césped híbrido', label: 'Césped híbrido' },
      { value: 'Césped sintético', label: 'Césped sintético' },
      { value: 'Parquet (madera)', label: 'Parquet (madera)' },
      { value: 'Hormigón', label: 'Hormigón' },
      { value: 'Cemento pulido', label: 'Cemento pulido' },
      { value: 'Goma / caucho', label: 'Goma / caucho' },
      { value: 'Pista de atletismo (tartán)', label: 'Pista de atletismo (tartán)' },
      { value: 'Hielo', label: 'Hielo' },
      { value: 'Arena', label: 'Arena' },
      { value: 'Tierra batida', label: 'Tierra batida' },
      { value: 'Superficie multiuso', label: 'Superficie multiuso' },
    ],
    roofOptions: [
      { value: 'no', label: 'Abierto' },
      { value: 'si', label: 'Techado' },
    ],

    // ── Toast ──
    toast: s.toast,
  }
}
