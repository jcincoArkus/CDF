"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, User } from "lucide-react"

interface Ruta {
  id: number
  nombre: string
  tipo: string
  descripcion: string
  vendedor_nombre: string
  clientes_count: number
  pedidos_mes: number
  ventas_mes: number
  estado: "Activa" | "Inactiva" | "En Mantenimiento"
  created_at: string
  clientes: Array<{
    id: number
    nombre: string
    direccion: string
    telefono: string
    pedidos_mes: number
    ventas_mes: number
  }>
}

interface AsignarVendedorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruta: Ruta | null
  onSuccess?: () => void
}

const vendedoresDisponibles = [
  { id: 1, nombre: "María García", rutas_asignadas: 1 },
  { id: 2, nombre: "Carlos López", rutas_asignadas: 1 },
  { id: 3, nombre: "Ana Martínez", rutas_asignadas: 1 },
  { id: 4, nombre: "Luis Rodríguez", rutas_asignadas: 0 },
  { id: 5, nombre: "Carmen Flores", rutas_asignadas: 0 },
]

export function AsignarVendedorDialog({ open, onOpenChange, ruta, onSuccess }: AsignarVendedorDialogProps) {
  const [loading, setLoading] = useState(false)
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!vendedorSeleccionado || !ruta) return

    setLoading(true)

    try {
      // Simular asignación de vendedor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Vendedor asignado:", {
        ruta_id: ruta.id,
        vendedor_id: vendedorSeleccionado,
      })

      onSuccess?.()
      onOpenChange(false)
      setVendedorSeleccionado("")
    } catch (error) {
      console.error("Error asignando vendedor:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!ruta) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Vendedor</DialogTitle>
          <DialogDescription>Asigna un vendedor a la ruta "{ruta.nombre}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="vendedor">Vendedor Actual</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{ruta.vendedor_nombre}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendedor">Nuevo Vendedor</Label>
              <Select value={vendedorSeleccionado} onValueChange={setVendedorSeleccionado} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un vendedor" />
                </SelectTrigger>
                <SelectContent>
                  {vendedoresDisponibles.map((vendedor) => (
                    <SelectItem key={vendedor.id} value={vendedor.id.toString()}>
                      <div className="flex items-center justify-between w-full">
                        <span>{vendedor.nombre}</span>
                        <span className="text-xs text-muted-foreground ml-2">({vendedor.rutas_asignadas} rutas)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !vendedorSeleccionado}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Asignar Vendedor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
