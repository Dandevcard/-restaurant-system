"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useMenu } from "@/contexts/menu-context"
import { useOrder } from "@/contexts/order-context"
import { useTable } from "@/contexts/table-context"
import { MenuItemCard } from "@/components/menuItemCard"
import { ShoppingCart } from "lucide-react"

export default function TableMenuPage() {
  const { id } = useParams()
  const router = useRouter()
  const { activeTable, setActiveTable } = useTable()
  const { categories, items } = useMenu()
  const { getTotalItems, getTotalPrice } = useOrder()
  const [activeCategory, setActiveCategory] = useState<string>("")

  useEffect(() => {
    const tableId = Number.parseInt(id as string)
    if (isNaN(tableId) || tableId <= 0) {
      router.push("/table")
      return
    }

    setActiveTable(tableId)

    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [id, router, setActiveTable, categories, activeCategory])

  const getItemsByCategory = (categoryId: string) => {
    return items.filter((item) => item.categoryId === categoryId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Mesa {activeTable}</h1>
            <p className="text-sm text-muted-foreground">Cardápio Digital</p>
          </div>
          <Button variant="outline" className="relative" onClick={() => router.push(`/table/${activeTable}/cart`)}>
            <ShoppingCart className="h-5 w-5 mr-2" />
            <span>Carrinho</span>
            {getTotalItems() > 0 && (
              <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 min-w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </Badge>
            )}
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <div className="sticky top-[73px] z-10 bg-background pt-2 pb-4">
            <TabsList className="w-full h-auto flex overflow-x-auto py-2 justify-start gap-2">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="px-4 py-2 whitespace-nowrap">
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getItemsByCategory(category.id).map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {getTotalItems() > 0 && (
        <div className="sticky bottom-0 bg-background border-t p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="font-medium">{getTotalItems()} itens no carrinho</p>
              <p className="text-lg font-bold">R$ {getTotalPrice().toFixed(2)}</p>
            </div>
            <Button onClick={() => router.push(`/table/${activeTable}/cart`)}>Ver Carrinho</Button>
          </div>
        </div>
      )}
    </div>
  )
}
