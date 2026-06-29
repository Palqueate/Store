import type { OrderRepository } from '../ports/OrderRepository'
import type { Order } from '../../domain/Order'

/** Use case: list all orders. */
export function listOrders(repo: OrderRepository): Promise<Order[]> {
  return repo.list()
}

/** Use case: place a new order. */
export function createOrder(repo: OrderRepository, order: Order): Promise<void> {
  return repo.create(order)
}

/** Use case: update an existing order (e.g. add food to a reservation). */
export function updateOrder(repo: OrderRepository, order: Order): Promise<void> {
  return repo.update(order)
}
