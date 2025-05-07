"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Table } from "@/types"

interface TableContextType {
  tables: Table[]
  activeTable: number
  setActiveTable: (tableId: number) => void
  updateTableStatus: (tableId: number, status: string) => void
}

const TableContext = createContext<TableContextType | undefined>(undefined)

interface TableProviderProps {
  children: ReactNode
}

export function TableProvider({ children }: TableProviderProps) {
  const [tables, setTables] = useState<Table[]>([])
  const [activeTable, setActiveTable] = useState<number>(0)

  useEffect(() => {
    // Carregar mesas do localStorage
    const storedTables = localStorage.getItem("restaurant_tables")

    if (storedTables) {
      setTables(JSON.parse(storedTables))
    } else {
      // Dados iniciais para demonstração
      const initialTables: Table[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        status: "available",
      }))
      setTables(initialTables)
      localStorage.setItem("restaurant_tables", JSON.stringify(initialTables))
    }
  }, [])

  const updateTableStatus = (tableId: number, status: string) => {
    setTables((prev) => {
      const updated = prev.map((table) => (table.id === tableId ? { ...table, status } : table))
      localStorage.setItem("restaurant_tables", JSON.stringify(updated))
      return updated
    })
  }

  return (
    <TableContext.Provider
      value={{
        tables,
        activeTable,
        setActiveTable,
        updateTableStatus,
      }}
    >
      {children}
    </TableContext.Provider>
  )
}

export function useTable() {
  const context = useContext(TableContext)
  if (context === undefined) {
    throw new Error("useTable must be used within a TableProvider")
  }
  return context
}
