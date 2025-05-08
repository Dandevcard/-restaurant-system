"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useOrder } from "@/contexts/order-context"
import type { Order } from "@/types"
import { format } from "date-fns"

interface OrdersListProps {
  orders?: Order[]
}

export function OrdersList({ orders }: OrdersListProps) {
  const { orders: allOrders, updateOrderStatus } = useOrder()

  const displayOrders = orders || allOrders

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pendente
          </Badge>
        )
      case "preparing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Preparando
          </Badge>
        )
      case "ready":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            Pronto
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Entregue
          </Badge>
        )
      default:
        return <Badge variant="outline">Desconhecido</Badge>
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "pending":
        return { status: "preparing", label: "Iniciar Preparo" }
      case "preparing":
        return { status: "ready", label: "Marcar como Pronto" }
      case "ready":
        return { status: "delivered", label: "Marcar como Entregue" }
      default:
        return { status: "", label: "" }
    }
  }

  const handleUpdateStatus = (orderId: string, currentStatus: string) => {
    const { status } = getNextStatus(currentStatus)
    if (status) {
      updateOrderStatus(orderId, status)
    }
  }

  if (displayOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Nenhum pedido encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {displayOrders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">
                  Pedido #{order.id.slice(-6).toUpperCase()} - Mesa {order.tableId}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(order.timestamp), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
              {getStatusBadge(order.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div className="flex items-start gap-2">
                    <span className="font-medium">{item.quantity}x</span>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
                    </div>
                  </div>
                  <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-3" />

            <div className="flex justify-between items-center">
              <div className="font-bold">Total: R$ {order.total.toFixed(2)}</div>

              {order.status !== "delivered" && (
                <Button
                  onClick={() => handleUpdateStatus(order.id, order.status)}
                  variant={order.status === "ready" ? "default" : "outline"}
                  size="sm"
                >
                  {getNextStatus(order.status).label}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
