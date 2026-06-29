import { css } from '@/shared/ui/css'
import { Btn, Badge } from '@/lib'
import { useHeaderVM } from '@/shared/ui/vm/useHeaderVM'

export default function Header() {
  const vals = useHeaderVM()
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 60, display: 'flex', alignItems: 'center', gap: '18px', padding: '14px clamp(16px,4vw,40px)', background: 'color-mix(in srgb, var(--background,#0E1116) 78%, transparent)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border,rgba(255,255,255,.09))' }}>
      <button onClick={vals.goHome} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
        <span style={{ position: 'relative', display: 'grid', placeItems: 'center', width: '34px', height: '34px', borderRadius: '9px', background: 'var(--primary,#C9A24B)' }}>
          <span style={{ width: '13px', height: '13px', borderRadius: '50%', border: '3px solid var(--primary-foreground,#1A1407)' }} />
        </span>
        <span style={{ fontFamily: "'Archivo'", fontWeight: 900, fontSize: '20px', letterSpacing: '-.04em', color: 'var(--foreground,#F4EFE6)', fontStretch: '125%' }}>PALQUEATE</span>
      </button>

      <nav style={css(vals.navStyle)}>
        <button onClick={vals.goHome} style={css(vals.navLinkHome)}>Explorar</button>
        <button onClick={vals.goEvents} style={css(vals.navLinkResults)}>Eventos</button>
        <button onClick={vals.goOwner} style={css(vals.navLinkOwner)}>Soy dueño</button>
      </nav>

      <div style={{ flex: 1 }} />

      <button onClick={vals.cycleTheme} title="Cambiar estilo visual" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', padding: '0 13px', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--muted-foreground,#9AA6B2)', cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: '11px', letterSpacing: '.04em' }}>
        <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: 'var(--primary,#C9A24B)', boxShadow: 'inset 0 0 0 2px var(--card,#171B22), 0 0 0 1px var(--primary,#C9A24B)' }} />
        <span style={css(vals.themeLabelStyle)}>{vals.themeName}</span>
      </button>

      <button onClick={vals.goCart} style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', cursor: 'pointer' }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
        {vals.cartCount ? (
          <span style={{ position: 'absolute', top: '-7px', right: '-7px', pointerEvents: 'none' }}>
            <Badge tone="success" solid>{vals.cartCount}</Badge>
          </span>
        ) : null}
      </button>

      {/* AUTH controls */}
      {vals.headerAuthButtons ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Btn label="Ingresar" variant="secondary" size="sm" onClick={vals.openLogin} />
          <Btn label="Crear cuenta" variant="primary" size="sm" onClick={vals.openRegister} />
        </div>
      ) : null}
      {vals.headerAuthIcon ? (
        <button onClick={vals.openLogin} title="Ingresar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '38px', height: '38px', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', color: 'var(--foreground,#F4EFE6)', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        </button>
      ) : null}
      {vals.loggedIn ? (
        <div style={{ position: 'relative' }}>
          <button onClick={vals.toggleAcctMenu} title="Mi cuenta" style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '38px', padding: '0 6px 0 6px', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.12))', background: 'var(--card,#171B22)', cursor: 'pointer' }}>
            <span style={{ position: 'relative', overflow: 'hidden', width: '28px', height: '28px', borderRadius: '8px', background: 'var(--primary,#C9A24B)', color: 'var(--primary-foreground,#1A1407)', display: 'grid', placeItems: 'center', fontFamily: "'Archivo'", fontWeight: 800, fontSize: '12px' }}>
              {vals.acctHasPhoto ? <div style={css(vals.acctPhotoBg)} /> : null}
              {vals.acctNoPhoto ? vals.userInitials : null}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {vals.acctMenuOpen ? (
            <div style={{ position: 'absolute', top: '46px', right: 0, zIndex: 80, width: '224px', background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))', borderRadius: '14px', boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)', overflow: 'hidden' }}>
              <div style={{ padding: '14px', borderBottom: '1px solid var(--border,rgba(255,255,255,.09))' }}>
                <div style={{ fontFamily: "'Archivo'", fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vals.userName}</div>
                <div style={{ fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{vals.userEmail}</div>
              </div>
              <button onClick={vals.gotoCuenta} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px', textAlign: 'left' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>Mi cuenta</button>
              <button onClick={vals.gotoCompras} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground,#F4EFE6)', fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px', textAlign: 'left' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>Mis compras</button>
              {vals.loggedInAdmin ? (
                <button onClick={vals.gotoAdmin} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'none', border: 'none', borderTop: '1px solid var(--border,rgba(255,255,255,.09))', cursor: 'pointer', color: 'var(--primary,#C9A24B)', fontFamily: "'Archivo'", fontWeight: 700, fontSize: '14px', textAlign: 'left' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l8 4v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z" /></svg>Administración</button>
              ) : null}
              <button onClick={vals.doLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', background: 'none', border: 'none', borderTop: '1px solid var(--border,rgba(255,255,255,.09))', cursor: 'pointer', color: 'var(--destructive,#E5604D)', fontFamily: "'Archivo'", fontWeight: 600, fontSize: '14px', textAlign: 'left' }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5M21 12H9" /></svg>Cerrar sesión</button>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  )
}
