import { useState } from 'react'
import type { ReactNode } from 'react'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

type FieldType =
  | 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  | 'date' | 'time' | 'datetime-local' | 'month' | 'week'

interface FieldProps {
  label?: string
  value?: string
  placeholder?: string
  type?: FieldType
  hint?: string
  /** Error message — turns the border red and replaces the hint. */
  error?: string
  /** Any node (e.g. a Heroicon) rendered inside, before the text. */
  leadingIcon?: ReactNode
  /** Any node rendered inside, after the text. Ignored for password (toggle wins). */
  trailingIcon?: ReactNode
  disabled?: boolean
  /** Receives the native change event (so `e.target.value` works). */
  onInput?: (e: any) => void
}

const ICON_PAD = 42

export default function Field({
  label = '', value = '', placeholder = '', type = 'text', hint = '', error = '',
  leadingIcon, trailingIcon, disabled = false, onInput,
}: FieldProps) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = type === 'password'
  const effectiveType = isPassword && showPw ? 'text' : type
  const hasTrailing = isPassword || trailingIcon != null

  return (
    <div style={{ width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>{label}</label>
      ) : null}

      <div style={{ position: 'relative', width: '100%' }}>
        {leadingIcon != null ? (
          <span className="pq-ico" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--subtle-foreground,#6B7480)', pointerEvents: 'none' }}>
            {leadingIcon}
          </span>
        ) : null}

        <input
          className="pq-input"
          type={effectiveType}
          value={value ?? ''}
          onChange={onInput}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: '100%', height: '46px',
            paddingLeft: (leadingIcon != null ? ICON_PAD : 14) + 'px',
            paddingRight: (hasTrailing ? ICON_PAD : 14) + 'px',
            borderRadius: '11px', background: 'var(--background,#0E1116)',
            border: '1.5px solid ' + (error ? 'var(--destructive,#E5604D)' : 'var(--border,rgba(255,255,255,.12))'),
            color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 500, fontSize: '15px',
            outline: 'none', opacity: disabled ? 0.6 : 1,
          }}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: '24px', height: '24px', padding: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--subtle-foreground,#6B7480)' }}
          >
            <span className="pq-ico" style={{ width: '18px', height: '18px' }}>
              {showPw ? <EyeSlashIcon /> : <EyeIcon />}
            </span>
          </button>
        ) : trailingIcon != null ? (
          <span className="pq-ico" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: 'var(--subtle-foreground,#6B7480)', pointerEvents: 'none' }}>
            {trailingIcon}
          </span>
        ) : null}
      </div>

      {error ? (
        <div style={{ fontSize: '11.5px', color: 'var(--destructive,#E5604D)', marginTop: '6px' }}>{error}</div>
      ) : hint ? (
        <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)', marginTop: '6px' }}>{hint}</div>
      ) : null}
    </div>
  )
}
