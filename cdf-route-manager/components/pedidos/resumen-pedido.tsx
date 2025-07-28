"use client"

import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/hooks/use-cart"

interface ResumenPedidoProps {
  cliente: any
}

export function ResumenPedido({ cliente }: ResumenPedidoProps) {
  const { cart, updateQuantity, removeItem, clearCart } = useCart()

  const subtotal = cart.total || 0
  const iva = subtotal * 0.16
  const total = subtotal + iva

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Resumen del Pedido
        </CardTitle>
        {cliente && (
          <div className="text-sm text-muted-foreground">
            Para: <span className="font-medium">{cliente.nombre}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {cart.items && cart.items.length > 0 ? (
          <>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">${item.precio.toFixed(2)} c/u</p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>

                      <span className="text-sm font-medium min-w-[1.5rem] text-center">{item.cantidad}</span>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium">${(item.precio * item.cantidad).toFixed(2)}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IVA (16%):</span>
                <span>${iva.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={clearCart}
              className="w-full gap-2 text-red-600 hover:text-red-700 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar Carrito
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hay productos en el carrito</p>
            <p className="text-sm text-muted-foreground mt-2">Agrega productos del catálogo</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
