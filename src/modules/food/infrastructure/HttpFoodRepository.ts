import type { FoodRepository } from '../application/ports/FoodRepository'
import type { FoodItem, FoodCat } from '../domain/Food'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed food catalog. Wire it in the container when the backend is ready. */
export class HttpFoodRepository implements FoodRepository {
  constructor(private readonly http: HttpClient) {}

  listItems(): Promise<FoodItem[]> {
    return this.http.get<FoodItem[]>('/food/items')
  }
  listCategories(): Promise<FoodCat[]> {
    return this.http.get<FoodCat[]>('/food/categories')
  }
}
