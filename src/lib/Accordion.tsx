import { useState } from 'react'
import type { ReactNode } from 'react'

interface AccordionItem {
  key: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items?: AccordionItem[]
  /** Allow multiple panels open at once. */
  multiple?: boolean
  /** Key(s) open on first render. */
  defaultOpen?: string[]
}

export default function Accordion({ items = [], multiple = false, defaultOpen = [] }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpen)

  function toggle(key: string) {
    setOpen((prev) => {
      const isOpen = prev.includes(key)
      if (multiple) return isOpen ? prev.filter((k) => k !== key) : [...prev, key]
      return isOpen ? [] : [key]
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((it) => {
        const isOpen = open.includes(it.key)
        return (
          <div key={it.key} style={{ background: 'var(--card,#171B22)', border: '1px solid var(--border,rgba(255,255,255,.1))', borderRadius: '14px', overflow: 'hidden' }}>
            <button
              onClick={() => toggle(it.key)}
              aria-expanded={isOpen}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                fontFamily: 'Archivo', fontWeight: 700, fontSize: '15px', color: 'var(--foreground,#F4EFE6)',
              }}
            >
              <span>{it.title}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground,#9AA6B2)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .2s ease' }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {isOpen ? (
              <div style={{ padding: '0 18px 18px', fontSize: '14px', lineHeight: 1.5, color: 'var(--muted-foreground,#9AA6B2)', animation: 'pq-lib-fade-in .18s ease both' }}>
                {it.content}
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
