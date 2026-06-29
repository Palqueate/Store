import type { DocEntry } from './types'

import actions from './entries/actions'
import inputs from './entries/inputs'
import dataDisplay from './entries/data-display'
import feedback from './entries/feedback'
import navigation from './entries/navigation'
import overlays from './entries/overlays'
import layout from './entries/layout'
import wave1 from './entries/wave1'
import wave2 from './entries/wave2'
import wave3 from './entries/wave3'
import wave4 from './entries/wave4'
import wave5 from './entries/wave5'

/** Sidebar category order. */
export const CATEGORY_ORDER = ['Acciones', 'Inputs', 'Datos', 'Feedback', 'Navegación', 'Overlays', 'Layout']

export const ENTRIES: DocEntry[] = [
  ...actions, ...inputs, ...dataDisplay, ...feedback, ...navigation, ...overlays, ...layout,
  ...wave1, ...wave2, ...wave3, ...wave4, ...wave5,
]

export const BY_SLUG: Record<string, DocEntry> = Object.fromEntries(ENTRIES.map((e) => [e.slug, e]))
