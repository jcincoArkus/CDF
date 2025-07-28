"use client"

import { useState, useEffect } from "react"

export interface Notification {
  id: string
  type: "stock" | "pedido" | "ruta" | "factura" | "cliente" | "sistema"
  priority: "critica" | "alta" | "media" | "baja"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "stock",
    priority: "critica",
    title: "Stock Crítico",
    message: "Pepsi 600ml tiene solo 8 unidades en inventario",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
    read: false,
    actionUrl: "/dashboard/inventario",
  },
  {
    id: "2",
    type: "pedido",
    priority: "alta",
    title: "Pedido Pendiente",
    message: "Pedido #2 de Supermercado Luna requiere procesamiento",
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
    read: false,
    actionUrl: "/dashboard/pedidos",
  },
  {
    id: "3",
    type: "ruta",
    priority: "media",
    title: "Ruta Completada",
    message: "María García completó la Ruta Centro exitosamente",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
    read: true,
    actionUrl: "/dashboard/rutas",
  },
  {
    id: "4",
    type: "factura",
    priority: "media",
    title: "Factura Generada",
    message: "Factura #F001 generada para Tienda El Sol",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
    read: true,
    actionUrl: "/dashboard/facturas",
  },
  {
    id: "5",
    type: "cliente",
    priority: "baja",
    title: "Nuevo Cliente",
    message: "Se registró un nuevo cliente: Abarrotes La Esperanza",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
    read: true,
    actionUrl: "/dashboard/clientes",
  },
  {
    id: "6",
    type: "stock",
    priority: "alta",
    title: "Stock Bajo",
    message: "Doritos Nacho tiene solo 15 unidades disponibles",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    read: false,
    actionUrl: "/dashboard/inventario",
  },
  {
    id: "7",
    type: "sistema",
    priority: "baja",
    title: "Actualización del Sistema",
    message: "Sistema actualizado a la versión 1.2.0",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    read: true,
  },
  {
    id: "8",
    type: "ruta",
    priority: "alta",
    title: "Ruta en Mantenimiento",
    message: "Ruta Express requiere mantenimiento programado",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
    read: false,
    actionUrl: "/dashboard/rutas",
  },
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [loading, setLoading] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const criticalCount = notifications.filter((n) => n.priority === "critica" && !n.read).length
  const highPriorityCount = notifications.filter((n) => n.priority === "alta" && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const getRecentNotifications = (limit = 10) => {
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit)
  }

  const getNotificationsByType = (type: string) => {
    if (type === "all") return notifications
    if (type === "unread") return notifications.filter((n) => !n.read)
    if (type === "read") return notifications.filter((n) => n.read)
    return notifications.filter((n) => n.type === type)
  }

  const filterNotifications = (searchTerm: string, type: string, priority: string) => {
    let filtered = notifications

    if (searchTerm) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.message.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (type && type !== "all") {
      if (type === "unread") {
        filtered = filtered.filter((n) => !n.read)
      } else if (type === "read") {
        filtered = filtered.filter((n) => n.read)
      } else {
        filtered = filtered.filter((n) => n.type === type)
      }
    }

    if (priority && priority !== "all") {
      filtered = filtered.filter((n) => n.priority === priority)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Simular nuevas notificaciones ocasionalmente
      if (Math.random() < 0.1) {
        // 10% de probabilidad cada 30 segundos
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: "sistema",
          priority: "baja",
          title: "Actualización Automática",
          message: "Los datos se han sincronizado correctamente",
          timestamp: new Date(),
          read: false,
        }
        setNotifications((prev) => [newNotification, ...prev])
      }
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  return {
    notifications,
    loading,
    unreadCount,
    criticalCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getRecentNotifications,
    getNotificationsByType,
    filterNotifications,
  }
}
