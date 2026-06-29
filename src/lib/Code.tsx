import { useState } from 'react'

interface CodeProps {
  code: string
  language?: string
  copyable?: boolean
}

/** Bloque de código con tipografía mono, chip de lenguaje y botón de copia con feedback visual. */
export default function Code({ code, language, copyable = true }: CodeProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div style={{ position: 'relative', borderRadius: '10px', border: '1px solid var(--border,rgba(255,255,255,.1))', background: 'var(--background,#0E1116)', overflow: 'hidden' }}>
      {/* Top bar with language chip and copy button */}
      {(language || copyable) && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 12px',
          borderBottom: '1px solid var(--border,rgba(255,255,255,.08))',
          background: 'var(--card,#171B22)',
          minHeight: '34px',
        }}>
          {language ? (
            <span style={{
              fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em',
              textTransform: 'lowercase', color: 'var(--subtle-foreground,#6B7480)',
            }}>
              {language}
            </span>
          ) : <span />}
          {copyable && (
            <button
              onClick={handleCopy}
              aria-label={copied ? 'Copiado' : 'Copiar código'}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 9px', borderRadius: '6px', border: '1px solid var(--border,rgba(255,255,255,.1))',
                background: copied ? 'color-mix(in srgb, var(--success,#34D17E) 12%, transparent)' : 'transparent',
                color: copied ? 'var(--success,#34D17E)' : 'var(--muted-foreground,#9AA6B2)',
                cursor: 'pointer', fontFamily: "'Space Mono'", fontSize: '10px',
                transition: 'background .15s ease, color .15s ease, border-color .15s ease',
                borderColor: copied ? 'color-mix(in srgb, var(--success,#34D17E) 40%, transparent)' : undefined,
              }}
            >
              {copied ? (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  copiado
                </>
              ) : (
                <>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                  copiar
                </>
              )}
            </button>
          )}
        </div>
      )}
      <pre style={{
        margin: 0, padding: '14px 16px',
        overflowX: 'auto', overflowY: 'auto',
        fontFamily: "'Space Mono'", fontSize: '12.5px', lineHeight: 1.65,
        color: 'var(--muted-foreground,#9AA6B2)', whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
