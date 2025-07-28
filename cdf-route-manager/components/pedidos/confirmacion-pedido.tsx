"use client"

import { CheckCircle, User, Package, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ConfirmacionPedidoProps {
  cliente: any
  items: any[]
  total: number
  onConfirmar: () => void
  isCreating: boolean
}

export function ConfirmacionPedido({ cliente, items, total, onConfirmar, isCreating }: ConfirmacionPedidoProps) {
  const subtotal = items?.reduce((sum, item) => sum + item.precio * item.cantidad, 0) || 0
  const iva = subtotal * 0.16
  const totalConIva = subtotal + iva

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Confirmar Pedido
        </h3>
        <p className="text-sm text-muted-foreground">Revisa los detalles del pedido antes de confirmar</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Información del Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">{cliente?.nombre}</p>
              <p className="text-sm text-muted-foreground">{cliente?.direccion}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>📞 {cliente?.telefono}</span>
              <Badge variant="outline">{cliente?.ruta_nombre}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resumen del Pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA (16%):</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span className="text-green-600">${totalConIva.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Productos ({items?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{item.nombre}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {item.cantidad} x ${item.precio.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">${(item.precio * item.cantidad).toFixed(2)}</p>
                </div>
              </div>
            )) || <p className="text-center text-muted-foreground py-4">No hay productos en el pedido</p>}
          </div>
        </CardContent>
      </Card>

      {/* Botón de Confirmación */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div>
              <h4 className="font-semibold text-green-800">¿Confirmar este pedido?</h4>
              <p className="text-sm text-green-600">Se creará el pedido y se enviará para procesamiento</p>
            </div>

            <Button
              onClick={onConfirmar}
              disabled={isCreating || !items || items.length === 0}
              className="w-full gap-2"
              size="lg"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando Pedido...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" />
                  Confirmar Pedido
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
