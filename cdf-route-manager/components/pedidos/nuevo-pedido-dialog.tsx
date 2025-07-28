"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, User, Package, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { SeleccionCliente } from "./seleccion-cliente"
import { CatalogoProductos } from "./catalogo-productos"
import { ConfirmacionPedido } from "./confirmacion-pedido"
import { ResumenPedido } from "./resumen-pedido"
import { useCart } from "@/hooks/use-cart"
import { crearPedido } from "@/lib/pedidos"

interface NuevoPedidoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPedidoCreado?: (pedidoId: number) => void
}

export function NuevoPedidoDialog({ open, onOpenChange, onPedidoCreado }: NuevoPedidoDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { cart, clearCart } = useCart()

  const steps = [
    { id: 1, name: "Cliente", icon: User, description: "Seleccionar cliente" },
    { id: 2, name: "Productos", icon: Package, description: "Agregar productos" },
    { id: 3, name: "Confirmación", icon: CheckCircle, description: "Revisar pedido" },
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleClienteSeleccionado = (cliente: any) => {
    setClienteSeleccionado(cliente)
    handleNext()
  }

  const handleConfirmarPedido = async () => {
    if (!clienteSeleccionado || !cart.items || cart.items.length === 0) return

    setIsCreating(true)
    try {
      const pedidoData = {
        cliente_id: clienteSeleccionado.id,
        usuario_id: 1, // Usuario actual (hardcoded por ahora)
        fecha_entrega: new Date().toISOString().split("T")[0],
        items: cart.items.map((item) => ({
          producto_id: Number.parseInt(item.id),
          cantidad: item.cantidad,
          precio_unitario: item.precio,
        })),
        total: cart.total,
        notas: "Pedido creado desde el dashboard",
      }

      const result = await crearPedido(pedidoData)

      if (result.success && result.pedido_id) {
        // Limpiar carrito y resetear estado
        clearCart()
        setCurrentStep(1)
        setClienteSeleccionado(null)

        // Cerrar dialog
        onOpenChange(false)

        // Notificar creación exitosa
        if (onPedidoCreado) {
          onPedidoCreado(result.pedido_id)
        }
      } else {
        console.error("Error al crear pedido:", result.error)
      }
    } catch (error) {
      console.error("Error al crear pedido:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    clearCart()
    setCurrentStep(1)
    setClienteSeleccionado(null)
    onOpenChange(false)
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return clienteSeleccionado !== null
      case 2:
        return cart.items && cart.items.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Crear Nuevo Pedido
          </DialogTitle>
          <DialogDescription>Sigue los pasos para crear un nuevo pedido para tu cliente</DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                          ? "bg-blue-500 border-blue-500 text-white"
                          : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${isActive ? "text-blue-600" : "text-gray-500"}`}>{step.name}</p>
                    <p className="text-xs text-gray-400">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          {currentStep === 1 && (
            <SeleccionCliente
              clienteSeleccionado={clienteSeleccionado}
              onClienteSeleccionado={handleClienteSeleccionado}
            />
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <CatalogoProductos />
              </div>
              <div className="lg:col-span-1">
                <ResumenPedido cliente={clienteSeleccionado} />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <ConfirmacionPedido
              cliente={clienteSeleccionado}
              items={cart.items || []}
              total={cart.total}
              onConfirmar={handleConfirmarPedido}
              isCreating={isCreating}
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <Separator />
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center gap-2">
            {clienteSeleccionado && (
              <Badge variant="outline" className="gap-1">
                <User className="h-3 w-3" />
                {clienteSeleccionado.nombre}
              </Badge>
            )}
            {cart.items && cart.items.length > 0 && (
              <Badge variant="outline" className="gap-1">
                <Package className="h-3 w-3" />
                {cart.items.length} productos
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-1 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={!canProceedToNext()} className="gap-1">
                Siguiente
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleConfirmarPedido} disabled={!canProceedToNext() || isCreating} className="gap-1">
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Confirmar Pedido
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
