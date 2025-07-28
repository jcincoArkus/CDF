"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Package, DollarSign, Hash, Calendar, Edit, Loader2, Tag, BarChart3 } from "lucide-react"
import { obtenerDetalleProducto, type ProductoDetalle } from "@/lib/actions/productos"

interface DetalleProductoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  productoId: number | null
  onEditarProducto?: (productoId: number) => void
}

export function DetalleProductoDialog({
  open,
  onOpenChange,
  productoId,
  onEditarProducto,
}: DetalleProductoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [producto, setProducto] = useState<ProductoDetalle | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && productoId) {
      loadProductoData()
    }
  }, [open, productoId])

  const loadProductoData = async () => {
    if (!productoId) return

    setLoading(true)
    setError(null)
    try {
      const productoData = await obtenerDetalleProducto(productoId)
      setProducto(productoData)
    } catch (error) {
      console.error("Error cargando datos del producto:", error)
      setError("No se pudieron cargar los datos del producto")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setProducto(null)
    setError(null)
    onOpenChange(false)
  }

  const handleEditar = () => {
    if (productoId) {
      onEditarProducto?.(productoId)
      handleClose()
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock > 50) return { label: "En Stock", variant: "default" as const, color: "text-green-600" }
    if (stock > 20) return { label: "Stock Bajo", variant: "secondary" as const, color: "text-yellow-600" }
    return { label: "Sin Stock", variant: "destructive" as const, color: "text-red-600" }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Cargando información del producto...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Package className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar producto</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={handleClose} variant="outline">
                Cerrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!producto) {
    return null
  }

  const stockStatus = getStockStatus(producto.stock_actual)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle del Producto
          </DialogTitle>
          <DialogDescription>Información completa de {producto.nombre}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <p className="text-lg font-semibold">{producto.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">SKU</label>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{producto.sku}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>{producto.categoria}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${producto.estado === "Activo" ? "bg-green-500" : "bg-red-500"}`}
                    ></div>
                    <span className={producto.estado === "Activo" ? "text-green-600" : "text-red-600"}>
                      {producto.estado}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Información Comercial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Precio de Venta</label>
                  <p className="text-2xl font-bold text-green-600">${producto.precio.toFixed(2)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock Actual</label>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{producto.stock_actual}</span>
                    <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Valor en Inventario</label>
                  <p className="text-lg font-semibold">${(producto.precio * producto.stock_actual).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Información de Fechas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Historial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">
                    {new Date(producto.created_at).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {producto.updated_at && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                    <p className="text-sm">
                      {new Date(producto.updated_at).toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Alertas de Stock */}
          {producto.stock_actual <= 20 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Package className="h-5 w-5" />
                  <div>
                    <h4 className="font-semibold">Alerta de Stock</h4>
                    <p className="text-sm">
                      {producto.stock_actual === 0
                        ? "Este producto está agotado. Considera reabastecer el inventario."
                        : "El stock está bajo. Considera reabastecer pronto para evitar desabasto."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de Acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose}>
              Cerrar
            </Button>
            <Button onClick={handleEditar} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Editar Producto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
