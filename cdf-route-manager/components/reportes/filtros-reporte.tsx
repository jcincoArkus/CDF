"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, RotateCcw } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface FiltrosReporteProps {
  filtros: {
    fechaInicio: string
    fechaFin: string
    vendedor: string
    ruta: string
    cliente: string
  }
  onFiltrosChange: (filtros: any) => void
}

export function FiltrosReporte({ filtros, onFiltrosChange }: FiltrosReporteProps) {
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(
    filtros.fechaInicio ? new Date(filtros.fechaInicio) : undefined,
  )
  const [fechaFin, setFechaFin] = useState<Date | undefined>(filtros.fechaFin ? new Date(filtros.fechaFin) : undefined)

  // Datos mock para los selectores
  const vendedores = [
    { id: "1", nombre: "Carlos Mendoza" },
    { id: "2", nombre: "Ana García" },
    { id: "3", nombre: "Luis Rodríguez" },
    { id: "4", nombre: "María López" },
  ]

  const rutas = [
    { id: "1", nombre: "Ruta Centro Preventa" },
    { id: "2", nombre: "Ruta Norte Reparto" },
    { id: "3", nombre: "Ruta Industrial Convencional" },
    { id: "4", nombre: "Ruta Sur Mixta" },
  ]

  const clientes = [
    { id: "1", nombre: "Tienda El Buen Precio" },
    { id: "2", nombre: "Súper Mercado Familiar" },
    { id: "3", nombre: "Abarrotes Don Juan" },
    { id: "4", nombre: "Minisuper La Esquina" },
    { id: "5", nombre: "Comercial Los Pinos" },
  ]

  const handleFiltroChange = (campo: string, valor: string) => {
    const nuevosFiltros = { ...filtros, [campo]: valor }
    onFiltrosChange(nuevosFiltros)
  }

  const handleFechaChange = (campo: "fechaInicio" | "fechaFin", fecha: Date | undefined) => {
    if (fecha) {
      const fechaString = fecha.toISOString().split("T")[0]
      if (campo === "fechaInicio") {
        setFechaInicio(fecha)
      } else {
        setFechaFin(fecha)
      }
      handleFiltroChange(campo, fechaString)
    }
  }

  const resetearFiltros = () => {
    const filtrosDefault = {
      fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      fechaFin: new Date().toISOString().split("T")[0],
      vendedor: "Todos los vendedores",
      ruta: "Todas las rutas",
      cliente: "Todos los clientes",
    }
    setFechaInicio(new Date(filtrosDefault.fechaInicio))
    setFechaFin(new Date(filtrosDefault.fechaFin))
    onFiltrosChange(filtrosDefault)
  }

  const aplicarFiltrosRapidos = (dias: number) => {
    const fechaFin = new Date()
    const fechaInicio = new Date(Date.now() - dias * 24 * 60 * 60 * 1000)

    setFechaInicio(fechaInicio)
    setFechaFin(fechaFin)

    const nuevosFiltros = {
      ...filtros,
      fechaInicio: fechaInicio.toISOString().split("T")[0],
      fechaFin: fechaFin.toISOString().split("T")[0],
    }
    onFiltrosChange(nuevosFiltros)
  }

  return (
    <div className="space-y-6">
      {/* Filtros Rápidos */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Períodos Rápidos</Label>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => aplicarFiltrosRapidos(7)}>
            Últimos 7 días
          </Button>
          <Button variant="outline" size="sm" onClick={() => aplicarFiltrosRapidos(30)}>
            Últimos 30 días
          </Button>
          <Button variant="outline" size="sm" onClick={() => aplicarFiltrosRapidos(90)}>
            Últimos 3 meses
          </Button>
          <Button variant="outline" size="sm" onClick={() => aplicarFiltrosRapidos(365)}>
            Último año
          </Button>
        </div>
      </div>

      {/* Filtros Detallados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Fecha Inicio */}
        <div className="space-y-2">
          <Label htmlFor="fechaInicio">Fecha Inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !fechaInicio && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fechaInicio}
                onSelect={(date) => handleFechaChange("fechaInicio", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Fecha Fin */}
        <div className="space-y-2">
          <Label htmlFor="fechaFin">Fecha Fin</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !fechaFin && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fechaFin ? format(fechaFin, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fechaFin}
                onSelect={(date) => handleFechaChange("fechaFin", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Vendedor */}
        <div className="space-y-2">
          <Label htmlFor="vendedor">Vendedor</Label>
          <Select value={filtros.vendedor} onValueChange={(value) => handleFiltroChange("vendedor", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los vendedores" />
            </SelectTrigger>
            <SelectContent>
              {vendedores.map((vendedor) => (
                <SelectItem key={vendedor.id} value={vendedor.nombre}>
                  {vendedor.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ruta */}
        <div className="space-y-2">
          <Label htmlFor="ruta">Ruta</Label>
          <Select value={filtros.ruta} onValueChange={(value) => handleFiltroChange("ruta", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas las rutas" />
            </SelectTrigger>
            <SelectContent>
              {rutas.map((ruta) => (
                <SelectItem key={ruta.id} value={ruta.nombre}>
                  {ruta.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cliente */}
        <div className="space-y-2">
          <Label htmlFor="cliente">Cliente</Label>
          <Select value={filtros.cliente} onValueChange={(value) => handleFiltroChange("cliente", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos los clientes" />
            </SelectTrigger>
            <SelectContent>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.nombre}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Botón Reset */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={resetearFiltros} className="flex items-center space-x-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          <span>Resetear Filtros</span>
        </Button>
      </div>
    </div>
  )
}
