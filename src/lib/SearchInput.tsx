interface SearchInputProps {
  value?: string
  placeholder?: string
  onInput?: (value: string) => void
  onClear?: () => void
}

/** Input with leading search glyph and a clear affordance. */
export default function SearchInput({ value = '', placeholder = 'Buscar…', onInput, onClear }: SearchInputProps) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--subtle-foreground,#6B7480)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
        <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        className="pq-lib-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onInput?.(e.target.value)}
        style={{
          width: '100%', height: '46px', padding: '0 40px', borderRadius: '11px',
          background: 'var(--background,#0E1116)', border: '1.5px solid var(--border,rgba(255,255,255,.12))',
          color: 'var(--foreground,#F4EFE6)', fontFamily: 'Archivo', fontWeight: 500, fontSize: '15px', outline: 'none',
        }}
      />
      {value ? (
        <button
          onClick={() => { onClear?.(); onInput?.('') }}
          aria-label="Limpiar"
          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', display: 'grid', placeItems: 'center', width: '22px', height: '22px', borderRadius: '6px', background: 'var(--muted,#1F2530)', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground,#9AA6B2)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      ) : null}
    </div>
  )
}
