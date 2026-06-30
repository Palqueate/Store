export interface FoodItem {
  id: string
  cat: string
  name: string
  price: number
  desc: string
  /** Imagen del producto (URL o data URL). Opcional: si falta, la UI muestra
   *  un placeholder con el emoji de la categoría. */
  image?: string
}

export interface FoodCat {
  id: string
  name: string
}
