"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, BellRing, AlertTriangle, CheckCircle, X, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

interface Notification {
  id: number
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  timestamp: string
  read: boolean
  action?: {
    label: string
    href: string
  }
}

const notificationIcons = {
  info: Bell,
  warning: AlertTriangle,
  success: CheckCircle,
  error: AlertTriangle,
}

const notificationColors = {
  info: "text-blue-600",
  warning: "text-yellow-600",
  success: "text-green-600",
  error: "text-red-600",
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Simular carga de notificaciones
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "Stock Bajo",
        message: "Coca Cola 600ml tiene solo 15 unidades disponibles",
        type: "warning",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
        action: {
          label: "Ver Inventario",
          href: "/dashboard/inventario",
        },
      },
      {
        id: 2,
        title: "Nuevo Pedido",
        message: "Pedido #PED-001 recibido de Tienda La Esquina",
        type: "info",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
        action: {
          label: "Ver Pedido",
          href: "/dashboard/pedidos",
        },
      },
      {
        id: 3,
        title: "Pedido Entregado",
        message: "Pedido #PED-002 entregado exitosamente",
        type: "success",
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 4,
        title: "Cliente Inactivo",
        message: "Abarrotes El Sur no ha realizado pedidos en 7 días",
        type: "warning",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        action: {
          label: "Ver Cliente",
          href: "/dashboard/clientes",
        },
      },
      {
        id: 5,
        title: "Meta Alcanzada",
        message: "¡Felicidades! Has alcanzado el 80% de la meta mensual",
        type: "success",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 6,
        title: "Ruta Completada",
        message: "Ruta Centro completada por María García",
        type: "info",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: true,
        action: {
          label: "Ver Rutas",
          href: "/dashboard/rutas",
        },
      },
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter((n) => !n.read).length)
  }, [])

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Ahora"
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours}h`

    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays}d`
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
    setUnreadCount(0)
  }

  const removeNotification = (id: number) => {
    const notification = notifications.find((n) => n.id === id)
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id)
    }

    if (notification.action) {
      router.push(notification.action.href)
    }
  }

  const criticalNotifications = notifications.filter((n) => n.type === "error" || n.type === "warning")
  const hasCritical = criticalNotifications.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`relative p-2 hover:bg-accent transition-all duration-200 ${hasCritical ? "animate-pulse" : ""}`}
        >
          <div className="relative">
            {unreadCount > 0 ? (
              <BellRing className={`h-5 w-5 ${hasCritical ? "text-red-500" : "text-blue-500"}`} />
            ) : (
              <Bell className="h-5 w-5 text-muted-foreground" />
            )}

            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className={`absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs p-0 animate-bounce ${
                  hasCritical
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </div>
          <span className="sr-only">
            {unreadCount > 0 ? `${unreadCount} notificaciones no leídas` : "Notificaciones"}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6 px-2">
              Marcar todas como leídas
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mb-2" />
            <p className="text-sm">No hay notificaciones</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-1">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const iconColor = notificationColors[notification.type]

                return (
                  <div key={notification.id} className="relative group">
                    <DropdownMenuItem
                      className={`flex flex-col items-start gap-2 p-3 cursor-pointer transition-all duration-200 ${
                        !notification.read
                          ? "bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-500"
                          : "hover:bg-accent"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-start gap-2 flex-1">
                          <Icon className={`h-4 w-4 mt-0.5 ${iconColor} flex-shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-muted-foreground">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <Badge variant="outline" className="text-xs">
                                  {notification.action.label}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </DropdownMenuItem>

                    {!notification.read && (
                      <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-center justify-center text-sm text-muted-foreground cursor-pointer"
          onClick={() => router.push("/dashboard/notificaciones")}
        >
          Ver todas las notificaciones
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
