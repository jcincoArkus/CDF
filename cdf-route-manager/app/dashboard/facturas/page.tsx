"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Plus, Eye, Download, Printer, Mail, CalendarIcon, FileText, DollarSign, CheckCircle, Clock } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { DetalleFacturaDialog } from "@/components/facturas/detalle-factura-dialog"
import { NuevaFacturaDialog } from "@/components/facturas/nueva-factura-dialog"
import { obtenerFacturas, type Factura } from "@/lib/actions/facturas"

export default function FacturasPage() {
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [metodoPagoFilter, setMetodoPagoFilter] = useState("todos")
  const [fechaDesde, setFechaDesde] = useState<Date>()
  const [fechaHasta, setFechaHasta] = useState<Date>()
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null)
  const [showDetalleDialog, setShowDetalleDialog] = useState(false)
  const [showNuevaFacturaDialog, setShowNuevaFacturaDialog] = useState(false)

  useEffect(() => {
    const cargarFacturas = async () => {
      setLoading(true)
      try {
        const response = await obtenerFacturas()
        if (response.success && Array.isArray(response.data)) {
          setFacturas(response.data)
        } else {
          console.error("Error al cargar facturas:", response.error)
          setFacturas([])
        }
      } catch (error) {
        console.error("Error al cargar facturas:", error)
        setFacturas([])
      } finally {
        setLoading(false)
      }
    }

    cargarFacturas()
  }, [])

  const filteredFacturas = facturas.filter((factura) => {
    const matchesSearch =
      factura.folio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      factura.uuid_sat?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "todos" || (factura.estatus && factura.estatus.toLowerCase() === statusFilter)

    const matchesMetodoPago =
      metodoPagoFilter === "todos" || (factura.metodo_pago && factura.metodo_pago.toLowerCase() === metodoPagoFilter)

    const matchesFechaDesde = !fechaDesde || new Date(factura.fecha || '') >= fechaDesde
    const matchesFechaHasta = !fechaHasta || new Date(factura.fecha || '') <= fechaHasta

    return matchesSearch && matchesStatus && matchesMetodoPago && matchesFechaDesde && matchesFechaHasta
  })

  const totalFacturas = facturas.length
  const totalMonto = facturas.reduce((sum, factura) => sum + (factura.total || 0), 0)
  const facturasPagadas = facturas.filter((f) => f.estatus === "Pagada" || f.estatus === "Vigente").length
  const facturasPendientes = facturas.filter((f) => f.estatus === "Pendiente").length
  const facturasCanceladas = facturas.filter((f) => f.estatus === "Cancelada").length

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
        return "T. Crédito"
      case "28":
        return "T. Débito"
      default:
        return metodo
    }
  }

  const handleVerDetalle = (factura: Factura) => {
    setSelectedFactura(factura)
    setShowDetalleDialog(true)
  }

  const handleDescargarPDF = (factura: Factura) => {
    console.log("Descargando PDF de factura:", factura.folio)
    // Implementar descarga de PDF
  }

  const handleImprimir = (factura: Factura) => {
    console.log("Imprimiendo factura:", factura.folio)
    // Implementar impresión
  }

  const handleEnviarEmail = (factura: Factura) => {
    console.log("Enviando email de factura:", factura.folio)
    // Implementar envío de email
  }

  const handleFacturaCreada = async (facturaId: number) => {
    console.log("Factura creada:", facturaId)
    // Recargar facturas
    try {
      const response = await obtenerFacturas()
      if (response.success && Array.isArray(response.data)) {
        setFacturas(response.data)
      }
    } catch (error) {
      console.error("Error al recargar facturas:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>

        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Facturas</h1>
          <p className="text-muted-foreground">Gestiona y consulta todas las facturas CFDI generadas</p>
        </div>
        <Button onClick={() => setShowNuevaFacturaDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacturas}</div>
            <p className="text-xs text-muted-foreground">Facturas generadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatearMoneda(totalMonto)}</div>
            <p className="text-xs text-muted-foreground">Valor total facturado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vigentes</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{facturasPagadas}</div>
            <p className="text-xs text-muted-foreground">Facturas vigentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{facturasCanceladas}</div>
            <p className="text-xs text-muted-foreground">Facturas canceladas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Buscar por folio, cliente o UUID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="vigente">Vigente</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
              </SelectContent>
            </Select>

            <Select value={metodoPagoFilter} onValueChange={setMetodoPagoFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Método de Pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los métodos</SelectItem>
                <SelectItem value="01">Efectivo</SelectItem>
                <SelectItem value="02">Cheque</SelectItem>
                <SelectItem value="03">Transferencia</SelectItem>
                <SelectItem value="04">Tarjeta de Crédito</SelectItem>
                <SelectItem value="28">Tarjeta de Débito</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !fechaDesde && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaDesde ? format(fechaDesde, "PPP", { locale: es }) : "Fecha desde"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fechaDesde} onSelect={setFechaDesde} initialFocus />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !fechaHasta && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaHasta ? format(fechaHasta, "PPP", { locale: es }) : "Fecha hasta"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={fechaHasta} onSelect={setFechaHasta} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Facturas</CardTitle>
          <CardDescription>
            {filteredFacturas.length} de {totalFacturas} facturas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Folio</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>UUID</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFacturas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No se encontraron facturas</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFacturas.map((factura) => (
                    <TableRow key={factura.id}>
                      <TableCell className="font-medium">{factura.folio}</TableCell>
                      <TableCell>{factura.clientes?.nombre || 'Cliente Desconocido'}</TableCell>
                      <TableCell>
                        {factura.fecha ? format(new Date(factura.fecha), "dd/MM/yyyy", { locale: es }) : 'N/A'}
                      </TableCell>
                      <TableCell className="font-medium">{formatearMoneda(factura.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getMetodoPagoLabel(factura.metodo_pago || '')}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(factura.estatus || 'Pendiente')}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {factura.uuid_sat ? `${factura.uuid_sat.substring(0, 8)}...` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVerDetalle(factura)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDescargarPDF(factura)}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleImprimir(factura)}
                            className="h-8 w-8 p-0"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEnviarEmail(factura)}
                            className="h-8 w-8 p-0"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <DetalleFacturaDialog factura={selectedFactura} open={showDetalleDialog} onOpenChange={setShowDetalleDialog} />

      <NuevaFacturaDialog
        open={showNuevaFacturaDialog}
        onOpenChange={setShowNuevaFacturaDialog}
        onFacturaCreada={handleFacturaCreada}
      />
    </div>
  )
}
