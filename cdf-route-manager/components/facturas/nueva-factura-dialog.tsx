"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Plus, Search, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { obtenerPedidosSinFacturar, crearFactura, type PedidoSinFacturar, type CrearFacturaData } from "@/lib/actions/facturas"
import { useToast } from "@/hooks/use-toast"

interface NuevaFacturaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFacturaCreada: (facturaId: number) => void
}

export function NuevaFacturaDialog({ open, onOpenChange, onFacturaCreada }: NuevaFacturaDialogProps) {
  const [step, setStep] = useState<'seleccion' | 'datos' | 'confirmacion'>('seleccion')
  const [pedidos, setPedidos] = useState<PedidoSinFacturar[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPedido, setSelectedPedido] = useState<PedidoSinFacturar | null>(null)
  const [formData, setFormData] = useState<CrearFacturaData>({
    pedido_id: 0,
    serie: "A",
    metodo_pago: "01",
    observaciones: ""
  })
  const [creating, setCreating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      cargarPedidos()
      setStep('seleccion')
      setSelectedPedido(null)
      setFormData({
        pedido_id: 0,
        serie: "A",
        metodo_pago: "01",
        observaciones: ""
      })
    }
  }, [open])

  const cargarPedidos = async () => {
    setLoading(true)
    try {
      const data = await obtenerPedidosSinFacturar()
      setPedidos(data)
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos sin facturar",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPedidos = pedidos.filter((pedido) =>
    pedido.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.id.toString().includes(searchTerm)
  )

  const formatearMoneda = (cantidad: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(cantidad)
  }

  const handleSeleccionarPedido = (pedido: PedidoSinFacturar) => {
    setSelectedPedido(pedido)
    setFormData(prev => ({ ...prev, pedido_id: pedido.id }))
    setStep('datos')
  }

  const handleContinuar = () => {
    if (!selectedPedido) return
    setStep('confirmacion')
  }

  const handleCrearFactura = async () => {
    if (!selectedPedido) return

    setCreating(true)
    try {
      const facturaId = await crearFactura(formData)
      
      toast({
        title: "Factura creada",
        description: `La factura ha sido generada exitosamente`,
      })

      onFacturaCreada(facturaId)
      onOpenChange(false)
    } catch (error) {
      console.error("Error al crear factura:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la factura",
        variant: "destructive"
      })
    } finally {
      setCreating(false)
    }
  }

  const handleVolver = () => {
    if (step === 'datos') {
      setStep('seleccion')
    } else if (step === 'confirmacion') {
      setStep('datos')
    }
  }

  const getMetodoPagoLabel = (metodo: string) => {
    switch (metodo) {
      case "01": return "Efectivo"
      case "02": return "Cheque"
      case "03": return "Transferencia"
      case "04": return "Tarjeta de Crédito"
      case "28": return "Tarjeta de Débito"
      default: return metodo
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nueva Factura CFDI
          </DialogTitle>
          <DialogDescription>
            {step === 'seleccion' && "Selecciona el pedido que deseas facturar"}
            {step === 'datos' && "Completa los datos de la factura"}
            {step === 'confirmacion' && "Revisa y confirma la información de la factura"}
          </DialogDescription>
        </DialogHeader>

        {/* Paso 1: Selección de pedido */}
        {step === 'seleccion' && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Buscar por cliente o número de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={cargarPedidos} variant="outline" disabled={loading}>
                Actualizar
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos Sin Facturar</CardTitle>
                <CardDescription>
                  Selecciona un pedido entregado para generar su factura
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                ) : filteredPedidos.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pedidos sin facturar</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pedido</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="text-right">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPedidos.map((pedido) => (
                          <TableRow key={pedido.id}>
                            <TableCell className="font-medium">
                              PED-{pedido.id.toString().padStart(6, '0')}
                            </TableCell>
                            <TableCell>{pedido.cliente_nombre}</TableCell>
                            <TableCell>
                              {format(new Date(pedido.fecha), "dd/MM/yyyy", { locale: es })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{pedido.items_count} items</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatearMoneda(pedido.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                onClick={() => handleSeleccionarPedido(pedido)}
                              >
                                Seleccionar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Paso 2: Datos de la factura */}
        {step === 'datos' && selectedPedido && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pedido Seleccionado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Pedido</Label>
                    <p className="font-medium">PED-{selectedPedido.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Cliente</Label>
                    <p className="font-medium">{selectedPedido.cliente_nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total</Label>
                    <p className="font-medium">{formatearMoneda(selectedPedido.total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos de la Factura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serie">Serie</Label>
                    <Select
                      value={formData.serie}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, serie: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Serie A</SelectItem>
                        <SelectItem value="B">Serie B</SelectItem>
                        <SelectItem value="C">Serie C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metodo_pago">Método de Pago</Label>
                    <Select
                      value={formData.metodo_pago}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, metodo_pago: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">Efectivo</SelectItem>
                        <SelectItem value="02">Cheque</SelectItem>
                        <SelectItem value="03">Transferencia</SelectItem>
                        <SelectItem value="04">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="28">Tarjeta de Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                  <Textarea
                    id="observaciones"
                    placeholder="Observaciones adicionales para la factura..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleVolver}>
                Volver
              </Button>
              <Button onClick={handleContinuar}>
                Continuar
              </Button>
            </div>
          </div>
        )}

        {/* Paso 3: Confirmación */}
        {step === 'confirmacion' && selectedPedido && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Confirmar Factura
                </CardTitle>
                <CardDescription>
                  Revisa la información antes de generar la factura CFDI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm text-muted-foreground">Pedido</Label>
                    <p className="font-medium">PED-{selectedPedido.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Cliente</Label>
                    <p className="font-medium">{selectedPedido.cliente_nombre}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Serie</Label>
                    <p className="font-medium">{formData.serie}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Método de Pago</Label>
                    <p className="font-medium">{getMetodoPagoLabel(formData.metodo_pago)}</p>
                  </div>
                </div>

                {formData.observaciones && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Observaciones</Label>
                    <p className="text-sm">{formData.observaciones}</p>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium">{formatearMoneda(selectedPedido.total / 1.16)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (16%):</span>
                    <span className="font-medium">{formatearMoneda(selectedPedido.total - (selectedPedido.total / 1.16))}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatearMoneda(selectedPedido.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleVolver}>
                Volver
              </Button>
              <Button onClick={handleCrearFactura} disabled={creating}>
                {creating ? "Generando..." : "Generar Factura"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
