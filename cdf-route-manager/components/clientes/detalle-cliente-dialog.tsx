"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User, Phone, MapPin, Navigation, Calendar, ShoppingCart, Clock, Edit, ExternalLink } from "lucide-react"
import { obtenerDetalleCliente, type ClienteDetalle } from "@/lib/actions/clientes"

interface DetalleClienteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteId: number | null
  onEditarCliente?: (clienteId: number) => void
}

export function DetalleClienteDialog({ open, onOpenChange, clienteId, onEditarCliente }: DetalleClienteDialogProps) {
  const [cliente, setCliente] = useState<ClienteDetalle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open && clienteId) {
      loadClienteDetalle()
    }
  }, [open, clienteId])

  const loadClienteDetalle = async () => {
    if (!clienteId) return

    setLoading(true)
    setError(null)

    try {
      const clienteData = await obtenerDetalleCliente(clienteId)
      setCliente(clienteData)
    } catch (error) {
      console.error("Error cargando detalle del cliente:", error)
      setError("Error al cargar la información del cliente")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCliente(null)
    setError(null)
    onOpenChange(false)
  }

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const abrirEnMaps = () => {
    if (cliente?.latitud && cliente?.longitud) {
      const url = `https://www.google.com/maps?q=${cliente.latitud},${cliente.longitud}`
      window.open(url, "_blank")
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Cargando información del cliente...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadClienteDetalle}>Reintentar</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!cliente) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalle del Cliente
          </DialogTitle>
          <DialogDescription>Información completa y estadísticas del cliente</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{cliente.nombre}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => onEditarCliente?.(cliente.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
              <CardDescription>Cliente registrado el {formatFecha(cliente.created_at)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">{cliente.telefono}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Ruta Asignada</p>
                    <Badge variant="secondary">{cliente.ruta_nombre || "Sin asignar"}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Dirección</p>
                  <p className="text-sm text-muted-foreground">{cliente.direccion}</p>
                  {cliente.referencias && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Referencias:</strong> {cliente.referencias}
                    </p>
                  )}
                  {cliente.latitud && cliente.longitud && (
                    <Button variant="link" size="sm" onClick={abrirEnMaps} className="p-0 h-auto mt-2">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Ver en Google Maps
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Ventas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas de Ventas</CardTitle>
              <CardDescription>Resumen de la actividad comercial</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{cliente.total_pedidos || 0}</p>
                    <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Último Pedido</p>
                    <p className="text-sm text-muted-foreground">
                      {cliente.ultimo_pedido ? formatFecha(cliente.ultimo_pedido) : "Sin pedidos registrados"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas GPS */}
          {cliente.latitud && cliente.longitud && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Coordenadas GPS
                </CardTitle>
                <CardDescription>Ubicación exacta del cliente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Latitud</p>
                    <p className="text-sm text-muted-foreground font-mono">{cliente.latitud.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Longitud</p>
                    <p className="text-sm text-muted-foreground font-mono">{cliente.longitud.toFixed(6)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Fecha de Registro</p>
                  <p className="text-sm text-muted-foreground">{formatFecha(cliente.created_at)}</p>
                </div>
              </div>

              {cliente.updated_at && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Última Actualización</p>
                    <p className="text-sm text-muted-foreground">{formatFecha(cliente.updated_at)}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cerrar
          </Button>
          <Button onClick={() => onEditarCliente?.(cliente.id)}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
