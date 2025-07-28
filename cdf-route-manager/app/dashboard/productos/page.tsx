"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Package, AlertTriangle, TrendingUp, Eye, Edit } from "lucide-react"
import { getProductos, getInventarios } from "@/lib/db"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NuevoProductoDialog } from "@/components/productos/nuevo-producto-dialog"
import { EditarProductoDialog } from "@/components/productos/editar-producto-dialog"
import { DetalleProductoDialog } from "@/components/productos/detalle-producto-dialog"
import { useToast } from "@/hooks/use-toast"

interface ProductoConStock {
  id: number
  nombre: string
  sku: string
  categoria: string
  precio: number
  tipo_producto: string
  activo: boolean
  created_at: string
  stock: number
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<ProductoConStock[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroStock, setFiltroStock] = useState("todos")

  // Estados para dialogs
  const [showNuevoProducto, setShowNuevoProducto] = useState(false)
  const [showEditarProducto, setShowEditarProducto] = useState(false)
  const [showDetalleProducto, setShowDetalleProducto] = useState(false)
  const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    loadProductos()
  }, [])

  const loadProductos = async () => {
    try {
      setLoading(true)
      const [productosData, inventarios] = await Promise.all([getProductos(), getInventarios()])

      // Combinar productos con su stock del inventario
      const productosConStock: ProductoConStock[] = productosData.map((producto: any) => {
        const inventario = inventarios.find((i: any) => i.producto_id === producto.id)
        return {
          ...producto,
          stock: inventario?.cantidad || 0,
        }
      })

      setProductos(productosConStock)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategoria = filtroCategoria === "todas" || producto.categoria === filtroCategoria

    const matchesStock =
      filtroStock === "todos" ||
      (filtroStock === "sin-stock" && producto.stock === 0) ||
      (filtroStock === "bajo-stock" && producto.stock > 0 && producto.stock <= 20) ||
      (filtroStock === "en-stock" && producto.stock > 20)

    return matchesSearch && matchesCategoria && matchesStock
  })

  // Calcular estadísticas
  const totalProductos = productos.length
  const productosActivos = productos.filter((p) => p.activo).length
  const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0)
  const valorInventario = productos.reduce((sum, p) => sum + p.stock * p.precio, 0)
  const productosSinStock = productos.filter((p) => p.stock === 0).length
  const productosBajoStock = productos.filter((p) => p.stock > 0 && p.stock <= 20).length

  // Obtener categorías únicas
  const categorias = [...new Set(productos.map((p) => p.categoria))]

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Sin Stock</Badge>
    } else if (stock <= 20) {
      return <Badge variant="secondary">Stock Bajo</Badge>
    } else {
      return <Badge variant="default">En Stock</Badge>
    }
  }

  const handleProductoCreado = () => {
    toast({
      title: "¡Producto creado exitosamente!",
      description: "El producto ha sido registrado correctamente",
    })
    loadProductos()
  }

  const handleProductoActualizado = () => {
    toast({
      title: "¡Producto actualizado exitosamente!",
      description: "Los datos del producto han sido actualizados",
    })
    loadProductos()
  }

  const handleEditarProducto = (productoId: number) => {
    setProductoSeleccionado(productoId)
    setShowEditarProducto(true)
  }

  const handleVerProducto = (productoId: number) => {
    setProductoSeleccionado(productoId)
    setShowDetalleProducto(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra tu catálogo de productos e inventario</p>
        </div>
        <Button onClick={() => setShowNuevoProducto(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
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
            <p className="text-xs text-muted-foreground">{productosActivos} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unidades disponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${valorInventario.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Valor total del stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{productosSinStock + productosBajoStock}</div>
            <p className="text-xs text-muted-foreground">
              {productosSinStock} sin stock, {productosBajoStock} bajo stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre, SKU o categoría..."
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
            <SelectItem value="en-stock">En Stock</SelectItem>
            <SelectItem value="bajo-stock">Stock Bajo</SelectItem>
            <SelectItem value="sin-stock">Sin Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catálogo de Productos</CardTitle>
          <CardDescription>
            {productosFiltrados.length} de {totalProductos} productos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Valor Stock</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosFiltrados.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell className="font-mono text-sm">{producto.sku}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{producto.nombre}</div>
                      <div className="text-sm text-muted-foreground">{producto.tipo_producto}</div>
                    </div>
                  </TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>${producto.precio.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="font-bold text-lg">{producto.stock}</div>
                  </TableCell>
                  <TableCell>{getStockBadge(producto.stock)}</TableCell>
                  <TableCell>${(producto.stock * producto.precio).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleVerProducto(producto.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditarProducto(producto.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {productosFiltrados.length === 0 && (
            <div className="text-center py-8">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filtroCategoria !== "todas" || filtroStock !== "todos"
                  ? "No se encontraron productos con los filtros aplicados."
                  : "Comienza agregando tu primer producto."}
              </p>
              {!searchTerm && filtroCategoria === "todas" && filtroStock === "todos" && (
                <div className="mt-6">
                  <Button onClick={() => setShowNuevoProducto(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Producto
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <NuevoProductoDialog
        open={showNuevoProducto}
        onOpenChange={setShowNuevoProducto}
        onProductoCreado={handleProductoCreado}
      />

      <EditarProductoDialog
        open={showEditarProducto}
        onOpenChange={setShowEditarProducto}
        productoId={productoSeleccionado}
        onProductoActualizado={handleProductoActualizado}
      />

      <DetalleProductoDialog
        open={showDetalleProducto}
        onOpenChange={setShowDetalleProducto}
        productoId={productoSeleccionado}
        onEditarProducto={handleEditarProducto}
      />
    </div>
  )
}
