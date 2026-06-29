import type { FoodRepository } from '../ports/FoodRepository'
import type { FoodItem, FoodCat } from '../../domain/Food'

/** Use case: list food items in the catalog. */
export function listFoodItems(repo: FoodRepository): Promise<FoodItem[]> {
  return repo.listItems()
}

/** Use case: list food categories. */
export function listFoodCategories(repo: FoodRepository): Promise<FoodCat[]> {
  return repo.listCategories()
}
