import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}
interface State {
  error: Error | null
}

/**
 * Captura errores de render de todo el árbol y muestra una pantalla de
 * recuperación en vez de un árbol en blanco. Solo atrapa errores de render de
 * React; los rechazos de promesas (fetch) se manejan en las repos / VMs.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[palqueate] error de render no capturado', error, info)
  }

  private reset = () => {
    this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div
        role="alert"
        style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24,
          textAlign: 'center', fontFamily: "'Archivo', system-ui, sans-serif",
          background: 'var(--background, #0b0b0c)', color: 'var(--foreground, #f5f5f5)',
        }}
      >
        <div style={{ fontSize: 42 }}>⚠️</div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Algo salió mal</h1>
        <p style={{ margin: 0, maxWidth: 420, color: 'var(--muted-foreground, #9a9a9a)', fontSize: 14 }}>
          Ocurrió un error inesperado en la aplicación. Podés reintentar; si el problema
          persiste, recargá la página.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            onClick={this.reset}
            style={{
              height: 40, padding: '0 18px', borderRadius: 9, cursor: 'pointer', border: 'none',
              fontFamily: 'inherit', fontWeight: 800, fontSize: 14,
              background: 'var(--primary, #e5604d)', color: 'var(--primary-foreground, #fff)',
            }}
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            style={{
              height: 40, padding: '0 18px', borderRadius: 9, cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 700, fontSize: 14,
              background: 'transparent', color: 'var(--foreground, #f5f5f5)',
              border: '1px solid var(--border, #333)',
            }}
          >
            Recargar
          </button>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
