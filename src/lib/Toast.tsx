import { createContext, useCallback, useContext, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ToastTone = 'info' | 'success' | 'danger' | 'warn'

interface ToastOptions {
  title: string
  description?: string
  tone?: ToastTone
  /** Auto-dismiss after ms. 0 keeps it until closed. */
  duration?: number
}

interface ToastItem extends ToastOptions {
  id: number
}

interface ToastApi {
  toast: (opts: ToastOptions) => void
  dismiss: (id: number) => void
}

const TONES: Record<ToastTone, string> = {
  info: 'var(--primary,#C9A24B)',
  success: 'var(--success,#34D17E)',
  danger: 'var(--destructive,#E5604D)',
  warn: 'var(--warning,#E5A94D)',
}

const ToastCtx = createContext<ToastApi | null>(null)

/** useToast() — call toast({title, tone, ...}) from anywhere under the provider. */
export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])
  const seq = useRef(0)

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((opts: ToastOptions) => {
    const id = ++seq.current
    setItems((prev) => [...prev, { id, ...opts }])
    const dur = opts.duration ?? 4000
    if (dur > 0) setTimeout(() => dismiss(id), dur)
  }, [dismiss])

  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <div style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: 1100, display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', width: 'calc(100vw - 40px)' }}>
        {items.map((t) => {
          const color = TONES[t.tone || 'info']
          return (
            <div
              key={t.id}
              role="status"
              className="pq-lib-pop"
              style={{
                display: 'flex', gap: '12px', alignItems: 'flex-start',
                padding: '14px 16px', borderRadius: '14px',
                background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.12))',
                borderLeft: `3px solid ${color}`, boxShadow: '0 20px 50px -15px rgba(0,0,0,.6)',
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flex: '0 0 auto', marginTop: '6px' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'Archivo', fontWeight: 800, fontSize: '14px', color: 'var(--foreground,#F4EFE6)' }}>{t.title}</div>
                {t.description ? <div style={{ marginTop: '2px', fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)', lineHeight: 1.4 }}>{t.description}</div> : null}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)', padding: '2px', lineHeight: 0, flex: '0 0 auto' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}
