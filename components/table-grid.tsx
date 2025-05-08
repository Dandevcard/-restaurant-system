"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTable } from "@/contexts/table-context"
import { useOrder } from "@/contexts/order-context"

export function TableGrid() {
  const { tables } = useTable()
  const { getOrdersByTable } = useOrder()

  const getTableStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 border-green-200 text-green-800"
      case "occupied":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "reserved":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      default:
        return "bg-muted"
    }
  }

  const getTableStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponível"
      case "occupied":
        return "Ocupada"
      case "reserved":
        return "Reservada"
      default:
        return "Desconhecido"
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tables.map((table) => {
        const tableOrders = getOrdersByTable(table.id)
        const activeOrders = tableOrders.filter((order) => order.status !== "delivered")

        return (
          <Card key={table.id} className="overflow-hidden">
            <div className={`h-2 w-full ${getTableStatusColor(table.status)}`} />
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Mesa {table.id}</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium">{getTableStatusText(table.status)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pedidos ativos:</span>
                  <span className="font-medium">{activeOrders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de pedidos:</span>
                  <span className="font-medium">{tableOrders.length}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full" disabled={activeOrders.length === 0}>
                Ver Pedidos
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
