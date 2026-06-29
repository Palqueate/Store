// @ts-nocheck
// Admin panel: tab/navigation, event & stadium creation drafts and actions.
import { container } from '@/app/container'
import { createEvent } from '@/modules/events/application/use-cases/createEvent'
import { updateEvent } from '@/modules/events/application/use-cases/updateEvent'
import { createStadium } from '@/modules/stadiums/application/use-cases/createStadium'
import { updateStadium } from '@/modules/stadiums/application/use-cases/updateStadium'
import { eventOccurrences } from '@/modules/events/domain/Event'
import { readImagesAsDataUrls } from '@/shared/lib/readImages'
import { DEFAULT_COUNTRY } from '@/shared/domain/countries'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DOWS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

export const createAdminSlice = (set, get) => ({
  adminTab: 'dashboard',
  adminClient: null,
  adminEvModal: false,
  adminStadModal: false,
  evEditId: null,
  stadEditId: null,
  // Verificación de palcos: id del palco en revisión, motivo general del rechazo
  // y mapa de campos marcados como no validados ({ key: { on, label, reason } }).
  palcoReviewId: null,
  palcoReviewReason: '',
  palcoReviewFlags: {},
  // `dates` son las funciones del evento (fecha + hora). Fútbol suele tener una;
  // shows y otros eventos pueden tener varias.
  evDraft: { type: 'futbol', stadium: 'gpc', country: DEFAULT_COUNTRY, dates: [{ date: '', time: '17:00' }], comp: '', round: '', opp: '', images: [], obs: '' },
  stadDraft: { name: '', short: '', city: 'Montevideo', country: DEFAULT_COUNTRY, address: '', capacity: '', year: '', surface: '', levels: '2', roof: 'no', mapImage: '' },

  isAdmin: () => !!(get().user && get().user.admin),
  openAdmin: (tab) => { if (!get().isAdmin()) return get().flash('Acceso solo para administradores'); set({ adminTab: tab || 'dashboard', acctMenu: false }); get().go('admin') },
  setAdminTab: (t) => { set({ adminTab: t, adminClient: null }); scrollTop() },
  openClient: (id) => set({ adminClient: get().adminClient === id ? null : id }),
  _fmtDate: (iso) => {
    const d = new Date(iso + 'T00:00:00')
    if (isNaN(d.getTime())) return null
    return { day: String(d.getDate()).padStart(2, '0'), month: MONTHS[d.getMonth()], dow: DOWS[d.getDay()] }
  },
  setEvDraft: (k, v) => set({ evDraft: { ...get().evDraft, [k]: v } }),
  // Funciones (fecha + hora) del evento en el draft.
  addEvDate: () => set({ evDraft: { ...get().evDraft, dates: get().evDraft.dates.concat([{ date: '', time: '17:00' }]) } }),
  removeEvDate: (i) => { const d = get().evDraft.dates.slice(); if (d.length <= 1) return; d.splice(i, 1); set({ evDraft: { ...get().evDraft, dates: d } }) },
  setEvDateAt: (i, field, v) => { const d = get().evDraft.dates.map((x) => ({ ...x })); if (!d[i]) return; d[i][field] = v; set({ evDraft: { ...get().evDraft, dates: d } }) },
  setStadDraft: (k, v) => set({ stadDraft: { ...get().stadDraft, [k]: v } }),
  // Stadiums (ids) located in a given country.
  _stadiumsInCountry: (country) => {
    const stadiums = get().stadiums
    return Object.keys(stadiums).filter((k) => (stadiums[k].country || '') === country)
  },
  setEvStadium: (id) => set({ evDraft: { ...get().evDraft, stadium: id } }),
  // The event country drives the stadium list: pick the country first, then
  // only stadiums in it are selectable. Changing country re-selects the first
  // stadium of that country (or clears it when the country has none yet).
  setEvCountry: (country) => {
    const inCountry = get()._stadiumsInCountry(country)
    const cur = get().evDraft.stadium
    const stadium = inCountry.indexOf(cur) >= 0 ? cur : (inCountry[0] || '')
    set({ evDraft: { ...get().evDraft, country, stadium } })
  },
  openEvModal: () => {
    const firstId = Object.keys(get().stadiums)[0] || ''
    const firstStad = get().stadiums[firstId]
    const country = (firstStad && firstStad.country) || DEFAULT_COUNTRY
    const inCountry = get()._stadiumsInCountry(country)
    const stadium = inCountry.indexOf(firstId) >= 0 ? firstId : (inCountry[0] || '')
    set({ adminEvModal: true, evEditId: null, evDraft: { type: 'futbol', stadium, country, dates: [{ date: '', time: '17:00' }], comp: '', round: '', opp: '', images: [], obs: '' } })
  },
  openEvModalEdit: (id) => {
    const ev = get().events.find((e) => e.id === id); if (!ev) return
    const dates = eventOccurrences(ev).map((o) => ({ date: o.iso || '', time: o.time || '17:00' }))
    set({
      adminEvModal: true, evEditId: id,
      evDraft: {
        type: ev.type || 'futbol', stadium: ev.stadium, country: ev.country, dates: dates.length ? dates : [{ date: '', time: '17:00' }],
        comp: ev.comp || '', round: ev.round || '', opp: ev.opp || '', images: (ev.images || []).slice(), obs: ev.obs || '',
      },
    })
  },
  adminAddEventImages: async (files) => {
    if (!files || !files.length) return
    const urls = await readImagesAsDataUrls(Array.from(files))
    if (urls.length) get().setEvDraft('images', get().evDraft.images.concat(urls))
  },
  adminRemoveEventImage: (index) => get().setEvDraft('images', get().evDraft.images.filter((_, i) => i !== index)),
  closeEvModal: () => set({ adminEvModal: false, evEditId: null }),
  openStadModal: () => set({ adminStadModal: true, stadEditId: null, stadDraft: { name: '', short: '', city: 'Montevideo', country: DEFAULT_COUNTRY, address: '', capacity: '', year: '', surface: '', levels: '2', roof: 'no', mapImage: '' } }),
  openStadModalEdit: (id) => {
    const st = get().stadiums[id]; if (!st) return
    set({
      adminStadModal: true, stadEditId: id,
      stadDraft: {
        name: st.name || '', short: st.short || '', city: st.city || '', country: st.country || DEFAULT_COUNTRY, address: st.address || '',
        capacity: st.capacity ? String(st.capacity) : '', year: st.year ? String(st.year) : '',
        surface: st.surface || '', levels: st.levels ? String(st.levels) : '1',
        roof: st.roof ? 'si' : 'no', mapImage: st.mapImage || '',
      },
    })
  },
  closeStadModal: () => set({ adminStadModal: false, stadEditId: null }),
  adminAddStadMap: async (files) => {
    const list = Array.from(files || []); if (!list.length) return
    const urls = await readImagesAsDataUrls(list)
    if (urls.length) get().setStadDraft('mapImage', urls[0])
  },
  adminRemoveStadMap: () => get().setStadDraft('mapImage', ''),
  adminCreateEvent: () => {
    const d = get().evDraft
    const rows = (d.dates || []).filter((r) => r && r.date)
    if (!rows.length) return get().flash('Elegí al menos una fecha del evento')
    if (!d.stadium) return get().flash('Agregá un estadio en ese país primero')
    if (!(d.opp || '').trim()) return get().flash('Ingresá el nombre del evento')
    const et = get().eventTypes.find((t) => t.id === d.type) || get().eventTypes[0]
    const comp = (d.comp || '').trim() || et.name
    const stadCountry = (get().stadiums[d.stadium] || {}).country
    const country = (d.country || stadCountry || DEFAULT_COUNTRY)
    const editId = get().evEditId
    const baseId = editId || ('e' + Date.now())
    // Construir las funciones (fecha + hora). Para fecha única, el id de la
    // función coincide con el del evento (compatibilidad de disponibilidad).
    const occ = []
    for (let i = 0; i < rows.length; i++) {
      const fd = get()._fmtDate(rows[i].date); if (!fd) return get().flash('Fecha inválida')
      occ.push({ id: baseId + '-' + (i + 1), month: fd.month, day: fd.day, dow: fd.dow, time: rows[i].time || '17:00', iso: rows[i].date })
    }
    if (occ.length === 1) occ[0].id = baseId
    const first = occ[0]
    const base = { stadium: d.stadium, type: d.type, comp, round: (d.round || '').trim(), opp: (d.opp || '').trim(), month: first.month, day: first.day, dow: first.dow, iso: first.iso, time: first.time, dates: occ, tag: et.tag, label: comp + ((d.round || '').trim() ? (' · ' + d.round.trim()) : ''), images: d.images || [], obs: (d.obs || '').trim(), country }
    if (editId) {
      const ev = { ...base, id: editId }
      updateEvent(container.events, ev)
      set({ events: get().events.map((e) => (e.id === editId ? ev : e)), adminEvModal: false, evEditId: null })
      get().flash('Evento actualizado')
      return
    }
    const ev = { ...base, id: baseId }
    createEvent(container.events, ev)
    set({ events: get().events.concat([ev]), adminEvModal: false }); get().flash('Evento creado')
  },
  adminAddStadium: () => {
    const d = get().stadDraft
    if (!(d.name || '').trim()) return get().flash('Ingresá el nombre del estadio')
    const short = ((d.short || '').trim() || d.name.trim().slice(0, 3)).toUpperCase().slice(0, 4)
    const editId = get().stadEditId
    const base = {
      name: d.name.trim(), short, city: (d.city || '').trim(), country: (d.country || '').trim() || DEFAULT_COUNTRY, shape: 'rect',
      address: (d.address || '').trim(),
      capacity: parseInt((d.capacity || '').toString().replace(/[^0-9]/g, ''), 10) || 0,
      year: parseInt((d.year || '').toString().replace(/[^0-9]/g, ''), 10) || null,
      surface: (d.surface || '').trim(), levels: parseInt(d.levels, 10) || 1,
      roof: d.roof === 'si', mapImage: d.mapImage || '',
    }
    if (editId) {
      const st = { ...base, id: editId }
      updateStadium(container.stadiums, st)
      set({ stadiums: { ...get().stadiums, [editId]: st }, adminStadModal: false, stadEditId: null })
      get().flash('Estadio actualizado')
      return
    }
    const st = { ...base, id: 'st' + Date.now() }
    createStadium(container.stadiums, st)
    set({ stadiums: { ...get().stadiums, [st.id]: st }, adminStadModal: false }); get().flash('Estadio agregado')
  },

  // ── Verificación de palcos ──
  // Abre el modal de revisión, precargando los campos marcados en una revisión
  // previa (cuando el palquista reenvió un palco rechazado).
  openPalcoReview: (id) => {
    const p = get().byId(id); if (!p) return
    const flags = {}
    if (p.review && p.review.fields) p.review.fields.forEach((f) => { flags[f.key] = { on: true, label: f.label, reason: f.reason || '' } })
    set({ palcoReviewId: id, palcoReviewReason: (p.review && p.review.reason) || '', palcoReviewFlags: flags })
  },
  closePalcoReview: () => set({ palcoReviewId: null, palcoReviewReason: '', palcoReviewFlags: {} }),
  setPalcoReviewReason: (v) => set({ palcoReviewReason: v }),
  togglePalcoReviewFlag: (key, label) => {
    const flags = { ...get().palcoReviewFlags }
    if (flags[key] && flags[key].on) flags[key] = { ...flags[key], on: false }
    else flags[key] = { on: true, label, reason: (flags[key] && flags[key].reason) || '' }
    set({ palcoReviewFlags: flags })
  },
  setPalcoReviewFlagReason: (key, label, v) => {
    const flags = { ...get().palcoReviewFlags }
    flags[key] = { on: (flags[key] ? flags[key].on : true), label: (flags[key] && flags[key].label) || label, reason: v }
    set({ palcoReviewFlags: flags })
  },
  approvePalcoReview: () => {
    const id = get().palcoReviewId; const p = id && get().byId(id); if (!p) return
    const np = { ...p, status: 'publicado' }; delete np.review
    get().savePalco(np)
    set({ palcoReviewId: null, palcoReviewReason: '', palcoReviewFlags: {} })
    get().flash('Palco aprobado y publicado')
  },
  rejectPalcoReview: () => {
    const id = get().palcoReviewId; const p = id && get().byId(id); if (!p) return
    const flagsMap = get().palcoReviewFlags
    const fields = Object.keys(flagsMap).filter((k) => flagsMap[k] && flagsMap[k].on).map((k) => ({ key: k, label: flagsMap[k].label, reason: (flagsMap[k].reason || '').trim() }))
    const reason = (get().palcoReviewReason || '').trim()
    if (!reason && !fields.length) return get().flash('Indicá un motivo o marcá al menos un campo')
    for (let i = 0; i < fields.length; i++) { if (!fields[i].reason) return get().flash('Poné el motivo del campo: ' + fields[i].label) }
    const np = { ...p, status: 'rechazado', review: { reason, fields, reviewedAt: new Date().toISOString() } }
    get().savePalco(np)
    set({ palcoReviewId: null, palcoReviewReason: '', palcoReviewFlags: {} })
    get().flash('Palco rechazado · el palquista fue notificado')
  },
})
