// Binds React Router's navigate into the module ref and syncs the URL into the
// store (screen mirror + route params). One-directional: URL -> store. Store
// actions push the URL via routerNavigate(); this only reads the URL back.
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppStore } from '@/app/store'
import { bindNavigate, screenForPath } from './navigation'

export function RouterBridge() {
  const navigate = useNavigate()
  const location = useLocation()
  bindNavigate(navigate)

  // Re-run when the path changes OR when the catalog finishes loading (so a
  // deep link to /palco/:id resolves once palcos are available).
  const palcosCount = useAppStore((s: any) => s.palcos.length)

  useEffect(() => {
    const { screen, palcoId, eventId } = screenForPath(location.pathname)
    const store = useAppStore.getState()
    if (palcoId && store.pId !== palcoId) store.selectPalco(palcoId)
    else if (eventId && store.eventId !== eventId) useAppStore.setState({ eventId })
    if (useAppStore.getState().screen !== screen) useAppStore.setState({ screen })
  }, [location.pathname, palcosCount])

  return null
}
