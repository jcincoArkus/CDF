"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  Minus,
  RotateCcw,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Search,
  Eye,
  Edit,
  History,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { MovimientoInventarioDialog } from "@/components/inventario/movimiento-inventario-dialog"
import { DetalleInventarioDialog } from "@/components/inventario/detalle-inventario-dialog"
import { EditarStockDialog } from "@/components/inventario/editar-stock-dialog"
import { HistorialMovimientosDialog } from "@/components/inventario/historial-movimientos-dialog"

interface InventarioItem {
  id: number
  producto_id: number
  cantidad: number
  ubicacion: string
  stock_minimo: number
  stock_maximo: number
  updated_at: string
  producto_nombre: string
  sku: string
  categoria: string
  precio: number
  tipo_producto: string
}

interface MovimientoItem {
  id: number
  producto_id: number
  tipo_movimiento: "entrada" | "salida" | "ajuste"
  cantidad: number
  cantidad_anterior: number
  cantidad_nueva: number
  motivo: string
  usuario_id: number
  fecha: string
  producto_nombre: string
  sku: string
  usuario_nombre: string
}

const tipoMovimientoColors = {
  entrada: "bg-green-100 text-green-800 border-green-200",
  salida: "bg-red-100 text-red-800 border-red-200",
  ajuste: "bg-blue-100 text-blue-800 border-blue-200",
}

const tipoMovimientoIcons = {
  entrada: Plus,
  salida: Minus,
  ajuste: RotateCcw,
}

