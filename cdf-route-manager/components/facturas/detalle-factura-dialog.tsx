"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Download, Printer, Mail, FileText, Building, Calendar, CreditCard } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { type Factura } from "@/lib/actions/facturas"

interface DetalleFacturaDialogProps {
  factura: Factura | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetalleFacturaDialog({ factura, open, onOpenChange }: DetalleFacturaDialogProps) {
  if (!factura) return null

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Vigente":
      case "Pagada":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Vigente</Badge>
      case "Pendiente":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendiente</Badge>
      case "Cancelada":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Cancelada</Badge>
      case "Vencida":
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Vencida</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getMetodoPagoLabel = (metodo: string) => {
    switch (metodo) {
      case "01":
        return "Efectivo"
      case "02":
        return "Cheque"
      case "03":
        return "Transferencia"
      case "04":
        return "Tarjeta de Crédito"
      case "28":
        return "Tarjeta de Débito"
      default:
        return metodo
    }
  }

  const handleDescargarPDF = () => {
    console.log("Descargando PDF de factura:", factura.folio)
    // Implementar descarga de PDF
  }

  const handleImprimir = () => {
    console.log("Imprimiendo factura:", factura.folio)
    // Implementar impresión
  }

  const handleEnviarEmail = () => {
    console.log("Enviando email de factura:", factura.folio)
    // Implementar envío de email
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle de Factura - {factura.folio}
          </DialogTitle>
          <DialogDescription>
            Información completa de la factura CFDI
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con acciones */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {getStatusBadge(factura.estatus || 'Pendiente')}
              <span className="text-sm text-muted-foreground">
                {factura.fecha ? format(new Date(factura.fecha), "dd/MM/yyyy HH:mm", { locale: es }) : 'N/A'}
              </span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDescargarPDF}>
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleImprimir}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" onClick={handleEnviarEmail}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
          </div>

          {/* Información general */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Información de la Factura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Folio:</span>
                  <span className="font-medium">{factura.folio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Serie:</span>
                  <span className="font-medium">{factura.serie || 'A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">UUID SAT:</span>
                  <span className="font-mono text-xs">{factura.uuid_sat || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pedido:</span>
                  <span className="font-medium">{factura.pedido_id ? `PED-${factura.pedido_id.toString().padStart(6, '0')}` : 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Información del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nombre:</span>
                  <span className="font-medium">{(factura as any).clientes?.nombre || 'Cliente Desconocido'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">RFC:</span>
                  <span className="font-medium">{(factura as any).clientes?.rfc || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dirección:</span>
                  <span className="text-sm">{(factura as any).clientes?.direccion || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="text-sm">{(factura as any).clientes?.correo || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información de pago */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información de Pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Método de Pago:</span>
                  <Badge variant="outline">
                    {getMetodoPagoLabel(factura.metodo_pago || '')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Forma de Pago:</span>
                  <span className="font-medium">{factura.forma_pago || '01'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Uso CFDI:</span>
                  <span className="font-medium">{factura.uso_cfdi || 'G03'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalle de productos */}
          {(factura as any).pedidos?.pedidos_detalle && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalle de Productos</CardTitle>
                <CardDescription>
                  Productos incluidos en esta factura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead className="text-right">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(factura as any).pedidos.pedidos_detalle.map((detalle: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {detalle.productos?.nombre || 'Producto'}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {detalle.productos?.sku || 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">{detalle.cantidad}</TableCell>
                        <TableCell className="text-right">
                          {formatearMoneda(detalle.precio_unitario)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatearMoneda(detalle.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Totales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatearMoneda(factura.subtotal)}</span>
                </div>
                {factura.descuento && factura.descuento > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Descuento:</span>
                    <span className="font-medium text-red-600">-{formatearMoneda(factura.descuento)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (16%):</span>
                  <span className="font-medium">{formatearMoneda(factura.impuestos)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatearMoneda(factura.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
