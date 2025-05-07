export interface MenuCategory {
  id: string
  name: string
}

export interface MenuItem {
  id: string
  categoryId: string
  name: string
  description: string
  price: number
  image: string
}
export interface CartItem {
  id: string
  itemId: string
  name: string
  price: number
  quantity: number
  notes?: string
}
export interface Order {
  id: string
  tableId: number
  items: CartItem[]
  status: string // "pending" | "preparing" | "ready" | "delivered"
  total: number
  timestamp: string
}
export interface Table {
    id: number
    status: string // "available" | "occupied" | "reserved"
  }
  