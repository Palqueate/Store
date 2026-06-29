import type { ReactNode } from 'react'
import type { DocEntry, PropRow } from './types'

// ------------------------------------------------------------------
// Doc-page building blocks: props/events tables, code blocks, example
// cards, and the page renderer. All theme-reactive via the short vars.
// ------------------------------------------------------------------

function Eyebrow({ children }: { children: ReactNode }) {
  return <div style={{ fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--primary,#C9A24B)' }}>{children}</div>
}

function H2({ children }: { children: ReactNode }) {
  return <h2 style={{ margin: '0 0 14px', fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.02em', fontSize: '20px', color: 'var(--foreground,#F4EFE6)' }}>{children}</h2>
}

export function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ margin: '12px 0 0', padding: '12px 14px', borderRadius: '10px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.1))', overflowX: 'auto' }}>
      <code style={{ fontFamily: "'Space Mono'", fontSize: '12px', lineHeight: 1.6, color: 'var(--muted-foreground,#9AA6B2)', whiteSpace: 'pre' }}>{children}</code>
    </pre>
  )
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--border,rgba(255,255,255,.1))' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Archivo', minWidth: '520px' }}>
        <thead>
          <tr style={{ background: 'var(--muted,#1F2530)' }}>
            {['Prop', 'Tipo', 'Default', 'Descripción'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 14px', fontFamily: "'Space Mono'", fontWeight: 700, fontSize: '10px', letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--subtle-foreground,#6B7480)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} style={{ borderTop: '1px solid var(--border,rgba(255,255,255,.08))', background: 'var(--card,#171B22)' }}>
              <td style={{ padding: '11px 14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: '12.5px', fontWeight: 700, color: 'var(--foreground,#F4EFE6)' }}>{r.name}</span>
                {r.required ? <span style={{ marginLeft: '6px', fontSize: '9px', fontFamily: "'Space Mono'", color: 'var(--destructive,#E5604D)' }}>REQ</span> : null}
              </td>
              <td style={{ padding: '11px 14px', verticalAlign: 'top' }}>
                <code style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--primary,#C9A24B)', whiteSpace: 'pre-wrap' }}>{r.type}</code>
              </td>
              <td style={{ padding: '11px 14px', verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                <code style={{ fontFamily: "'Space Mono'", fontSize: '12px', color: 'var(--subtle-foreground,#6B7480)' }}>{r.default ?? '—'}</code>
              </td>
              <td style={{ padding: '11px 14px', verticalAlign: 'top', fontSize: '13.5px', color: 'var(--muted-foreground,#9AA6B2)', lineHeight: 1.45 }}>{r.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ExampleCard({ title, description, node, code, contrast }: DocEntry['examples'][number]) {
  return (
    <div style={{ background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ fontFamily: 'Archivo', fontWeight: 700, fontSize: '14.5px', color: 'var(--foreground,#F4EFE6)' }}>{title}</div>
        {description ? <div style={{ fontSize: '13px', color: 'var(--muted-foreground,#9AA6B2)', marginTop: '3px' }}>{description}</div> : null}
      </div>
      <div style={{ margin: '14px', padding: '22px', borderRadius: '10px', background: contrast ? 'var(--muted,#1F2530)' : 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.06))', display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
        {node}
      </div>
      {code ? <div style={{ padding: '0 14px 14px' }}><CodeBlock>{code}</CodeBlock></div> : null}
    </div>
  )
}

export function DocPage({ entry }: { entry: DocEntry }) {
  return (
    <article style={{ maxWidth: '860px', margin: '0 auto' }}>
      <header style={{ marginBottom: '28px' }}>
        <Eyebrow>{entry.category}</Eyebrow>
        <h1 style={{ margin: '8px 0 10px', fontFamily: 'Archivo', fontWeight: 900, letterSpacing: '-.03em', fontSize: 'clamp(28px,5vw,40px)', color: 'var(--foreground,#F4EFE6)' }}>{entry.name}</h1>
        <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>{entry.description}</p>
        {entry.importLine ? <div style={{ marginTop: '16px' }}><CodeBlock>{entry.importLine}</CodeBlock></div> : null}
      </header>

      <section style={{ marginBottom: '32px' }}>
        <H2>Ejemplos</H2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {entry.examples.map((ex, i) => <ExampleCard key={i} {...ex} />)}
        </div>
      </section>

      {entry.props && entry.props.length ? (
        <section style={{ marginBottom: '32px' }}>
          <H2>Propiedades</H2>
          <PropsTable rows={entry.props} />
        </section>
      ) : null}

      {entry.events && entry.events.length ? (
        <section style={{ marginBottom: '32px' }}>
          <H2>Eventos</H2>
          <PropsTable rows={entry.events} />
        </section>
      ) : null}

      {entry.notes && entry.notes.length ? (
        <section style={{ marginBottom: '32px' }}>
          <H2>Notas</H2>
          <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {entry.notes.map((n, i) => <li key={i} style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)' }}>{n}</li>)}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
