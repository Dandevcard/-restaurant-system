"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { MenuCategory, MenuItem } from "@/types"

interface MenuContextType {
  categories: MenuCategory[]
  items: MenuItem[]
  addCategory: (category: MenuCategory) => void
  updateCategory: (id: string, category: Partial<MenuCategory>) => void
  deleteCategory: (id: string) => void
  addItem: (item: MenuItem) => void
  updateItem: (id: string, item: Partial<MenuItem>) => void
  deleteItem: (id: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

interface MenuProviderProps {
  children: ReactNode
}

export function MenuProvider({ children }: MenuProviderProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])

  useEffect(() => {
    // Carregar dados do localStorage
    const storedCategories = localStorage.getItem("restaurant_categories")
    const storedItems = localStorage.getItem("restaurant_items")

    if (storedCategories) {
      setCategories(JSON.parse(storedCategories))
    } else {
      // Dados iniciais para demonstração
      const initialCategories: MenuCategory[] = [
        { id: "category-1", name: "Entradas" },
        { id: "category-2", name: "Pratos Principais" },
        { id: "category-3", name: "Sobremesas" },
        { id: "category-4", name: "Bebidas" },
      ]
      setCategories(initialCategories)
      localStorage.setItem("restaurant_categories", JSON.stringify(initialCategories))
    }

    if (storedItems) {
      setItems(JSON.parse(storedItems))
    } else {
      // Dados iniciais para demonstração
      const initialItems: MenuItem[] = [
        {
          id: "item-1",
          categoryId: "category-1",
          name: "Batata Frita",
          description: "Porção de batatas fritas crocantes",
          price: 15.9,
          image: "",
        },
        {
          id: "item-2",
          categoryId: "category-1",
          name: "Isca de Frango",
          description: "Iscas de frango empanadas",
          price: 18.9,
          image: "",
        },
        {
          id: "item-3",
          categoryId: "category-2",
          name: "X-Burger",
          description: "Hambúrguer com queijo, alface e tomate",
          price: 22.9,
          image: "",
        },
        {
          id: "item-4",
          categoryId: "category-2",
          name: "Filé com Fritas",
          description: "Filé mignon grelhado com batatas fritas",
          price: 39.9,
          image: "",
        },
        {
          id: "item-5",
          categoryId: "category-3",
          name: "Pudim",
          description: "Pudim de leite condensado",
          price: 12.9,
          image: "",
        },
        {
          id: "item-6",
          categoryId: "category-4",
          name: "Refrigerante",
          description: "Lata 350ml",
          price: 6.9,
          image: "",
        },
        {
          id: "item-7",
          categoryId: "category-4",
          name: "Suco Natural",
          description: "Copo 300ml",
          price: 8.9,
          image: "",
        },
      ]
      setItems(initialItems)
      localStorage.setItem("restaurant_items", JSON.stringify(initialItems))
    }
  }, [])

  const addCategory = (category: MenuCategory) => {
    setCategories((prev) => {
      const updated = [...prev, category]
      localStorage.setItem("restaurant_categories", JSON.stringify(updated))
      return updated
    })
  }

  const updateCategory = (id: string, category: Partial<MenuCategory>) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...category } : c))
      localStorage.setItem("restaurant_categories", JSON.stringify(updated))
      return updated
    })
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      localStorage.setItem("restaurant_categories", JSON.stringify(updated))
      return updated
    })
  }

  const addItem = (item: MenuItem) => {
    setItems((prev) => {
      const updated = [...prev, item]
      localStorage.setItem("restaurant_items", JSON.stringify(updated))
      return updated
    })
  }

  const updateItem = (id: string, item: Partial<MenuItem>) => {
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, ...item } : i))
      localStorage.setItem("restaurant_items", JSON.stringify(updated))
      return updated
    })
  }

  const deleteItem = (id: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id)
      localStorage.setItem("restaurant_items", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <MenuContext.Provider
      value={{
        categories,
        items,
        addCategory,
        updateCategory,
        deleteCategory,
        addItem,
        updateItem,
        deleteItem,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
