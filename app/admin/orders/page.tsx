"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useOrder } from "@/contexts/order-context"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { OrdersList } from "@/components/order-list"

export default function AdminOrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { orders } = useOrder()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const preparingOrders = orders.filter((order) => order.status === "preparing")
  const readyOrders = orders.filter((order) => order.status === "ready")
  const deliveredOrders = orders.filter((order) => order.status === "delivered")

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Gerenciar Pedidos" />

        <main className="p-4 md:p-6">
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pendentes ({pendingOrders.length})</TabsTrigger>
              <TabsTrigger value="preparing">Preparando ({preparingOrders.length})</TabsTrigger>
              <TabsTrigger value="ready">Prontos ({readyOrders.length})</TabsTrigger>
              <TabsTrigger value="delivered">Entregues ({deliveredOrders.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="mt-4">
              <OrdersList orders={pendingOrders} />
            </TabsContent>
            <TabsContent value="preparing" className="mt-4">
              <OrdersList orders={preparingOrders} />
            </TabsContent>
            <TabsContent value="ready" className="mt-4">
              <OrdersList orders={readyOrders} />
            </TabsContent>
            <TabsContent value="delivered" className="mt-4">
              <OrdersList orders={deliveredOrders} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
