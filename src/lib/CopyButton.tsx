import { useState, useRef, useEffect } from 'react'

interface CopyButtonProps {
  text: string
  label?: string
}

export default function CopyButton({ text, label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? '¡Copiado!' : (label ?? 'Copiar')}
      style={{
        height: 36,
        borderRadius: 10,
        padding: '0 14px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        border: `1.5px solid ${copied ? 'color-mix(in srgb, var(--success,#4A9E71) 35%, transparent)' : 'var(--border,rgba(255,255,255,.12))'}`,
        background: copied
          ? 'color-mix(in srgb, var(--success,#4A9E71) 12%, transparent)'
          : 'var(--card,#171B22)',
        color: copied ? 'var(--success,#4A9E71)' : 'var(--muted-foreground,#9AA6B2)',
        fontFamily: 'Archivo',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'background .2s, color .2s, border-color .2s',
      }}
    >
      <span className="pq-ico" style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2h-2"/>
            <path d="M8 4a2 2 0 012-2h0a2 2 0 012 2v0a2 2 0 01-2 2h0a2 2 0 01-2-2v0z"/>
          </svg>
        )}
      </span>
      {copied ? '¡Copiado!' : (label ?? 'Copiar')}
    </button>
  )
}
