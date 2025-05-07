"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useOrder } from "@/contexts/order-context"
import type { CartItem } from "@/types"
import { Minus, Plus, Trash2 } from "lucide-react"

interface CartItemCardProps {
  cartItem: CartItem
}

export function CartItemCard({ cartItem }: CartItemCardProps) {
  const { updateCartItemQuantity, removeFromCart } = useOrder()

  const handleIncrement = () => {
    updateCartItemQuantity(cartItem.id, cartItem.quantity + 1)
  }

  const handleDecrement = () => {
    if (cartItem.quantity > 1) {
      updateCartItemQuantity(cartItem.id, cartItem.quantity - 1)
    } else {
      removeFromCart(cartItem.id)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-medium">{cartItem.name}</h3>
              <span className="font-bold">R$ {(cartItem.price * cartItem.quantity).toFixed(2)}</span>
            </div>

            {cartItem.notes && <p className="text-sm text-muted-foreground mb-2">{cartItem.notes}</p>}

            <div className="flex items-center mt-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleDecrement}>
                {cartItem.quantity === 1 ? (
                  <Trash2 className="h-3 w-3 text-destructive" />
                ) : (
                  <Minus className="h-3 w-3" />
                )}
              </Button>
              <span className="w-12 text-center">{cartItem.quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleIncrement}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
