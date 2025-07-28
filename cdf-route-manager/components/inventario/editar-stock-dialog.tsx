"use client"

import React from "react"

import { useState } from "react"
import { Edit, TrendingUp, TrendingDown } from "lucide-react"
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

interface EditarStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: InventarioItem | null
  onSuccess: () => void
}

export function EditarStockDialog({ open, onOpenChange, producto, onSuccess }: EditarStockDialogProps) {
  const [stockMinimo, setStockMinimo] = useState("")
  const [stockMaximo, setStockMaximo] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Inicializar valores cuando se abre el dialog
  React.useEffect(() => {
    if (producto && open) {
      setStockMinimo(producto.stock_minimo.toString())
      setStockMaximo(producto.stock_maximo.toString())
    }
  }, [producto, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!producto || !stockMinimo || !stockMaximo) return

    const minimo = Number.parseInt(stockMinimo)
    const maximo = Number.parseInt(stockMaximo)

    if (minimo >= maximo) {
      toast({
        title: "Error de validación",
        description: "El stock mínimo debe ser menor al stock máximo",
        variant: "destructive",
      })
      return
    }

    if (minimo < 0 || maximo < 0) {
      toast({
        title: "Error de validación",
        description: "Los valores de stock no pueden ser negativos",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simular API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Stock actualizado",
        description: `Niveles de stock actualizados para ${producto.producto_nombre}`,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar los niveles de stock",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!producto) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Editar Niveles de Stock
          </DialogTitle>
          <DialogDescription>Actualizar los niveles mínimo y máximo de stock</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Información del producto */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">{producto.producto_nombre}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-mono">{producto.sku}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock Actual:</span>
                <span className="ml-2 font-bold">{producto.cantidad}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stock-minimo" className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Stock Mínimo
                </Label>
                <Input
                  id="stock-minimo"
                  type="number"
                  min="0"
                  value={stockMinimo}
                  onChange={(e) => setStockMinimo(e.target.value)}
                  placeholder="Cantidad mínima"
                  required
                />
              </div>

              <div>
                <Label htmlFor="stock-maximo" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Stock Máximo
                </Label>
                <Input
                  id="stock-maximo"
                  type="number"
                  min="1"
                  value={stockMaximo}
                  onChange={(e) => setStockMaximo(e.target.value)}
                  placeholder="Cantidad máxima"
                  required
                />
              </div>
            </div>

            {/* Validación visual */}
            {stockMinimo && stockMaximo && (
              <div className="text-sm">
                {Number.parseInt(stockMinimo) >= Number.parseInt(stockMaximo) ? (
                  <p className="text-red-600">⚠️ El stock mínimo debe ser menor al máximo</p>
                ) : (
                  <p className="text-green-600">
                    ✓ Rango válido: {stockMinimo} - {stockMaximo} unidades
                  </p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  loading ||
                  (stockMinimo && stockMaximo && Number.parseInt(stockMinimo) >= Number.parseInt(stockMaximo))
                }
              >
                {loading ? "Actualizando..." : "Actualizar Stock"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
