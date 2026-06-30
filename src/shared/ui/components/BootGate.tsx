import type { ReactNode } from 'react'
import { useAppStore } from '@/app/store'

/**
 * Bloquea el contenido hasta que la carga inicial (bootstrap) termine:
 *  · 'loading' → indicador de carga.
 *  · 'error'   → mensaje + botón para reintentar (re-dispara bootstrap()).
 *  · 'ready'   → renderiza los children.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const status = useAppStore((s) => s.bootStatus)
  const bootstrap = useAppStore((s) => s.bootstrap)

  if (status === 'ready') return <>{children}</>

  const wrap = {
    minHeight: 'calc(100vh - 67px)', display: 'flex', flexDirection: 'column' as const,
    alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24, textAlign: 'center' as const,
  }

  if (status === 'error') {
    return (
      <div role="alert" style={wrap}>
        <div style={{ fontSize: 38 }}>📡</div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>No pudimos cargar los datos</h2>
        <p style={{ margin: 0, maxWidth: 380, color: 'var(--muted-foreground)', fontSize: 14 }}>
          Revisá tu conexión e intentá de nuevo.
        </p>
        <button
          onClick={() => { void bootstrap() }}
          style={{
            height: 40, padding: '0 18px', borderRadius: 9, cursor: 'pointer', border: 'none',
            fontFamily: 'inherit', fontWeight: 800, fontSize: 14, marginTop: 4,
            background: 'var(--primary)', color: 'var(--primary-foreground)',
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div style={wrap} aria-busy="true" aria-live="polite">
      <div
        style={{
          width: 34, height: 34, borderRadius: '50%',
          border: '3px solid var(--border)', borderTopColor: 'var(--primary)',
          animation: 'palqueate-spin 0.8s linear infinite',
        }}
      />
      <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: 14 }}>Cargando…</p>
      <style>{'@keyframes palqueate-spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  )
}

export default BootGate
