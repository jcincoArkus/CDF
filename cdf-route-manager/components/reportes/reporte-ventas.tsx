"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, ShoppingCart, Package, Users, Calendar } from "lucide-react"

interface ReporteVentasProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    vendedor: string
    ruta: string
  }
}

export function ReporteVentas({ filtros }: ReporteVentasProps) {
  // Datos mock para demostración
  const ventasData = {
    totalVentas: 125430.5,
    variacionVentas: 12.5,
    totalPedidos: 342,
    variacionPedidos: 8.2,
    ticketPromedio: 366.75,
    variacionTicket: 3.8,
    productosVendidos: 1247,
    variacionProductos: -2.3,
  }

  const ventasPorDia = [
    { fecha: "2024-01-15", ventas: 4250.0, pedidos: 12 },
    { fecha: "2024-01-16", ventas: 3890.5, pedidos: 11 },
    { fecha: "2024-01-17", ventas: 5120.25, pedidos: 15 },
    { fecha: "2024-01-18", ventas: 4680.0, pedidos: 13 },
    { fecha: "2024-01-19", ventas: 5340.75, pedidos: 16 },
    { fecha: "2024-01-20", ventas: 4920.0, pedidos: 14 },
    { fecha: "2024-01-21", ventas: 5580.25, pedidos: 17 },
  ]

  const productosMasVendidos = [
    { nombre: "Coca-Cola 600ml", cantidad: 156, ingresos: 2418.0, porcentaje: 15.2 },
    { nombre: "Sabritas Original 45g", cantidad: 134, ingresos: 2412.0, porcentaje: 14.8 },
    { nombre: "Agua Bonafont 1L", cantidad: 98, ingresos: 1176.0, porcentaje: 12.1 },
    { nombre: "Leche Lala 1L", cantidad: 87, ingresos: 2088.0, porcentaje: 11.3 },
    { nombre: "Galletas Marías 200g", cantidad: 76, ingresos: 1710.0, porcentaje: 9.8 },
  ]

  const ventasPorVendedor = [
    { nombre: "Carlos Mendoza", ventas: 45230.5, pedidos: 128, participacion: 36.1 },
    { nombre: "Ana García", ventas: 38920.25, pedidos: 112, participacion: 31.0 },
    { nombre: "Luis Rodríguez", ventas: 28450.0, pedidos: 78, participacion: 22.7 },
    { nombre: "María López", ventas: 12829.75, pedidos: 24, participacion: 10.2 },
  ]

  const maxVentas = Math.max(...ventasPorDia.map((v) => v.ventas))

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ventasData.totalVentas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{ventasData.variacionVentas}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventasData.totalPedidos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{ventasData.variacionPedidos}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${ventasData.ticketPromedio.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />+{ventasData.variacionTicket}% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ventasData.productosVendidos.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              {ventasData.variacionProductos > 0 ? "+" : ""}
              {ventasData.variacionProductos}% vs período anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas por Día */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Ventas por Día
            </CardTitle>
            <CardDescription>Evolución diaria de las ventas en el período seleccionado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ventasPorDia.map((dia) => (
                <div key={dia.fecha} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium">
                      {new Date(dia.fecha).toLocaleDateString("es-MX", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    <div className="flex-1">
                      <Progress value={(dia.ventas / maxVentas) * 100} className="h-2 w-32" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${dia.ventas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-muted-foreground">{dia.pedidos} pedidos</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productos Más Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos Más Vendidos
            </CardTitle>
            <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosMasVendidos.map((producto, index) => (
                <div key={producto.nombre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">{producto.cantidad} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${producto.ingresos.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {producto.porcentaje}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ventas por Vendedor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Rendimiento por Vendedor
          </CardTitle>
          <CardDescription>Análisis de ventas por miembro del equipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ventasPorVendedor.map((vendedor) => (
              <div key={vendedor.nombre} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{vendedor.nombre}</h3>
                  <Badge variant="outline">{vendedor.participacion}% del total</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Ventas</p>
                    <p className="font-medium">
                      ${vendedor.ventas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pedidos</p>
                    <p className="font-medium">{vendedor.pedidos}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ticket Promedio</p>
                    <p className="font-medium">
                      ${(vendedor.ventas / vendedor.pedidos).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={vendedor.participacion} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
