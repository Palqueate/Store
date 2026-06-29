// @ts-nocheck
// Bridge facade for per-screen VM hooks. Wraps the Zustand store so a VM
// builder can read self.state.* and call self.action()/self.selector() — the
// exact shape the lifted computeVals logic expects.
import { useAppStore } from '@/app/store/useAppStore'

const facade = (st) => Object.assign({}, st, { state: st })

/** Subscribe to the whole store and return the VM facade. */
export const useFacade = () => facade(useAppStore((s) => s))
