"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, TrendingUp, MapPin, Calendar, DollarSign, ShoppingCart } from "lucide-react"

interface ReporteClientesProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    vendedor: string
    ruta: string
  }
}

export function ReporteClientes({ filtros }: ReporteClientesProps) {
  // Datos mock para demostración
  const clientesData = {
    totalClientes: 89,
    clientesActivos: 76,
    clientesNuevos: 5,
    clientesInactivos: 13,
    tasaRetencion: 85.4,
    frecuenciaCompra: 2.3,
  }

  const topClientes = [
    {
      nombre: "Tienda El Buen Precio",
      ventas: 18450.5,
      pedidos: 24,
      ultimaCompra: "2024-01-21",
      ruta: "Centro Preventa",
      categoria: "Premium",
    },
    {
      nombre: "Súper Mercado Familiar",
      ventas: 15230.25,
      pedidos: 19,
      ultimaCompra: "2024-01-20",
      ruta: "Norte Reparto",
      categoria: "Premium",
    },
    {
      nombre: "Abarrotes Don Juan",
      ventas: 12890.0,
      pedidos: 16,
      ultimaCompra: "2024-01-19",
      ruta: "Industrial",
      categoria: "Regular",
    },
    {
      nombre: "Minisuper La Esquina",
      ventas: 9650.75,
      pedidos: 13,
      ultimaCompra: "2024-01-18",
      ruta: "Centro Preventa",
      categoria: "Regular",
    },
    {
      nombre: "Comercial Los Pinos",
      ventas: 8420.0,
      pedidos: 11,
      ultimaCompra: "2024-01-17",
      ruta: "Sur Mixta",
      categoria: "Regular",
    },
  ]

  const clientesPorRuta = [
    { ruta: "Centro Preventa", clientes: 25, activos: 22, ventas: 45230.5 },
    { ruta: "Norte Reparto", clientes: 18, activos: 16, ventas: 38920.25 },
    { ruta: "Industrial", clientes: 15, activos: 13, ventas: 28450.0 },
    { ruta: "Sur Mixta", clientes: 12, activos: 10, ventas: 15680.75 },
  ]

  const segmentacionClientes = [
    { categoria: "Premium", cantidad: 12, porcentaje: 13.5, ventasPromedio: 15240.5 },
    { categoria: "Regular", cantidad: 45, porcentaje: 50.6, ventasPromedio: 8950.25 },
    { categoria: "Básico", cantidad: 32, porcentaje: 35.9, ventasPromedio: 4230.0 },
  ]

  const maxVentas = Math.max(...topClientes.map((c) => c.ventas))

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              {clientesData.clientesActivos} activos, {clientesData.clientesInactivos} inactivos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.clientesNuevos}</div>
            <p className="text-xs text-muted-foreground">En el período seleccionado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.tasaRetencion}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% vs período anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frecuencia de Compra</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesData.frecuenciaCompra}</div>
            <p className="text-xs text-muted-foreground">Pedidos promedio por cliente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Top Clientes por Ventas
            </CardTitle>
            <CardDescription>Los 5 clientes con mayor volumen de compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topClientes.map((cliente, index) => (
                <div key={cliente.nombre} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{cliente.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {cliente.pedidos} pedidos • {cliente.ruta}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${cliente.ventas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant={cliente.categoria === "Premium" ? "default" : "secondary"} className="text-xs">
                      {cliente.categoria}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clientes por Ruta */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Distribución por Ruta
            </CardTitle>
            <CardDescription>Análisis de clientes por zona de distribución</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientesPorRuta.map((ruta) => (
                <div key={ruta.ruta} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{ruta.ruta}</p>
                      <p className="text-xs text-muted-foreground">
                        {ruta.activos}/{ruta.clientes} activos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${ruta.ventas.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((ruta.activos / ruta.clientes) * 100).toFixed(1)}% activos
                      </p>
                    </div>
                  </div>
                  <Progress value={(ruta.activos / ruta.clientes) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segmentación de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Segmentación de Clientes
          </CardTitle>
          <CardDescription>Clasificación de clientes por volumen de compras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segmentacionClientes.map((segmento) => (
              <div key={segmento.categoria} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{segmento.categoria}</h3>
                  <Badge
                    variant={
                      segmento.categoria === "Premium"
                        ? "default"
                        : segmento.categoria === "Regular"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {segmento.porcentaje}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cantidad:</span>
                    <span className="font-medium">{segmento.cantidad} clientes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ventas promedio:</span>
                    <span className="font-medium">
                      ${segmento.ventasPromedio.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Progress value={segmento.porcentaje} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>Clientes con compras en los últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClientes.slice(0, 3).map((cliente) => (
                <div key={cliente.nombre} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{cliente.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      Última compra: {new Date(cliente.ultimaCompra).toLocaleDateString("es-MX")}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Activo
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Oportunidades de Crecimiento
            </CardTitle>
            <CardDescription>Clientes con potencial de incrementar compras</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium">Clientes Regulares → Premium</p>
                <p className="text-sm text-muted-foreground">8 clientes cerca del umbral premium</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium">Reactivar Clientes Inactivos</p>
                <p className="text-sm text-muted-foreground">13 clientes sin compras en 15+ días</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-medium">Expandir en Rutas Exitosas</p>
                <p className="text-sm text-muted-foreground">Potencial para 5+ nuevos clientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
