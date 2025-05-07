"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { CartItem, Order } from "@/types"
import { useTable } from "@/contexts/table-context"

interface OrderContextType {
  cart: CartItem[]
  orders: Order[]
  addToCart: (item: CartItem) => void
  updateCartItemQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  placeOrder: (tableId: number) => void
  getOrdersByTable: (tableId: number) => Order[]
  updateOrderStatus: (id: string, status: string) => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

interface OrderProviderProps {
  children: ReactNode
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const { updateTableStatus } = useTable()

  useEffect(() => {
    // Carregar pedidos do localStorage
    const storedOrders = localStorage.getItem("restaurant_orders")
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders))
    }
  }, [])

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item])
  }

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const placeOrder = (tableId: number) => {
    if (cart.length === 0) return

    const total = getTotalPrice() * 1.1 // Adiciona 10% de taxa de serviço

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tableId,
      items: [...cart],
      status: "pending",
      total,
      timestamp: new Date().toISOString(),
    }

    setOrders((prev) => {
      const updated = [...prev, newOrder]
      localStorage.setItem("restaurant_orders", JSON.stringify(updated))
      return updated
    })

    // Atualiza o status da mesa para ocupada
    updateTableStatus(tableId, "occupied")

    // Limpa o carrinho
    clearCart()
  }

  const getOrdersByTable = (tableId: number) => {
    return orders.filter((order) => order.tableId === tableId)
  }

  const updateOrderStatus = (id: string, status: string) => {
    setOrders((prev) => {
      const updated = prev.map((order) => (order.id === id ? { ...order, status } : order))
      localStorage.setItem("restaurant_orders", JSON.stringify(updated))
      return updated
    })

    // Se o status for "delivered", verifica se há outros pedidos ativos para a mesa
    if (status === "delivered") {
      const order = orders.find((o) => o.id === id)
      if (order) {
        const tableId = order.tableId
        const hasActiveOrders = orders.some((o) => o.tableId === tableId && o.id !== id && o.status !== "delivered")

        // Se não houver outros pedidos ativos, marca a mesa como disponível
        if (!hasActiveOrders) {
          updateTableStatus(tableId, "available")
        }
      }
    }
  }

  return (
    <OrderContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalPrice,
        placeOrder,
        getOrdersByTable,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider")
  }
  return context
}
