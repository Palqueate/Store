interface StatData {
  label?: string
  value?: string | number
  sub?: string
  icon?: string
  accent?: boolean
}

export default function StatTile({ data }: { data: StatData }) {
  const d = data || {}
  const isStar = d.icon === 'star'
  return (
    <div style={{ padding: '16px 18px', borderRadius: '14px', background: 'var(--card,#171B22)', border: '1px solid ' + (d.accent ? 'color-mix(in srgb,var(--primary,#C9A24B) 42%, var(--border,rgba(255,255,255,.08)))' : 'var(--border,rgba(255,255,255,.08))') }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '9px' }}>
        {isStar ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="var(--primary,#C9A24B)" stroke="none" style={{ flex: '0 0 auto' }}><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z" /></svg>
        ) : null}
        <span style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.06em', color: 'var(--subtle-foreground,#6B7480)' }}>{d.label || ''}</span>
      </div>
      <div style={{ fontFamily: 'Archivo', fontWeight: 900, fontSize: 'clamp(20px,2.5vw,26px)', letterSpacing: '-.02em', color: 'var(--foreground,#F4EFE6)', lineHeight: 1, whiteSpace: 'nowrap' }}>{d.value != null ? d.value : ''}</div>
      {d.sub ? <div style={{ fontSize: '12px', color: 'var(--muted-foreground,#9AA6B2)', marginTop: '7px' }}>{d.sub}</div> : null}
    </div>
  )
}
