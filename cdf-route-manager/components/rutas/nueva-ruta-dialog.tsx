"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { crearRuta } from "@/lib/actions/rutas"

interface NuevaRutaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRutaCreada: () => void
}

const tiposRuta = [
  { value: "Preventa", label: "Preventa" },
  { value: "Reparto", label: "Reparto" },
  { value: "Convencional", label: "Convencional" },
  { value: "Autoventa", label: "Autoventa" },
]

export function NuevaRutaDialog({ open, onOpenChange, onRutaCreada }: NuevaRutaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    numero_identificador: "",
    nombre: "",
    tipo: "",
    descripcion: "",
    activa: true,
  })

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.numero_identificador || !formData.nombre || !formData.tipo) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await crearRuta(formData)

      if (result.success) {
        toast({
          title: "¡Ruta creada exitosamente!",
          description: `La ruta ${formData.nombre} ha sido registrada`,
        })
        onRutaCreada()
        onOpenChange(false)
        resetForm()
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo crear la ruta",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating ruta:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      numero_identificador: "",
      nombre: "",
      tipo: "",
      descripcion: "",
      activa: true,
    })
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !loading) {
      resetForm()
    }
    onOpenChange(newOpen)
  }

  const generateIdentifier = (tipo: string) => {
    const prefixes = {
      Preventa: "PV",
      Reparto: "RP",
      Convencional: "CV",
      Autoventa: "AV",
    }

    const prefix = prefixes[tipo as keyof typeof prefixes] || "RT"
    const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, "0")
    return `${prefix}-${number}`
  }

  const handleTipoChange = (tipo: string) => {
    setFormData((prev) => ({
      ...prev,
      tipo,
      numero_identificador: prev.numero_identificador || generateIdentifier(tipo),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nueva Ruta
          </DialogTitle>
          <DialogDescription>Crea una nueva ruta de distribución para organizar las entregas</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_identificador">
                Código de Ruta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="numero_identificador"
                value={formData.numero_identificador}
                onChange={(e) => setFormData((prev) => ({ ...prev, numero_identificador: e.target.value }))}
                placeholder="PV-0001"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipo">
                Tipo de Ruta <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.tipo} onValueChange={handleTipoChange} disabled={loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposRuta.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre de la Ruta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData((prev) => ({ ...prev, nombre: e.target.value }))}
              placeholder="Ej: Ruta Centro Norte"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData((prev) => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción opcional de la ruta..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="activa"
              checked={formData.activa}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, activa: checked }))}
              disabled={loading}
            />
            <Label htmlFor="activa">Ruta activa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Crear Ruta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
