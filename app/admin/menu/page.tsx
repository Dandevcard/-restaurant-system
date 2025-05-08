"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useMenu } from "@/contexts/menu-context"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import MenuCategoryCard, {  } from "@/components/menu-category-card"
import { AddCategoryDialog } from "@/components/add-category-dialog"
import { AddItemDialog } from "@/components/add-item-dialog"
import { Plus } from "lucide-react"
import MenuItemAdmin from "@/components/menu-item-admin"

export default function AdminMenuPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { categories, items } = useMenu()
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }

    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [isAuthenticated, router, categories, activeCategory])

  if (!isAuthenticated) {
    return null
  }

  const getItemsByCategory = (categoryId: string) => {
    return items.filter((item) => item.categoryId === categoryId)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Gerenciar Cardápio" />

        <main className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Cardápio</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
              <Button onClick={() => setIsAddItemOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Item
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categorias</CardTitle>
                  <CardDescription>Gerencie as categorias do cardápio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => (
                    <MenuCategoryCard
                      key={category.id}
                      category={category}
                      isActive={category.id === activeCategory}
                      onClick={() => setActiveCategory(category.id)}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>{categories.find((c) => c.id === activeCategory)?.name || "Itens"}</CardTitle>
                  <CardDescription>Gerencie os itens desta categoria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeCategory &&
                      getItemsByCategory(activeCategory).map((item) => <MenuItemAdmin key={item.id} item={item} />)}

                    {activeCategory && getItemsByCategory(activeCategory).length === 0 && (
                      <div className="col-span-full text-center py-8">
                        <p className="text-muted-foreground mb-4">Nenhum item nesta categoria</p>
                        <Button onClick={() => setIsAddItemOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Item
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <AddCategoryDialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen} />

      <AddItemDialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen} categoryId={activeCategory} />
    </div>
  )
}
