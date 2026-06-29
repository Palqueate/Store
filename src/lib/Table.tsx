import type { ReactNode } from 'react'

interface Column<T> {
  key: string
  header: ReactNode
  /** Cell renderer. Defaults to row[key]. */
  render?: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  width?: string
}

interface TableProps<T> {
  columns?: Column<T>[]
  rows?: T[]
  /** Row click handler — adds hover affordance when set. */
  onRowClick?: (row: T) => void
  empty?: ReactNode
}

/** Lightweight data table — themed, zebra-free, hairline rows. */
export default function Table<T extends Record<string, any>>({ columns = [], rows = [], onRowClick, empty }: TableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto', borderRadius: '14px', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Archivo' }}>
        <thead>
          <tr style={{ background: 'var(--muted,#1F2530)' }}>
            {columns.map((c) => (
              <th
                key={c.key}
                style={{
                  textAlign: c.align || 'left', padding: '12px 16px', width: c.width,
                  fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase',
                  color: 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap',
                }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: '28px 16px', textAlign: 'center', color: 'var(--muted-foreground,#9AA6B2)', fontSize: '14px' }}>{empty || 'Sin datos'}</td></tr>
          ) : (
            rows.map((row, ri) => (
              <tr
                key={ri}
                onClick={() => onRowClick?.(row)}
                style={{ borderTop: '1px solid var(--border,rgba(255,255,255,.08))', cursor: onRowClick ? 'pointer' : 'default', background: 'var(--card,#171B22)' }}
                onMouseEnter={(e) => onRowClick && (e.currentTarget.style.background = 'var(--muted,#1F2530)')}
                onMouseLeave={(e) => onRowClick && (e.currentTarget.style.background = 'var(--card,#171B22)')}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align || 'left', padding: '13px 16px', fontSize: '14px', color: 'var(--foreground,#F4EFE6)', whiteSpace: 'nowrap' }}>
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
