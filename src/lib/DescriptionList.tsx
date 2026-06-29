import type { ReactNode } from 'react'

interface Item {
  term: string
  value: ReactNode
}

interface DescriptionListProps {
  items?: Item[]
}

/** Key/value rows — receipts, summaries, detail panels. */
export default function DescriptionList({ items = [] }: DescriptionListProps) {
  return (
    <dl style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
      {items.map((it, i) => (
        <div
          key={i}
          style={{
            display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px',
            padding: '11px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--border,rgba(255,255,255,.08))',
          }}
        >
          <dt style={{ fontFamily: 'Archivo', fontWeight: 500, fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)' }}>{it.term}</dt>
          <dd style={{ margin: 0, fontFamily: 'Archivo', fontWeight: 700, fontSize: '14px', color: 'var(--foreground,#F4EFE6)', textAlign: 'right' }}>{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
