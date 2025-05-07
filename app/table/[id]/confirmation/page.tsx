"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useTable } from "@/contexts/table-context"
import { useOrder } from "@/contexts/order-context"
import { CheckCircle, Clock, Utensils } from "lucide-react"

export default function ConfirmationPage() {
  const { id } = useParams()
  const router = useRouter()
  const { activeTable, setActiveTable } = useTable()
  const { getOrdersByTable } = useOrder()
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)

  useEffect(() => {
    const tableId = Number.parseInt(id as string)
    if (isNaN(tableId) || tableId <= 0) {
      router.push("/table")
      return
    }

    setActiveTable(tableId)

    // Obter o último pedido da mesa
    const tableOrders = getOrdersByTable(tableId)
    if (tableOrders.length > 0) {
      setLastOrderId(tableOrders[tableOrders.length - 1].id)
    } else {
      // Se não houver pedidos, redirecionar para o menu
      router.push(`/table/${tableId}/menu`)
    }
  }, [id, router, setActiveTable, getOrdersByTable])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Pedido Confirmado!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Número do Pedido</span>
              </div>
              <span className="text-sm font-bold">{lastOrderId?.slice(-6).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Utensils className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Mesa</span>
              </div>
              <span className="text-sm font-bold">{activeTable}</span>
            </div>
          </div>

          <div className="text-center text-muted-foreground">
            <p>Seu pedido foi enviado para a cozinha.</p>
            <p>Acompanhe o status do seu pedido nesta tela.</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" onClick={() => router.push(`/table/${activeTable}/menu`)}>
            Fazer outro pedido
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.push(`/table/${activeTable}/orders`)}>
            Ver meus pedidos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
