// @ts-nocheck
// Public entry for the app store: the Zustand hook and the bootstrap effect.
// View-models live in per-screen hooks (modules/*/ui/useXxxVM, shared/ui/vm).
import { useEffect } from 'react'
import { useAppStore } from './useAppStore'

export { useAppStore }

/** Load domain data and wire the viewport listener. Was the store's mount(). */
export function useBootstrap() {
  useEffect(() => {
    useAppStore.getState().bootstrap()
    const onResize = () => useAppStore.setState({ vw: window.innerWidth })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
}
