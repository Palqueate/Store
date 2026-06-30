import { useFacade } from '@/shared/ui/vm/facade'
import { navLink } from '@/shared/ui/vm/helpers'
import { THEMES } from '@/shared/domain/theme'
import type { User } from '@/modules/accounts/domain/User'

export function useHeaderVM(): any {
  const self = useFacade()
  const s = self.state

  const mobile = s.vw < 860
  const th = THEMES[s.theme] || THEMES.palco
  const uu = s.user || ({} as User)

  return {
    // navigation
    goHome: function () { self.go('home') },
    goEvents: function () { self.goEvents() },
    goOwner: function () { self.go('owner') },
    goCart: function () { self.go('cart') },

    navStyle: (mobile ? 'display:none;' : 'display:flex;') + ' align-items:center; gap:22px;',
    navLinkHome: navLink(s.screen === 'home'),
    navLinkResults: navLink(s.screen === 'events' || s.screen === 'eventPalcos' || s.screen === 'detail' || s.screen === 'results'),
    navLinkOwner: navLink(s.screen === 'owner' || s.screen === 'publish' || s.screen === 'metrics'),

    // theme toggle
    cycleTheme: function () { self.cycleTheme() },
    themeName: th.name,
    themeLabelStyle: mobile ? 'display:none;' : '',

    // cart badge
    cartCount: self.cartCount() || null,

    // auth state
    headerAuthButtons: !s.user && !mobile,
    headerAuthIcon: !s.user && mobile,
    loggedIn: !!s.user,
    loggedInAdmin: !!(s.user && s.user.admin),

    // auth actions
    openLogin: function () { self.openAuth('login') },
    openRegister: function () { self.openAuth('register') },

    // account menu
    acctMenuOpen: s.acctMenu,
    toggleAcctMenu: function () { self.toggleAcctMenu() },

    // user identity
    userName: s.user ? s.user.name : '',
    userEmail: s.user ? s.user.email : '',
    userInitials: s.user
      ? s.user.name.trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0) }).join('').toUpperCase()
      : '',
    acctHasPhoto: !!uu.photo,
    acctNoPhoto: !uu.photo,
    acctPhotoBg: uu.photo
      ? { position: 'absolute', inset: '0', backgroundImage: 'url(' + uu.photo + ')', backgroundSize: 'cover', backgroundPosition: 'center' }
      : null,

    // account navigation
    gotoCuenta: function () { self.goAccount('perfil') },
    gotoCompras: function () { self.goAccount('compras') },
    gotoAdmin: function () { self.openAdmin('dashboard') },
    doLogout: function () { self.logout() },
  }
}
