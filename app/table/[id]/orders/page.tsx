"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTable } from "@/contexts/table-context"
import { useOrder } from "@/contexts/order-context"
import { ArrowLeft, Clock, CheckCircle, ChefHat } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function TableOrdersPage() {
  const { id } = useParams()
  const router = useRouter()
  const { activeTable, setActiveTable } = useTable()
  const { getOrdersByTable } = useOrder()

  useEffect(() => {
    const tableId = Number.parseInt(id as string)
    if (isNaN(tableId) || tableId <= 0) {
      router.push("/table")
      return
    }

    setActiveTable(tableId)
  }, [id, router, setActiveTable])

  const tableOrders = getOrdersByTable(activeTable)

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "preparing":
        return <ChefHat className="h-5 w-5 text-blue-500" />
      case "ready":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-purple-500" />
      default:
        return <Clock className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/table/${activeTable}/menu`)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Seus Pedidos</h1>
            <p className="text-sm text-muted-foreground">Mesa {activeTable}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {tableOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
            <Button onClick={() => router.push(`/table/${activeTable}/menu`)}>Ir para o Cardápio</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {tableOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <CardTitle className="text-base font-medium">
                        Pedido #{order.id.slice(-6).toUpperCase()}
                      </CardTitle>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground mb-3">
                    {format(new Date(order.timestamp), "dd 'de' MMMM', às 'HH:mm", { locale: ptBR })}
                  </div>

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

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>R$ {order.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="container mx-auto">
          <Button className="w-full" onClick={() => router.push(`/table/${activeTable}/menu`)}>
            Voltar ao Cardápio
          </Button>
        </div>
      </div>
    </div>
  )
}
