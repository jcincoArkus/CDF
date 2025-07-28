"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Navigation, Users, Clock, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

interface RutaData {
  id: string
  nombre: string
  tipo: string
  vendedor_nombre: string
  progreso: number
  estado: string
  total_clientes: number
  clientes_visitados: number
  tiempo_promedio: number
  eficiencia: number
}

interface ReporteRutasProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    vendedor: string
    ruta: string
  }
}

export function ReporteRutas({ filtros }: ReporteRutasProps) {
  // Datos mock para demostración
  const rutasData: RutaData[] = [
    {
      id: "1",
      nombre: "Ruta Centro Preventa",
      tipo: "Preventa",
      vendedor_nombre: "Carlos Mendoza",
      progreso: 85,
      estado: "activa",
      total_clientes: 25,
      clientes_visitados: 21,
      tiempo_promedio: 45,
      eficiencia: 92,
    },
    {
      id: "2",
      nombre: "Ruta Norte Reparto",
      tipo: "Reparto",
      vendedor_nombre: "Ana García",
      progreso: 70,
      estado: "activa",
      total_clientes: 18,
      clientes_visitados: 13,
      tiempo_promedio: 38,
      eficiencia: 78,
    },
    {
      id: "3",
      nombre: "Ruta Industrial Convencional",
      tipo: "Convencional",
      vendedor_nombre: "Luis Rodríguez",
      progreso: 100,
      estado: "completada",
      total_clientes: 15,
      clientes_visitados: 15,
      tiempo_promedio: 52,
      eficiencia: 95,
    },
  ]

  const promedioEficiencia = rutasData.reduce((sum, ruta) => sum + ruta.eficiencia, 0) / rutasData.length
  const totalClientesVisitados = rutasData.reduce((sum, ruta) => sum + ruta.clientes_visitados, 0)
  const totalClientes = rutasData.reduce((sum, ruta) => sum + ruta.total_clientes, 0)
  const rutasCompletadas = rutasData.filter((ruta) => ruta.estado === "completada").length

  return (
    <div className="space-y-6">
      {/* Métricas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedioEficiencia.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Visitados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClientesVisitados}</div>
            <p className="text-xs text-muted-foreground">de {totalClientes} programados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rutas Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutasCompletadas}</div>
            <p className="text-xs text-muted-foreground">de {rutasData.length} rutas activas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(rutasData.reduce((sum, ruta) => sum + ruta.tiempo_promedio, 0) / rutasData.length)} min
            </div>
            <p className="text-xs text-muted-foreground">por cliente visitado</p>
          </CardContent>
        </Card>
      </div>

      {/* Detalle de Rutas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Navigation className="h-5 w-5 mr-2" />
            Detalle de Rutas
          </CardTitle>
          <CardDescription>Análisis detallado del rendimiento por ruta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rutasData.map((ruta) => (
              <div key={ruta.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{ruta.nombre}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ruta.vendedor_nombre} • {ruta.tipo}
                    </p>
                  </div>
                  <Badge variant={ruta.estado === "completada" ? "default" : "secondary"}>
                    {ruta.estado === "completada" ? "Completada" : "En Progreso"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Progreso</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Progress value={ruta.progreso} className="flex-1" />
                      <span className="font-medium">{ruta.progreso}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Clientes</p>
                    <p className="font-medium">
                      {ruta.clientes_visitados}/{ruta.total_clientes}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Tiempo Promedio</p>
                    <p className="font-medium">{ruta.tiempo_promedio} min</p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Eficiencia</p>
                    <div className="flex items-center">
                      <span className="font-medium">{ruta.eficiencia}%</span>
                      {ruta.eficiencia >= 90 ? (
                        <CheckCircle className="h-4 w-4 text-green-500 ml-1" />
                      ) : ruta.eficiencia >= 70 ? (
                        <Clock className="h-4 w-4 text-yellow-500 ml-1" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Recomendaciones */}
                {ruta.eficiencia < 80 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                    <div className="flex items-start">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Recomendación de Optimización</p>
                        <p className="text-yellow-700 mt-1">
                          Esta ruta presenta oportunidades de mejora. Considera revisar la secuencia de visitas o el
                          tiempo asignado por cliente.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis de Rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo de Ruta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Preventa", "Reparto", "Convencional"].map((tipo) => {
                const rutasTipo = rutasData.filter((r) => r.tipo === tipo)
                const porcentaje = (rutasTipo.length / rutasData.length) * 100
                return (
                  <div key={tipo} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tipo}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={porcentaje} className="w-20" />
                      <span className="text-sm text-muted-foreground w-12">{porcentaje.toFixed(0)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Alerta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                  <span className="text-sm">Rutas con alta eficiencia (≥90%)</span>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  {rutasData.filter((r) => r.eficiencia >= 90).length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-md">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                  <span className="text-sm">Rutas con eficiencia media (70-89%)</span>
                </div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {rutasData.filter((r) => r.eficiencia >= 70 && r.eficiencia < 90).length}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-sm">Rutas que requieren atención (&lt;70%)</span>
                </div>
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  {rutasData.filter((r) => r.eficiencia < 70).length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
