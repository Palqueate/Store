// @ts-nocheck
// Authentication, the logged-in user, accounts, and profile editing.
import { container } from '@/app/container'
import { saveAccount, setSession, clearSession } from '@/modules/accounts/application/use-cases/accountUseCases'
import { SEED_USER } from '@/shared/infrastructure/in-memory/db'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const createAuthSlice = (set, get) => ({
  user: null,
  accounts: [],
  authView: null,
  authForm: { name: '', email: '', phone: '', pass: '' },
  authErr: '',
  pendingPay: false,
  profileDraft: null,

  _saveSession: (id) => { if (id) setSession(container.session, id); else clearSession(container.session) },

  openAuth: (view) => { const f = { name: '', email: '', phone: '', pass: '' }; if (view === 'login') { f.email = SEED_USER.email; f.pass = SEED_USER.pass } set({ authView: view, authErr: '', authForm: f, acctMenu: false }) },
  closeAuth: () => set({ authView: null, authErr: '', pendingPay: false }),
  setAuthField: (k, v) => set({ authForm: { ...get().authForm, [k]: v }, authErr: '' }),
  switchAuth: (view) => { const f = { ...get().authForm }; if (view === 'login') { f.email = SEED_USER.email; f.pass = SEED_USER.pass } set({ authView: view, authErr: '', authForm: f }) },
  _afterAuth: (usr) => {
    const s = get(); const patch = { user: usr, authView: null, authErr: '', acctMenu: false, contact: { name: usr.name, email: usr.email }, pendingPay: false }
    set(patch); get().flash('¡Hola ' + usr.name.split(' ')[0] + '!')
    if (s.pendingPay && s.cart.length) get().pay(usr)
  },
  doRegister: () => {
    const f = get().authForm
    const name = (f.name || '').trim(), email = (f.email || '').trim().toLowerCase(), pass = (f.pass || '')
    if (name.length < 2) return set({ authErr: 'Ingresá tu nombre.' })
    if (!EMAIL_RE.test(email)) return set({ authErr: 'Ingresá un email válido.' })
    if (pass.length < 4) return set({ authErr: 'La contraseña debe tener al menos 4 caracteres.' })
    if (get().accounts.some((a) => a.email === email)) return set({ authErr: 'Ese email ya está registrado. Iniciá sesión.' })
    const usr = { id: 'u' + Date.now() + Math.floor(Math.random() * 999), name, email, phone: (f.phone || '').trim(), pass, joined: new Date().toISOString() }
    const accs = get().accounts.concat([usr]); saveAccount(container.accounts, usr); get()._saveSession(usr.id)
    set({ accounts: accs }); get()._afterAuth(usr)
  },
  doLogin: () => {
    // Demo: login always enters the María Eugenia account.
    const usr = get().accounts.find((a) => a.id === SEED_USER.id) || SEED_USER
    if (!get().accounts.some((a) => a.id === SEED_USER.id)) { const accs = get().accounts.concat([SEED_USER]); saveAccount(container.accounts, SEED_USER); set({ accounts: accs }) }
    get()._saveSession(usr.id); get()._afterAuth(usr)
  },
  logout: () => { get()._saveSession(null); set({ user: null, acctMenu: false }); get().flash('Sesión cerrada'); get().go('home') },
  myOrders: () => { const uid = get().user ? get().user.id : null; if (!uid) return []; return get().orders.filter((o) => o.userId === uid).slice().reverse() },

  setProfileField: (k, v) => set({ profileDraft: { ...(get().profileDraft || {}), [k]: v } }),
  saveProfile: (patch, silent) => {
    if (!get().user) return
    const accs = get().accounts.map((a) => a.id === patch.id ? { ...a, ...patch } : a)
    const usr = accs.find((a) => a.id === patch.id)
    saveAccount(container.accounts, usr); set({ accounts: accs, user: usr }); if (!silent) get().flash('Datos actualizados')
  },
  saveProfileDraft: () => {
    const d = get().profileDraft, u = get().user; if (!d || !u) return
    const name = (d.name || '').trim(), email = (d.email || '').trim().toLowerCase()
    if (name.length < 2) return get().flash('Ingresá tu nombre')
    if (!EMAIL_RE.test(email)) return get().flash('Email inválido')
    if (get().accounts.some((a) => a.email === email && a.id !== u.id)) return get().flash('Ese email ya está en uso')
    get().saveProfile({ id: u.id, name, email, phone: (d.phone || '').trim(), ci: (d.ci || '').trim(), birth: (d.birth || '').trim(), city: (d.city || '').trim(), address: (d.address || '').trim(), country: (d.country || '').trim() })
  },
  toggleNotif: (k) => { const u = get().user; if (!u) return; const n = { ...(u.notif || {}) }; n[k] = !n[k]; get().saveProfile({ id: u.id, notif: n }) },
  setFavStadium: (v) => { const u = get().user; if (!u) return; get().saveProfile({ id: u.id, favStadium: v }) },
  setLang: (v) => { const u = get().user; if (!u) return; get().saveProfile({ id: u.id, lang: v }) },
  removePhoto: () => { const u = get().user; if (!u) return; get().saveProfile({ id: u.id, photo: null }, true); get().flash('Foto eliminada') },
  onPhotoPick: (e) => {
    const file = e.target && e.target.files && e.target.files[0]; const u = get().user; if (!file || !u) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const max = 256, w = img.width || max, h = img.height || max, sc = Math.min(1, max / Math.max(w, h))
        const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w * sc)); c.height = Math.max(1, Math.round(h * sc))
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
        try { get().saveProfile({ id: u.id, photo: c.toDataURL('image/jpeg', 0.85) }, true); get().flash('Foto de perfil actualizada') } catch (err) { get().flash('No se pudo guardar la foto') }
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  },
})
