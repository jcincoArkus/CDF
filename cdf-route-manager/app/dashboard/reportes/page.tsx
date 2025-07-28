"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Users, Package, Navigation, Download, Filter } from "lucide-react"
import { ReporteVentas } from "@/components/reportes/reporte-ventas"
import { ReporteClientes } from "@/components/reportes/reporte-clientes"
import { ReporteInventario } from "@/components/reportes/reporte-inventario"
import { ReporteRutas } from "@/components/reportes/reporte-rutas"
import { FiltrosReporte } from "@/components/reportes/filtros-reporte"
import { ExportarModal } from "@/components/reportes/exportar-modal"

export default function ReportesPage() {
  const [filtros, setFiltros] = useState({
    fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 30 días atrás
    fechaFin: new Date().toISOString().split("T")[0], // Hoy
    vendedor: "",
    ruta: "",
    cliente: "",
  })

  const [mostrarFiltros, setMostrarFiltros] = useState(false)
  const [mostrarExportar, setMostrarExportar] = useState(false)
  const [tabActiva, setTabActiva] = useState("dashboard")

  // Datos mock para el dashboard general
  const metricsGenerales = {
    ventasTotal: 125430.5,
    ventasVariacion: 12.5,
    pedidosTotal: 342,
    pedidosVariacion: 8.2,
    clientesActivos: 89,
    clientesVariacion: 5.1,
    productosVendidos: 1247,
    productosVariacion: -2.3,
  }

  const handleFiltrosChange = (nuevosFiltros: typeof filtros) => {
    setFiltros(nuevosFiltros)
  }

  const handleExportar = (tipo: string, formato: string) => {
    console.log(`Exportando ${tipo} en formato ${formato}`)
    // Aquí iría la lógica de exportación
    setMostrarExportar(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Analytics</h1>
          <p className="text-gray-600">Análisis detallado del rendimiento de tu negocio</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setMostrarFiltros(!mostrarFiltros)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button onClick={() => setMostrarExportar(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {mostrarFiltros && (
        <Card>
          <CardHeader>
            <CardTitle>Filtros de Reporte</CardTitle>
            <CardDescription>Personaliza el período y criterios para tus reportes</CardDescription>
          </CardHeader>
          <CardContent>
            <FiltrosReporte filtros={filtros} onFiltrosChange={handleFiltrosChange} />
          </CardContent>
        </Card>
      )}

      {/* Período Seleccionado */}
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <span>Período:</span>
        <Badge variant="outline">
          {new Date(filtros.fechaInicio).toLocaleDateString()} - {new Date(filtros.fechaFin).toLocaleDateString()}
        </Badge>
        {filtros.vendedor && <Badge variant="outline">Vendedor: {filtros.vendedor}</Badge>}
        {filtros.ruta && <Badge variant="outline">Ruta: {filtros.ruta}</Badge>}
        {filtros.cliente && <Badge variant="outline">Cliente: {filtros.cliente}</Badge>}
      </div>

      {/* Tabs de Reportes */}
      <Tabs value={tabActiva} onValueChange={setTabActiva} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="ventas" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Ventas</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="inventario" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>Inventario</span>
          </TabsTrigger>
          <TabsTrigger value="rutas" className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Rutas</span>
          </TabsTrigger>
        </TabsList>

        {/* Dashboard General */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${metricsGenerales.ventasTotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />+{metricsGenerales.ventasVariacion}% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Procesados</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsGenerales.pedidosTotal.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />+{metricsGenerales.pedidosVariacion}% vs período
                  anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsGenerales.clientesActivos}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />+{metricsGenerales.clientesVariacion}% vs período
                  anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metricsGenerales.productosVendidos.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {metricsGenerales.productosVariacion > 0 ? "+" : ""}
                  {metricsGenerales.productosVariacion}% vs período anterior
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Ejecutivo</CardTitle>
                <CardDescription>Principales indicadores del período seleccionado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Crecimiento en Ventas</p>
                    <p className="text-sm text-green-600">Incremento sostenido del 12.5%</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Excelente</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">Nuevos Clientes</p>
                    <p className="text-sm text-blue-600">5 nuevos clientes este período</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Bueno</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-yellow-800">Eficiencia de Rutas</p>
                    <p className="text-sm text-yellow-600">Oportunidad de optimización</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Mejorable</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Recomendadas</CardTitle>
                <CardDescription>Sugerencias basadas en el análisis de datos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">Optimizar Rutas de Distribución</p>
                  <p className="text-sm text-muted-foreground">
                    Revisar secuencia de visitas en rutas con eficiencia menor al 80%
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">Expandir Productos Exitosos</p>
                  <p className="text-sm text-muted-foreground">Aumentar stock de productos con alta rotación</p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="font-medium">Seguimiento a Clientes Inactivos</p>
                  <p className="text-sm text-muted-foreground">Contactar clientes sin pedidos en los últimos 15 días</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reportes Específicos */}
        <TabsContent value="ventas">
          <ReporteVentas filtros={filtros} />
        </TabsContent>

        <TabsContent value="clientes">
          <ReporteClientes filtros={filtros} />
        </TabsContent>

        <TabsContent value="inventario">
          <ReporteInventario filtros={filtros} />
        </TabsContent>

        <TabsContent value="rutas">
          <ReporteRutas filtros={filtros} />
        </TabsContent>
      </Tabs>

      {/* Modal de Exportar */}
      {mostrarExportar && (
        <ExportarModal
          isOpen={mostrarExportar}
          onClose={() => setMostrarExportar(false)}
          onExport={handleExportar}
          tipoReporte={tabActiva}
        />
      )}
    </div>
  )
}
