"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Minus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

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

interface MovimientoInventarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: InventarioItem | null
  tipoMovimiento: "entrada" | "salida" | "ajuste"
  onSuccess: () => void
}

const tipoMovimientoConfig = {
  entrada: {
    title: "Entrada de Inventario",
    description: "Agregar productos al inventario",
    icon: Plus,
    color: "bg-green-100 text-green-800 border-green-200",
    buttonText: "Registrar Entrada",
  },
  salida: {
    title: "Salida de Inventario",
    description: "Retirar productos del inventario",
    icon: Minus,
    color: "bg-red-100 text-red-800 border-red-200",
    buttonText: "Registrar Salida",
  },
  ajuste: {
    title: "Ajuste de Inventario",
    description: "Ajustar cantidad exacta en inventario",
    icon: RotateCcw,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    buttonText: "Registrar Ajuste",
  },
}

export function MovimientoInventarioDialog({
  open,
  onOpenChange,
  producto,
  tipoMovimiento,
  onSuccess,
}: MovimientoInventarioDialogProps) {
  const [cantidad, setCantidad] = useState("")
  const [motivo, setMotivo] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const config = tipoMovimientoConfig[tipoMovimiento]
  const Icon = config.icon

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!producto || !cantidad || !motivo) return

    setLoading(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const cantidadNum = Number.parseInt(cantidad)
      let nuevaCantidad = producto.cantidad

      if (tipoMovimiento === "entrada") {
        nuevaCantidad = producto.cantidad + cantidadNum
      } else if (tipoMovimiento === "salida") {
        nuevaCantidad = producto.cantidad - cantidadNum
        if (nuevaCantidad < 0) {
          throw new Error("No hay suficiente stock disponible")
        }
      } else if (tipoMovimiento === "ajuste") {
        nuevaCantidad = cantidadNum
      }

      toast({
        title: "Movimiento registrado",
        description: `${config.buttonText} exitoso para ${producto.producto_nombre}`,
      })

      onSuccess()
      onOpenChange(false)
      setCantidad("")
      setMotivo("")
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al registrar movimiento",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const calcularNuevaCantidad = () => {
    if (!producto || !cantidad) return producto?.cantidad || 0

    const cantidadNum = Number.parseInt(cantidad) || 0

    if (tipoMovimiento === "entrada") {
      return producto.cantidad + cantidadNum
    } else if (tipoMovimiento === "salida") {
      return Math.max(0, producto.cantidad - cantidadNum)
    } else if (tipoMovimiento === "ajuste") {
      return cantidadNum
    }

    return producto.cantidad
  }

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del producto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{producto.producto_nombre}</h4>
              <Badge className={config.color}>{tipoMovimiento.toUpperCase()}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-mono">{producto.sku}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock Actual:</span>
                <span className="ml-2 font-bold">{producto.cantidad}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock Mín:</span>
                <span className="ml-2">{producto.stock_minimo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock Máx:</span>
                <span className="ml-2">{producto.stock_maximo}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cantidad">{tipoMovimiento === "ajuste" ? "Cantidad Final" : "Cantidad"}</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                placeholder={tipoMovimiento === "ajuste" ? "Cantidad exacta en inventario" : "Cantidad a mover"}
                required
              />
              {cantidad && (
                <p className="text-sm text-muted-foreground mt-1">
                  Nueva cantidad: <span className="font-bold">{calcularNuevaCantidad()}</span>
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="motivo">Motivo</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Describe el motivo del movimiento..."
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Procesando..." : config.buttonText}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
