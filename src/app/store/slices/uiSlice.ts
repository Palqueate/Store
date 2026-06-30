// UI / chrome state: theme, viewport, toast, account menu.
import { THEME_ORDER } from '@/shared/domain/theme'
import { formatMoney } from '@/shared/domain/money'

let flashTimer

export const createUiSlice = (set, get) => ({
  theme: 'palco',
  vw: typeof window !== 'undefined' ? window.innerWidth : 1280,
  toast: null,
  acctMenu: false,

  // Generic shallow-merge setter, mirroring the old store.setState. Used by the
  // transitional view-model for inline filter/tab updates.
  setState: (patch) => set(patch),

  money: (n) => formatMoney(n),
  cycleTheme: () => { const i = THEME_ORDER.indexOf(get().theme); set({ theme: THEME_ORDER[(i + 1) % THEME_ORDER.length] }) },
  flash: (msg) => {
    set({ toast: msg })
    if (flashTimer) clearTimeout(flashTimer)
    flashTimer = setTimeout(() => set({ toast: null }), 2200)
  },
  toggleAcctMenu: () => set({ acctMenu: !get().acctMenu }),
})
