"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { FileText, Building, CreditCard, Download, Printer, Mail, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface FacturaMock {
  id: number
  folio: string
  serie: string
  pedido_id: number
  fecha: string
  subtotal: number
  impuestos: number
  total: number
  metodo_pago: string
  forma_pago: string
  uso_cfdi: string
  estatus: "Vigente" | "Cancelada" | "Pendiente"
  uuid_sat: string
  cliente: {
    nombre: string
    rfc: string
    direccion: string
    correo: string
  }
  items: {
    id: number
    producto_nombre: string
    sku: string
    cantidad: number
    precio_unitario: number
    subtotal: number
  }[]
  empresa: {
    nombre: string
    rfc: string
    direccion: string
    regimen_fiscal: string
  }
}

interface PreviewFacturaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pedidoId: number | null
}

const estatusColors = {
  Vigente: "bg-green-100 text-green-800 border-green-200",
  Cancelada: "bg-red-100 text-red-800 border-red-200",
  Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

const estatusIcons = {
  Vigente: CheckCircle,
  Cancelada: AlertCircle,
  Pendiente: Clock,
}

export function PreviewFacturaDialog({ open, onOpenChange, pedidoId }: PreviewFacturaDialogProps) {
  const [factura, setFactura] = useState<FacturaMock | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && pedidoId) {
      cargarFactura()
    }
  }, [open, pedidoId])

  const cargarFactura = async () => {
    setLoading(true)

    // Simular carga de datos desde Supabase
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Datos mock que simularían venir de Supabase
    const facturasMock: { [key: number]: FacturaMock } = {
      1: {
        id: 1,
        folio: "FAC-000001",
        serie: "A",
        pedido_id: 1,
        fecha: new Date().toISOString(),
        subtotal: 387.93,
        impuestos: 62.07,
        total: 450.0,
        metodo_pago: "01",
        forma_pago: "01",
        uso_cfdi: "G03",
        estatus: "Vigente",
        uuid_sat: "12345678-1234-1234-1234-123456789012",
        cliente: {
          nombre: "Tienda La Esquina",
          rfc: "XAXX010101000",
          direccion: "Av. Principal 123, Centro, Ciudad, CP 12345",
          correo: "contacto@tiendalaesquina.com",
        },
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
        empresa: {
          nombre: "CDF Distribuidora S.A. de C.V.",
          rfc: "CDF123456789",
          direccion: "Calle Empresa 456, Zona Industrial, Ciudad, CP 54321",
          regimen_fiscal: "601 - General de Ley Personas Morales",
        },
      },
      4: {
        id: 4,
        folio: "FAC-000004",
        serie: "A",
        pedido_id: 4,
        fecha: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 237.07,
        impuestos: 37.93,
        total: 275.0,
        metodo_pago: "03",
        forma_pago: "03",
        uso_cfdi: "G03",
        estatus: "Vigente",
        uuid_sat: "12345678-1234-1234-1234-123456789015",
        cliente: {
          nombre: "Minisuper Central",
          rfc: "XAXX010101003",
          direccion: "Plaza Central 321, Centro, Ciudad, CP 12345",
          correo: "admin@minisupercentral.com",
        },
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
        empresa: {
          nombre: "CDF Distribuidora S.A. de C.V.",
          rfc: "CDF123456789",
          direccion: "Calle Empresa 456, Zona Industrial, Ciudad, CP 54321",
          regimen_fiscal: "601 - General de Ley Personas Morales",
        },
      },
      6: {
        id: 6,
        folio: "FAC-000006",
        serie: "A",
        pedido_id: 6,
        fecha: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 448.28,
        impuestos: 71.72,
        total: 520.0,
        metodo_pago: "04",
        forma_pago: "04",
        uso_cfdi: "G03",
        estatus: "Vigente",
        uuid_sat: "12345678-1234-1234-1234-123456789017",
        cliente: {
          nombre: "Súper Mercado Norte",
          rfc: "XAXX010101001",
          direccion: "Calle Norte 456, Zona Norte, Ciudad, CP 67890",
          correo: "ventas@supernorte.com",
        },
        items: [
          {
            id: 1,
            producto_nombre: "Coca Cola 600ml",
            sku: "CC600",
            cantidad: 15,
            precio_unitario: 15.0,
            subtotal: 225.0,
          },
          {
            id: 2,
            producto_nombre: "Pepsi 600ml",
            sku: "PP600",
            cantidad: 12,
            precio_unitario: 14.5,
            subtotal: 174.0,
          },
          {
            id: 3,
            producto_nombre: "Agua Natural 1L",
            sku: "AG1L",
            cantidad: 15,
            precio_unitario: 8.0,
            subtotal: 120.0,
          },
        ],
        empresa: {
          nombre: "CDF Distribuidora S.A. de C.V.",
          rfc: "CDF123456789",
          direccion: "Calle Empresa 456, Zona Industrial, Ciudad, CP 54321",
          regimen_fiscal: "601 - General de Ley Personas Morales",
        },
      },
      8: {
        id: 8,
        folio: "FAC-000008",
        serie: "A",
        pedido_id: 8,
        fecha: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        subtotal: 293.1,
        impuestos: 46.9,
        total: 340.0,
        metodo_pago: "01",
        forma_pago: "01",
        uso_cfdi: "G03",
        estatus: "Vigente",
        uuid_sat: "12345678-1234-1234-1234-123456789019",
        cliente: {
          nombre: "Minisuper Central",
          rfc: "XAXX010101003",
          direccion: "Plaza Central 321, Centro, Ciudad, CP 12345",
          correo: "admin@minisupercentral.com",
        },
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
            id: 4,
            producto_nombre: "Sabritas Original",
            sku: "SAB001",
            cantidad: 4,
            precio_unitario: 12.0,
            subtotal: 48.0,
          },
        ],
        empresa: {
          nombre: "CDF Distribuidora S.A. de C.V.",
          rfc: "CDF123456789",
          direccion: "Calle Empresa 456, Zona Industrial, Ciudad, CP 54321",
          regimen_fiscal: "601 - General de Ley Personas Morales",
        },
      },
    }

    setFactura(facturasMock[pedidoId!] || null)
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
    console.log("Descargando PDF de factura:", factura?.folio)
    // Implementar descarga de PDF
  }

  const handleImprimir = () => {
    console.log("Imprimiendo factura:", factura?.folio)
    // Implementar impresión
  }

  const handleEnviarEmail = () => {
    console.log("Enviando email de factura:", factura?.folio)
    // Implementar envío de email
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

  if (!factura) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No se encontró la factura para este pedido</p>
            <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const EstatusIcon = estatusIcons[factura.estatus]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Factura {factura.folio}</DialogTitle>
              <DialogDescription>Vista previa del CFDI generado</DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${estatusColors[factura.estatus]} gap-1`}>
                <EstatusIcon className="h-3 w-3" />
                {factura.estatus}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header con acciones */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="text-sm text-muted-foreground">
              <p>Fecha de emisión: {formatearFecha(factura.fecha)}</p>
              <p>
                UUID SAT: <span className="font-mono text-xs">{factura.uuid_sat}</span>
              </p>
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

          {/* Información de la empresa y cliente */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Emisor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold text-lg">{factura.empresa.nombre}</p>
                  <p className="text-sm text-muted-foreground">RFC: {factura.empresa.rfc}</p>
                </div>
                <div className="text-sm">
                  <p>{factura.empresa.direccion}</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium">Régimen Fiscal:</p>
                  <p className="text-muted-foreground">{factura.empresa.regimen_fiscal}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Receptor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-semibold text-lg">{factura.cliente.nombre}</p>
                  <p className="text-sm text-muted-foreground">RFC: {factura.cliente.rfc}</p>
                </div>
                <div className="text-sm">
                  <p>{factura.cliente.direccion}</p>
                </div>
                <div className="text-sm">
                  <p className="text-muted-foreground">{factura.cliente.correo}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información fiscal */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Información Fiscal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <p className="text-sm text-muted-foreground">Serie y Folio</p>
                  <p className="font-medium">
                    {factura.serie}-{factura.folio}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pago</p>
                  <p className="font-medium">{getMetodoPagoLabel(factura.metodo_pago)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Forma de Pago</p>
                  <p className="font-medium">{factura.forma_pago}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Uso CFDI</p>
                  <p className="font-medium">{factura.uso_cfdi}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalle de productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conceptos</CardTitle>
              <CardDescription>Detalle de productos facturados</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clave</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factura.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Badge variant="outline">{item.sku}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{item.producto_nombre}</TableCell>
                      <TableCell className="text-center">{item.cantidad}</TableCell>
                      <TableCell className="text-right">{formatearMoneda(item.precio_unitario)}</TableCell>
                      <TableCell className="text-right font-medium">{formatearMoneda(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Totales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Importes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">{formatearMoneda(factura.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">IVA (16%):</span>
                  <span className="font-medium">{formatearMoneda(factura.impuestos)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">{formatearMoneda(factura.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sello digital */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sello Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-xs font-mono break-all text-muted-foreground">
                  Este documento es una representación impresa de un CFDI. El sello digital se encuentra en el archivo
                  XML correspondiente. UUID: {factura.uuid_sat}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Acciones finales */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cerrar
            </Button>
            <Button onClick={handleDescargarPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
