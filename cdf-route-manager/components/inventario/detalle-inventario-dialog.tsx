"use client"

import { Package, MapPin, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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

interface DetalleInventarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: InventarioItem | null
}

export function DetalleInventarioDialog({ open, onOpenChange, producto }: DetalleInventarioDialogProps) {
  if (!producto) return null

  const getStockStatus = () => {
    if (producto.cantidad <= producto.stock_minimo) {
      return { status: "bajo", color: "bg-red-100 text-red-800 border-red-200", text: "Stock Bajo" }
    }
    if (producto.cantidad >= producto.stock_maximo) {
      return { status: "alto", color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Stock Alto" }
    }
    return { status: "normal", color: "bg-green-100 text-green-800 border-green-200", text: "Normal" }
  }

  const stockStatus = getStockStatus()
  const valorTotal = producto.cantidad * producto.precio
  const porcentajeStock =
    ((producto.cantidad - producto.stock_minimo) / (producto.stock_maximo - producto.stock_minimo)) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detalle de Inventario
          </DialogTitle>
          <DialogDescription>Información completa del producto en inventario</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información básica del producto */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{producto.producto_nombre}</h3>
              <Badge className={stockStatus.color}>{stockStatus.text}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-mono font-medium">{producto.sku}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Categoría:</span>
                <span>{producto.categoria}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Tipo:</span>
                <span>{producto.tipo_producto}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{producto.ubicacion}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de stock */}
          <div>
            <h4 className="font-medium mb-3">Niveles de Stock</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stock Actual</span>
                <span className="text-2xl font-bold">{producto.cantidad}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Mínimo</div>
                    <div className="font-medium">{producto.stock_minimo}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Máximo</div>
                    <div className="font-medium">{producto.stock_maximo}</div>
                  </div>
                </div>
              </div>

              {/* Barra de progreso de stock */}
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Mín</span>
                  <span>{Math.round(porcentajeStock)}%</span>
                  <span>Máx</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      porcentajeStock < 20 ? "bg-red-500" : porcentajeStock > 80 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.max(0, Math.min(100, porcentajeStock))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información financiera */}
          <div>
            <h4 className="font-medium mb-3">Información Financiera</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Precio Unitario</div>
                  <div className="font-medium">${producto.precio.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                  <div className="font-bold text-lg">${valorTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de actualización */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Última actualización:{" "}
              {new Date(producto.updated_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
