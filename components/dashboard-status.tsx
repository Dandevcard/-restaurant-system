"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useOrder } from "@/contexts/order-context"
import { useTable } from "@/contexts/table-context"
import { DollarSign, ShoppingBag, Users, UtensilsCrossed } from "lucide-react"

export function DashboardStats() {
  const { orders } = useOrder()
  const { tables } = useTable()

  const totalRevenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((acc, order) => acc + order.total, 0)

  const totalOrders = orders.length

  const activeTables = tables.filter((table) => table.status === "occupied").length

  const pendingOrders = orders.filter((order) => order.status === "pending" || order.status === "preparing").length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Faturamento Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            De {orders.filter((order) => order.status === "delivered").length} pedidos entregues
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">{pendingOrders} pedidos pendentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Mesas Ativas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTables}</div>
          <p className="text-xs text-muted-foreground">De {tables.length} mesas no total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Itens no Cardápio</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {/* Aqui você pode adicionar a contagem de itens do cardápio */}
            24
          </div>
          <p className="text-xs text-muted-foreground">Em 6 categorias diferentes</p>
        </CardContent>
      </Card>
    </div>
  )
}
