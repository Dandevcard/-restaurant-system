"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useOrder } from "@/contexts/order-context"
import { useTable } from "@/contexts/table-context"
import { CartItemCard } from "@/components/cart-item-card"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function CartPage() {
  const { id } = useParams()
  const router = useRouter()
  const { activeTable, setActiveTable } = useTable()
  const { cart, getTotalItems, getTotalPrice, clearCart, placeOrder } = useOrder()

  useEffect(() => {
    const tableId = Number.parseInt(id as string)
    if (isNaN(tableId) || tableId <= 0) {
      router.push("/table")
      return
    }

    setActiveTable(tableId)
  }, [id, router, setActiveTable])

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de fazer o pedido",
        variant: "destructive",
      })
      return
    }

    placeOrder(activeTable)
    toast({
      title: "Pedido realizado com sucesso!",
      description: "Seu pedido foi enviado para a cozinha",
      action: (
        <div className="h-8 w-8 bg-primary/20 rounded-full flex items-center justify-center">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
      ),
    })

    // Redirecionar para a página de confirmação após um breve delay
    setTimeout(() => {
      router.push(`/table/${activeTable}/confirmation`)
    }, 1500)
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
            <h1 className="text-xl font-bold">Seu Carrinho</h1>
            <p className="text-sm text-muted-foreground">Mesa {activeTable}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        {cart.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Button onClick={() => router.push(`/table/${activeTable}/menu`)}>Voltar ao Cardápio</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((cartItem) => (
              <CartItemCard key={cartItem.id} cartItem={cartItem} />
            ))}
          </div>
        )}
      </main>

      {cart.length > 0 && (
        <div className="sticky bottom-0 bg-background border-t p-4">
          <div className="container mx-auto space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ {getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Taxa de serviço (10%)</span>
                <span>R$ {(getTotalPrice() * 0.1).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>R$ {(getTotalPrice() * 1.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => router.push(`/table/${activeTable}/menu`)}>
                Adicionar mais
              </Button>
              <Button className="flex-1" onClick={handlePlaceOrder}>
                Fazer Pedido
              </Button>
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}
