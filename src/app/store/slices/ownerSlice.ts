// Owner publish wizard state + flow.
import { readImagesAsDataUrls } from '@/shared/lib/readImages'
import { DEFAULT_COUNTRY } from '@/shared/domain/countries'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }

// Comodidades sugeridas. El palquista puede sumar las suyas además de estas.
export const DEFAULT_AMENITIES = ['Wi-Fi', 'Cocina', 'Heladera', 'Televisión', 'Baño', 'Aire acondicionado', 'Calefacción', 'Bar', 'Parrillero']

const MIN_PHOTOS = 3

const emptyPayout = () => ({ country: DEFAULT_COUNTRY, swift: '', bank: '', beneficiary: '', accountNumber: '', branch: '', idFront: '', idBack: '', proofOfAddress: '', propertyTitle: '' })

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())

// La carga es una sola página con secciones (Dónde está · El palco · Fotos ·
// Co-propietarios · Cobro · Modalidades). wzSubmit valida todo junto y publica.

export const createOwnerSlice = (set, get) => ({
  // Borrador transitorio del asistente de publicación (forma dinámica por paso).
  wz: null as any,

  // Stadiums (ids) located in a given country.
  _wzStadiumsInCountry: (country) => {
    const st = get().stadiums
    return Object.keys(st).filter((k) => (st[k].country || '') === country)
  },

  startWizard: () => {
    const country = DEFAULT_COUNTRY
    const inCountry = get()._wzStadiumsInCountry(country)
    const stadium = inCountry[0] || ''
    set({ wz: { editId: null, country, stadium, x: null, y: null, title: '', seats: 10, parkHas: true, parkN: 2, parkPrice: 80000, amenities: [], coOwners: [], images: [], payout: emptyPayout(), priceSeatE: 6500 } })
    get().go('publish')
  },
  startEditWizard: (id) => {
    const p = get().byId(id); if (!p) return
    const stadCountry = (get().stadiums[p.stadium] || {}).country || DEFAULT_COUNTRY
    set({ wz: {
      editId: p.id, country: p.country || stadCountry, stadium: p.stadium, x: p.map.x, y: p.map.y, title: p.title,
      seats: p.seats,
      parkHas: p.parking.has, parkN: p.parking.n || 1, parkPrice: p.parking.price || 0,
      amenities: (p.amenities || []).slice(),
      coOwners: (p.coOwners || []).map((c) => ({ name: c.name, email: c.email })),
      images: (p.images || []).slice(),
      payout: { ...emptyPayout(), ...(p.payout || {}) },
      priceSeatE: p.modes.seatEvent.price,
    } })
    get().go('publish')
  },
  wzSet: (patch) => set({ wz: { ...get().wz, ...patch } }),

  // País: al cambiarlo, re-seleccionamos un estadio de ese país (o lo limpiamos
  // si todavía no hay ninguno cargado allí).
  wzSetCountry: (country) => {
    const w = get().wz; if (!w) return
    const inCountry = get()._wzStadiumsInCountry(country)
    const stadium = inCountry.indexOf(w.stadium) >= 0 ? w.stadium : (inCountry[0] || '')
    get().wzSet({ country, stadium })
  },

  // Comodidades: alterna una de la lista o de las agregadas.
  wzToggleAmenity: (name) => {
    const w = get().wz; if (!w) return
    const cur = w.amenities || []
    get().wzSet({ amenities: cur.indexOf(name) >= 0 ? cur.filter((a) => a !== name) : cur.concat([name]) })
  },
  wzAddAmenity: (name) => {
    const w = get().wz; if (!w) return
    const clean = (name || '').trim(); if (!clean) return
    const cur = w.amenities || []
    if (cur.some((a) => a.toLowerCase() === clean.toLowerCase())) return
    get().wzSet({ amenities: cur.concat([clean]) })
  },

  // Co-propietarios: lista de { name, email }.
  wzAddCoOwner: () => {
    const w = get().wz; if (!w) return
    get().wzSet({ coOwners: (w.coOwners || []).concat([{ name: '', email: '' }]) })
  },
  wzSetCoOwner: (index, key, value) => {
    const w = get().wz; if (!w) return
    get().wzSet({ coOwners: (w.coOwners || []).map((c, i) => (i === index ? { ...c, [key]: value } : c)) })
  },
  wzRemoveCoOwner: (index) => {
    const w = get().wz; if (!w) return
    get().wzSet({ coOwners: (w.coOwners || []).filter((_, i) => i !== index) })
  },

  // Datos de cobro.
  wzSetPayout: (key, value) => {
    const w = get().wz; if (!w) return
    get().wzSet({ payout: { ...(w.payout || emptyPayout()), [key]: value } })
  },
  wzAddPayoutDoc: async (key, files: FileList | null) => {
    const list = Array.from(files || []); if (!list.length) return
    const urls = await readImagesAsDataUrls(list)
    const w = get().wz; if (!w || !urls.length) return
    get().wzSet({ payout: { ...(w.payout || emptyPayout()), [key]: urls[0] } })
  },
  wzRemovePayoutDoc: (key) => {
    const w = get().wz; if (!w) return
    get().wzSet({ payout: { ...(w.payout || emptyPayout()), [key]: '' } })
  },

  // Carga en una sola página: valida TODO junto (mismas reglas que el asistente
  // por pasos) y publica. Ante el primer faltante, avisa y sube al inicio.
  wzSubmit: () => {
    const w = get().wz; if (!w) return
    const fail = (msg) => { get().flash(msg); scrollTop(); return false }
    if (!w.stadium) return fail('Elegí el estadio donde está tu palco')
    if (w.x == null) return fail('Tocá el plano para ubicar el palco')
    if (!w.seats || w.seats < 1) return fail('Indicá cuántos asientos tiene')
    if (!(w.amenities || []).length) return fail('Elegí al menos una comodidad')
    if ((w.images || []).length < MIN_PHOTOS) return fail('Subí al menos ' + MIN_PHOTOS + ' fotos del palco')
    const co = w.coOwners || []
    for (let i = 0; i < co.length; i++) {
      if (!(co[i].name || '').trim()) return fail('Completá el nombre del co-propietario ' + (i + 1))
      if (!isEmail(co[i].email)) return fail('Ingresá un email válido para el co-propietario ' + (i + 1))
    }
    const p = w.payout || {}
    if (!(p.country || '').trim()) return fail('Indicá el país de la cuenta bancaria')
    if (!(p.bank || '').trim()) return fail('Indicá el banco')
    if (!(p.beneficiary || '').trim()) return fail('Indicá el nombre del beneficiario bancario')
    if (!(p.accountNumber || '').trim()) return fail('Indicá el número de cuenta bancaria')
    if (!(p.branch || '').trim()) return fail('Indicá la sucursal del banco')
    if (!p.idFront) return fail('Subí el anverso del documento de identidad')
    if (!p.idBack) return fail('Subí el reverso del documento de identidad')
    if (!p.proofOfAddress) return fail('Subí el comprobante de domicilio')
    if (!p.propertyTitle) return fail('Subí el título de propiedad del palco')
    if (!(w.priceSeatE > 0)) return fail('Poné el precio del asiento por evento')
    get().publishPalco()
  },
  wzCancel: () => { set({ wz: null }); get().go('owner') },
  wzAddImages: async (files: FileList | null) => {
    const list = Array.from(files || []); if (!list.length) return
    const urls = await readImagesAsDataUrls(list)
    const w = get().wz; if (!w) return
    get().wzSet({ images: (w.images || []).concat(urls) })
  },
  wzRemoveImage: (index) => {
    const w = get().wz; if (!w) return
    get().wzSet({ images: (w.images || []).filter((_, i) => i !== index) })
  },
  publishPalco: () => {
    const w = get().wz
    const imgs = w.images || []
    const country = (get().stadiums[w.stadium] || {}).country || w.country || DEFAULT_COUNTRY
    const amenities = (w.amenities || []).slice()
    const coOwners = (w.coOwners || []).filter((c) => (c.name || '').trim() && (c.email || '').trim()).map((c) => ({ name: c.name.trim(), email: c.email.trim() }))
    const payout = { ...emptyPayout(), ...(w.payout || {}) }
    if (w.editId) {
      const prev = get().byId(w.editId); if (!prev) { set({ wz: null }); return get().go('owner') }
      // Cualquier modificación al palco lo devuelve a verificación: vuelve a
      // 'pendiente' y sale del catálogo público hasta que el admin lo apruebe.
      // Preserve identity, reputation and already-rented seats while applying the edits.
      const np = {
        ...prev,
        stadium: w.stadium, country, title: (w.title || '').trim() || 'Mi palco',
        sector: get().stadiums[w.stadium].name + ' · Nivel Palcos',
        map: { x: w.x == null ? 50 : w.x, y: w.y == null ? 14 : w.y },
        seats: w.seats || 1,
        parking: { has: w.parkHas, n: w.parkHas ? (w.parkN || 1) : 0, price: w.parkHas ? (w.parkPrice || 0) : 0 },
        amenities, coOwners, payout,
        photos: imgs.length, images: imgs,
        status: 'pendiente',
        modes: {
          seatEvent: { on: true, price: w.priceSeatE || 0, taken: prev.modes.seatEvent.taken || {} },
        },
      }
      get().savePalco(np)
      set({ wz: null })
      get().flash('Cambios enviados a revisión'); get().go('owner')
      return
    }
    const id = 'px' + Date.now()
    // Todo palco nuevo entra en proceso de verificación antes de publicarse.
    const np = { id, stadium: w.stadium, country, title: (w.title || '').trim() || 'Mi palco', sector: get().stadiums[w.stadium].name + ' · Nivel Palcos', map: { x: w.x == null ? 50 : w.x, y: w.y == null ? 14 : w.y }, seats: w.seats || 1, parking: { has: w.parkHas, n: w.parkHas ? (w.parkN || 1) : 0, price: w.parkHas ? (w.parkPrice || 0) : 0 }, amenities, coOwners, payout, host: 'Vos (demo)', rating: 5.0, photos: imgs.length, images: imgs, modes: { seatEvent: { on: true, price: w.priceSeatE || 0, taken: {} } }, status: 'pendiente' }
    get().publishPalcoEntity(np)
    set({ palcos: get().palcos.concat([np]), wz: null }); get().flash('Palco enviado a revisión'); get().go('owner')
  },

  // ── Palquista: respuesta a campos rechazados y reenvío a revisión ──
  // Guarda la aclaración del palquista sobre un campo marcado como incorrecto.
  setPalcoFieldReply: (palcoId, fieldKey, text) => {
    const p = get().byId(palcoId); if (!p || !p.review) return
    const fields = (p.review.fields || []).map((f) => (f.key === fieldKey ? { ...f, ownerReply: text } : f))
    get().savePalco({ ...p, review: { ...p.review, fields } })
  },
  // Reenvía un palco rechazado a revisión, conservando las respuestas para que
  // el admin tenga el contexto de lo que el palquista aclaró.
  resubmitPalco: (palcoId) => {
    const p = get().byId(palcoId); if (!p) return
    if (p.status !== 'rechazado') return
    get().savePalco({ ...p, status: 'pendiente' })
    get().flash('Palco reenviado a revisión')
  },
})
