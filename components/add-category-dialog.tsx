"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMenu } from "@/contexts/menu-context"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCategoryDialog({ open, onOpenChange }: AddCategoryDialogProps) {
  const [name, setName] = useState("")
  const { addCategory } = useMenu()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (name.trim()) {
      addCategory({
        id: `category-${Date.now()}`,
        name: name.trim(),
      })

      setName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
          <DialogDescription>Adicione uma nova categoria ao cardápio</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Categoria</Label>
              <Input
                id="name"
                placeholder="Ex: Entradas, Pratos Principais, Bebidas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar Categoria</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
