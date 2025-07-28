"use client"

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, TrendingUp, Package } from "lucide-react"

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

interface DetalleRutaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruta: Ruta | null
}

export function DetalleRutaDialog({ open, onOpenChange, ruta }: DetalleRutaDialogProps) {
  if (!ruta) return null

  const estadoColors = {
    Activa: "bg-green-100 text-green-800 border-green-200",
    Inactiva: "bg-gray-100 text-gray-800 border-gray-200",
    "En Mantenimiento": "bg-yellow-100 text-yellow-800 border-yellow-200",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {ruta.nombre}
            <Badge className={estadoColors[ruta.estado]}>{ruta.estado}</Badge>
          </DialogTitle>
          <DialogDescription>{ruta.descripcion}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vendedor Asignado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{ruta.vendedor_nombre}</p>
                <p className="text-sm text-muted-foreground">Tipo: {ruta.tipo}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{ruta.clientes_count}</p>
                <p className="text-sm text-muted-foreground">Activos en la ruta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">${ruta.ventas_mes.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{ruta.pedidos_mes} pedidos</p>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes en la Ruta</CardTitle>
              <CardDescription>Lista detallada de clientes asignados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Pedidos/Mes</TableHead>
                    <TableHead>Ventas/Mes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ruta.clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {cliente.direccion}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {cliente.telefono}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          {cliente.pedidos_mes}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />${cliente.ventas_mes.toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
