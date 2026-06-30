// Bridge facade for per-screen VM hooks. Wraps the Zustand store so a VM
// builder can read self.state.* and call self.action()/self.selector() — the
// exact shape the lifted computeVals logic expects.
import { useAppStore, type RootState } from '@/app/store/useAppStore'

/** El facade expone el store completo y además `state` (alias del propio store). */
export type Facade = RootState & { state: RootState }

const facade = (st: RootState): Facade => Object.assign({}, st, { state: st })

/** Subscribe to the whole store and return the VM facade. */
export const useFacade = (): Facade => facade(useAppStore((s) => s))
