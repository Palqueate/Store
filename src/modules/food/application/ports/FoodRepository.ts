import type { FoodItem, FoodCat } from '../../domain/Food'

/** Read-only catalog contract for food. Async so an HTTP adapter is a drop-in. */
export interface FoodRepository {
  listItems(): Promise<FoodItem[]>
  listCategories(): Promise<FoodCat[]>
}
