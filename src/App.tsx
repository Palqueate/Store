import { Routes, Route } from 'react-router-dom'
import { useAppStore, useBootstrap } from '@/app/store'
import { RouterBridge } from '@/app/router/RouterBridge'
import { THEMES } from '@/shared/domain/theme'
import { css } from '@/shared/ui/css'

import Header from '@/shared/ui/components/Header'
import { BottomNav, AcctBackdrop, AuthModal, EventModal, StadiumModal, PalcoReviewModal, Toast } from '@/shared/ui/components/Overlays'

import Home from '@/modules/home/ui/Home'
import Results from '@/modules/palcos/ui/Results'
import Detail from '@/modules/palcos/ui/Detail'
import Cart from '@/modules/orders/ui/Cart'
import Checkout from '@/modules/orders/ui/Checkout'
import Confirm from '@/modules/orders/ui/Confirm'
import Food from '@/modules/food/ui/Food'
import FoodConfirm from '@/modules/food/ui/FoodConfirm'
import Owner from '@/modules/owner/ui/Owner'
import Publish from '@/modules/owner/ui/Publish'
import Events from '@/modules/events/ui/Events'
import EventPalcos from '@/modules/events/ui/EventPalcos'
import Metrics from '@/modules/owner/ui/Metrics'
import Account from '@/modules/accounts/ui/Account'
import Admin from '@/modules/admin/ui/Admin'

export default function App() {
  useBootstrap()
  const theme = useAppStore((s: any) => s.theme)
  const th = THEMES[theme] || THEMES.palco
  const rootStyle = {
    ...th.vars,
    background: 'var(--background)', color: 'var(--foreground)', minHeight: '100vh',
    fontFamily: "'Archivo', system-ui, sans-serif", transition: 'background .35s ease, color .35s ease',
  }

  return (
    <div style={css(rootStyle)}>
      <RouterBridge />
      <Header />

      <main style={{ minHeight: 'calc(100vh - 67px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/palcos" element={<Results />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/evento/:eventId" element={<EventPalcos />} />
          <Route path="/palco/:palcoId" element={<Detail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmacion" element={<Confirm />} />
          <Route path="/comida" element={<Food />} />
          <Route path="/comida/confirmacion" element={<FoodConfirm />} />
          <Route path="/owner" element={<Owner />} />
          <Route path="/owner/metricas" element={<Metrics />} />
          <Route path="/publicar" element={<Publish />} />
          <Route path="/cuenta" element={<Account />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <BottomNav />
      <AcctBackdrop />
      <AuthModal />
      <EventModal />
      <StadiumModal />
      <PalcoReviewModal />
      <Toast />
    </div>
  )
}
