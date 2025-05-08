"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { DashboardStats } from "@/components/dashboard-status"
import { TableGrid } from "@/components/table-grid"
import { OrdersList } from "@/components/order-list"

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <AdminSidebar />

      <div className="flex-1">
        <AdminHeader title="Dashboard" />

        <main className="p-4 md:p-6">
          <DashboardStats />

          <Tabs defaultValue="orders" className="mt-6">
            <TabsList>
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="tables">Mesas</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4">
              <OrdersList />
            </TabsContent>
            <TabsContent value="tables" className="mt-4">
              <TableGrid />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
