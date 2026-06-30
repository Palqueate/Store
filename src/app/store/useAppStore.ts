// Composition of the Zustand app store from its domain slices. Every slice
// shares the same (set, get), so actions can call across slices via get().
//
// `RootState` se deriva de las propias slices con `ReturnType`, así el estado y
// todas las acciones quedan tipados sin mantener una interfaz a mano: agregar
// una clave a una slice la expone tipada en todo el store.
import { create } from 'zustand'
import { createUiSlice } from './slices/uiSlice'
import { createFiltersSlice } from './slices/filtersSlice'
import { createCatalogSlice } from './slices/catalogSlice'
import { createNavigationSlice } from './slices/navigationSlice'
import { createCartSlice } from './slices/cartSlice'
import { createAuthSlice } from './slices/authSlice'
import { createAdminSlice } from './slices/adminSlice'
import { createOwnerSlice } from './slices/ownerSlice'

export type RootState =
  ReturnType<typeof createUiSlice> &
  ReturnType<typeof createFiltersSlice> &
  ReturnType<typeof createCatalogSlice> &
  ReturnType<typeof createNavigationSlice> &
  ReturnType<typeof createCartSlice> &
  ReturnType<typeof createAuthSlice> &
  ReturnType<typeof createAdminSlice> &
  ReturnType<typeof createOwnerSlice>

export const useAppStore = create<RootState>()((set, get) => ({
  ...createUiSlice(set, get),
  ...createFiltersSlice(),
  ...createCatalogSlice(set, get),
  ...createNavigationSlice(set, get),
  ...createCartSlice(set, get),
  ...createAuthSlice(set, get),
  ...createAdminSlice(set, get),
  ...createOwnerSlice(set, get),
}))
