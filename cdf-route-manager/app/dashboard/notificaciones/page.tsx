"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Search,
  MoreHorizontal,
  Eye,
  EyeOff,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils"

const notificationTypeConfig = {
  stock: { color: "bg-red-100 text-red-800 border-red-200", icon: "📦", label: "Stock" },
  pedido: { color: "bg-blue-100 text-blue-800 border-blue-200", icon: "🛒", label: "Pedido" },
  ruta: { color: "bg-green-100 text-green-800 border-green-200", icon: "🚛", label: "Ruta" },
  factura: { color: "bg-purple-100 text-purple-800 border-purple-200", icon: "📄", label: "Factura" },
  cliente: { color: "bg-orange-100 text-orange-800 border-orange-200", icon: "👥", label: "Cliente" },
  sistema: { color: "bg-gray-100 text-gray-800 border-gray-200", icon: "⚙️", label: "Sistema" },
}

const priorityConfig = {
  critica: {
    color: "bg-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-50",
    icon: XCircle,
    label: "Crítica",
  },
  alta: {
    color: "bg-orange-500",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: AlertTriangle,
    label: "Alta",
  },
  media: {
    color: "bg-blue-500",
    textColor: "text-blue-600",
    bgColor: "bg-blue-50",
    icon: Info,
    label: "Media",
  },
  baja: {
    color: "bg-gray-500",
    textColor: "text-gray-600",
    bgColor: "bg-gray-50",
    icon: CheckCircle2,
    label: "Baja",
  },
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "Ahora mismo"
  if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? "s" : ""}`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? "s" : ""}`
}

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    criticalCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getNotificationsByType,
    filterNotifications,
  } = useNotifications()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedPriority, setSelectedPriority] = useState("all")
  const [activeTab, setActiveTab] = useState("all")

  const filteredNotifications = filterNotifications(searchTerm, selectedType, selectedPriority)
  const tabNotifications = getNotificationsByType(activeTab)
  const finalNotifications =
    activeTab === "all"
      ? filteredNotifications
      : tabNotifications.filter(
          (n) =>
            (!searchTerm ||
              n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              n.message.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedPriority === "all" || n.priority === selectedPriority),
        )

  const unreadTabCount = notifications.filter((n) => !n.read).length
  const readTabCount = notifications.filter((n) => n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificaciones</h1>
          <p className="text-muted-foreground">Gestiona todas las notificaciones del sistema</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Notificaciones totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Leídas</CardTitle>
            <EyeOff className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">Prioridad crítica</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alta Prioridad</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highPriorityCount}</div>
            <p className="text-xs text-muted-foreground">Prioridad alta</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="stock">📦 Stock</SelectItem>
                <SelectItem value="pedido">🛒 Pedidos</SelectItem>
                <SelectItem value="ruta">🚛 Rutas</SelectItem>
                <SelectItem value="factura">📄 Facturas</SelectItem>
                <SelectItem value="cliente">👥 Clientes</SelectItem>
                <SelectItem value="sistema">⚙️ Sistema</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="critica">🔴 Crítica</SelectItem>
                <SelectItem value="alta">🟠 Alta</SelectItem>
                <SelectItem value="media">🔵 Media</SelectItem>
                <SelectItem value="baja">⚪ Baja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">No Leídas ({unreadTabCount})</TabsTrigger>
          <TabsTrigger value="read">Leídas ({readTabCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {finalNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay notificaciones</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || selectedType !== "all" || selectedPriority !== "all"
                    ? "No se encontraron notificaciones que coincidan con los filtros aplicados."
                    : "No tienes notificaciones en este momento."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {finalNotifications.map((notification) => {
                const typeConfig = notificationTypeConfig[notification.type]
                const priorityInfo = priorityConfig[notification.priority]
                const PriorityIcon = priorityInfo.icon

                return (
                  <Card
                    key={notification.id}
                    className={cn(
                      "transition-all hover:shadow-md",
                      !notification.read && "border-l-4 border-l-blue-500 bg-blue-50/30",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        {/* Priority & Type Indicators */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                          <div className={cn("w-3 h-3 rounded-full", priorityInfo.color)} />
                          <span className="text-2xl">{typeConfig.icon}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={typeConfig.color}>{typeConfig.label}</Badge>
                            <Badge variant="outline" className={cn("border-0", priorityInfo.textColor)}>
                              <PriorityIcon className="w-3 h-3 mr-1" />
                              {priorityInfo.label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                Nueva
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-lg mb-2">{notification.title}</h3>

                          <p className="text-muted-foreground mb-3">{notification.message}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(notification.timestamp)}
                            </span>

                            <div className="flex items-center gap-2">
                              {notification.actionUrl && (
                                <Link href={notification.actionUrl}>
                                  <Button variant="outline" size="sm">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver detalles
                                  </Button>
                                </Link>
                              )}

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.read ? (
                                    <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Marcar como leída
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem disabled>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Ya leída
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => deleteNotification(notification.id)}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Eliminar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
