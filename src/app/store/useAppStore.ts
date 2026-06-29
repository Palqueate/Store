// @ts-nocheck
// Composition of the Zustand app store from its domain slices. Every slice
// shares the same (set, get), so actions can call across slices via get().
import { create } from 'zustand'
import { createUiSlice } from './slices/uiSlice'
import { createFiltersSlice } from './slices/filtersSlice'
import { createCatalogSlice } from './slices/catalogSlice'
import { createNavigationSlice } from './slices/navigationSlice'
import { createCartSlice } from './slices/cartSlice'
import { createAuthSlice } from './slices/authSlice'
import { createAdminSlice } from './slices/adminSlice'
import { createOwnerSlice } from './slices/ownerSlice'

export const useAppStore = create((set, get) => ({
  ...createUiSlice(set, get),
  ...createFiltersSlice(set, get),
  ...createCatalogSlice(set, get),
  ...createNavigationSlice(set, get),
  ...createCartSlice(set, get),
  ...createAuthSlice(set, get),
  ...createAdminSlice(set, get),
  ...createOwnerSlice(set, get),
}))
