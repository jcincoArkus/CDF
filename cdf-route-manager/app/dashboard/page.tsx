"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, MapPin, Clock, Eye } from "lucide-react"
import { obtenerClientes } from "@/lib/actions/clientes"
import { obtenerProductos } from "@/lib/actions/productos"
import { getRutas, getPedidos } from "@/lib/db"

interface DashboardStats {
  totalClientes: number
  totalProductos: number
  totalPedidos: number
  ventasHoy: number
  ventasMes: number
  pedidosPendientes: number
}

interface AlertaStock {
  id: string
  nombre: string
  stock: number
  minimo: number
}

interface RutaEstado {
  id: string
  nombre: string
  vendedor: string
  progreso: number
  estado: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    totalProductos: 0,
    totalPedidos: 0,
    ventasHoy: 0,
    ventasMes: 0,
    pedidosPendientes: 0,
  })
  const [alertasStock, setAlertasStock] = useState<AlertaStock[]>([])
  const [rutasEstado, setRutasEstado] = useState<RutaEstado[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)

        // Obtener datos de forma segura
        const [clientes, productos, rutas, pedidos] = await Promise.all([
          obtenerClientes().catch(() => []),
          obtenerProductos().catch(() => []),
          getRutas().catch(() => []),
          getPedidos().catch(() => []),
        ])

        // Validar que los datos sean arrays
        const clientesArray = Array.isArray(clientes) ? clientes : []
        const productosArray = Array.isArray(productos) ? productos : []
        const rutasArray = Array.isArray(rutas) ? rutas : []
        const pedidosArray = Array.isArray(pedidos) ? pedidos : []

        // Calcular estadísticas de forma segura
        const hoy = new Date()
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

        const pedidosHoy = pedidosArray.filter((p) => {
          if (!p || typeof p !== "object") return false
          try {
            const fechaPedido = new Date(String(p.fecha || ""))
            return fechaPedido.toDateString() === hoy.toDateString()
          } catch {
            return false
          }
        })

        const pedidosMes = pedidosArray.filter((p) => {
          if (!p || typeof p !== "object") return false
          try {
            const fechaPedido = new Date(String(p.fecha || ""))
            return fechaPedido >= inicioMes
          } catch {
            return false
          }
        })

        const ventasHoy = pedidosHoy.reduce((sum, p) => {
          const total = Number.parseFloat(String(p?.total || "0"))
          return sum + (isNaN(total) ? 0 : total)
        }, 0)

        const ventasMes = pedidosMes.reduce((sum, p) => {
          const total = Number.parseFloat(String(p?.total || "0"))
          return sum + (isNaN(total) ? 0 : total)
        }, 0)

        const pedidosPendientes = pedidosArray.filter(
          (p) => p && typeof p === "object" && String(p.estatus || "") === "pendiente",
        ).length

        setStats({
          totalClientes: clientesArray.length,
          totalProductos: productosArray.length,
          totalPedidos: pedidosArray.length,
          ventasHoy,
          ventasMes,
          pedidosPendientes,
        })

        // Generar alertas de stock de forma segura
        const alertas = productosArray
          .filter((p) => {
            if (!p || typeof p !== "object") return false
            const stock = Number.parseInt(String(p.stock || "0"))
            const minimo = Number.parseInt(String(p.stock_minimo || "10"))
            return !isNaN(stock) && !isNaN(minimo) && stock <= minimo
          })
          .slice(0, 5)
          .map((p, index) => ({
            id: String(p?.id || `alerta-${index}`),
            nombre: String(p?.nombre || `Producto ${index + 1}`),
            stock: Number.parseInt(String(p?.stock || "0")),
            minimo: Number.parseInt(String(p?.stock_minimo || "10")),
          }))

        setAlertasStock(alertas)

        // Generar estado de rutas de forma segura
        const rutasConEstado = rutasArray.slice(0, 4).map((ruta, index) => {
          if (!ruta || typeof ruta !== "object") {
            return {
              id: `ruta-${index}`,
              nombre: `Ruta ${index + 1}`,
              vendedor: `Vendedor ${index + 1}`,
              progreso: Math.floor(Math.random() * 100),
              estado: "activa",
            }
          }

          return {
            id: String(ruta.id || `ruta-${index}`),
            nombre: String(ruta.nombre || `Ruta ${index + 1}`),
            vendedor: String(ruta.vendedor || `Vendedor ${index + 1}`),
            progreso: Math.min(
              100,
              Math.max(0, Number.parseInt(String(ruta.progreso || Math.floor(Math.random() * 100)))),
            ),
            estado: String(ruta.estado || "activa"),
          }
        })

        setRutasEstado(rutasConEstado)
      } catch (error) {
        console.error("Error cargando datos del dashboard:", error)
        // Mantener valores por defecto en caso de error
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu negocio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProductos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPedidos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              {stats.pedidosPendientes} pendientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.ventasMes.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Hoy: ${stats.ventasHoy.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Alertas de Stock
            </CardTitle>
            <CardDescription>Productos con stock bajo que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            {alertasStock.length === 0 ? (
              <div className="text-center py-6">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No hay alertas de stock</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertasStock.map((alerta) => (
                  <div
                    key={alerta.id}
                    className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200"
                  >
                    <div>
                      <p className="font-medium text-sm">{alerta.nombre}</p>
                      <p className="text-xs text-gray-600">
                        Stock actual: {alerta.stock} | Mínimo: {alerta.minimo}
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      Crítico
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver inventario completo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estado de Rutas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              Estado de Rutas
            </CardTitle>
            <CardDescription>Progreso actual de las rutas de distribución</CardDescription>
          </CardHeader>
          <CardContent>
            {rutasEstado.length === 0 ? (
              <div className="text-center py-6">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No hay rutas activas</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rutasEstado.map((ruta) => (
                  <div key={ruta.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{ruta.nombre}</p>
                        <p className="text-xs text-gray-600">{ruta.vendedor}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={ruta.estado === "completada" ? "default" : "secondary"} className="text-xs">
                          {ruta.estado}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{ruta.progreso}%</p>
                      </div>
                    </div>
                    <Progress value={ruta.progreso} className="h-2" />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3 bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver todas las rutas
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
