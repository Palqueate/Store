interface TextareaProps {
  label?: string
  value?: string
  placeholder?: string
  hint?: string
  rows?: number
  disabled?: boolean
  onInput?: (value: string) => void
}

export default function Textarea({ label = '', value = '', placeholder = '', hint = '', rows = 4, disabled = false, onInput }: TextareaProps) {
  return (
    <div style={{ width: '100%' }}>
      {label ? (
        <label style={{ display: 'block', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.08em', color: 'var(--subtle-foreground,#6B7480)', marginBottom: '6px' }}>{label}</label>
      ) : null}
      <textarea
        className="pq-lib-input"
        value={value}
        rows={rows}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onInput?.(e.target.value)}
        style={{
          width: '100%', padding: '12px 14px', borderRadius: '11px', resize: 'vertical',
          background: 'var(--background,#0E1116)', border: '1.5px solid var(--border,rgba(255,255,255,.12))',
          color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 500, fontSize: '15px',
          lineHeight: 1.5, outline: 'none', opacity: disabled ? 0.6 : 1,
        }}
      />
      {hint ? <div style={{ fontSize: '11.5px', color: 'var(--subtle-foreground,#6B7480)', marginTop: '6px' }}>{hint}</div> : null}
    </div>
  )
}
