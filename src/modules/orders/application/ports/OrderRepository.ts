import type { Order } from '../../domain/Order'

/** Persistence contract for orders. Async so an HTTP adapter is a drop-in. */
export interface OrderRepository {
  list(): Promise<Order[]>
  listByUser(userId: string): Promise<Order[]>
  create(order: Order): Promise<void>
  update(order: Order): Promise<void>
}
