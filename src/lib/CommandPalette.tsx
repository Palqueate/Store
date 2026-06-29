import { useState, useEffect, useRef } from 'react'
import type { ReactNode, CSSProperties } from 'react'

interface PaletteCommand {
  key: string
  label: string
  icon?: ReactNode
  group?: string
  hint?: string
  onRun: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  commands?: PaletteCommand[]
  placeholder?: string
}

export default function CommandPalette({
  open,
  onClose,
  commands = [],
  placeholder = 'Buscar comando…',
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setQuery('')
      setHighlighted(0)
    }
  }, [open])

  // Autofocus input when open
  useEffect(() => {
    if (open) {
      inputRef.current?.focus()
    }
  }, [open])

  // Build filtered + grouped list
  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  )

  const grouped = new Map<string, PaletteCommand[]>()
  for (const cmd of filtered) {
    const g = cmd.group ?? ''
    if (!grouped.has(g)) grouped.set(g, [])
    grouped.get(g)!.push(cmd)
  }

  // Flat ordered list for keyboard navigation
  const flatFiltered = filtered

  // Keyboard handler
  useEffect(() => {
    if (!open) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlighted(prev => (prev + 1) % Math.max(flatFiltered.length, 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlighted(prev =>
          prev === 0 ? Math.max(flatFiltered.length - 1, 0) : prev - 1
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = flatFiltered[highlighted]
        if (cmd) {
          cmd.onRun()
          onClose()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, flatFiltered, highlighted, onClose])

  if (!open) return null

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'color-mix(in srgb, #000 62%, transparent)',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    display: 'grid',
    placeItems: 'start center',
    paddingTop: '15vh',
    animation: 'pq-lib-fade-in .15s ease both',
  }

  const panelStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '540px',
    background: 'var(--card,#171B22)',
    border: '1px solid var(--border,rgba(255,255,255,.12))',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 24px 50px -20px rgba(0,0,0,.7)',
    animation: 'pq-lib-pop-in .18s cubic-bezier(.2,.8,.2,1) both',
  }

  const searchRowStyle: CSSProperties = {
    padding: '14px 16px',
    borderBottom: '1px solid var(--border,rgba(255,255,255,.1))',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }

  const searchIconStyle: CSSProperties = {
    color: 'var(--subtle-foreground,#6B7480)',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  }

  const inputStyle: CSSProperties = {
    flex: 1,
    background: 'none',
    border: 'none',
    outline: 'none',
    fontFamily: 'Archivo',
    fontWeight: 500,
    fontSize: '16px',
    color: 'var(--foreground,#F4EFE6)',
    caretColor: 'var(--primary,#C9A24B)',
  }

  const listStyle: CSSProperties = {
    maxHeight: '320px',
    overflowY: 'auto',
    padding: '6px',
  }

  const groupHeaderStyle: CSSProperties = {
    fontFamily: "'Space Mono'",
    fontSize: '10px',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    color: 'var(--subtle-foreground,#6B7480)',
    padding: '10px 16px 4px',
  }

  const emptyStyle: CSSProperties = {
    padding: '32px 16px',
    textAlign: 'center',
    color: 'var(--subtle-foreground,#6B7480)',
    fontFamily: 'Archivo',
    fontSize: '14px',
  }

  const footerStyle: CSSProperties = {
    padding: '10px 16px',
    borderTop: '1px solid var(--border,rgba(255,255,255,.1))',
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
  }

  const kbdStyle: CSSProperties = {
    fontFamily: "'Space Mono'",
    fontSize: '10px',
    background: 'var(--muted,#1F2530)',
    color: 'var(--subtle-foreground,#6B7480)',
    padding: '3px 6px',
    borderRadius: '5px',
    border: '1px solid var(--border,rgba(255,255,255,.1))',
  }

  const kbdLabelStyle: CSSProperties = {
    fontFamily: 'Archivo',
    fontSize: '12px',
    color: 'var(--subtle-foreground,#6B7480)',
  }

  function getRowStyle(isHighlighted: boolean, isHovered: boolean): CSSProperties {
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      borderRadius: '10px',
      cursor: 'pointer',
      fontFamily: 'Archivo',
      fontWeight: 600,
      fontSize: '14px',
      color: isHighlighted ? 'var(--primary,#C9A24B)' : 'var(--foreground,#F4EFE6)',
      background: isHighlighted
        ? 'color-mix(in srgb, var(--primary,#C9A24B) 12%, transparent)'
        : isHovered
          ? 'var(--muted,#1F2530)'
          : 'transparent',
      transition: 'background .1s ease',
    }
  }

  function getIconStyle(isHighlighted: boolean): CSSProperties {
    return {
      width: '18px',
      height: '18px',
      flex: '0 0 auto',
      color: isHighlighted ? 'var(--primary,#C9A24B)' : 'var(--muted-foreground,#9AA6B2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  const hintStyle: CSSProperties = {
    marginLeft: 'auto',
    fontFamily: "'Space Mono'",
    fontSize: '10px',
    color: 'var(--subtle-foreground,#6B7480)',
    background: 'var(--muted,#1F2530)',
    padding: '3px 7px',
    borderRadius: '6px',
  }

  // Compute flat index for a command
  function getFlatIndex(cmd: PaletteCommand): number {
    return flatFiltered.findIndex(c => c.key === cmd.key)
  }

  return (
    <div
      style={backdropStyle}
      onClick={onClose}
    >
      <div
        style={panelStyle}
        className="pq-lib-pop"
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div style={searchRowStyle}>
          <span style={searchIconStyle}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            style={inputStyle}
            className="pq-lib-input"
            value={query}
            placeholder={placeholder}
            onChange={e => {
              setQuery(e.target.value)
              setHighlighted(0)
            }}
          />
        </div>

        <div style={listStyle}>
          {flatFiltered.length === 0 ? (
            <div style={emptyStyle}>Sin resultados</div>
          ) : (
            Array.from(grouped.entries()).map(([groupName, groupCmds]) => (
              <div key={groupName}>
                {groupName !== '' && (
                  <div style={groupHeaderStyle}>{groupName}</div>
                )}
                {groupCmds.map(cmd => {
                  const flatIdx = getFlatIndex(cmd)
                  const isHighlighted = flatIdx === highlighted
                  const isHovered = hoveredKey === cmd.key && !isHighlighted
                  return (
                    <div
                      key={cmd.key}
                      style={getRowStyle(isHighlighted, isHovered)}
                      onMouseEnter={() => {
                        setHoveredKey(cmd.key)
                        setHighlighted(flatIdx)
                      }}
                      onMouseLeave={() => setHoveredKey(null)}
                      onClick={() => {
                        cmd.onRun()
                        onClose()
                      }}
                      role="option"
                      aria-selected={isHighlighted}
                    >
                      {cmd.icon && (
                        <span className="pq-ico" style={getIconStyle(isHighlighted)}>
                          {cmd.icon}
                        </span>
                      )}
                      {cmd.label}
                      {cmd.hint && <span style={hintStyle}>{cmd.hint}</span>}
                    </div>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div style={footerStyle}>
          <kbd style={kbdStyle}>↑↓</kbd>
          <span style={kbdLabelStyle}>navegar</span>
          <kbd style={kbdStyle}>↵</kbd>
          <span style={kbdLabelStyle}>ejecutar</span>
          <kbd style={kbdStyle}>esc</kbd>
          <span style={kbdLabelStyle}>cerrar</span>
        </div>
      </div>
    </div>
  )
}
