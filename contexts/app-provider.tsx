"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "./auth-context";
import { TableProvider } from "./table-context";
import { MenuProvider } from "./menu-context";
import { OrderProvider } from "./order-context";

interface AppProviderProps {
  children: React.ReactNode;
}
export function AppProvider({ children }: AppProviderProps) {
  return (
    <SidebarProvider>
      <AuthProvider>
        <TableProvider>
          <MenuProvider>
            <OrderProvider>{children}</OrderProvider>
          </MenuProvider>
        </TableProvider>
      </AuthProvider>
    </SidebarProvider>
  );
}
