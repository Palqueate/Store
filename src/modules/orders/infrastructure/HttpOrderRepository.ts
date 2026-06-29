import type { OrderRepository } from '../application/ports/OrderRepository'
import type { Order } from '../domain/Order'
import type { HttpClient } from '../../../shared/application/ports/HttpClient'

/** API-backed orders. Wire it in the container when the backend is ready. */
export class HttpOrderRepository implements OrderRepository {
  constructor(private readonly http: HttpClient) {}

  list(): Promise<Order[]> {
    return this.http.get<Order[]>('/orders')
  }
  listByUser(userId: string): Promise<Order[]> {
    return this.http.get<Order[]>(`/orders?userId=${encodeURIComponent(userId)}`)
  }
  async create(order: Order): Promise<void> {
    await this.http.post<void>('/orders', order)
  }
  async update(order: Order): Promise<void> {
    await this.http.put<void>(`/orders/${order.code}`, order)
  }
}
