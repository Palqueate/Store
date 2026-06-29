// @ts-nocheck
// Owner publish wizard state + flow.
import { readImagesAsDataUrls } from '@/shared/lib/readImages'

const scrollTop = () => { if (typeof window !== 'undefined') { try { window.scrollTo(0, 0) } catch (e) {} } }

// Wizard step indices: 0 Estadio · 1 Ubicación · 2 Asientos · 3 Fotos ·
// 4 Estacionamiento · 5 Precios. Fotos (3) is optional; Precios (5) is final.
export const createOwnerSlice = (set, get) => ({
  wz: null,

  startWizard: () => { set({ wz: { step: 0, stadium: 'gpc', x: null, y: null, title: '', seats: 10, images: [], parkHas: true, parkN: 2, mPalco: true, pricePalco: 1200000, mSeatY: true, priceSeatY: 95000, mSeatE: true, priceSeatE: 6500 } }); get().go('publish') },
  wzSet: (patch) => set({ wz: { ...get().wz, ...patch } }),
  wzNext: () => {
    const w = get().wz; if (!w) return
    if (w.step === 1 && w.x == null) return get().flash('Tocá el plano para ubicar el palco')
    if (w.step === 2 && (!w.seats || w.seats < 1)) return get().flash('Indicá cuántos asientos tiene')
    if (w.step === 5) { if (!(w.mPalco || w.mSeatY || w.mSeatE)) return get().flash('Activá al menos una modalidad'); return get().publishPalco() }
    get().wzSet({ step: w.step + 1 }); scrollTop()
  },
  wzBack: () => { const w = get().wz; if (!w) return; if (w.step === 0) return get().go('owner'); get().wzSet({ step: w.step - 1 }); scrollTop() },
  wzAddImages: async (files) => {
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
    const w = get().wz; const id = 'px' + Date.now()
    const imgs = w.images || []
    const np = { id, stadium: w.stadium, title: (w.title || '').trim() || 'Mi palco', sector: get().stadiums[w.stadium].name + ' · Nivel Palcos', map: { x: w.x == null ? 50 : w.x, y: w.y == null ? 14 : w.y }, seats: w.seats || 1, parking: { has: w.parkHas, n: w.parkHas ? (w.parkN || 1) : 0 }, host: 'Vos (demo)', rating: 5.0, photos: imgs.length, images: imgs, modes: { palcoYear: { on: w.mPalco, price: w.pricePalco || 0 }, seatYear: { on: w.mSeatY, price: w.priceSeatY || 0, taken: [] }, seatEvent: { on: w.mSeatE, price: w.priceSeatE || 0, taken: {} } }, status: 'publicado' }
    get().publishPalcoEntity(np)
    set({ palcos: get().palcos.concat([np]), wz: null }); get().flash('¡Palco publicado!'); get().go('owner')
  },
})
