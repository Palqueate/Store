// @ts-nocheck
import { useFacade } from '@/shared/ui/vm/facade'
import { bnS } from '@/shared/ui/vm/helpers'

export function useOverlaysVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const STAD_LIST = Object.keys(s.stadiums).map(function (k) { return s.stadiums[k] })
  const EVENT_TYPES = s.eventTypes

  const evTypeOptions = EVENT_TYPES.map(function (t) { return { value: t.id, label: t.name } })
  const stadOptions = STAD_LIST.map(function (st) { return { value: st.id, label: st.name } })

  return {
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
    closeEvModal: function () { self.closeEvModal() },
    adminCreateEvent: function () { self.adminCreateEvent() },
    evTypeOptions: evTypeOptions,
    stadOptions: stadOptions,
    evDtype: s.evDraft.type,
    evStadiumSel: s.evDraft.stadium,
    evDate: s.evDraft.date,
    evTime: s.evDraft.time,
    evComp: s.evDraft.comp,
    evRound: s.evDraft.round,
    evOpp: s.evDraft.opp,
    evImages: s.evDraft.images,
    addEvImages: function (files) { self.adminAddEventImages(files) },
    removeEvImage: function (i) { self.adminRemoveEventImage(i) },
    setEvType: function (e) { self.setEvDraft('type', e.target.value) },
    setEvStadiumSel: function (e) { self.setEvDraft('stadium', e.target.value) },
    setEvDate: function (e) { self.setEvDraft('date', e.target.value) },
    setEvTime: function (e) { self.setEvDraft('time', e.target.value) },
    setEvComp: function (e) { self.setEvDraft('comp', e.target.value) },
    setEvRound: function (e) { self.setEvDraft('round', e.target.value) },
    setEvOpp: function (e) { self.setEvDraft('opp', e.target.value) },

    // ── StadiumModal ──
    adminStadModal: s.adminStadModal,
    closeStadModal: function () { self.closeStadModal() },
    adminAddStadium: function () { self.adminAddStadium() },
    stadName: s.stadDraft.name,
    stadShort: s.stadDraft.short,
    stadCity: s.stadDraft.city,
    stadAddress: s.stadDraft.address,
    stadCapacity: s.stadDraft.capacity,
    stadYear: s.stadDraft.year,
    stadSurface: s.stadDraft.surface,
    stadLevels: s.stadDraft.levels,
    stadRoof: s.stadDraft.roof,
    setStadName: function (e) { self.setStadDraft('name', e.target.value) },
    setStadShort: function (e) { self.setStadDraft('short', e.target.value) },
    setStadCity: function (e) { self.setStadDraft('city', e.target.value) },
    setStadAddress: function (e) { self.setStadDraft('address', e.target.value) },
    setStadCapacity: function (e) { self.setStadDraft('capacity', e.target.value) },
    setStadYear: function (e) { self.setStadDraft('year', e.target.value) },
    setStadSurface: function (e) { self.setStadDraft('surface', e.target.value) },
    setStadLevels: function (e) { self.setStadDraft('levels', e.target.value) },
    setStadRoof: function (e) { self.setStadDraft('roof', e.target.value) },
    surfaceOptions: [
      { value: 'Césped natural', label: 'Césped natural' },
      { value: 'Césped híbrido', label: 'Césped híbrido' },
      { value: 'Césped sintético', label: 'Césped sintético' },
    ],
    roofOptions: [
      { value: 'no', label: 'Abierto' },
      { value: 'si', label: 'Techado' },
    ],

    // ── Toast ──
    toast: s.toast,
  }
}
