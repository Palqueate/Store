import type { ReactNode } from 'react'

/** A single row in a Props or Events table. */
export interface PropRow {
  name: string
  /** TypeScript-ish type signature, shown in mono. */
  type: string
  /** Default value, if any. */
  default?: string
  /** Whether the prop is required. */
  required?: boolean
  description: string
}

/** One live example: a rendered node plus optional source snippet. */
export interface Example {
  title: string
  description?: string
  /** The live rendered component(s). Use a small local component for stateful demos. */
  node: ReactNode
  /** Optional source snippet shown under the preview. */
  code?: string
  /** Render the preview on a sunken/inverted surface (good for light components). */
  contrast?: boolean
}

/** A full documentation page for one component. */
export interface DocEntry {
  slug: string
  name: string
  category: string
  /** One or two sentences shown under the title. */
  description: string
  /** Import line shown at the top of the page. */
  importLine?: string
  props?: PropRow[]
  /** Callback props, documented separately from value props. */
  events?: PropRow[]
  /** Free-form gotchas / usage notes. */
  notes?: string[]
  examples: Example[]
}
