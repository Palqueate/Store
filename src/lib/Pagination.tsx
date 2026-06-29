interface PaginationProps {
  page?: number
  total?: number
  onChange?: (page: number) => void
}

/** Builds a compact page list with ellipses: 1 … 4 5 [6] 7 8 … 20 */
function pageList(page: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const out: (number | '…')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)
  if (start > 2) out.push('…')
  for (let i = start; i <= end; i++) out.push(i)
  if (end < total - 1) out.push('…')
  out.push(total)
  return out
}

function Arrow({ dir, disabled, onClick }: { dir: 'prev' | 'next'; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Anterior' : 'Siguiente'}
      style={{
        width: '36px', height: '36px', borderRadius: '9px', display: 'grid', placeItems: 'center',
        background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))',
        color: 'var(--muted-foreground,#9AA6B2)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d={dir === 'prev' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

export default function Pagination({ page = 1, total = 1, onChange }: PaginationProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <Arrow dir="prev" disabled={page <= 1} onClick={() => onChange?.(page - 1)} />
      {pageList(page, total).map((p, i) =>
        p === '…' ? (
          <span key={'e' + i} style={{ width: '20px', textAlign: 'center', color: 'var(--subtle-foreground,#6B7480)' }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange?.(p)}
            aria-current={p === page}
            style={{
              minWidth: '36px', height: '36px', padding: '0 8px', borderRadius: '9px',
              background: p === page ? 'var(--primary,#C9A24B)' : 'var(--card,#171B22)',
              border: '1px solid ' + (p === page ? 'var(--primary,#C9A24B)' : 'var(--border,rgba(255,255,255,.1))'),
              color: p === page ? 'var(--primary-foreground,#1A1407)' : 'var(--muted-foreground,#9AA6B2)',
              fontFamily: 'Archivo', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ),
      )}
      <Arrow dir="next" disabled={page >= total} onClick={() => onChange?.(page + 1)} />
    </div>
  )
}
