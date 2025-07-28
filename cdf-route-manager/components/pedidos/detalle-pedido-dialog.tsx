"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Package,
  User,
  Calendar,
  MapPin,
  Phone,
  FileText,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
} from "lucide-react"

interface DetallePedido {
  id: number
  cliente: {
    nombre: string
    direccion: string
    telefono: string
    ruta: string
  }
  vendedor: {
    nombre: string
    correo: string
  }
  fecha: string
  total: number
  estatus: "Pendiente" | "En Ruta" | "Entregado" | "Cancelado"
  items: {
    id: number
    producto_nombre: string
    sku: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }[]
  notas?: string
}

interface DetallePedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedidoId: number | null
}

const estadoColors = {
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "En Ruta": "bg-blue-100 text-blue-800 border-blue-200",
  Entregado: "bg-green-100 text-green-800 border-green-200",
  Cancelado: "bg-red-100 text-red-800 border-red-200",
}

const estadoIcons = {
  Pendiente: Clock,
  "En Ruta": Truck,
  Entregado: CheckCircle,
  Cancelado: XCircle,
}

export function DetallePedidoDialog({ open, onOpenChange, pedidoId }: DetallePedidoDialogProps) {
  const [pedido, setPedido] = useState<DetallePedido | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && pedidoId) {
      cargarDetallePedido()
    }
  }, [open, pedidoId])

  const cargarDetallePedido = async () => {
    setLoading(true)

    // Simular carga de datos
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Datos de prueba basados en el pedidoId que coinciden con el script SQL
    const pedidosPrueba: { [key: number]: DetallePedido } = {
      1: {
        id: 1,
        cliente: {
          nombre: "Tienda La Esquina",
          direccion: "Av. Principal 123, Centro",
          telefono: "555-0001",
          ruta: "Ruta Centro",
        },
        vendedor: {
          nombre: "María García",
          correo: "maria.garcia@cdf.com",
        },
        fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        total: 450.0,
        estatus: "Entregado",
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 10,
            precio_unitario: 15.0,
            subtotal: 150.0,
          },
          {
            id: 2,
            producto_nombre: "Pepsi 600ml",
            sku: "PP600",
            cantidad: 8,
            precio_unitario: 14.5,
            subtotal: 116.0,
          },
          {
            id: 3,
            producto_nombre: "Agua Natural 1L",
            sku: "AG1L",
            cantidad: 12,
            precio_unitario: 8.0,
            subtotal: 96.0,
          },
          {
            id: 4,
            producto_nombre: "Sabritas Original",
            sku: "SAB001",
            cantidad: 7,
            precio_unitario: 12.0,
            subtotal: 84.0,
          },
        ],
        notas: "Cliente prefiere entrega en la mañana. Verificar disponibilidad de productos antes de la entrega.",
      },
      2: {
        id: 2,
        cliente: {
          nombre: "Súper Mercado Norte",
          direccion: "Calle Norte 456, Zona Norte",
          telefono: "555-0002",
          ruta: "Ruta Norte",
        },
        vendedor: {
          nombre: "María García",
          correo: "maria.garcia@cdf.com",
        },
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        total: 320.5,
        estatus: "En Ruta",
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 8,
            precio_unitario: 15.0,
            subtotal: 120.0,
          },
          {
            id: 2,
            producto_nombre: "Pepsi 600ml",
            sku: "PP600",
            cantidad: 6,
            precio_unitario: 14.5,
            subtotal: 87.0,
          },
          {
            id: 3,
            producto_nombre: "Agua Natural 1L",
            sku: "AG1L",
            cantidad: 10,
            precio_unitario: 8.0,
            subtotal: 80.0,
          },
          {
            id: 5,
            producto_nombre: "Doritos Nacho",
            sku: "DOR001",
            cantidad: 3,
            precio_unitario: 18.0,
            subtotal: 54.0,
          },
        ],
        notas: "Pedido urgente. Cliente solicita entrega antes de las 2:00 PM.",
      },
      3: {
        id: 3,
        cliente: {
          nombre: "Abarrotes El Sur",
          direccion: "Blvd. Sur 789, Zona Sur",
          telefono: "555-0003",
          ruta: "Ruta Sur",
        },
        vendedor: {
          nombre: "Carlos López",
          correo: "carlos.lopez@cdf.com",
        },
        fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        total: 180.0,
        estatus: "Pendiente",
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 5,
            precio_unitario: 15.0,
            subtotal: 75.0,
          },
          {
            id: 3,
            producto_nombre: "Agua Natural 1L",
            sku: "AG1L",
            cantidad: 8,
            precio_unitario: 8.0,
            subtotal: 64.0,
          },
          {
            id: 4,
            producto_nombre: "Sabritas Original",
            sku: "SAB001",
            cantidad: 3,
            precio_unitario: 12.0,
            subtotal: 36.0,
          },
        ],
        notas: "Verificar disponibilidad antes de la entrega. Cliente nuevo, confirmar dirección.",
      },
      4: {
        id: 4,
        cliente: {
          nombre: "Minisuper Central",
          direccion: "Plaza Central 321, Centro",
          telefono: "555-0004",
          ruta: "Ruta Centro",
        },
        vendedor: {
          nombre: "María García",
          correo: "maria.garcia@cdf.com",
        },
        fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        total: 275.0,
        estatus: "Entregado",
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 6,
            precio_unitario: 15.0,
            subtotal: 90.0,
          },
          {
            id: 2,
            producto_nombre: "Pepsi 600ml",
            sku: "PP600",
            cantidad: 5,
            precio_unitario: 14.5,
            subtotal: 72.5,
          },
          {
            id: 3,
            producto_nombre: "Agua Natural 1L",
            sku: "AG1L",
            cantidad: 8,
            precio_unitario: 8.0,
            subtotal: 64.0,
          },
          {
            id: 4,
            producto_nombre: "Sabritas Original",
            sku: "SAB001",
            cantidad: 4,
            precio_unitario: 12.0,
            subtotal: 48.0,
          },
        ],
      },
      5: {
        id: 5,
        cliente: {
          nombre: "Tienda La Esquina",
          direccion: "Av. Principal 123, Centro",
          telefono: "555-0001",
          ruta: "Ruta Centro",
        },
        vendedor: {
          nombre: "Carlos López",
          correo: "carlos.lopez@cdf.com",
        },
        fecha: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        total: 390.0,
        estatus: "Cancelado",
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 12,
            precio_unitario: 15.0,
            subtotal: 180.0,
          },
          {
            id: 2,
            producto_nombre: "Pepsi 600ml",
            sku: "PP600",
            cantidad: 8,
            precio_unitario: 14.5,
            subtotal: 116.0,
          },
          {
            id: 5,
            producto_nombre: "Doritos Nacho",
            sku: "DOR001",
            cantidad: 5,
            precio_unitario: 18.0,
            subtotal: 90.0,
          },
        ],
        notas: "Pedido cancelado por el cliente. Motivo: Cambio en la demanda del producto.",
      },
    }

    setPedido(pedidosPrueba[pedidoId!] || null)
    setLoading(false)
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!pedido) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Package className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No se pudo cargar el pedido</p>
            <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const EstadoIcon = estadoIcons[pedido.estatus]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Pedido #{pedido.id}</DialogTitle>
              <DialogDescription>Detalles completos del pedido</DialogDescription>
            </div>
            <Badge variant="outline" className={`${estadoColors[pedido.estatus]} gap-1`}>
              <EstadoIcon className="h-3 w-3" />
              {pedido.estatus}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium text-lg">{pedido.cliente.nombre}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3" />
                    {pedido.cliente.direccion}
                  </p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {pedido.cliente.telefono}
                  </p>
                  <Badge variant="outline" className="mt-2">
                    {pedido.cliente.ruta}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Información del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatearFecha(pedido.fecha)}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vendedor</p>
                  <p className="font-medium">{pedido.vendedor.nombre}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {pedido.vendedor.correo}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total del Pedido</p>
                  <p className="text-2xl font-bold text-green-600">{formatearMoneda(pedido.total)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos del Pedido</CardTitle>
              <CardDescription>{pedido.items.length} productos en este pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedido.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.producto_nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.sku}</Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{item.cantidad}</TableCell>
                        <TableCell className="text-right">{formatearMoneda(item.precio_unitario)}</TableCell>
                        <TableCell className="text-right font-medium">{formatearMoneda(item.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-end">
                <div className="space-y-2 min-w-[250px]">
                  <div className="flex justify-between items-center gap-8">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span>{formatearMoneda(pedido.total)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-8">
                    <span className="text-muted-foreground">IVA (16%):</span>
                    <span>{formatearMoneda(pedido.total * 0.16)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center gap-8">
                    <span className="font-medium text-lg">Total:</span>
                    <span className="text-xl font-bold text-green-600">{formatearMoneda(pedido.total * 1.16)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notas */}
          {pedido.notas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas del Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm bg-muted p-3 rounded-md">{pedido.notas}</p>
              </CardContent>
            </Card>
          )}

          {/* Acciones */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Generar Factura
            </Button>
            {pedido.estatus === "Pendiente" && (
              <Button className="gap-2">
                <Truck className="h-4 w-4" />
                Marcar En Ruta
              </Button>
            )}
            {pedido.estatus === "En Ruta" && (
              <Button className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Marcar Entregado
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
