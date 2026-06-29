import type { ReactNode } from 'react'

interface CheckboxProps {
  checked?: boolean
  label?: ReactNode
  disabled?: boolean
  onChange?: (checked: boolean) => void
}

export default function Checkbox({ checked = false, label, disabled = false, onChange }: CheckboxProps) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.55 : 1 }}>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        style={{
          width: '20px', height: '20px', borderRadius: '6px', flex: '0 0 auto', padding: 0,
          display: 'grid', placeItems: 'center', cursor: 'inherit',
          background: checked ? 'var(--primary,#C9A24B)' : 'var(--background,#0E1116)',
          border: '1.5px solid ' + (checked ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.16))'),
          transition: 'background .15s ease, border-color .15s ease',
        }}
      >
        {checked ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--primary-foreground,#1A1407)" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        ) : null}
      </button>
      {label ? <span style={{ fontFamily: 'Archivo', fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)' }}>{label}</span> : null}
    </label>
  )
}
