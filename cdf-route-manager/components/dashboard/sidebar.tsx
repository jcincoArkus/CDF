"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  MapPin,
  FileText,
  Warehouse,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "Clientes", href: "/dashboard/clientes", icon: Users },
  { name: "Productos", href: "/dashboard/productos", icon: Package },
  { name: "Pedidos", href: "/dashboard/pedidos", icon: ShoppingCart },
  { name: "Rutas", href: "/dashboard/rutas", icon: MapPin },
  { name: "Inventario", href: "/dashboard/inventario", icon: Warehouse },
  { name: "Facturas", href: "/dashboard/facturas", icon: FileText },
  { name: "Reportes", href: "/dashboard/reportes", icon: BarChart3 },
  { name: "Notificaciones", href: "/dashboard/notificaciones", icon: Bell },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">CDF</h1>
              <p className="text-sm text-gray-500">RouteManager</p>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/dashboard/configuracion"
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">Configuración</span>}
        </Link>
      </div>
    </div>
  )
}
