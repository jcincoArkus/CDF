"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, AlertTriangle, TrendingUp, BarChart3, CheckCircle, Clock } from "lucide-react"

interface ReporteInventarioProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    vendedor: string
    ruta: string
  }
}

export function ReporteInventario({ filtros }: ReporteInventarioProps) {
  // Datos mock para demostración
  const inventarioData = {
    totalProductos: 156,
    stockTotal: 2847,
    valorInventario: 68420.5,
    rotacionPromedio: 4.2,
    productosStockBajo: 8,
    productosAgotados: 2,
  }

  const productosStockBajo = [
    {
      nombre: "Galletas Marías 200g",
      sku: "MAR-200",
      stockActual: 8,
      stockMinimo: 15,
      categoria: "Galletas",
      valorStock: 180.0,
      estado: "crítico",
    },
    {
      nombre: "Leche Lala 1L",
      sku: "LAL-1L",
      stockActual: 12,
      stockMinimo: 25,
      categoria: "Lácteos",
      valorStock: 288.0,
      estado: "bajo",
    },
    {
      nombre: "Pan Bimbo Blanco",
      sku: "BIM-BLA",
      stockActual: 18,
      stockMinimo: 30,
      categoria: "Panadería",
      valorStock: 432.0,
      estado: "bajo",
    },
    {
      nombre: "Yogurt Danone 1L",
      sku: "DAN-1L",
      stockActual: 6,
      stockMinimo: 20,
      categoria: "Lácteos",
      valorStock: 156.0,
      estado: "crítico",
    },
  ]

  const rotacionProductos = [
    {
      nombre: "Coca-Cola 600ml",
      categoria: "Bebidas",
      stockActual: 150,
      vendidosUltimos30: 89,
      rotacion: 5.9,
      tendencia: "alta",
    },
    {
      nombre: "Sabritas Original 45g",
      categoria: "Botanas",
      stockActual: 200,
      vendidosUltimos30: 76,
      rotacion: 3.8,
      tendencia: "media",
    },
    {
      nombre: "Agua Bonafont 1L",
      categoria: "Bebidas",
      stockActual: 300,
      vendidosUltimos30: 145,
      rotacion: 4.8,
      tendencia: "alta",
    },
    {
      nombre: "Galletas Emperador",
      categoria: "Galletas",
      stockActual: 45,
      vendidosUltimos30: 12,
      rotacion: 2.7,
      tendencia: "baja",
    },
  ]

  const inventarioPorCategoria = [
    { categoria: "Bebidas", productos: 45, stock: 890, valor: 18450.5, porcentaje: 27.0 },
    { categoria: "Botanas", productos: 32, stock: 650, valor: 15230.25, porcentaje: 22.3 },
    { categoria: "Lácteos", productos: 28, stock: 420, valor: 12890.0, porcentaje: 18.8 },
    { categoria: "Galletas", productos: 25, stock: 380, valor: 9650.75, porcentaje: 14.1 },
    { categoria: "Panadería", productos: 26, stock: 507, valor: 12199.0, porcentaje: 17.8 },
  ]

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventarioData.totalProductos}</div>
            <p className="text-xs text-muted-foreground">
              {inventarioData.stockTotal.toLocaleString()} unidades en stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventarioData.valorInventario.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +5.2% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rotación Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventarioData.rotacionPromedio}x</div>
            <p className="text-xs text-muted-foreground">Veces por mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas de Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inventarioData.productosStockBajo}</div>
            <p className="text-xs text-muted-foreground">{inventarioData.productosAgotados} productos agotados</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productos con Stock Bajo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Productos con Stock Bajo
            </CardTitle>
            <CardDescription>Productos que requieren reabastecimiento urgente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosStockBajo.map((producto) => (
                <div
                  key={producto.sku}
                  className={`border rounded-lg p-3 ${
                    producto.estado === "crítico" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">
                        {producto.sku} • {producto.categoria}
                      </p>
                    </div>
                    <Badge variant={producto.estado === "crítico" ? "destructive" : "secondary"} className="text-xs">
                      {producto.estado === "crítico" ? "Crítico" : "Bajo"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Stock Actual</p>
                      <p className="font-medium">{producto.stockActual}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stock Mínimo</p>
                      <p className="font-medium">{producto.stockMinimo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Valor</p>
                      <p className="font-medium">
                        ${producto.valorStock.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <Progress
                      value={(producto.stockActual / producto.stockMinimo) * 100}
                      className={`h-2 ${producto.estado === "crítico" ? "bg-red-100" : "bg-orange-100"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análisis de Rotación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Análisis de Rotación
            </CardTitle>
            <CardDescription>Productos por velocidad de rotación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rotacionProductos.map((producto) => (
                <div key={producto.nombre} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{producto.nombre}</p>
                      <p className="text-xs text-muted-foreground">{producto.categoria}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          producto.tendencia === "alta"
                            ? "default"
                            : producto.tendencia === "media"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {producto.tendencia === "alta" ? "Alta" : producto.tendencia === "media" ? "Media" : "Baja"}
                      </Badge>
                      {producto.tendencia === "alta" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : producto.tendencia === "media" ? (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">{producto.stockActual}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Vendidos (30d)</p>
                      <p className="font-medium">{producto.vendidosUltimos30}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rotación</p>
                      <p className="font-medium">{producto.rotacion}x</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventario por Categoría */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Inventario por Categoría
          </CardTitle>
          <CardDescription>Distribución del inventario por tipo de producto</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventarioPorCategoria.map((categoria) => (
              <div key={categoria.categoria} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{categoria.categoria}</h3>
                  <Badge variant="outline">{categoria.porcentaje}% del total</Badge>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Productos</p>
                    <p className="font-medium">{categoria.productos}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stock Total</p>
                    <p className="font-medium">{categoria.stock.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valor</p>
                    <p className="font-medium">
                      ${categoria.valor.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Promedio/Producto</p>
                    <p className="font-medium">
                      ${(categoria.valor / categoria.productos).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <Progress value={categoria.porcentaje} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Productos Exitosos
            </CardTitle>
            <CardDescription>Productos con alta rotación y buen margen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Coca-Cola 600ml</p>
                  <p className="text-sm text-green-600">Rotación: 5.9x • Alta demanda</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Aumentar stock</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-800">Agua Bonafont 1L</p>
                  <p className="text-sm text-green-600">Rotación: 4.8x • Estable</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Mantener nivel</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Acciones Requeridas
            </CardTitle>
            <CardDescription>Productos que necesitan atención inmediata</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-red-500 pl-4">
                <p className="font-medium text-red-800">Reabastecimiento Urgente</p>
                <p className="text-sm text-red-600">4 productos en estado crítico</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-medium text-orange-800">Revisar Rotación Baja</p>
                <p className="text-sm text-orange-600">3 productos con rotación menor a 3x</p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-blue-800">Optimizar Categorías</p>
                <p className="text-sm text-blue-600">Balancear inventario por demanda</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
