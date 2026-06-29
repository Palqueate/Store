import type { FoodRepository } from '../application/ports/FoodRepository'
import type { FoodItem, FoodCat } from '../domain/Food'
import { FOOD, FOOD_CATS } from '../../../shared/infrastructure/in-memory/db'

/** Read-only catalog backed by the in-memory FOOD collections. */
export class InMemoryFoodRepository implements FoodRepository {
  async listItems(): Promise<FoodItem[]> {
    return FOOD
  }

  async listCategories(): Promise<FoodCat[]> {
    return FOOD_CATS
  }
}
