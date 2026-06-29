import { useState, useRef, useEffect } from 'react'
import type { KeyboardEvent } from 'react'

interface EditableProps {
  value: string
  onSave: (v: string) => void
  placeholder?: string
}

export default function Editable({ value, onSave, placeholder }: EditableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  function handleEdit() {
    setDraft(value)
    setEditing(true)
  }

  function handleSave() {
    onSave(draft.trim())
    setEditing(false)
  }

  function handleCancel() {
    setEditing(false)
    setDraft('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') handleCancel()
  }

  if (editing) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <input
          ref={inputRef}
          className="pq-lib-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            height: 46,
            minWidth: 200,
            width: '100%',
            borderRadius: 11,
            border: '1.5px solid var(--border,rgba(255,255,255,.12))',
            background: 'var(--background,#0E1116)',
            color: 'var(--foreground,#F4EFE6)',
            fontFamily: 'Archivo',
            fontSize: 15,
            fontWeight: 500,
            padding: '0 12px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />

        {/* Save button */}
        <button
          onClick={handleSave}
          aria-label="Guardar"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--success,#4A9E71)',
            border: 'none',
            color: 'var(--success-foreground,#F4EFE6)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="pq-ico" style={{ width: 16, height: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7"/>
            </svg>
          </span>
        </button>

        {/* Cancel button */}
        <button
          onClick={handleCancel}
          aria-label="Cancelar"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'var(--muted,#1F2530)',
            border: '1px solid var(--border,rgba(255,255,255,.12))',
            color: 'var(--subtle-foreground,#6B7480)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span className="pq-ico" style={{ width: 16, height: 16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div
      onClick={handleEdit}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'text',
      }}
    >
      <span style={{
        fontFamily: 'Archivo',
        fontSize: 15,
        color: value ? 'var(--foreground,#F4EFE6)' : 'var(--subtle-foreground,#6B7480)',
      }}>
        {value || placeholder}
      </span>

      <span
        className="pq-ico"
        style={{
          width: 14,
          height: 14,
          opacity: hovered ? 1 : 0,
          transition: 'opacity .15s',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--subtle-foreground,#6B7480)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </span>
    </div>
  )
}
