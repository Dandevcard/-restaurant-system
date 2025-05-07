"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTable } from "@/contexts/table-context"

export default function TableAccessPage() {
  const [tableNumber, setTableNumber] = useState("")
  const [error, setError] = useState("")
  const { setActiveTable } = useTable()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const tableNum = Number.parseInt(tableNumber)
    if (isNaN(tableNum) || tableNum <= 0) {
      setError("Por favor, insira um número de mesa válido")
      return
    }

    setActiveTable(tableNum)
    router.push(`/table/${tableNum}/menu`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Acesso à Mesa</CardTitle>
          <CardDescription>Digite o número da sua mesa para acessar o cardápio e fazer pedidos</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="tableNumber">Número da Mesa</Label>
              <Input
                id="tableNumber"
                type="number"
                placeholder="Ex: 1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                min="1"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Acessar Cardápio
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
