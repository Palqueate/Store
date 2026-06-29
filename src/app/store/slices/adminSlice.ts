// @ts-nocheck
// Admin panel: tab/navigation, event & stadium creation drafts and actions.
import { container } from '@/app/container'
import { createEvent } from '@/modules/events/application/use-cases/createEvent'
import { createStadium } from '@/modules/stadiums/application/use-cases/createStadium'
import { readImagesAsDataUrls } from '@/shared/lib/readImages'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SET', 'OCT', 'NOV', 'DIC']
const DOWS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

export const createAdminSlice = (set, get) => ({
  adminTab: 'dashboard',
  adminClient: null,
  adminEvModal: false,
  adminStadModal: false,
  evDraft: { type: 'liga', stadium: 'gpc', date: '', time: '17:00', comp: '', round: '', opp: '', images: [] },
  stadDraft: { name: '', short: '', city: 'Montevideo', address: '', capacity: '', year: '', surface: 'Césped natural', levels: '2', roof: 'no', shape: 'rect', mapImage: '' },

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
  openEvModal: () => set({ adminEvModal: true, evDraft: { type: 'liga', stadium: Object.keys(get().stadiums)[0] || 'gpc', date: '', time: '17:00', comp: '', round: '', opp: '', images: [] } }),
  adminAddEventImages: async (files) => {
    if (!files || !files.length) return
    const urls = await readImagesAsDataUrls(Array.from(files))
    if (urls.length) get().setEvDraft('images', get().evDraft.images.concat(urls))
  },
  adminRemoveEventImage: (index) => get().setEvDraft('images', get().evDraft.images.filter((_, i) => i !== index)),
  closeEvModal: () => set({ adminEvModal: false }),
  openStadModal: () => set({ adminStadModal: true, stadDraft: { name: '', short: '', city: 'Montevideo', address: '', capacity: '', year: '', surface: 'Césped natural', levels: '2', roof: 'no', shape: 'rect' } }),
  closeStadModal: () => set({ adminStadModal: false }),
  adminAddStadMap: async (files) => {
    const list = Array.from(files || []); if (!list.length) return
    const urls = await readImagesAsDataUrls(list)
    if (urls.length) get().setStadDraft('mapImage', urls[0])
  },
  adminRemoveStadMap: () => get().setStadDraft('mapImage', ''),
  adminCreateEvent: () => {
    const d = get().evDraft
    if (!d.date) return get().flash('Elegí la fecha del evento')
    if (!(d.opp || '').trim()) return get().flash('Ingresá el rival o título del evento')
    const fd = get()._fmtDate(d.date); if (!fd) return get().flash('Fecha inválida')
    const et = get().eventTypes.find((t) => t.id === d.type) || get().eventTypes[0]
    const comp = (d.comp || '').trim() || et.name
    const ev = { id: 'e' + Date.now(), stadium: d.stadium, type: d.type, comp, round: (d.round || '').trim(), opp: (d.opp || '').trim(), month: fd.month, day: fd.day, dow: fd.dow, iso: d.date, time: d.time || '17:00', tag: et.tag, label: comp + ((d.round || '').trim() ? (' · ' + d.round.trim()) : ''), images: d.images || [] }
    createEvent(container.events, ev)
    set({ events: get().events.concat([ev]), adminEvModal: false }); get().flash('Evento creado')
  },
  adminAddStadium: () => {
    const d = get().stadDraft
    if (!(d.name || '').trim()) return get().flash('Ingresá el nombre del estadio')
    const short = ((d.short || '').trim() || d.name.trim().slice(0, 3)).toUpperCase().slice(0, 4)
    const st = { id: 'st' + Date.now(), name: d.name.trim(), short, city: (d.city || '').trim(), shape: d.shape || 'rect', address: (d.address || '').trim(), capacity: parseInt((d.capacity || '').toString().replace(/[^0-9]/g, ''), 10) || 0, year: parseInt((d.year || '').toString().replace(/[^0-9]/g, ''), 10) || null, surface: d.surface || 'Césped natural', levels: parseInt(d.levels, 10) || 1, roof: d.roof === 'si', mapImage: d.mapImage || '' }
    createStadium(container.stadiums, st)
    set({ stadiums: { ...get().stadiums, [st.id]: st }, adminStadModal: false }); get().flash('Estadio agregado')
  },
})
