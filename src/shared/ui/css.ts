import type { CSSProperties } from 'react'

/**
 * Parse a CSS declaration string (e.g. "display:flex; gap:8px;") into a React
 * style object — the prototype authored most styles as inline CSS strings, so
 * this lets us port them faithfully. Pass-through for objects (some view-model
 * styles are already objects). Custom properties (`--background`) are kept verbatim.
 */
export function css(input?: string | CSSProperties | null): CSSProperties {
  if (!input) return {}
  if (typeof input !== 'string') return input
  const o: Record<string, string> = {}
  for (const decl of input.split(';')) {
    const i = decl.indexOf(':')
    if (i < 0) continue
    const prop = decl.slice(0, i).trim()
    if (!prop) continue
    const val = decl.slice(i + 1).trim()
    o[prop.startsWith('--') ? prop : kebabToCamel(prop)] = val
  }
  return o as CSSProperties
}

function kebabToCamel(s: string): string {
  return s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}
