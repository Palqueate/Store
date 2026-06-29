import type { CSSProperties } from 'react'

interface Seat {
  n: number
  state: 'all' | 'taken' | 'sel' | 'free'
  onPick?: () => void
}

export default function SeatGrid({ seats = [] }: { seats: Seat[] }) {
  const cells = (seats || []).map((c) => {
    let bg: string, bd: string, col: string, cur = 'pointer', op = '1'
    if (c.state === 'all') { bg = 'color-mix(in srgb,var(--primary,#C9A24B) 24%, var(--muted,#1F2530))'; bd = 'var(--primary,#C9A24B)'; col = 'var(--foreground,#F4EFE6)'; cur = 'default' }
    else if (c.state === 'taken') { bg = 'var(--muted,#1F2530)'; bd = 'var(--border,rgba(255,255,255,.12))'; col = 'var(--subtle-foreground,#6B7480)'; cur = 'not-allowed'; op = '.4' }
    else if (c.state === 'sel') { bg = 'var(--success,#34D17E)'; bd = 'var(--success,#34D17E)'; col = 'var(--success-foreground,#06120B)' }
    else { bg = 'var(--muted,#1F2530)'; bd = 'var(--border,rgba(255,255,255,.12))'; col = 'var(--muted-foreground,#9AA6B2)' }
    const style: CSSProperties = { width: '46px', height: '42px', border: 'none', borderRadius: '9px', display: 'grid', placeItems: 'center', fontFamily: 'Space Mono', fontWeight: 700, fontSize: '13px', cursor: cur, opacity: op, background: bg, boxShadow: 'inset 0 0 0 1.5px ' + bd, color: col }
    return { n: c.n, click: c.onPick, style }
  })

  return (
    <div style={{ padding: '16px', borderRadius: '13px', background: 'var(--background,#0E1116)', border: '1px solid var(--border,rgba(255,255,255,.08))' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {cells.map((c, i) => (
          <button key={i} onClick={c.click} style={c.style}>{c.n}</button>
        ))}
      </div>
      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: "'Space Mono'", fontSize: '10px', letterSpacing: '.18em', color: 'var(--subtle-foreground,#6B7480)' }}>
        <span style={{ height: '1px', width: '40px', background: 'var(--border,rgba(255,255,255,.15))' }} />
        CANCHA
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
        <span style={{ height: '1px', width: '40px', background: 'var(--border,rgba(255,255,255,.15))' }} />
      </div>
    </div>
  )
}
