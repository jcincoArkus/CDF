"use client"

import { Plus, Minus, RotateCcw, History, User, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
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

interface HistorialMovimientosDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: InventarioItem | null
  movimientos: MovimientoItem[]
}

const tipoMovimientoConfig = {
  entrada: {
    icon: Plus,
    color: "bg-green-100 text-green-800 border-green-200",
    text: "Entrada",
  },
  salida: {
    icon: Minus,
    color: "bg-red-100 text-red-800 border-red-200",
    text: "Salida",
  },
  ajuste: {
    icon: RotateCcw,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    text: "Ajuste",
  },
}

export function HistorialMovimientosDialog({
  open,
  onOpenChange,
  producto,
  movimientos,
}: HistorialMovimientosDialogProps) {
  if (!producto) return null

  // Ordenar movimientos por fecha (más reciente primero)
  const movimientosOrdenados = [...movimientos].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historial de Movimientos
          </DialogTitle>
          <DialogDescription>Historial completo de movimientos para {producto.producto_nombre}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del producto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{producto.producto_nombre}</h4>
              <Badge variant="outline" className="font-mono">
                {producto.sku}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Stock actual: <span className="font-bold text-foreground">{producto.cantidad}</span> unidades
            </div>
          </div>

          {/* Lista de movimientos */}
          <div>
            <h4 className="font-medium mb-3">Movimientos Recientes ({movimientosOrdenados.length})</h4>

            {movimientosOrdenados.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay movimientos registrados para este producto</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {movimientosOrdenados.map((movimiento, index) => {
                    const config = tipoMovimientoConfig[movimiento.tipo_movimiento]
                    const Icon = config.icon

                    return (
                      <div key={movimiento.id}>
                        <div className="flex items-start gap-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className={`p-2 rounded-full ${config.color}`}>
                              <Icon className="h-4 w-4" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className={config.color}>{config.text}</Badge>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(movimiento.fecha).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm">{movimiento.motivo}</p>

                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Cantidad:</span>
                                  <span className="font-medium">
                                    {movimiento.tipo_movimiento === "ajuste"
                                      ? `${movimiento.cantidad_anterior} → ${movimiento.cantidad_nueva}`
                                      : `${movimiento.tipo_movimiento === "entrada" ? "+" : "-"}${movimiento.cantidad}`}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-muted-foreground">Stock resultante:</span>
                                  <span className="font-bold">{movimiento.cantidad_nueva}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>Por: {movimiento.usuario_nombre}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {index < movimientosOrdenados.length - 1 && <Separator className="my-2" />}
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
