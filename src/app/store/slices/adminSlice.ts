// @ts-nocheck
// Admin panel: tab/navigation, event & stadium creation drafts and actions.
import { container } from '@/app/container'
import { createEvent } from '@/modules/events/application/use-cases/createEvent'
import { createStadium } from '@/modules/stadiums/application/use-cases/createStadium'
import { updateStadium } from '@/modules/stadiums/application/use-cases/updateStadium'
import { readImagesAsDataUrls } from '@/shared/lib/readImages'
import { DEFAULT_COUNTRY } from '@/shared/domain/countries'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC']
const DOWS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

export const createAdminSlice = (set, get) => ({
  adminTab: 'dashboard',
  adminClient: null,
  adminEvModal: false,
  adminStadModal: false,
  stadEditId: null,
  evDraft: { type: 'liga', stadium: 'gpc', country: DEFAULT_COUNTRY, date: '', time: '17:00', comp: '', round: '', opp: '', images: [] },
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
    set({ adminEvModal: true, evDraft: { type: 'liga', stadium, country, date: '', time: '17:00', comp: '', round: '', opp: '', images: [] } })
  },
  adminAddEventImages: async (files) => {
    if (!files || !files.length) return
    const urls = await readImagesAsDataUrls(Array.from(files))
    if (urls.length) get().setEvDraft('images', get().evDraft.images.concat(urls))
  },
  adminRemoveEventImage: (index) => get().setEvDraft('images', get().evDraft.images.filter((_, i) => i !== index)),
  closeEvModal: () => set({ adminEvModal: false }),
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
    if (!d.date) return get().flash('Elegí la fecha del evento')
    if (!d.stadium) return get().flash('Agregá un estadio en ese país primero')
    if (!(d.opp || '').trim()) return get().flash('Ingresá el rival o título del evento')
    const fd = get()._fmtDate(d.date); if (!fd) return get().flash('Fecha inválida')
    const et = get().eventTypes.find((t) => t.id === d.type) || get().eventTypes[0]
    const comp = (d.comp || '').trim() || et.name
    const stadCountry = (get().stadiums[d.stadium] || {}).country
    const country = (d.country || stadCountry || DEFAULT_COUNTRY)
    const ev = { id: 'e' + Date.now(), stadium: d.stadium, country, type: d.type, comp, round: (d.round || '').trim(), opp: (d.opp || '').trim(), month: fd.month, day: fd.day, dow: fd.dow, iso: d.date, time: d.time || '17:00', tag: et.tag, label: comp + ((d.round || '').trim() ? (' · ' + d.round.trim()) : ''), images: d.images || [] }
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
})