export default function InventarioPage() {
  const [inventarios, setInventarios] = useState<InventarioItem[]>([])
  const [movimientos, setMovimientos] = useState<MovimientoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroStock, setFiltroStock] = useState("todos")

  // Estados para dialogs
  const [movimientoDialogOpen, setMovimientoDialogOpen] = useState(false)
  const [detalleDialogOpen, setDetalleDialogOpen] = useState(false)
  const [editarStockDialogOpen, setEditarStockDialogOpen] = useState(false)
  const [historialDialogOpen, setHistorialDialogOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<InventarioItem | null>(null)
  const [tipoMovimiento, setTipoMovimiento] = useState<"entrada" | "salida" | "ajuste">("entrada")

  const { toast } = useToast()

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      // Simular carga de datos
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Datos de inventario simulados
      const inventarioData: InventarioItem[] = [
        {
          id: 1,
          producto_id: 1,
          cantidad: 150,
          ubicacion: "Almacén Principal",
          stock_minimo: 20,
          stock_maximo: 500,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Coca Cola 600ml",
          sku: "CC600",
          categoria: "Bebidas",
          precio: 15.5,
          tipo_producto: "Bebida",
        },
        {
          id: 2,
          producto_id: 2,
          cantidad: 192,
          ubicacion: "Almacén Principal",
          stock_minimo: 30,
          stock_maximo: 400,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Sabritas Original",
          sku: "SAB001",
          categoria: "Snacks",
          precio: 18.0,
          tipo_producto: "Snack",
        },
        {
          id: 3,
          producto_id: 3,
          cantidad: 288,
          ubicacion: "Almacén Principal",
          stock_minimo: 50,
          stock_maximo: 600,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Agua Bonafont 1L",
          sku: "BON1L",
          categoria: "Bebidas",
          precio: 12.0,
          tipo_producto: "Bebida",
        },
        {
          id: 4,
          producto_id: 4,
          cantidad: 15,
          ubicacion: "Almacén Principal",
          stock_minimo: 25,
          stock_maximo: 350,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Doritos Nacho",
          sku: "DOR001",
          categoria: "Snacks",
          precio: 22.0,
          tipo_producto: "Snack",
        },
        {
          id: 5,
          producto_id: 5,
          cantidad: 8,
          ubicacion: "Almacén Principal",
          stock_minimo: 20,
          stock_maximo: 400,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Pepsi 600ml",
          sku: "PEP600",
          categoria: "Bebidas",
          precio: 15.0,
          tipo_producto: "Bebida",
        },
        {
          id: 6,
          producto_id: 6,
          cantidad: 204,
          ubicacion: "Almacén Principal",
          stock_minimo: 30,
          stock_maximo: 300,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Cheetos Flamin Hot",
          sku: "CHE001",
          categoria: "Snacks",
          precio: 20.0,
          tipo_producto: "Snack",
        },
        {
          id: 7,
          producto_id: 7,
          cantidad: 180,
          ubicacion: "Almacén Principal",
          stock_minimo: 20,
          stock_maximo: 400,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Sprite 600ml",
          sku: "SPR600",
          categoria: "Bebidas",
          precio: 15.0,
          tipo_producto: "Bebida",
        },
        {
          id: 8,
          producto_id: 8,
          cantidad: 229,
          ubicacion: "Almacén Principal",
          stock_minimo: 25,
          stock_maximo: 350,
          updated_at: "2024-01-21T12:00:00Z",
          producto_nombre: "Ruffles Original",
          sku: "RUF001",
          categoria: "Snacks",
          precio: 19.0,
          tipo_producto: "Snack",
        },
      ]

      // Datos de movimientos simulados
      const movimientosData: MovimientoItem[] = [
        {
          id: 1,
          producto_id: 1,
          tipo_movimiento: "entrada",
          cantidad: 100,
          cantidad_anterior: 50,
          cantidad_nueva: 150,
          motivo: "Restock semanal",
          usuario_id: 1,
          fecha: "2024-01-10T08:00:00Z",
          producto_nombre: "Coca Cola 600ml",
          sku: "CC600",
          usuario_nombre: "Juan Pérez",
        },
        {
          id: 2,
          producto_id: 1,
          tipo_movimiento: "salida",
          cantidad: 10,
          cantidad_anterior: 150,
          cantidad_nueva: 140,
          motivo: "Venta pedido #1",
          usuario_id: 2,
          fecha: "2024-01-15T10:30:00Z",
          producto_nombre: "Coca Cola 600ml",
          sku: "CC600",
          usuario_nombre: "María García",
        },
        {
          id: 3,
          producto_id: 4,
          tipo_movimiento: "salida",
          cantidad: 35,
          cantidad_anterior: 50,
          cantidad_nueva: 15,
          motivo: "Ventas múltiples",
          usuario_id: 2,
          fecha: "2024-01-20T14:15:00Z",
          producto_nombre: "Doritos Nacho",
          sku: "DOR001",
          usuario_nombre: "María García",
        },
        {
          id: 4,
          producto_id: 5,
          tipo_movimiento: "salida",
          cantidad: 32,
          cantidad_anterior: 40,
          cantidad_nueva: 8,
          motivo: "Ventas múltiples",
          usuario_id: 2,
          fecha: "2024-01-20T16:30:00Z",
          producto_nombre: "Pepsi 600ml",
          sku: "PEP600",
          usuario_nombre: "María García",
        },
      ]

      setInventarios(inventarioData)
      setMovimientos(movimientosData)
    } catch (error) {
      console.error("Error cargando datos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del inventario",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar inventarios
  const inventariosFiltrados = inventarios.filter((item) => {
    const matchesSearch =
      item.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria = filtroCategoria === "todas" || item.categoria === filtroCategoria

    const matchesStock =
      filtroStock === "todos" ||
      (filtroStock === "bajo" && item.cantidad <= item.stock_minimo) ||
      (filtroStock === "normal" && item.cantidad > item.stock_minimo && item.cantidad < item.stock_maximo) ||
      (filtroStock === "alto" && item.cantidad >= item.stock_maximo)

    return matchesSearch && matchesCategoria && matchesStock
  })

  // Calcular estadísticas
  const totalProductos = inventarios.length
  const stockBajo = inventarios.filter((item) => item.cantidad <= item.stock_minimo).length
  const stockAlto = inventarios.filter((item) => item.cantidad >= item.stock_maximo).length
  const valorTotal = inventarios.reduce((sum, item) => sum + item.cantidad * item.precio, 0)

  const categorias = [...new Set(inventarios.map((item) => item.categoria))]

  const getStockStatus = (item: InventarioItem) => {
    if (item.cantidad <= item.stock_minimo) {
      return { status: "bajo", color: "bg-red-100 text-red-800 border-red-200", text: "Stock Bajo" }
    }
    if (item.cantidad >= item.stock_maximo) {
      return { status: "alto", color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Stock Alto" }
    }
    return { status: "normal", color: "bg-green-100 text-green-800 border-green-200", text: "Normal" }
  }

  const handleMovimiento = (producto: InventarioItem, tipo: "entrada" | "salida" | "ajuste") => {
    setSelectedProducto(producto)
    setTipoMovimiento(tipo)
    setMovimientoDialogOpen(true)
  }

  const handleVerDetalle = (producto: InventarioItem) => {
    setSelectedProducto(producto)
    setDetalleDialogOpen(true)
  }

  const handleEditarStock = (producto: InventarioItem) => {
    setSelectedProducto(producto)
    setEditarStockDialogOpen(true)
  }

  const handleVerHistorial = (producto: InventarioItem) => {
    setSelectedProducto(producto)
    setHistorialDialogOpen(true)
  }

  if (loading) {
    return <div>Cargando inventario...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">Gestiona el stock y movimientos de productos</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProductos}</div>
            <p className="text-xs text-muted-foreground">En catálogo activo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stockBajo}</div>
            <p className="text-xs text-muted-foreground">Requieren restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Alto</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stockAlto}</div>
            <p className="text-xs text-muted-foreground">Sobre stock máximo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Inventario valorizado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {categorias.map((categoria) => (
              <SelectItem key={categoria} value={categoria}>
                {categoria}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroStock} onValueChange={setFiltroStock}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="bajo">Stock Bajo</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="alto">Stock Alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Productos</CardTitle>
          <CardDescription>Lista completa del inventario con niveles de stock y acciones</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventariosFiltrados.map((item) => {
                const stockStatus = getStockStatus(item)
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.producto_nombre}</div>
                        <div className="text-sm text-muted-foreground">{item.ubicacion}</div>
                      </div>
                    </TableCell>
                    <TableCell>{item.categoria}</TableCell>
                    <TableCell>
                      <div className="font-bold text-lg">{item.cantidad}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Min: {item.stock_minimo}</div>
                        <div>Max: {item.stock_maximo}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
                    </TableCell>
                    <TableCell>${(item.cantidad * item.precio).toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" onClick={() => handleVerDetalle(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMovimiento(item, "entrada")}>
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMovimiento(item, "salida")}>
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditarStock(item)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleVerHistorial(item)}>
                          <History className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <MovimientoInventarioDialog
        open={movimientoDialogOpen}
        onOpenChange={setMovimientoDialogOpen}
        producto={selectedProducto}
        tipoMovimiento={tipoMovimiento}
        onSuccess={cargarDatos}
      />

      <DetalleInventarioDialog
        open={detalleDialogOpen}
        onOpenChange={setDetalleDialogOpen}
        producto={selectedProducto}
      />

      <EditarStockDialog
        open={editarStockDialogOpen}
        onOpenChange={setEditarStockDialogOpen}
        producto={selectedProducto}
        onSuccess={cargarDatos}
      />

      <HistorialMovimientosDialog
        open={historialDialogOpen}
        onOpenChange={setHistorialDialogOpen}
        producto={selectedProducto}
        movimientos={movimientos.filter((m) => m.producto_id === selectedProducto?.producto_id)}
      />
    </div>
  )
}
