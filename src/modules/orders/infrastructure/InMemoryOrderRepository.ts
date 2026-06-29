import type { OrderRepository } from '../application/ports/OrderRepository'
import type { Order } from '../domain/Order'
import { SEED_ORDERS } from '../../../shared/infrastructure/in-memory/db'
import { readJson, writeJson } from '../../../shared/infrastructure/storage/localStorage'

const KEY = 'pq_orders'

/** Orders persisted in localStorage, seeded with the demo orders on first read. */
export class InMemoryOrderRepository implements OrderRepository {
  private load(): Order[] {
    const orders = readJson<Order[]>(KEY, [])
    for (const so of SEED_ORDERS) {
      if (!orders.some((o) => o.code === so.code)) orders.push(so)
    }
    writeJson(KEY, orders)
    return orders
  }

  async list(): Promise<Order[]> {
    return this.load()
  }

  async listByUser(userId: string): Promise<Order[]> {
    return this.load().filter((o) => o.userId === userId)
  }

  async create(order: Order): Promise<void> {
    const orders = this.load()
    orders.push(order)
    writeJson(KEY, orders)
  }

  async update(order: Order): Promise<void> {
    const orders = this.load().map((o) => (o.code === order.code ? order : o))
    writeJson(KEY, orders)
  }
}
